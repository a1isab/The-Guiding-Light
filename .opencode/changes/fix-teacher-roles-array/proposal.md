# Fix Teacher Roles Array Not Being Updated

## Problem
The `auth_confirm_user` function in `migration-017-auth-helpers.sql` only sets `profiles.role = 'teacher'` but never updates `profiles.roles`. Since `profiles.roles` defaults to `ARRAY['student']`, the `get_user_roles()` RPC returns `['student']` (not `['teacher']`), causing `requireTeacher()` to fail with 403 Forbidden when teachers try to create classes.

## Root Cause
After migration-014 added the multi-role `roles` array column with default `ARRAY['student']`, migration-017's teacher upgrade was not updated to sync both columns. The `COALESCE(roles, ARRAY[role])` in `get_user_roles()` only falls back when `roles IS NULL`, but it's never null due to the column default.

## Fix
1. Update `auth_confirm_user` to also set `roles = ARRAY['teacher']`
2. Create a backfill migration to fix existing teachers
