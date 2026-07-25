## ADDED Requirements

### Requirement: Multi-step onboarding wizard for new users

A stepper-based onboarding wizard collects user preferences and saves them on completion.

#### Scenario: Wizard displays for users with onboarded: false
- **WHEN** a user with `onboarded: false` accesses the dashboard
- **THEN** they are redirected to `/en/onboarding`

#### Scenario: Student onboarding has 5 steps
- **WHEN** a student accesses the wizard
- **THEN** the steps are: Welcome, Display Name, Knowledge Level, Topic Interests, Learning Goals

#### Scenario: Teacher onboarding has 4 steps
- **WHEN** a teacher accesses the wizard
- **THEN** the steps are: Welcome, Display Name, Teaching Subjects, Experience Level

#### Scenario: Step indicator shows progress
- **WHEN** the wizard renders
- **THEN** a numbered step indicator shows current step and total steps (e.g., "2 / 5")

#### Scenario: Next button advances step
- **WHEN** the user fills in a step and clicks "Next"
- **THEN** the wizard advances to the next step

#### Scenario: Previous button returns to prior step
- **WHEN** the user clicks "Previous" on step 3
- **THEN** the wizard returns to step 2

#### Scenario: Complete button on final step
- **WHEN** the user reaches the final step
- **THEN** the button text changes from "Next" to "Complete"

#### Scenario: Skip button available
- **WHEN** the wizard renders any step
- **THEN** a "Skip for now" link is visible that redirects to the dashboard without saving

#### Scenario: All answers bundled and POSTed on completion
- **WHEN** the user clicks "Complete"
- **THEN** all answers from all steps are bundled into a single POST to `/api/onboarding`

#### Scenario: On successful completion
- **WHEN** the API returns success
- **THEN** the user is redirected to `/en/dashboard`

#### Scenario: Wizard has test identifiers
- **WHEN** the wizard renders
- **THEN** the container has `data-testid="onboarding-wizard"` and each step has `data-testid="onboarding-step-{n}"`

### Requirement: Onboarding API route saves user data

#### Scenario: API saves display name
- **WHEN** the POST body includes `displayName: "Ahmad"`
- **THEN** the `profiles.display_name` column is updated to "Ahmad"

#### Scenario: API saves onboarding data as JSONB
- **WHEN** the POST body includes `level: "beginner"` and `interests: ["quran", "hadith"]`
- **THEN** `profiles.onboarding_data` is set to `{"level": "beginner", "interests": ["quran", "hadith"]}`

#### Scenario: API sets onboarded flag
- **WHEN** the POST succeeds
- **THEN** `profiles.onboarded` is set to `true`

#### Scenario: API requires authentication
- **WHEN** the POST is made without a valid session
- **THEN** the API returns 401

#### Scenario: API validates required fields
- **WHEN** the POST body is missing `displayName`
- **THEN** the API returns 400 with an error message

#### Scenario: API is idempotent for onboarded users
- **WHEN** a user with `onboarded: true` calls the API
- **THEN** the API returns 200 but does not update the profile
