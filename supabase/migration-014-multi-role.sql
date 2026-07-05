-- Multi-role support: change profiles.role from single text to text array

-- 1. Change column type from text to text[]
ALTER TABLE profiles
  ALTER COLUMN role TYPE text[]
  USING CASE
    WHEN role = 'student' THEN ARRAY['student']
    WHEN role = 'teacher' THEN ARRAY['teacher']
    WHEN role = 'admin' THEN ARRAY['admin']
    ELSE ARRAY['student']
  END;

-- 2. Update check constraint for array values
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role <@ ARRAY['student', 'teacher', 'admin']::text[]);

-- 3. Set default to array
ALTER TABLE profiles
  ALTER COLUMN role SET DEFAULT ARRAY['student'];

-- 4. Update get_user_role() to return text[]
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- 5. Update the admin check helper for RLS policies that use role = 'admin'
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role @> ARRAY['admin']);
$$;

-- 6. Update the teacher/admin check helper
CREATE OR REPLACE FUNCTION is_teacher_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role && ARRAY['teacher', 'admin']);
$$;
