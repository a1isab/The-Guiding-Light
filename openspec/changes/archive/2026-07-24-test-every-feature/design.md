## Context

The app uses Next.js 16 with Supabase auth, internationalized routes (`[locale]`), and Playwright for E2E tests. Tests run against a live Supabase project with seeded test users. Currently 13 Playwright spec files exist but most pages have no `data-testid` attributes. The API layer has inconsistent auth patterns (some routes pass JWT from header, others rely on cookies only), missing error handling, and two critical unauthenticated email-confirmation endpoints.

## Goals / Non-Goals

**Goals:**
- Every interactive element has a stable `data-testid` for Playwright selection
- All 25 API routes have consistent auth, error handling, and response shapes
- 20+ Playwright tests cover every role's complete feature set
- Tests run automatically via GitHub Actions on push/PR
- No regressions on login/auth flows (verified via existing tests)

**Non-Goals:**
- Unit/integration tests (E2E only for this change)
- Visual regression testing
- Performance testing
- Accessibility testing (a11y)
- Replacing the existing agent-browser shell scripts

## Decisions

### 1. Single `auth.spec.ts` for all auth flows
Instead of splitting signup/verify/login into separate files, a single auth spec file covers the full lifecycle: signup → verify → login → logout. This avoids duplicating the `beforeEach` login setup across files.

### 2. Two shared fixture helpers
- `setupTeacherSession(page)` — extends the existing `setupTeacherLesson` to return session + full data tree
- `setupStudentSession(page)` — logs in as student, returns locale + session info

Reduces boilerplate across the 20+ new tests.

### 3. API route fixes follow consistent pattern
- `requireAuth`, `requireTeacher`, `requireAdmin` always receive JWT from `Authorization` header
- All handlers wrapped in try/catch returning `{ error: string }`
- All error paths call `applyCookies` before returning
- Response shape normalized: errors use `{ error: "..." }`, successes use `{ success: true }` or data

### 4. GitHub Actions runs on push to main + PR
Uses Playwright's official `setup-playwright@v1` action. Runs all 13 existing + 20+ new tests. Reuses dev server across test files via `webServer` config. Sets `SUPABASE_SERVICE_ROLE_KEY` as a GitHub secret.

### 5. `data-testid` naming convention
Pattern: `{page}-{element}` for top-level pages, `{section}-{element}` inside complex components. Examples: `signup-email`, `signup-password`, `signup-submit`, `signup-error`, `verify-code-input-0`, `student-dashboard-streak`.

## Risks / Trade-offs

- [**Risk**] Adding testids to 30+ files is mechanical but touches every page — merge conflicts with parallel work. → **Mitigation**: Batch into fewer, focused commits.
- [**Risk**] The 9 JWT-skipping routes have historically worked due to cookie fallback; adding JWT extraction could break if the header format differs. → **Mitigation**: Extract and pass JWT but keep `supabase.auth.getUser()` as fallback.
- [**Risk**] GitHub Actions exposes test environment (test user credentials, Supabase URL) in CI logs. → **Mitigation**: Use GitHub secrets for all credentials.
- [**Trade-off**] Adding auth to `confirm-email` and `verify-code` routes means the signup flow needs a token. The frontend signup page already generates a code client-side, but the verify page needs to pass something the server trusts. → **Decision**: The verify page sends the `access_token` from the just-created Supabase session (available after `signUp()` via `data.session?.access_token`), which the server validates before confirming the email.
