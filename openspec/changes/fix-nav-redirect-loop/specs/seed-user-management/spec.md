## ADDED Requirements

### Requirement: Seed script updates Auth password for existing users

The system SHALL update the Auth password for existing users when \scripts/seed-users.ts\ is run, not just their profile row. This ensures password changes in the seed data take effect for existing accounts.

#### Scenario: Existing user has a different password in seed data

- **WHEN** \scripts/seed-users.ts\ runs
- **AND** the user already exists in Supabase Auth
- **AND** the user's password in the seed data differs from their current Auth password
- **THEN** the script SHALL call \supabase.auth.admin.updateUserById(existing.id, { password: u.password })\
- **AND** the script SHALL update the profile row (\ole\, \oles\)

#### Scenario: New user is created

- **WHEN** \scripts/seed-users.ts\ runs
- **AND** the user does not exist in Supabase Auth
- **THEN** the script SHALL create the Auth user via \supabase.auth.admin.createUser()\
- **AND** SHALL set the profile row with \ole\ and \oles\

#### Scenario: User exists but password matches

- **WHEN** \scripts/seed-users.ts\ runs
- **AND** the user exists in Supabase Auth
- **AND** the password is already correct
- **THEN** the script SHALL still call \updateUserById\ (idempotent — no-op for matching password)
- **AND** SHALL update the profile row (\ole\, \oles\)
