## ADDED Requirements

### Requirement: All interactive elements have data-testid attributes
The system SHALL have stable `data-testid` attributes on all interactive elements for automated testing.

#### Scenario: Signup page has testids
- **WHEN** signup page renders
- **THEN** the email input has `data-testid="signup-email"`
- **AND** the password input has `data-testid="signup-password"`
- **AND** the student role button has `data-testid="signup-role-student"`
- **AND** the teacher role button has `data-testid="signup-role-teacher"`
- **AND** the invite code input has `data-testid="signup-invite-code"`
- **AND** the submit button has `data-testid="signup-submit"`
- **AND** the error message has `data-testid="signup-error"`

#### Scenario: Verify page has testids
- **WHEN** verify page renders
- **THEN** each digit input has `data-testid="verify-code-input-{index}"`
- **AND** the displayed code has `data-testid="verify-displayed-code"`
- **AND** the verify button has `data-testid="verify-submit"`
- **AND** the error message has `data-testid="verify-error"`

#### Scenario: Forgot password page has testids
- **WHEN** forgot password page renders
- **THEN** the email input has `data-testid="forgot-email"`
- **AND** the submit button has `data-testid="forgot-submit"`
- **AND** the error message has `data-testid="forgot-error"`
- **AND** the sent confirmation has `data-testid="forgot-sent"`

#### Scenario: Reset password page has additional testids
- **WHEN** reset password page renders
- **THEN** the password input has `data-testid="reset-password"`
- **AND** the confirm input has `data-testid="reset-confirm"`
- **AND** the error message has `data-testid="reset-error"`
- **AND** the submit button already has `data-testid="reset-password-submit"`

#### Scenario: Student dashboard has testids
- **WHEN** dashboard renders
- **THEN** each stat card has `data-testid="stat-{name}"`
- **AND** the continue learning card has `data-testid="continue-learning"`
- **AND** each class card has `data-testid="class-card-{id}"`
- **AND** the join class section has `data-testid="join-class-card"`

#### Scenario: Teacher dashboard has testids
- **WHEN** teacher dashboard renders
- **THEN** each stat card has `data-testid="stat-{name}"`
- **AND** the new class button has `data-testid="new-class"`

#### Scenario: Admin dashboard has testids
- **WHEN** admin dashboard renders
- **THEN** each stat card has `data-testid="stat-{name}"`
- **AND** the activity list has `data-testid="recent-activity"`

#### Scenario: Join page uses unique testids
- **WHEN** join page renders success state
- **THEN** the success container has `data-testid="join-success"`
- **AND** the dashboard button has `data-testid="join-go-to-dashboard"` (unique per state, not duplicated with exists state)

### Requirement: API routes have consistent auth, error handling, and response shapes
The system SHALL have uniform error handling and auth patterns across all API routes.

#### Scenario: All auth-guarded routes pass JWT
- **WHEN** a route calls `requireAuth`, `requireTeacher`, or `requireAdmin`
- **THEN** it extracts the JWT from the `Authorization` header
- **AND** passes it to the auth function

#### Scenario: All handlers have try/catch
- **WHEN** any API handler throws an unexpected error
- **THEN** it returns a 500 response with `{ error: "Internal server error" }`

#### Scenario: All error responses include applyCookies
- **WHEN** an API route returns an error response
- **THEN** `applyCookies` is called before returning to preserve session cookies

### Requirement: Email confirmation routes require auth
The system SHALL require authentication for email confirmation endpoints.

#### Scenario: Confirm-email without auth is rejected
- **WHEN** an unauthenticated POST is sent to `/api/auth/confirm-email`
- **THEN** a 401 response is returned

#### Scenario: Verify-code without auth is rejected
- **WHEN** an unauthenticated POST is sent to `/api/auth/verify-code`
- **THEN** a 401 response is returned

### Requirement: File upload route checks ownership
The system SHALL verify the uploading user is the teacher or admin for the lesson.

#### Scenario: Student cannot POST files
- **WHEN** an authenticated student sends POST to `/api/teacher/files`
- **THEN** a 403 response is returned

### Requirement: Quiz submission handles type safety
The system SHALL correctly score quiz answers regardless of JSON type.

#### Scenario: String answer indices match numeric correct_index
- **WHEN** quiz answers arrive as strings (e.g., `"2"`)
- **AND** `correct_index` is a number (e.g., `2`)
- **THEN** they are compared as equal

### Requirement: Invite codes use cryptographically secure randomness
The system SHALL generate teacher class invite codes using `crypto.randomBytes()`.

#### Scenario: Invite codes are unpredictable
- **WHEN** a teacher regenerates an invite code
- **THEN** the code is generated using a CSPRNG

### Requirement: GitHub Actions runs all Playwright tests on push
The system SHALL have a CI pipeline that runs all E2E tests automatically.

#### Scenario: Tests run on push to main
- **WHEN** code is pushed to the `main` branch
- **THEN** GitHub Actions checks out the code
- **AND** installs dependencies
- **AND** runs `npx playwright test`
- **AND** reports pass/fail status

#### Scenario: Tests run on pull requests to main
- **WHEN** a PR is opened against `main`
- **THEN** tests run automatically
- **AND** results are reported on the PR

### Requirement: Hardcoded English text uses i18n
The system SHALL use `next-intl` translation keys instead of hardcoded English strings.

#### Scenario: Dashboard greeting is translated
- **WHEN** student dashboard renders
- **THEN** the time-of-day greeting uses `t("greeting_morning")`, `t("greeting_afternoon")`, or `t("greeting_evening")`

#### Scenario: Badge titles are translated
- **WHEN** badges are displayed on the dashboard
- **THEN** badge titles use `t("badge_first_lesson")`, `t("badge_ten_lessons")`, etc.

#### Scenario: Mark as Viewed button is translated
- **WHEN** student lesson view renders
- **THEN** the "Mark as Viewed" button uses `t("mark_viewed")`
