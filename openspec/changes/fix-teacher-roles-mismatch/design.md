## Context

The platform uses `@supabase/ssr` v0.12 for auth session management. Both
the browser client (`createBrowserClient`) and server client
(`createServerClient`) use PKCE flow with cookie-based session persistence.
`@supabase/auth-js` v2.108.2 is the underlying auth library, with an
`EXPIRY_MARGIN_MS` of 90 seconds — a token refresh fires when the access
token has fewer than 90 seconds remaining.

## Root Cause: Double Token Refresh

The middleware calls `supabase.auth.getSession()` on every protected route
to set an `x-user-id` header. Server Components and API routes also call
`getUser()` or `getSession()` for their own auth checks.

When the session is within the 90-second expiry margin, `getSession()`
triggers a token refresh. The refresh consumes the old refresh token and
issues a new one.

**The problem**: the middleware and the Server Component each create their
own `createServerClient` instance — separate `GoTrueClient` instances with
separate `refreshingDeferred` single-flight locks. When BOTH call
`getSession()`/`getUser()` on the same request:

1. Middleware's `createServerClient` A → `getSession()` → refresh with
   old refresh token X → **succeeds** → X consumed, new tokens issued
2. Server Component's `createServerClient` B → `getUser()` →
   `getSession()` → refresh with old refresh token X → **fails** →
   X already consumed → session = null → user appears logged out

This causes the "logged out on refresh" symptom. The 403 on class
creation and 404 on class page are downstream effects — if the session is
not available on a given request, `requireTeacher()` returns null (403)
and the teacher layout redirects to login (apparent 404).

### Why the previous fix was insufficient

Task 7 in `fix-teacher-403-and-session` switched from `getUser()` to
`getSession()` in the middleware, assuming `getSession()` is passive.
However, `getSession()` in `@supabase/auth-js` also triggers a refresh
when the session is expired or within the 90-second expiry margin
(`EXPIRY_MARGIN_MS = 3 × 30s = 90s`). The single-flight mechanism
(`refreshingDeferred`) is per-instance, so separate clients still fire
duplicate refresh requests.

## Solution

### 1. Remove auth from middleware entirely

Delete the `getSession()` call and all auth-related cookie handling from
`src/middleware.ts`. The middleware should only handle i18n routing.

The `x-user-id` header is only consumed by `dashboard/page.tsx`, which
already has a fallback to `getUser()` via `createServerSupabaseClient()`
when the header is absent. No other page depends on this header.

### 2. Server Components and API routes handle auth

They already do — the teacher layout calls `getUser()`, API routes call
`getUser()` via `requireTeacher()`, and the dashboard page has its
fallback. With the middleware no longer calling any Supabase auth method,
only ONE `getUser()` call fires per request, eliminating the double
refresh entirely.

## Verification

1. Log in as a teacher
2. Refresh the page — should NOT log out
3. Create a new class — should return 200
4. Click on the class — should show the detail page
5. Verify on `the-guiding-light.vercel.app` after deployment
