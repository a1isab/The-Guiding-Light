## ADDED Requirements

### Requirement: Shared Supabase API client for routes
The system SHALL provide a `createApiSupabaseClient(request)` function in `src/lib/supabase-api.ts` that creates a Supabase server client with proper cookie handling (getAll + setAll) for App Router API routes.

#### Scenario: Client handles cookies correctly
- **WHEN** an API route calls `createApiSupabaseClient(request)`
- **THEN** the client SHALL read cookies from the request and write cookies back via setAll
- **THEN** setAll SHALL be fully implemented (not empty) to allow token refresh

### Requirement: RPC-based role checking
The system SHALL provide a `getUserRole(client)` function that calls `rpc("get_user_role")` to determine the user role, bypassing RLS on the profiles table.

#### Scenario: Role check succeeds for authenticated user
- **WHEN** an API route calls `getUserRole(client)` with an authenticated client
- **THEN** the function SHALL return the user role string (e.g., "admin", "teacher", "student")
- **THEN** the function SHALL NOT query `from("profiles")` directly

#### Scenario: Role check fails for unauthenticated user
- **WHEN** an API route calls `getUserRole(client)` without authentication
- **THEN** the function SHALL return null or throw an auth error

### Requirement: All API routes use shared utility
Every API route handler in `src/app/api/` SHALL use `createApiSupabaseClient` and `getUserRole` from the shared utility instead of inline `createServerClient` calls.

#### Scenario: API route returns JSON after fix
- **WHEN** a client sends a request to any API route (e.g., POST /api/teacher/classes)
- **THEN** the route SHALL return a JSON response (not HTML)

#### Scenario: API route validates role before action
- **WHEN** a teacher-only API route receives a request from a student
- **THEN** the route SHALL return 403 Forbidden

### Requirement: class-form.tsx has error handling
The `class-form.tsx` component SHALL have try-catch around API calls and use locale-aware redirect URLs.

#### Scenario: Class creation fails gracefully
- **WHEN** the API returns an error during class creation
- **THEN** the form SHALL show the error message (not hang on "saving")
- **THEN** the "saving" loading state SHALL stop

#### Scenario: Class creation succeeds
- **WHEN** the API returns success
- **THEN** the form SHALL redirect to the classes list with the locale prefix intact
