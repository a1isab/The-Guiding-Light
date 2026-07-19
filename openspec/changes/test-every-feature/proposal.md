## Why

The app has 13 Playwright tests covering a fraction of its 60+ pages and 25 API routes. Most pages have zero `data-testid` attributes, making automated testing impossible without brittle selectors. Beyond test coverage, the API layer has critical security holes (two routes confirm any email with no auth, file uploads check no ownership) and correctness bugs (quiz scoring silently fails on string/number type mismatch). Without a CI pipeline, nothing runs automatically. This change makes every feature testable, fixes the bugs, and runs tests on every push.

## What Changes

- Add `data-testid` attributes to every interactive element across all roles (admin, teacher, student, auth)
- Fix the duplicate `go-to-dashboard` testid conflict on the join page
- Add auth guard to `/api/auth/confirm-email` and `/api/auth/verify-code` (critical — currently unauthenticated)
- Pass JWT from `Authorization` header on the 9 routes that skip it (quiz, join, status, etc.)
- Fix quiz scoring `===` comparison (string vs number mismatch silently under-scores)
- Add ownership check on `POST /api/teacher/files` (currently any user can add files to any lesson)
- Replace `Math.random()` with `crypto.randomBytes()` in teacher invite code generation
- Add try/catch handlers to the 20 route files that lack them
- Write 20+ Playwright tests covering signup, verify, all dashboards, all CRUD flows, progress, invites, and role redirects
- Add GitHub Actions workflow to run tests on push and PR
- Fix hardcoded English text to use i18n where found (dashboard greeting, badge titles, "Mark as Viewed", "courses" label)
- Remove unreachable `success` state dead code in signup page

## Capabilities

### New Capabilities
- `auth-signup-verify`: Signup as student/teacher, verification code flow, forgot/reset password
- `student-dashboard`: Stats cards, streak, progress bar, badges, class list, "continue learning"
- `student-class-flow`: View class, view course curriculum, view lesson, mark viewed, take quiz, completion flow
- `teacher-crud`: Create/edit/delete class, course, section, lesson; invite code management; student management; progress matrix
- `admin-crud`: Course CRUD, user management, invite generation
- `test-infrastructure`: `data-testid` attributes, GitHub Actions CI, shared test utilities

### Modified Capabilities
*(none — no existing specs to modify)*

## Impact

- **30+ page files** across `src/app/[locale]/` need `data-testid` attributes added
- **25 API route files** need fixes (auth guards, JWT, try/catch, scoring, randomness)
- **13 existing test files** remain unchanged; **20+ new test files** created under `tests/e2e/`
- **1 new file**: `.github/workflows/playwright.yml`
- **Minor i18n additions**: English translation keys for hardcoded strings
- No database migrations, no new dependencies
