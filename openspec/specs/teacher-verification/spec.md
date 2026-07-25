# teacher-verification Specification

## Purpose
TBD - created by archiving change teacher-verification-featured-tour. Update Purpose after archive.
## Requirements
### Requirement: Teacher submits verification request
The system SHALL allow teachers to submit a verification request containing a document type, uploaded document file, optional document number, and optional notes.

#### Scenario: Teacher submits verification with passport
- **WHEN** a teacher with role "teacher" submits a verification request with document_type="passport", a valid file upload (JPG/PNG/PDF, max 10MB), and optional notes
- **THEN** the system SHALL upload the document to the `verification-documents` storage bucket under `{user_id}/{filename}`, create a row in `teacher_verification_requests` with status="pending", and return the request ID

#### Scenario: Teacher already has a pending request
- **WHEN** a teacher submits a verification request and already has an existing request with status="pending"
- **THEN** the system SHALL return a 409 Conflict error with message "You already have a pending verification request"

#### Scenario: Non-teacher attempts to submit
- **WHEN** a user with role "student" attempts to submit a verification request
- **THEN** the system SHALL return a 403 Forbidden error

### Requirement: Teacher views own verification status
The system SHALL allow teachers to retrieve their verification request history and current status.

#### Scenario: Teacher checks status with no prior requests
- **WHEN** a teacher requests their verification status and has never submitted a request
- **THEN** the system SHALL return status: "none"

#### Scenario: Teacher checks status with pending request
- **WHEN** a teacher requests their verification status and has an active pending request
- **THEN** the system SHALL return the request with status: "pending" and the created_at timestamp

#### Scenario: Teacher checks status with approved request
- **WHEN** a teacher requests their verification status and has an approved request
- **THEN** the system SHALL return the request with status: "approved" and the reviewed_at timestamp

### Requirement: Admin reviews verification requests
The system SHALL allow admins to view all pending verification requests and approve or reject them.

#### Scenario: Admin views pending requests
- **WHEN** an admin requests the list of verification requests
- **THEN** the system SHALL return all requests ordered by created_at ascending, including teacher user_id, document_type, status, and created_at

#### Scenario: Admin approves a verification request
- **WHEN** an admin approves a request with status="pending"
- **THEN** the system SHALL set the request status to "approved", set reviewed_by to the admin's user_id, set reviewed_at to now, and set `profiles.is_verified = true` for the teacher

#### Scenario: Admin rejects a verification request
- **WHEN** an admin rejects a request with status="pending" and provides optional review_notes
- **THEN** the system SHALL set the request status to "rejected", set reviewed_by to the admin's user_id, set reviewed_at to now, and store the review_notes

#### Scenario: Admin attempts to review already-reviewed request
- **WHEN** an admin attempts to approve or reject a request that is not in "pending" status
- **THEN** the system SHALL return a 409 Conflict error

### Requirement: Verification documents are access-controlled
The system SHALL store verification documents in a private storage bucket accessible only to the uploading teacher and admins.

#### Scenario: Teacher uploads verification document
- **WHEN** a teacher uploads a file to the `verification-documents` bucket
- **THEN** the file SHALL be stored at path `{user_id}/{filename}` and only the uploading teacher and admins SHALL have read access

#### Scenario: Non-owner teacher attempts to read document
- **WHEN** a teacher attempts to read a verification document belonging to another teacher
- **THEN** the system SHALL return a 403 Forbidden error

### Requirement: Verified teacher profile flag
The system SHALL set `profiles.is_verified = true` when a teacher's verification request is approved, and SHALL NOT set it when rejected.

#### Scenario: Profile flag set on approval
- **WHEN** a teacher's verification request is approved
- **THEN** `profiles.is_verified` SHALL be set to `true` for that teacher's user_id

#### Scenario: Profile flag not changed on rejection
- **WHEN** a teacher's verification request is rejected
- **THEN** `profiles.is_verified` SHALL remain unchanged for that teacher's user_id

