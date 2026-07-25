## Context

The Playwright test suite in `tests/e2e/auth.spec.ts` contains 6 tests that call Supabase email APIs (`signUp`, `resetPasswordForEmail`). On Supabase's free tier, email sending is rate-limited to a handful per hour. Once exceeded, all remaining tests fail with "email limit exceeded", derailing local development and CI runs.

Additionally, developers running tests locally may use `npm run test:e2e:ui` (which passes `--ui`) or `npx playwright test --debug`, both of which open the Playwright Inspector. This Inspector pauses execution and shows a blank browser requiring a "Resume" click at every step — producing a confusing experience.

## Goals / Non-Goals

**Goals:**
- Remove all email-triggering tests from `auth.spec.ts` so the suite passes on Supabase free tier
- Renumber remaining tests sequentially
- Document the reason for removal with conditions for re-enabling
- Update CI.md with correct run commands and warnings against `--ui`/`--debug`
- Keep the file structure (describe blocks) for easy restoration

**Non-Goals:**
- Not converting tests to use email mocking/stubbing (out of scope — Supabase client is called directly in browser)
- Not adding SMTP configuration to Supabase (out of scope — infrastructure decision)
- Not changing the signup/verify UI code

## Decisions

1. **Remove tests, don't comment them out** — dead code accumulates. The removed lines will be gone, but the describe block structure stays so re-adding them is straightforward. A comment block documents what was removed and why.

2. **Keep 4.4 (invalid invite code)** — even though it fills the signup form, the invite validation API call (`/api/teacher/invites/validate`) happens before `signUp()` is called. Since the invite is intentionally invalid, the signup never fires. No email sent.

3. **Keep 4.11 (mismatched passwords)** — this test navigates to `/reset-password` and performs pure client-side validation. No Supabase API call is made at all; no email sent.

4. **No new `test:e2e:ci` script** — the existing `test:e2e` script (`npx playwright test`) is the correct command. The issue is developers accidentally using `test:e2e:ui` or `--debug`. Documentation in CI.md is sufficient.

## Risks / Trade-offs

- **Loss of signup coverage** — these tests validated the auth flow from signup through verification. Trade-off: they don't work without SMTP, so they provide no value in CI. They can be re-enabled when SMTP is configured.
- **Forgot-password uncovered** — test 4.10 is removed. This flow is rarely changed and is a standard Supabase feature, so risk is low.
