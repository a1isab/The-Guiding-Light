# Fix Teacher 403 & Session Persistence

## Problems

1. **15 places call `get_user_roles` RPC directly without fallback.** Only
   `src/lib/supabase-api.ts` has the `profiles.role` fallback. When the RPC
   returns an error or null (e.g., migration-014 not applied), the role check
   fails and the user is treated as a student.

2. **API route session check returns null.** `POST /api/teacher/classes` calls
   `requireTeacher()` → `supabase.auth.getUser()` returns null. The form
   submission fails with 403 before the role check even runs.

3. **Confirm-email uses service role key unnecessarily.** The `auth_confirm_user`
   function is `GRANT EXECUTE TO authenticated`, but the endpoint uses
   `createAdminClient()` (service role). Without `SUPABASE_SERVICE_ROLE_KEY`,
   it fails.

4. **Middleware header pattern not extended to teacher routes.** Teacher and
   admin pages create their own supabase clients instead of reading middleware
   headers, creating a cookie propagation gap.

## Existing Fixes (already committed)

- `createAdminClient()` logs warning instead of throwing when key is missing
- confirm-email endpoint handles null admin client gracefully
- `getUserRole()` in `supabase-api.ts` falls back to `profiles.role`
- Middleware's `setAll` callback sets cookies on both request and response
