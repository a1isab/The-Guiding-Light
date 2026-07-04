## ADDED Requirements

### Requirement: Teacher lesson progress table
The system SHALL store student progress on teacher-created lessons in a `teacher_progress` table separate from the public-course `progress` table.

#### Scenario: Content viewed is recorded in teacher_progress
- **WHEN** a student clicks "Mark as Viewed" on a teacher lesson
- **THEN** the system inserts/upserts a record in `teacher_progress` with `student_id`, `lesson_id`, and `content_viewed_at`

#### Scenario: Quiz pass auto-completes teacher lesson
- **WHEN** a student passes a teacher lesson quiz (score >= 60%)
- **THEN** the system inserts a record in `teacher_progress` with `student_id`, `lesson_id`, and `completed_at`

#### Scenario: Teacher lesson progress does not affect public progress
- **WHEN** a student marks a teacher lesson as viewed
- **THEN** no rows are inserted or modified in the `progress` table (public course table)

### Requirement: New migration creates teacher_progress table
The migration SHALL create a `teacher_progress` table with columns: `id` (UUID PK), `student_id` (FK → `profiles.user_id`), `lesson_id` (FK → `teacher_lessons.id`), `content_viewed_at` (nullable timestamptz), `completed_at` (nullable timestamptz), and a UNIQUE constraint on `(student_id, lesson_id)`.

#### Scenario: Migration runs successfully
- **WHEN** migration-013-teacher-progress.sql is executed
- **THEN** the `teacher_progress` table exists with the correct columns and constraints

### Requirement: RLS policies for teacher_progress
The `teacher_progress` table SHALL have RLS policies:
- Students can SELECT their own rows (WHERE `student_id = auth.uid()`)
- Students can INSERT their own rows (WHERE `student_id = auth.uid()`)
- Teachers can SELECT rows for their class lessons (via JOIN through lesson → section → course → class)
- Admins can SELECT all rows

#### Scenario: Student inserts own progress
- **WHEN** a student calls INSERT on `teacher_progress` with their own `student_id`
- **THEN** the insert succeeds

#### Scenario: Student cannot insert progress for another student
- **WHEN** a student calls INSERT on `teacher_progress` with a different `student_id`
- **THEN** the insert is rejected by RLS

### Requirement: Update viewed API to write to teacher_progress
The `/api/student/lessons/viewed` endpoint SHALL detect whether the lesson is a teacher lesson or public lesson and write to the appropriate table.

#### Scenario: Teacher lesson viewed writes to teacher_progress
- **WHEN** a POST is made to `/api/student/lessons/viewed` with a `lessonId` that exists in `teacher_lessons`
- **THEN** the system writes to `teacher_progress`

#### Scenario: Public lesson viewed writes to progress
- **WHEN** a POST is made to `/api/student/lessons/viewed` with a `lessonId` that exists in `lessons`
- **THEN** the system writes to `progress` (existing behavior unchanged)

### Requirement: Update quiz submit to write to teacher_progress
The `/api/teacher/quiz/submit` endpoint SHALL write lesson completion to `teacher_progress` instead of `progress` when the lesson is a teacher lesson.

#### Scenario: Quiz pass records completion in teacher_progress
- **WHEN** a student passes a teacher lesson quiz
- **THEN** the system writes `completed_at` to `teacher_progress`
