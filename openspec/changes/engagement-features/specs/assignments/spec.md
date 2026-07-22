## ADDED Requirements

### Requirement: Teachers can create assignments
The system SHALL allow teachers to create assignments attached to lessons. An assignment has a title, description, optional due date, and optional maximum score.

#### Scenario: Teacher creates an assignment
- **WHEN** a teacher submits the assignment creation form with title, description, and optional due date
- **THEN** the assignment is saved and appears on the lesson page for enrolled students

#### Scenario: Teacher edits an assignment
- **WHEN** a teacher updates an existing assignment's title, description, or due date
- **THEN** the changes are saved and reflected for students

### Requirement: Students can submit text responses
The system SHALL allow students to submit text-based responses to assignments.

#### Scenario: Student submits text assignment
- **WHEN** a student fills in the submission text area and clicks submit
- **THEN** the submission is saved with a "submitted" status and timestamp

### Requirement: Students can submit file attachments
The system SHALL allow students to attach up to 3 files (max 10MB each) to their submission.

#### Scenario: Student uploads files with submission
- **WHEN** a student attaches files and submits
- **THEN** the files are uploaded to Supabase Storage and linked to the submission

#### Scenario: File exceeds size limit
- **WHEN** a student attempts to upload a file larger than 10MB
- **THEN** the system displays an error message and prevents the upload

### Requirement: Teachers can grade submissions
The system SHALL allow teachers to review submissions and assign a score with optional feedback text.

#### Scenario: Teacher grades a submission
- **WHEN** a teacher enters a score and feedback, then saves
- **THEN** the submission status changes to "graded" and the student can see the grade and feedback

#### Scenario: Teacher views all submissions for an assignment
- **WHEN** a teacher navigates to the assignment's submissions page
- **THEN** they see a table of all student submissions with status (submitted/graded/pending)

### Requirement: Students can see their grades
The system SHALL allow students to view their submission status, score, and teacher feedback.

#### Scenario: Student views graded submission
- **WHEN** a student navigates to a graded assignment
- **THEN** they see their score, feedback, and the assignment's maximum score

### Requirement: Assignment shows submission status
The system SHALL display the current submission status on the lesson page (not submitted / submitted / graded).

#### Scenario: Status indicator on lesson
- **WHEN** a student views a lesson with an assignment
- **THEN** the assignment section shows their submission status with appropriate icon/color
