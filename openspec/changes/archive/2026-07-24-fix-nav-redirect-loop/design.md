## Context

The app uses Next.js App Router with Supabase SSR for authentication. Auth verification happens at **two levels**:

### Current Architecture

\\\
Request (with auth cookies)
    ¦
    +-- proxy.ts (middleware)
    ¦   +-- getUser() ? CAN set cookies (setAll works here)
    ¦   +-- passes through on success
    ¦
    +-- Server Component (page/layout)
        +-- createServerSupabaseClient()
        +-- getUser() ? CANNOT set cookies (setAll fails silently)
        +-- redirect to login if null
\\\

The middleware correctly handles token refresh (sets new cookies on the response). But Server Components independently call \getUser()\ again — and when the access token expires, the refresh attempt fails because \cookieStore.set()\ throws in Server Components. The \	ry-catch\ swallows the error, but \getUser()\ may return null, triggering a redirect to login.

This affects \/admin/layout.tsx\, \/dashboard/page.tsx\, and \/dashboard/classes/*\ pages — every Server Component that gates on \getUser()\.

### Second Issue: Seed Script

\scripts/seed-users.ts\ for existing Auth users only updates \profiles\ — it never calls \supabase.auth.admin.updateUserById()\ to update the Auth password. So if the seed script changes a user's declared password, existing accounts can't log in with the new credential.

## Goals / Non-Goals

**Goals:**
- Eliminate redirects to login on client-side navigation for authenticated users
- Ensure seed script updates Auth passwords for existing users
- Remove redundant \getUser()\ calls from Server Components

**Non-Goals:**
- Changing the middleware's auth check behavior
- Altering RLS policies or database schema
- Introducing new auth providers (OAuth, magic link)
- Altering how the client-side Supabase client works

## Decisions

### Decision 1: Pass user info via request headers from middleware

Instead of calling \getUser()\ in Server Components, the middleware sets \x-user-id\ and \x-user-roles\ on the request. Server Components read these from \headers()\.

**Why not just try-catch harder?** The \setAll\ failure is a fundamental Next.js constraint — Server Components cannot write cookies. No amount of error handling can persist the refreshed token.

**Why not use \getSession()\?** \getSession()\ reads from the cookie but doesn't verify the JWT with Supabase Auth. It's lighter but returns stale data after the token expires. The middleware already does the verification.

### Decision 2: Service client for data fetching in Server Components

Once the middleware has verified the user, Server Components use \createServiceClient()\ (service role key, bypasses RLS) for data queries instead of \createServerSupabaseClient()\. This avoids creating a new SSR client per request.

**Why the service role key?** The user is already verified by middleware — no need for RLS row-level checks. This is simpler and avoids the SSR client's cookie issues entirely.

**Security concern:** The service role key is server-side only, never exposed to the client.

### Decision 3: seed-users.ts updates Auth password for existing users

For existing Auth users, add \supabase.auth.admin.updateUserById()\ to update the password. This ensures password changes in the seed script take effect for existing accounts.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Header injection: a malicious request could spoof \x-user-id\ | Middleware sets these headers AFTER verifying the JWT. If middleware doesn't set them, the Server Component sees null. Spoofed headers from the client are overwritten by middleware. |
| Missing headers on unprotected paths | Server Components on unprotected paths (courses, landing page) already handle missing auth gracefully. The headers are only set for protected paths. |
| Service role client bypasses RLS | Acceptable because the middleware has already verified auth. All data access is server-side only. |
| \updateUserById\ resets refresh tokens | True — existing sessions will be invalidated. Users need to re-login with the new password. This is the intended behavior. |
