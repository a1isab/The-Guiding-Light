## ADDED Requirements

### Requirement: Onboarding API endpoint

POST `/api/onboarding` saves all onboarding wizard answers in a single request.

#### Scenario: Successful onboarding submission
- **WHEN** authenticated user POSTs `{displayName: "Ahmad", level: "beginner", interests: ["quran"], goals: ["memorize quran"], onboarded: false}`
- **THEN** the API updates `profiles` with `display_name`, `onboarding_data` (JSONB), and sets `onboarded: true`

#### Scenario: Unauthenticated request rejected
- **WHEN** POST is made without `Authorization` header
- **THEN** returns 401

#### Scenario: Missing displayName rejected
- **WHEN** POST body is `{level: "beginner"}`
- **THEN** returns 400 with error "Display name is required"

#### Scenario: Already onboarded user
- **WHEN** POST is made by user with `onboarded: true`
- **THEN** returns 200 without modifying the profile

#### Scenario: Database error handled gracefully
- **WHEN** Supabase update fails
- **THEN** returns 500 with error message, does not crash
