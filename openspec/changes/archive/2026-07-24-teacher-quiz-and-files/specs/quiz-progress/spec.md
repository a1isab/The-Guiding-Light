## ADDED Requirements

### Requirement: Progress page shows quiz scores
The teacher's class progress page SHALL display quiz attempt scores alongside lesson completion status for each student.

#### Scenario: Teacher views progress
- **WHEN** a teacher views `/dashboard/classes/[id]/progress`
- **THEN** the page SHALL show a table with students as rows and lessons as columns
- **THEN** each cell SHALL show either: "Complete", "Incomplete", or the quiz score (e.g., "4/5")
- **THEN** if a student passed the quiz, the cell SHALL show the best score

### Requirement: Student sees own quiz history
A student SHALL be able to see their own quiz attempts and best score for each lesson.

#### Scenario: Student views their lesson progress
- **WHEN** a student views a lesson page
- **THEN** they SHALL see their quiz status (score, passed, attempts remaining or locked)
- **THEN** they SHALL see their best score if they have retaken the quiz
