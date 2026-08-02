## ADDED Requirements

### Requirement: Verification code sent via email
The system SHALL generate a 6-digit verification code server-side and send it to the user's email address via Resend after successful account creation.

#### Scenario: Code emailed after signup
- **WHEN** a user completes the signup form and the server generates a verification code
- **THEN** the system SHALL send an email to the user's address containing the 6-digit code, and return only the proof token to the client

#### Scenario: Code is numeric 6 digits
- **WHEN** the server generates a verification code
- **THEN** the code SHALL be exactly 6 numeric digits (0-9)

#### Scenario: Code expires after 15 minutes
- **WHEN** a verification code is generated
- **THEN** the system SHALL reject it after 15 minutes

### Requirement: Verify page does not display code
The verify page SHALL NOT display the verification code on-screen. Users MUST check their email to retrieve it.

#### Scenario: Verify page shows email input only
- **WHEN** a user lands on the verify page
- **THEN** the page SHALL show 6 empty digit inputs and the user's email address, with no code displayed

### Requirement: Auto-submit on complete code entry
The system SHALL automatically submit the verification code when all 6 digits are entered, without requiring the user to click the verify button.

#### Scenario: All 6 digits entered
- **WHEN** the user enters the 6th digit into the last input field
- **THEN** the system SHALL automatically trigger verification

#### Scenario: Full code pasted
- **WHEN** the user pastes a 6-digit code into any input field
- **THEN** the system SHALL fill all 6 inputs and auto-submit

### Requirement: Server-side code verification
The verify-code API SHALL validate the 6-digit code against the server-stored code, in addition to validating the proof token.

#### Scenario: Correct code and valid token
- **WHEN** the user submits the correct 6-digit code and a valid proof token
- **THEN** the system SHALL confirm the user's email and sign them in

#### Scenario: Incorrect code
- **WHEN** the user submits an incorrect 6-digit code
- **THEN** the system SHALL return an error and NOT confirm the email

#### Scenario: Expired code
- **WHEN** the user submits a code that has expired (older than 15 minutes)
- **THEN** the system SHALL return an error indicating the code has expired

### Requirement: Resend email delivery
The system SHALL use the Resend SDK to send verification emails with the 6-digit code.

#### Scenario: Resend API key configured
- **WHEN** the `RESEND_API_KEY` environment variable is set
- **THEN** the system SHALL use Resend to send the verification email

#### Scenario: Resend API key missing
- **WHEN** the `RESEND_API_KEY` environment variable is not set
- **THEN** the system SHALL log an error and return a user-friendly error message
