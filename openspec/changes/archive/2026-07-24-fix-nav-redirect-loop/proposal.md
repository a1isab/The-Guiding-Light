## Why

Clicking any navigation link (except /courses) immediately redirects to the login page, even after a successful login. This makes the app unusable for authenticated users. Root cause: Server Components call supabase.auth.getUser() which triggers token refresh, but Server Components cannot set cookies — the refresh fails silently and getUser() returns null. Additionally, the seed script only updates profiles for existing users but never resets their Auth password.

## What Changes

- **Centralize auth verification in middleware** — proxy.ts calls getUser() (where cookie setting works), passes verified user info to Server Components via request headers. Server Components read from headers instead of calling getUser() again.
- **Fix seed script** — For existing Auth users, supabase.auth.admin.updateUserById() is called to update passwords so seed password changes take effect.
- **Remove stale session check** — Server Components that currently call getUser() to gate access switch to middleware-based auth verification.

## Capabilities

### New Capabilities
- user-auth-flow: Server-side authentication flow — middleware verifies tokens, propagates user state via headers; Server Components consume verified state without redundant getUser() calls
- seed-user-management: Script that creates or updates Auth users (including password resets for existing users)

### Modified Capabilities

None.

## Impact

- src/proxy.ts — Add header propagation for verified user info
- Server Components (dmin/layout.tsx, dashboard/page.tsx, dashboard sub-pages) — Replace getUser() + redirect with middleware-based auth read
- scripts/seed-users.ts — Add password update for existing Auth users
- All existing auth flows remain functional; no RLS policy changes needed
