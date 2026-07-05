-- Multi-role support: change profiles.role from single text to text array
-- Drop all policies FIRST to avoid text[] = text errors during transition

-- ============================================================
-- PHASE 1: Drop all policies that reference get_user_role()
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Teachers can insert own courses" ON courses;
DROP POLICY IF EXISTS "Teachers can update own courses" ON courses;
DROP POLICY IF EXISTS "Teachers can delete own courses" ON courses;
DROP POLICY IF EXISTS "Teachers can insert sections" ON sections;
DROP POLICY IF EXISTS "Teachers can update sections" ON sections;
DROP POLICY IF EXISTS "Teachers can delete sections" ON sections;
DROP POLICY IF EXISTS "Teachers can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Teachers can update lessons" ON lessons;
DROP POLICY IF EXISTS "Teachers can delete lessons" ON lessons;
DROP POLICY IF EXISTS "Teachers can insert quizzes" ON quizzes;
DROP POLICY IF EXISTS "Teachers can update quizzes" ON quizzes;
DROP POLICY IF EXISTS "Teachers can delete quizzes" ON quizzes;
DROP POLICY IF EXISTS "Admins have full access to classes" ON classes;
DROP POLICY IF EXISTS "Admins have full access to class_members" ON class_members;
DROP POLICY IF EXISTS "Admins have full access to teacher_courses" ON teacher_courses;
DROP POLICY IF EXISTS "Admins have full access to teacher_sections" ON teacher_sections;
DROP POLICY IF EXISTS "Admins have full access to teacher_lessons" ON teacher_lessons;
DROP POLICY IF EXISTS "Admins have full access to teacher_video_assets" ON teacher_video_assets;
DROP POLICY IF EXISTS "Teachers can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all teacher videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all invites" ON teacher_invites;
DROP POLICY IF EXISTS "Admins can insert invites" ON teacher_invites;
DROP POLICY IF EXISTS "Admins can update invites" ON teacher_invites;
DROP POLICY IF EXISTS "Admins have full access to quiz questions" ON teacher_quiz_questions;
DROP POLICY IF EXISTS "Admins have full access to quiz attempts" ON teacher_quiz_attempts;
DROP POLICY IF EXISTS "Admins have full access to lesson files" ON teacher_lesson_files;
DROP POLICY IF EXISTS "Teachers can upload lesson files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all lesson files" ON storage.objects;
DROP POLICY IF EXISTS "Admins have full access to templates" ON teacher_lesson_templates;
DROP POLICY IF EXISTS "Admins can read all teacher progress" ON teacher_progress;

-- ============================================================
-- PHASE 2: Change column type and update function
-- (idempotent — skips if already text[])
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles'
      AND column_name = 'role'
      AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

    ALTER TABLE profiles
      ALTER COLUMN role TYPE text[]
      USING CASE
        WHEN role = 'student' THEN ARRAY['student']
        WHEN role = 'teacher' THEN ARRAY['teacher']
        WHEN role = 'admin' THEN ARRAY['admin']
        ELSE ARRAY['student']
      END;

    ALTER TABLE profiles
      DROP CONSTRAINT IF EXISTS profiles_role_check;

    ALTER TABLE profiles
      ADD CONSTRAINT profiles_role_check
      CHECK (role <@ ARRAY['student', 'teacher', 'admin']::text[]);

    ALTER TABLE profiles
      ALTER COLUMN role SET DEFAULT ARRAY['student'];
  END IF;
END $$;

-- Update get_user_role() to return text[]
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- ============================================================
-- PHASE 3: Recreate all policies with array operators
-- ============================================================

-- Profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    get_user_role() @> ARRAY['admin']
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (get_user_role() @> ARRAY['admin']);

-- Courses
CREATE POLICY "Teachers can insert own courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role() && ARRAY['teacher', 'admin']);

CREATE POLICY "Teachers can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR get_user_role() @> ARRAY['admin']);

CREATE POLICY "Teachers can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() OR get_user_role() @> ARRAY['admin']);

