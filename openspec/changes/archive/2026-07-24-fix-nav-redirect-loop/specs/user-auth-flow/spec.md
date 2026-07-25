## ADDED Requirements

### Requirement: Middleware verifies authentication for protected paths

The system SHALL verify user authentication in \proxy.ts\ middleware for all protected paths (\/dashboard\, \/admin\, \/teacher\, \/join\). On successful verification, the middleware SHALL propagate verified user identity to downstream Server Components via request headers.

#### Scenario: Authenticated user accesses protected path

- **WHEN** a request arrives at a protected path with valid auth cookies
- **THEN** middleware SHALL call \supabase.auth.getUser()\
- **AND** on success, middleware SHALL set \x-user-id\ and \x-user-roles\ headers on the request
- **AND** middleware SHALL allow the request to proceed

#### Scenario: Unauthenticated user accesses protected path

- **WHEN** a request arrives at a protected path without valid auth cookies
- **THEN** middleware SHALL redirect to \/auth/login\

#### Scenario: Token refresh succeeds in middleware

- **WHEN** the access token is expired but the refresh token is valid
- **THEN** middleware SHALL refresh the token via \getUser()\ (which calls \setAll\)
- **AND** new auth cookies SHALL be set on the response
- **AND** the request SHALL proceed with the authenticated user

### Requirement: Server Components read auth state from headers

Server Components SHALL read the authenticated user's identity from request headers set by the middleware, instead of calling \supabase.auth.getUser()\.

#### Scenario: Server Component renders protected page

- **WHEN** a Server Component renders a protected page
- **THEN** it SHALL read \x-user-id\ from \headers()\ (next/headers)
- **AND** if \x-user-id\ is absent, SHALL redirect to \/auth/login\
- **AND** it SHALL NOT call \supabase.auth.getUser()\ for auth verification

#### Scenario: Server Component reads user roles for access control

- **WHEN** a Server Component needs the user's roles
- **THEN** it SHALL read \x-user-roles\ from \headers()\
- **AND** if roles are absent, SHALL handle gracefully (no crash)

### Requirement: Data fetching uses service client after middleware verification

Server Components SHALL use \createServiceClient()\ (service role key) for database queries instead of \createServerSupabaseClient()\, since the middleware has already verified the user's identity.

#### Scenario: Server Component queries user-scoped data

- **WHEN** a Server Component queries user-specific data (e.g., their own subscriptions, progress)
- **THEN** it SHALL use \createServiceClient()\ with the verified \x-user-id\ as a filter
- **AND** SHALL NOT create a new SSR client for the same purpose
