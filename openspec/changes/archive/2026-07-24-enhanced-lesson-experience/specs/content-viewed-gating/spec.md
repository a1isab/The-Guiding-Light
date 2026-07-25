## ADDED Requirements

### Requirement: Progress table tracks content view
The progress table SHALL have a content_viewed_at TIMESTAMPTZ column that records when a student first viewed the lesson content.

#### Scenario: Student views lesson content
- **WHEN** student navigates to a lesson page
- **THEN** the system SHALL check if content_viewed_at is set for that student-lesson pair
- **AND** if null, SHALL display a "Mark as Viewed" button below the content (after video if exists)

### Requirement: Quiz is gated behind content view
The quiz section SHALL only be visible after the student has marked content as viewed.

#### Scenario: Lesson with video — student marks content as viewed
- **WHEN** student clicks "Mark as Viewed" button
- **THEN** the system SHALL set content_viewed_at = now() in the progress table
- **AND** the quiz section SHALL become visible immediately without page reload
- **AND** the "Mark as Viewed" button SHALL disappear

#### Scenario: Lesson without video — student marks content as viewed
- **WHEN** student reads the text content and browses documents
- **THEN** the "Mark as Viewed" button SHALL be visible below the content
- **AND** clicking it SHALL unlock the quiz section as above

#### Scenario: Returning student who already viewed content
- **WHEN** a student returns to a lesson they have previously viewed
- **THEN** the quiz section SHALL be immediately visible (content_viewed_at already set)
