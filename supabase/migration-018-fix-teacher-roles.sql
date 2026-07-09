-- Fix teacher roles array not being updated when role = 'teacher'
-- Prior to migration-017 fix, auth_confirm_user only set role = 'teacher'
-- but left roles = ARRAY['student'] (the column default).
-- This caused get_user_roles() to return ['student'] for teachers
-- since it uses COALESCE(roles, ARRAY[role]) and roles was not null.
--
-- Once applied, run: SELECT fix_teacher_roles();
-- Or skip the function and run the UPDATE directly.

UPDATE profiles
SET roles = ARRAY['teacher']
WHERE role = 'teacher'
  AND roles IS DISTINCT FROM ARRAY['teacher'];