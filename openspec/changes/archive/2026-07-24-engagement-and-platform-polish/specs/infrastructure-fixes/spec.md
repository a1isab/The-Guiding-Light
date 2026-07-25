## ADDED Requirements

### Requirement: migration-013 applied to database
The existing `supabase/migration-013-teacher-progress.sql` SHALL be applied to the development and production databases.

#### Scenario: teacher_progress table exists after migration
- **WHEN** migration-013 is executed
- **THEN** the `teacher_progress` table exists with columns: id, student_id, lesson_id, content_viewed_at, completed_at, and UNIQUE(student_id, lesson_id)

#### Scenario: Quiz submit route no longer crashes
- **WHEN** a student passes a teacher lesson quiz (POST /api/teacher/quiz/submit)
- **THEN** the route writes to `teacher_progress` without "relation does not exist" error

#### Scenario: Viewed route no longer crashes
- **WHEN** a student marks a teacher lesson as viewed (POST /api/student/lessons/viewed)
- **THEN** the route writes to `teacher_progress` without "relation does not exist" error

### Requirement: Proxy middleware propagates auth headers
The middleware in `src/proxy.ts` SHALL call `getUser()` on protected routes and set `x-user-id` and `x-user-roles` headers on the forwarded request.

#### Scenario: Authenticated request includes user headers
- **WHEN** an authenticated user navigates to a protected route
- **THEN** the middleware sets `x-user-id` and `x-user-roles` headers
- **AND** Server Components read these headers instead of calling `getUser()` again

### Requirement: Password reset flow exists
The system SHALL provide a complete password reset flow: "Forgot password?" link on login page, email input form, callback handler for recovery, and new password form.

#### Scenario: User requests password reset
- **WHEN** a user clicks "Forgot password?" on the login page
- **THEN** they see an email input form
- **AND** submitting calls `supabase.auth.resetPasswordForEmail()`

#### Scenario: Recovery callback redirects to reset page
- **WHEN** Supabase redirects to `/auth/callback` with `type=recovery`
- **THEN** the callback route redirects to `/auth/reset-password`

#### Scenario: User sets new password
- **WHEN** a user submits a new password on the reset page
- **THEN** `supabase.auth.updateUser({ password })` is called

### Requirement: Translations synced across all locales
All new UI strings for quiz editor, quiz viewer, file upload, join-by-code, and progress scores SHALL exist in `messages/ar.json`, `messages/ur.json`, and `messages/fr.json` matching the structure in `messages/en.json`.

### Requirement: Dead code removed
- `src/lib/supabase-server.ts` SHALL be deleted (identical to `src/lib/supabase.ts`)
- Dead code in `src/lib/gemini.ts` SHALL be removed if unused

### Requirement: Test users verified
The three test users SHALL be verified to have no redirect loops:
- `heyamer123@gmail.com` (teacher) — can access teacher routes
- `admin@theguidinglight.com` (admin) — can access admin routes
- `student@theguidinglight.com` (student) — dashboard works, admin/teacher redirect to dashboard
