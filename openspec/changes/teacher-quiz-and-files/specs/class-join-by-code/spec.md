## ADDED Requirements

### Requirement: Student dashboard has "Join by Code" input
The student dashboard SHALL have a text input and "Join" button to join a class using an invite code.

#### Scenario: Student joins with valid code
- **WHEN** a student enters a valid invite code and clicks "Join"
- **THEN** the system SHALL call `/api/teacher/invites/validate` with the code
- **THEN** the system SHALL redirect the student to `/join/[code]` (existing join page)
- **THEN** the student SHALL be added to the class

#### Scenario: Student enters invalid code
- **WHEN** a student enters an invalid or expired invite code
- **THEN** the UI SHALL show an error message "Invalid or expired invite code"
- **THEN** the student SHALL NOT be redirected

### Requirement: Join page handles direct code entry
The existing `/join/[inviteCode]` page SHALL continue to work for direct URL-based joining.

#### Scenario: Student joins via shared link
- **WHEN** a student navigates to `/join/ABC123`
- **THEN** the system SHALL validate the code and join the student to the class