-- Sections
CREATE POLICY "Teachers can insert sections"
  ON sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND (created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

CREATE POLICY "Teachers can update sections"
  ON sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND (created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

CREATE POLICY "Teachers can delete sections"
  ON sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND (created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

-- Lessons
CREATE POLICY "Teachers can insert lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM sections s JOIN courses c ON c.id = s.course_id WHERE s.id = section_id AND (c.created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

CREATE POLICY "Teachers can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM sections s JOIN courses c ON c.id = s.course_id WHERE s.id = section_id AND (c.created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

CREATE POLICY "Teachers can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM sections s JOIN courses c ON c.id = s.course_id WHERE s.id = section_id AND (c.created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

-- Quizzes (legacy table)
CREATE POLICY "Teachers can insert quizzes"
  ON quizzes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM lessons l JOIN sections s ON s.id = l.section_id JOIN courses c ON c.id = s.course_id WHERE l.id = lesson_id AND (c.created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

CREATE POLICY "Teachers can update quizzes"
  ON quizzes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM lessons l JOIN sections s ON s.id = l.section_id JOIN courses c ON c.id = s.course_id WHERE l.id = lesson_id AND (c.created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

CREATE POLICY "Teachers can delete quizzes"
  ON quizzes FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM lessons l JOIN sections s ON s.id = l.section_id JOIN courses c ON c.id = s.course_id WHERE l.id = lesson_id AND (c.created_by = auth.uid() OR get_user_role() @> ARRAY['admin']))
  );

-- Classes / teacher-classes tables
CREATE POLICY "Admins have full access to classes"
  ON classes FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

CREATE POLICY "Admins have full access to class_members"
  ON class_members FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

CREATE POLICY "Admins have full access to teacher_courses"
  ON teacher_courses FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

CREATE POLICY "Admins have full access to teacher_sections"
  ON teacher_sections FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

CREATE POLICY "Admins have full access to teacher_lessons"
  ON teacher_lessons FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

CREATE POLICY "Admins have full access to teacher_video_assets"
  ON teacher_video_assets FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

-- Storage RLS for teacher-videos bucket
CREATE POLICY "Teachers can upload videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'teacher-videos'
    AND get_user_role() && ARRAY['teacher', 'admin']
  );

CREATE POLICY "Admins can manage all teacher videos"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'teacher-videos'
    AND get_user_role() @> ARRAY['admin']
  );

-- Teacher invites
CREATE POLICY "Admins can read all invites"
  ON teacher_invites FOR SELECT TO authenticated
  USING (get_user_role() @> ARRAY['admin']);

CREATE POLICY "Admins can insert invites"
  ON teacher_invites FOR INSERT TO authenticated
  WITH CHECK (get_user_role() @> ARRAY['admin']);

CREATE POLICY "Admins can update invites"
  ON teacher_invites FOR UPDATE TO authenticated
  USING (get_user_role() @> ARRAY['admin']);

-- Quiz questions & attempts
CREATE POLICY "Admins have full access to quiz questions"
  ON teacher_quiz_questions FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

CREATE POLICY "Admins have full access to quiz attempts"
  ON teacher_quiz_attempts FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

-- Lesson files
CREATE POLICY "Admins have full access to lesson files"
  ON teacher_lesson_files FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

-- Storage RLS for lesson-files bucket
CREATE POLICY "Teachers can upload lesson files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'lesson-files'
    AND get_user_role() && ARRAY['teacher', 'admin']
  );

CREATE POLICY "Admins can manage all lesson files"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'lesson-files'
    AND get_user_role() @> ARRAY['admin']
  );

-- Templates
CREATE POLICY "Admins have full access to templates"
  ON teacher_lesson_templates FOR ALL TO authenticated
  USING (get_user_role() @> ARRAY['admin'])
  WITH CHECK (get_user_role() @> ARRAY['admin']);

-- Progress
CREATE POLICY "Admins can read all teacher progress"
  ON teacher_progress FOR SELECT TO authenticated
  USING (get_user_role() @> ARRAY['admin']);
