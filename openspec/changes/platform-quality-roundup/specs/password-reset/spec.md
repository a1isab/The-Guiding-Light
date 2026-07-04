## ADDED Requirements

### Requirement: Forgot password link on login page
The login page SHALL display a "Forgot password?" link below the password field that navigates to `/auth/forgot-password`.

#### Scenario: Forgot password link is visible
- **WHEN** a user visits the login page
- **THEN** a "Forgot password?" link SHALL be visible below the password input

#### Scenario: Clicking link navigates to forgot password
- **WHEN** a user clicks "Forgot password?"
- **THEN** the browser navigates to `/{locale}/auth/forgot-password`

### Requirement: Forgot password page
The system SHALL provide a `/auth/forgot-password` page where users can enter their email to receive a password reset link.

#### Scenario: Forgot password form submits
- **WHEN** a user enters their email and submits the form
- **THEN** the system calls `supabase.auth.resetPasswordForEmail()` and shows a success message

#### Scenario: Invalid email shows error
- **WHEN** a user submits an empty or invalid email
- **THEN** the system shows a validation error

### Requirement: Password reset page
The system SHALL handle the Supabase password reset redirect URL (`/auth/callback?type=recovery`) and provide a page for the user to set a new password.

#### Scenario: Reset callback updates password
- **WHEN** a user clicks the reset link in their email and navigates to the callback
- **THEN** the system detects `type=recovery` and SHALL redirect to `/auth/reset-password` with a session

#### Scenario: New password form submits
- **WHEN** a user enters a new password and confirms it on the reset page
- **THEN** the system calls `supabase.auth.updateUser({ password })` and redirects to login with a success message
