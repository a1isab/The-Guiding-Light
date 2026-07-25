## ADDED Requirements

### Requirement: Student can view class courses
The system SHALL display all courses in a class the student is enrolled in.

#### Scenario: Class detail shows course list
- **WHEN** student navigates to `/en/dashboard/classes/{classId}`
- **THEN** the class name and description are shown
- **AND** all courses in that class are listed with titles

#### Scenario: Empty class shows no courses message
- **WHEN** the class has no courses
- **THEN** a "no courses" empty state is shown

### Requirement: Student can view course curriculum
The system SHALL display sections and lessons within a course with completion status.

#### Scenario: Course curriculum shows sections and lessons
- **WHEN** student navigates to `/en/dashboard/classes/{classId}/courses/{courseId}`
- **THEN** the course title and description are shown
- **AND** sections are listed with their lessons
- **AND** completed lessons show a checkmark icon
- **AND** lessons with video show a film icon

### Requirement: Student can view a lesson and mark it as viewed
The system SHALL display lesson content and allow the student to mark it as viewed.

#### Scenario: Lesson view shows content
- **WHEN** student navigates to the lesson view page
- **THEN** the lesson title and markdown content are displayed
- **AND** a "Mark as Viewed" button is visible

#### Scenario: Mark as viewed updates state
- **WHEN** student clicks "Mark as Viewed"
- **THEN** the button is no longer visible
- **AND** the lesson is marked as completed

#### Scenario: Video lesson shows video player
- **WHEN** the lesson has a video URL
- **THEN** an iframe video player is visible

### Requirement: Student can take a quiz after viewing
The system SHALL unlock the quiz after the lesson content is viewed.

#### Scenario: Quiz appears after marking viewed
- **WHEN** student marks the lesson as viewed
- **AND** the lesson has quiz questions
- **THEN** the quiz component is visible

#### Scenario: Quiz shows locked state before viewing
- **WHEN** student has not marked the lesson as viewed
- **AND** the lesson has quiz questions
- **THEN** a "quiz locked" message is shown

#### Scenario: No quiz message
- **WHEN** the lesson has no quiz questions
- **THEN** a "No quiz for this lesson." message is visible

### Requirement: Student can complete a quiz and see results
The system SHALL score the quiz, show completion, and award confetti.

#### Scenario: Passing quiz shows celebration
- **WHEN** student answers all questions correctly
- **AND** clicks submit
- **THEN** a "Lesson Complete!" message is shown
- **AND** a confetti canvas is visible
- **AND** a "Continue to Next Lesson" button is visible
