## ADDED Requirements

### Requirement: Student can sign up with email and password
The system SHALL allow a new user to sign up as a student with email, password, and no invite code.

#### Scenario: Successful student signup
- **WHEN** user navigates to `/en/auth/signup`
- **AND** selects "Student" role
- **AND** fills in a valid email and password (6+ chars)
- **AND** clicks submit
- **THEN** the system creates a Supabase auth user
- **AND** generates a 6-digit verification code
- **AND** redirects to `/en/auth/verify`
- **AND** stores email, code, and password in sessionStorage

#### Scenario: Signup with existing email shows error
- **WHEN** user submits signup with an email that already exists
- **THEN** an error message is displayed
- **AND** the user remains on the signup page

#### Scenario: Password too short shows error
- **WHEN** user submits with password < 6 characters
- **THEN** browser validation prevents submission
- **AND** an HTML5 validation message is shown

### Requirement: User can sign up as a teacher with invite code
The system SHALL require a valid teacher invite code for teacher role signup.

#### Scenario: Teacher signup with valid invite code
- **WHEN** user selects "Teacher" role
- **AND** enters a valid invite code
- **AND** fills email and password
- **AND** clicks submit
- **THEN** the system creates a Supabase auth user with teacher role
- **AND** redirects to verify page

#### Scenario: Teacher signup with invalid invite code
- **WHEN** user selects "Teacher" role
- **AND** enters an invalid invite code
- **AND** fills email and password
- **AND** clicks submit
- **THEN** an error message is shown
- **AND** the user remains on signup page
- **AND** no auth user is created

#### Scenario: Teacher signup with empty invite code
- **WHEN** user selects "Teacher" role
- **AND** clicks submit without entering invite code
- **THEN** an error message prompts for invite code

### Requirement: User can verify email with 6-digit code
The system SHALL display a 6-digit code on the verify page and SHALL allow the user to enter it to confirm their email.

#### Scenario: Correct code enters dashboard
- **WHEN** user is redirected to verify page
- **AND** the 6-digit code is displayed on screen
- **AND** user types the matching code
- **AND** clicks verify
- **THEN** the email is confirmed via `auth_confirm_user` RPC
- **AND** the user is signed in with email and password
- **AND** redirected to the dashboard

#### Scenario: Wrong code shows error
- **WHEN** user enters a code that does not match the displayed code
- **AND** clicks verify
- **THEN** an error message is shown
- **AND** the user remains on the verify page

#### Scenario: Incomplete code shows error
- **WHEN** user clicks verify with fewer than 6 digits entered
- **THEN** an error message prompts for complete code

#### Scenario: Verify page without sessionStorage redirects
- **WHEN** user navigates directly to `/en/auth/verify`
- **AND** no signup data exists in sessionStorage
- **THEN** the user is redirected to `/en/auth/signup`

### Requirement: User can request password reset
The system SHALL allow users to request a password reset email.

#### Scenario: Forgot password with valid email
- **WHEN** user navigates to `/en/auth/forgot-password`
- **AND** enters their email
- **AND** clicks submit
- **THEN** a loading state is shown
- **AND** a confirmation message "Check your email" is displayed

#### Scenario: Forgot password with network error
- **WHEN** user submits with an email
- **AND** the Supabase API returns an error
- **THEN** the error message is displayed
- **AND** the user remains on the form

### Requirement: User can reset password with recovery token
The system SHALL allow users to set a new password after clicking the recovery link.

#### Scenario: Reset password with matching passwords
- **WHEN** user navigates to `/en/auth/reset-password` with a valid recovery token
- **AND** enters a new password (6+ chars) and confirmation
- **AND** clicks submit
- **THEN** the password is updated
- **AND** the user is redirected to login

#### Scenario: Reset password with mismatched passwords
- **WHEN** user enters different passwords in the two fields
- **AND** clicks submit
- **THEN** a mismatch error is displayed

### Requirement: User can log in and is redirected by role
The system SHALL redirect users to the correct dashboard based on their role after login.

#### Scenario: Admin login redirects to /admin
- **WHEN** admin enters credentials on `/en/auth/login`
- **AND** clicks submit
- **THEN** URL contains `/en/admin` after redirect

#### Scenario: Teacher login redirects to /teacher
- **WHEN** teacher enters credentials
- **THEN** URL contains `/en/teacher` after redirect

#### Scenario: Student login redirects to /dashboard
- **WHEN** student enters credentials
- **THEN** URL contains `/en/dashboard` after redirect

#### Scenario: Invalid credentials show error
- **WHEN** user enters wrong email or password
- **THEN** an error message is displayed on the login page

### Requirement: User can log out
The system SHALL sign the user out and clear the session.

#### Scenario: Logout redirects to home
- **WHEN** logged-in user clicks sign out
- **THEN** the session is cleared
- **AND** the user is redirected to the home page
