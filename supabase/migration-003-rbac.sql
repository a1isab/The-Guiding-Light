-- RBAC: Add teacher role, created_by, and RLS policies for content management

-- 1. Allow teacher in profiles role
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'teacher', 'admin'));

-- 2. Add created_by to courses (teacher/owner)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES profiles(user_id) ON DELETE SET NULL;

-- 3. RLS: Teachers can insert/update/delete their own courses
DROP POLICY IF EXISTS "Teachers can insert own courses" ON courses;
CREATE POLICY "Teachers can insert own courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('teacher', 'admin'))
  );

DROP POLICY IF EXISTS "Teachers can update own courses" ON courses;
CREATE POLICY "Teachers can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Teachers can delete own courses" ON courses;
CREATE POLICY "Teachers can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 4. RLS: Teachers can manage sections/lessons of their courses
-- Sections inherit via course ownership
DROP POLICY IF EXISTS "Teachers can insert sections" ON sections;
CREATE POLICY "Teachers can insert sections"
  ON sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND (created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

DROP POLICY IF EXISTS "Teachers can update sections" ON sections;
CREATE POLICY "Teachers can update sections"
  ON sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND (created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

DROP POLICY IF EXISTS "Teachers can delete sections" ON sections;
CREATE POLICY "Teachers can delete sections"
  ON sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND (created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

-- Lessons inherit via section → course
DROP POLICY IF EXISTS "Teachers can insert lessons" ON lessons;
CREATE POLICY "Teachers can insert lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM sections s JOIN courses c ON c.id = s.course_id WHERE s.id = section_id AND (c.created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

DROP POLICY IF EXISTS "Teachers can update lessons" ON lessons;
CREATE POLICY "Teachers can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM sections s JOIN courses c ON c.id = s.course_id WHERE s.id = section_id AND (c.created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

DROP POLICY IF EXISTS "Teachers can delete lessons" ON lessons;
CREATE POLICY "Teachers can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM sections s JOIN courses c ON c.id = s.course_id WHERE s.id = section_id AND (c.created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

-- 5. Teachers can manage quizzes for their lessons
DROP POLICY IF EXISTS "Teachers can insert quizzes" ON quizzes;
CREATE POLICY "Teachers can insert quizzes"
  ON quizzes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM lessons l JOIN sections s ON s.id = l.section_id JOIN courses c ON c.id = s.course_id WHERE l.id = lesson_id AND (c.created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

DROP POLICY IF EXISTS "Teachers can update quizzes" ON quizzes;
CREATE POLICY "Teachers can update quizzes"
  ON quizzes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM lessons l JOIN sections s ON s.id = l.section_id JOIN courses c ON c.id = s.course_id WHERE l.id = lesson_id AND (c.created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

DROP POLICY IF EXISTS "Teachers can delete quizzes" ON quizzes;
CREATE POLICY "Teachers can delete quizzes"
  ON quizzes FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM lessons l JOIN sections s ON s.id = l.section_id JOIN courses c ON c.id = s.course_id WHERE l.id = lesson_id AND (c.created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')))
  );

-- 6. RLS: Admins can read all profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 7. Function to check if user is admin/teacher (for middleware)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;
