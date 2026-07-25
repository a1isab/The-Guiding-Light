## Why

The platform has two critical data-integrity bugs that will cause silent failures in production, and several quality gaps that undermine the user experience. Fixing them now prevents data corruption and builds confidence in the system before we add more surface area.

## What Changes

- **Fix `progress` FK violation**: `progress.lesson_id` references `lessons(id)` (public courses), but teacher lesson completion writes `teacher_lessons.id` — a SQL FK violation. Create a separate `teacher_progress` table and route teacher lesson tracking there.
- **Fix `JoinClassCard` validation bug**: The dashboard join card calls `/api/teacher/invites/validate` which queries `teacher_invites`. Class invite codes live in `classes.invite_code` — it's the wrong table. Create `/api/student/invites/validate` and update the card.
- **Add quiz submission E2E tests**: The quiz retry/lockout state machine (3 fails → 30-min lock → 2 more retries → unlimited cycles) has zero test coverage despite being the most complex feature.
- **Consolidate duplicate code**: `src/lib/supabase.ts` and `src/lib/supabase-server.ts` are identical. `src/lib/gemini.ts` is unused by API routes. Dead weight.
- **Add password reset flow**: No forgot-password link on login, no reset page. Production requirement for any auth system.

## Capabilities

### New Capabilities
- `teacher-progress-tracking`: Track student progress (content viewed + lesson completion) for teacher-created lessons in a new `teacher_progress` table, independent of the public-course `progress` table.
- `class-invite-validation`: Fix class invite code validation so the dashboard join card correctly validates against `classes.invite_code` instead of `teacher_invites`.
- `quiz-e2e-tests`: Comprehensive E2E test covering quiz submission, scoring, pass/fail states, lockout, and auto-complete.
- `codebase-cleanup`: Remove duplicate `supabase-server.ts`, inline dead `gemini.ts`, remove unused imports and dead code.
- `password-reset`: Password reset flow with forgot-password link, reset page, and API integration via Supabase Auth.

### Modified Capabilities
(none)

## Impact

- **Database**: New migration `migration-013-teacher-progress.sql` creating `teacher_progress` table with FK to `teacher_lessons`.
- **API routes**: New `/api/student/invites/validate` endpoint. `/api/student/lessons/viewed` and `/api/teacher/quiz/submit` updated to write to `teacher_progress` for teacher lessons.
- **Components**: `JoinClassCard` updated to call correct validation endpoint. Auth pages get reset password flow.
- **Tests**: New E2E spec `quiz-submission.spec.ts` with 4+ test cases.
- **Files deleted**: `src/lib/supabase-server.ts`, dead code in `src/lib/gemini.ts`.
