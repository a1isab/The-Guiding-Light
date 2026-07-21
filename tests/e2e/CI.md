# CI Setup

## GitHub Actions

A Playwright CI workflow is defined in `.github/workflows/playwright.yml`.

### Required Secrets

Set these in the GitHub repo (Settings → Secrets and variables → Actions):

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

These are the same values found in `.env.local`.

### Test Accounts

The tests use pre-seeded Supabase accounts. Ensure these exist before running:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@theguidinglight.com | Admin123! |
| Teacher | teacher@theguidinglight.com | Teacher123! |
| Student | student@theguidinglight.com | Student123! |

Run `npm run seed:users` to seed/create them.

## Running Locally

The correct command is:

```bash
npm run test:e2e
```

This runs Playwright in headed mode (browser visible) without any debug features.

**Avoid these flags unless intentionally debugging:**
- `--ui` — opens Playwright UI Mode with a test runner panel, shows a blank browser until you click "Resume"
- `--debug` — opens Playwright Inspector, pauses at every step, requires clicking "Resume" to continue
- `PWDEBUG=1` — same as `--debug`

If you see a blank browser with a "Resume" button, you're running in UI mode or debug mode. Kill it and use `npm run test:e2e` instead.

## Known Instability

Some tests are sensitive to environment state:

- **Auth signup/verify tests (4.1-4.7)**: Require email delivery (Supabase SMTP). Skip on CI unless email is configured.
- **Teacher API-based setup tests**: `setupTeacherLesson()` helper may fail if auth cookie propagation is inconsistent. These affect `teacher-lesson.spec.ts`, `teacher-file-upload.spec.ts`, `teacher.spec.ts:6.4`, `student-view-lesson.spec.ts`, `quiz-submission.spec.ts`.
- **UI course creation (teacher 6.4)**: Fails if the course API route doesn't receive proper auth cookies.
- **Empty state checks (6.10)**: Depends on whether the teacher has existing classes.
- **Stat card testids (7.1)**: Should be stable now that testids use static keys instead of translated labels.
- **Email-triggering tests removed**: Signup-flow tests (student signup via UI, teacher signup with invite code), verify-page tests (correct/wrong code), and forgot-password test have been removed from `auth.spec.ts` because Supabase's free tier enforces strict email quotas. These tests will be re-added when SMTP is configured or the Supabase plan is upgraded.
