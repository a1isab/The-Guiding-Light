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

## Known Instability

Some tests are sensitive to environment state:

- **Auth signup/verify tests (4.1-4.7)**: Require email delivery (Supabase SMTP). Skip on CI unless email is configured.
- **Teacher API-based setup tests**: `setupTeacherLesson()` helper may fail if auth cookie propagation is inconsistent. These affect `teacher-lesson.spec.ts`, `teacher-file-upload.spec.ts`, `teacher.spec.ts:6.4`, `student-view-lesson.spec.ts`, `quiz-submission.spec.ts`.
- **UI course creation (teacher 6.4)**: Fails if the course API route doesn't receive proper auth cookies.
- **Empty state checks (6.10)**: Depends on whether the teacher has existing classes.
- **Stat card testids (7.1)**: Should be stable now that testids use static keys instead of translated labels.
