# Fix Session Persistence & Teacher 403 Bug

## Problems
1. **Session lost on refresh**: `proxy.ts` never runs because it's not named `middleware.ts` — Next.js doesn't load it. The middleware was the only place that could reliably refresh expired Supabase auth tokens and set the new cookies on the response. Server Components silently drop cookie refreshes in the `catch` block of `createAuthServerClient`, leaving the browser with stale tokens.

2. **Teacher API routes drop refreshed cookies on early returns**: When `getUser()` triggers a token refresh inside `requireTeacher`/`requireAuth`, the fresh cookies are stored in the `cookiesToSet` closure array. But if the route returns early (403/401) without calling `applyCookies`, those cookies are lost. The browser keeps the stale token, causing every subsequent request to fail.

## Fixes
1. Rename `src/proxy.ts` → `src/middleware.ts` and export `middleware` (not `proxy`)
2. Remove silent `catch` in `createAuthServerClient` that was dropping cookie refreshes
3. Wrap every early return in all teacher/admin/student API routes with `applyCookies()`
