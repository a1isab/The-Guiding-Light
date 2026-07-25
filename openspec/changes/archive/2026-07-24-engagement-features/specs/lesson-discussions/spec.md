## ADDED Requirements

### Requirement: Students can post comments on lessons
The system SHALL allow authenticated students to post text comments on any lesson they have access to (enrolled class lessons or public lessons).

#### Scenario: Student posts a top-level comment
- **WHEN** a student submits a comment on a lesson page
- **THEN** the comment appears in the discussion thread with the student's name and timestamp

#### Scenario: Unauthenticated user cannot comment
- **WHEN** a non-logged-in user attempts to post a comment
- **THEN** the system SHALL redirect to the login page

### Requirement: Comments support threading
The system SHALL allow users to reply to existing comments, creating a parent-child relationship. Threading SHALL be limited to 2 levels (top-level comments and direct replies).

#### Scenario: Student replies to a comment
- **WHEN** a student clicks "Reply" on an existing comment and submits
- **THEN** the reply appears indented under the parent comment

#### Scenario: Reply to a reply is not allowed
- **WHEN** a user attempts to reply to a comment that is already a reply
- **THEN** the reply button SHALL not be displayed

### Requirement: Teachers can delete comments
The system SHALL allow teachers to delete any comment on lessons within their classes.

#### Scenario: Teacher deletes a student's comment
- **WHEN** a teacher clicks delete on a comment in their class's lesson
- **THEN** the comment is removed from the database and disappears from the thread

### Requirement: Users can delete their own comments
The system SHALL allow any user to delete their own comments.

#### Scenario: Student deletes their own comment
- **WHEN** a student clicks delete on their own comment
- **THEN** the comment is removed from the thread

### Requirement: Comments display author and timestamp
The system SHALL display the author's display name and a relative timestamp for each comment.

#### Scenario: Comment shows metadata
- **WHEN** a comment is rendered in the thread
- **THEN** it shows the author's name, role badge (teacher/student), and relative time (e.g., "2 hours ago")

### Requirement: Lesson page shows comment count
The system SHALL display the total number of comments on a lesson page.

#### Scenario: Comment count visible
- **WHEN** a lesson page loads
- **THEN** the discussion section header shows the comment count
