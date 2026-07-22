## ADDED Requirements

### Requirement: Students can bookmark lessons
The system SHALL allow students to toggle a bookmark on any lesson they can access.

#### Scenario: Bookmark a lesson
- **WHEN** a student clicks the bookmark icon on a lesson page
- **THEN** the lesson is added to their bookmarks and the icon changes to filled/saved state

#### Scenario: Unbookmark a lesson
- **WHEN** a student clicks the bookmark icon on an already-bookmarked lesson
- **THEN** the lesson is removed from their bookmarks and the icon reverts to outline state

### Requirement: Dashboard shows saved lessons
The system SHALL display a "Saved Lessons" section on the student dashboard showing all bookmarked lessons.

#### Scenario: Saved lessons section visible
- **WHEN** a student with bookmarks visits the dashboard
- **THEN** they see a "Saved Lessons" section with cards for each bookmarked lesson showing title, course name, and link

#### Scenario: Empty saved lessons
- **WHEN** a student has no bookmarks
- **THEN** the "Saved Lessons" section is hidden (not shown with empty state)

### Requirement: Bookmark state is persistent
The system SHALL persist bookmarks across sessions.

#### Scenario: Bookmark survives logout
- **WHEN** a student bookmarks a lesson, logs out, and logs back in
- **THEN** the bookmark is still present on the lesson

### Requirement: Bookmark is toggle (unique constraint)
The system SHALL enforce a unique constraint on (user_id, lesson_id) in the bookmarks table.

#### Scenario: Duplicate bookmark prevented
- **WHEN** a student attempts to bookmark a lesson they already bookmarked
- **THEN** the system returns the existing bookmark state without creating a duplicate
