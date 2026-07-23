## ADDED Requirements

### Requirement: Collapsible curriculum sections on student course page

A `<StudentCurriculum>` component renders course sections with expand/collapse behavior, lesson completion indicators, and section progress.

#### Scenario: First section expanded by default
- **WHEN** the curriculum loads
- **THEN** the first section is expanded and all others are collapsed

#### Scenario: Section toggle on click
- **WHEN** the user clicks a section header
- **THEN** the section toggles between expanded and collapsed state with a rotating ChevronDown icon

#### Scenario: Section shows progress count
- **WHEN** a section has 5 lessons and 3 are completed
- **THEN** the section header shows "3/5 completed"

#### Scenario: Section shows completion icon
- **WHEN** all lessons in a section are completed
- **THEN** the section header shows a CheckCircle icon in emerald

#### Scenario: Lesson links use correct URL format
- **WHEN** a lesson is rendered in the student curriculum
- **THEN** its link points to `/en/dashboard/classes/{classId}/courses/{courseId}/lessons/{lessonId}`

#### Scenario: Lesson shows completion state
- **WHEN** a lesson has a corresponding row in `teacher_progress` with `content_viewed_at` set
- **THEN** the lesson shows a CheckCircle icon in emerald

#### Scenario: Curriculum uses teacher_progress for completion
- **WHEN** the component queries for completed lessons
- **THEN** it queries the `teacher_progress` table with `student_id` (not the public `progress` table with `user_id`)

#### Scenario: Component has test identifiers
- **WHEN** the curriculum renders
- **THEN** each section has `data-testid="student-section-{id}"` and each lesson has `data-testid="student-lesson-{id}"`
