## ADDED Requirements

### Requirement: "Continue where you left off" on dashboard
The dashboard SHALL prominently display the next uncompleted lesson across all enrolled courses and classes.

#### Scenario: Dashboard shows next lesson
- **WHEN** a student has incomplete lessons
- **THEN** the dashboard shows a "Continue Learning" card with the course/class name and lesson title
- **AND** clicking navigates directly to that lesson

#### Scenario: All lessons completed hides continue card
- **WHEN** a student has completed all lessons in all courses/classes
- **THEN** the "Continue Learning" card is hidden or shows "All caught up!"

### Requirement: Smart next-action after lesson completion
After completing a lesson, the system SHALL suggest the next logical lesson.

#### Scenario: Next lesson prompt after completion
- **WHEN** a student completes a lesson (passes quiz or marks complete)
- **THEN** a "Next Lesson" button appears with the next lesson's title
- **AND** clicking navigates directly to it

### Requirement: Completion celebration
Course and section completion SHALL trigger a celebratory visual effect.

#### Scenario: Section completion celebration
- **WHEN** a student completes the last lesson in a section
- **THEN** a celebration animation plays (confetti or similar)

#### Scenario: Course completion celebration
- **WHEN** a student completes the last lesson in a course
- **THEN** a celebration animation plays
- **AND** a course completion message is displayed

### Requirement: Track last activity
The `profiles` table SHALL track `last_activity_at` for retention analytics.

#### Scenario: Activity timestamp updated
- **WHEN** a student completes a lesson or quiz
- **THEN** `profiles.last_activity_at` is updated to the current timestamp
