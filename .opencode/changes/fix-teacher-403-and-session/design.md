# Design

## Fix 1 — Refactor all direct RPC call sites to use `getUserRole` fallback

Replace `supabase.rpc("get_user_roles", ...)` with `getUserRole(role)` (or
equivalent) in all 15 remaining locations. The helper already falls back to
`profiles.role` when the RPC returns null/empty.

Files to fix (all under `src/`):
```
- src/middleware.ts:44
- src/components/navbar.tsx:42,54
- src/app/[locale]/dashboard/page.tsx:38
- src/app/[locale]/admin/layout.tsx:19
- src/app/api/teacher/classes/route.ts:6 (isAdmin())
- src/app/api/teacher/courses/route.ts:22
- src/app/api/teacher/lessons/route.ts:29
- src/app/api/teacher/sections/route.ts:29,56
- src/app/api/teacher/classes/invite/route.ts:26
- src/app/api/teacher/classes/members/route.ts:26
- src/app/api/teacher/files/route.ts:92
- src/app/api/teacher/quiz/save/route.ts:65
- src/app/api/teacher/quiz/questions/route.ts:30
```

## Fix 2 — Diagnose and fix API route session drops

The `POST /api/teacher/classes` handler calls `createApiSupabaseClient()`
which reads cookies from `request.cookies.getAll()`. If the Supabase session
cookie (`sb-*-auth-token`) is present, `getUser()` should return a user.

Likely causes:
- Token expired and refresh fails silently in `_callRefreshToken()`
- Middleware excluded API routes from the path matcher, so cookie refresh
  never happens for API requests
- `createApiSupabaseClient()` doesn't call `getUser()` to trigger refresh

Fix: Log at each stage to determine which of these is happening, then fix
accordingly.

## Fix 3 — Confirm-email endpoint resilient to missing service role

The endpoint should use user's `authenticated` session to call
`auth_confirm_user()` since the function is `GRANT EXECUTE TO authenticated`.
If `createAdminClient()` returns null, fall back to the user's authed client.

## Fix 4 — Extend middleware to API routes

Add API route paths to middleware matcher so Supabase token refresh runs for
API requests too. This prevents stale cookies from reaching API handlers.
