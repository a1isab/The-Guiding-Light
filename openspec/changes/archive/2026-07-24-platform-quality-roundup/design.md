## Context

The platform has two course systems sharing the `progress` table via a broken FK, a validation endpoint querying the wrong database table, zero E2E coverage on the most complex feature (quiz), duplicate utility files, and no password reset flow. These are production-blocking issues that compound over time.

## Goals / Non-Goals

**Goals:**
- Eliminate FK violation when tracking teacher lesson progress
- Fix student class invite validation to use the correct table
- Add E2E test coverage for quiz submission pass/fail/lockout/auto-complete
- Remove duplicate and dead code
- Add password reset flow

**Non-Goals:**
- No new features beyond the fixes described
- No refactoring of the public course `progress` table
- No changes to quiz retry logic or thresholds
- No new UI components (except password reset page)

## Decisions

### 1. New `teacher_progress` table over polymorphic approach
**Decision**: Create a standalone `teacher_progress` table rather than making `progress.lesson_id` nullable + adding a `lesson_type` discriminator, or removing the FK.
**Rationale**: The two course systems (public vs teacher) are already completely separate tables (different prefixes, different schemas). A separate progress table maintains this clean separation. A polymorphic single table would require nullable FKs, CHECK constraints, and more complex queries. A separate table is simpler, has cleaner FK enforcement, and is easier to reason about.
**Alternatives considered**:
- Polymorphic `progress` (lesson_id nullable + teacher_lesson_id column + check constraint one non-null): More complex queries, harder to maintain.
- Drop the FK constraint entirely: Loses referential integrity.
- `teacher_progress` table: Clean, simple, mirrors existing patterns.

### 2. New `/api/student/invites/validate` endpoint
**Decision**: Create a new API endpoint under the student namespace rather than repurposing the teacher one.
**Rationale**: The teacher endpoint checks `teacher_invites` for teacher signup codes. Mixing both concerns would make the endpoint do double duty with confusing branching logic. A dedicated student endpoint is explicit, self-documenting, and follows the existing API route namespace pattern.
**What it validates**: Checks `classes.invite_code` for existence, checks `invite_expires_at` against current time, and optionally checks the user isn't already a member.

### 3. Quiz E2E flow via direct API calls rather than full browser UI
**Decision**: The quiz E2E test will use Playwright's `page.evaluate` for quiz submission (bypassing the browser UI for the scoring assertions), while using the browser for login and page navigation.
**Rationale**: The quiz viewer component involves click interactions for each question and a submit button. Controlling all of that via Playwright selectors would be fragile. Submitting answers via `fetch` to `/api/teacher/quiz/submit` from within `page.evaluate` gives us deterministic, fast assertions on the pass/fail/lockout states. We test the UI separately (quiz viewer renders, submit button exists) via existing tests.

### 4. Password reset via Supabase Auth REST API
**Decision**: Use Supabase's built-in `supabase.auth.resetPasswordForEmail()` for the forgot-password flow, and `supabase.auth.updateUser()` for the actual password change on the reset page.
**Rationale**: Supabase Auth provides this natively. We don't need to build SMTP or token management. The flow is: user enters email → Supabase sends reset email → user clicks link → reset page calls `updateUser({ password })`.
**Note**: Supabase's built-in email template needs to be configured in the Supabase dashboard (or we can customize the redirect URL).

## Risks / Trade-offs

- [Migration ordering] Migration-013 must be applied after all previous migrations since it references `teacher_lessons` (created in migration-006).
- [Password reset email deliverability] Depends on Supabase's email service. If emails don't arrive, users are stuck. Mitigation: Add a "resend email" button with cooldown.
- [Quiz test retries] The lockout test checks HTTP 429 status — this is fast. But if the retry logic timing changes, the test breaks.
