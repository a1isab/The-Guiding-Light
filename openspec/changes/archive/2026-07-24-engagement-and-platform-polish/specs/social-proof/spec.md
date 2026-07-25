## ADDED Requirements

### Requirement: Lesson completion counter
Lesson pages SHALL display the number of students who have completed that lesson.

#### Scenario: Public lesson shows completion count
- **WHEN** a student views a public lesson page
- **THEN** they see "X students completed this lesson"
- **AND** the count is derived from the `progress` table

#### Scenario: Teacher lesson shows completion count
- **WHEN** a student views a teacher lesson page
- **THEN** they see "X students completed this lesson"
- **AND** the count is derived from the `teacher_progress` table

### Requirement: Course enrollment counter
Course pages SHALL display the number of enrolled students.

#### Scenario: Public course shows enrollment count
- **WHEN** a student views a public course page
- **THEN** they see "Y students enrolled"
- **AND** the count is derived from distinct user_ids in the `progress` table for that course's lessons

#### Scenario: Counts are lazy-loaded
- **WHEN** a student navigates to a lesson or course page
- **THEN** the counter loads asynchronously (non-blocking)
