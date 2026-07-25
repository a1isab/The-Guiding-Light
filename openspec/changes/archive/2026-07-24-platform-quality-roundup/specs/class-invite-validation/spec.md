## ADDED Requirements

### Requirement: Student invite validation endpoint
The system SHALL provide a `/api/student/invites/validate` endpoint that checks whether a given code is a valid, unexpired class invite code by querying `classes.invite_code`.

#### Scenario: Valid class invite code returns valid
- **WHEN** a POST is made to `/api/student/invites/validate` with a valid, unexpired class invite code
- **THEN** the response SHALL contain `{ valid: true }`

#### Scenario: Invalid class invite code returns invalid
- **WHEN** a POST is made to `/api/student/invites/validate` with a code that does not exist in `classes.invite_code`
- **THEN** the response SHALL contain `{ valid: false, message: "Invalid invite code" }`

#### Scenario: Expired class invite code returns invalid
- **WHEN** a POST is made to `/api/student/invites/validate` with a code whose `invite_expires_at` is in the past
- **THEN** the response SHALL contain `{ valid: false, message: "This invite code has expired" }`

### Requirement: JoinClassCard uses student validation endpoint
The `JoinClassCard` component SHALL call `/api/student/invites/validate` (not `/api/teacher/invites/validate`) when validating the invite code input.

#### Scenario: Join button calls correct endpoint
- **WHEN** a student enters an invite code and clicks the join button
- **THEN** the component sends a POST to `/api/student/invites/validate`
