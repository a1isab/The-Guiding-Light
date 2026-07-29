-- Multi-role support: add roles text[] column alongside existing role column
-- Leaves existing role column and get_user_role() unchanged (backward compatible)
-- All existing RLS policies using get_user_role() = 'admin' continue to work

-- 1. Add new roles column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS roles text[] DEFAULT ARRAY['student'];

-- 2. Migrate existing single role to new array column
UPDATE profiles SET roles = ARRAY[role] WHERE roles IS NULL;

-- 3. Add constraint on new column
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_roles_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_roles_check
  CHECK (roles <@ ARRAY['student', 'teacher', 'admin']::text[]);

-- 4. New function to get all roles (for TypeScript code)
CREATE OR REPLACE FUNCTION get_user_roles()
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT COALESCE(profiles.roles, ARRAY[profiles.role]) FROM public.profiles WHERE user_id = auth.uid();
$$;
