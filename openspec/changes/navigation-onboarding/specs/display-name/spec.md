## ADDED Requirements

### Requirement: Display name replaces generic labels and UUIDs

The user's chosen display name from onboarding replaces "Student" greeting and raw UUIDs in teacher views.

#### Scenario: Student dashboard shows personalized greeting
- **WHEN** a student with `display_name: "Ahmad"` views the dashboard
- **THEN** the greeting shows "Welcome, Ahmad" instead of "Welcome, Student"

#### Scenario: Fallback to role-based greeting
- **WHEN** a student has no `display_name` (null or empty)
- **THEN** the greeting shows "Welcome, Student"

#### Scenario: Teacher class detail shows student display names
- **WHEN** a teacher views the student list in class detail
- **THEN** each student row shows their `display_name` (or "Student" if not set)

#### Scenario: Teacher analytics shows student display names
- **WHEN** a teacher views student progress
- **THEN** student names show `display_name` instead of UUIDs

#### Scenario: Profile type includes display_name
- **WHEN** the Profile interface is used
- **THEN** it includes `display_name: string | null`

#### Scenario: Profile type includes onboarding_data
- **WHEN** the Profile interface is used
- **THEN** it includes `onboarding_data: Record<string, unknown> | null`
