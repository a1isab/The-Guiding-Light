## ADDED Requirements

### Requirement: Teachers can post announcements
The system SHALL allow teachers to create announcements with a title and body text, targeted at a specific class.

#### Scenario: Teacher posts announcement
- **WHEN** a teacher submits the announcement form with title and body
- **THEN** the announcement is saved and becomes visible to enrolled students

#### Scenario: Teacher edits announcement
- **WHEN** a teacher updates an existing announcement
- **THEN** the changes are saved and reflected for students

#### Scenario: Teacher deletes announcement
- **WHEN** a teacher deletes an announcement
- **THEN** it is removed from the database and no longer visible to students

### Requirement: Students see announcements on class page
The system SHALL display announcements as a banner/card at the top of the student's class page.

#### Scenario: Announcement banner visible
- **WHEN** a student visits a class page with announcements
- **THEN** announcements are displayed at the top with title, body, and timestamp

#### Scenario: Most recent first
- **WHEN** multiple announcements exist
- **THEN** they are displayed in reverse chronological order (newest first)

### Requirement: Unread announcements are highlighted
The system SHALL track which announcements each student has seen and highlight unread ones.

#### Scenario: New announcement indicator
- **WHEN** a student visits a class page with unread announcements
- **THEN** unread announcements have a visual indicator (e.g., blue dot, bold title)

#### Scenario: Announcement marked as read
- **WHEN** a student views a class page
- **THEN** all visible announcements are marked as read for that student

### Requirement: Announcement count on dashboard
The system SHALL show the count of unread announcements on the student dashboard class cards.

#### Scenario: Unread count badge
- **WHEN** a student has unread announcements for a class
- **THEN** the class card on the dashboard shows a badge with the unread count
