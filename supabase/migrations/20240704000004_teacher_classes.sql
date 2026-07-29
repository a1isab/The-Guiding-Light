-- Teacher Class System: private classes, invite codes, and student membership
-- Each teacher can create classes with courses/sections/lessons for enrolled students

-- 1. Classes
CREATE TABLE classes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  cover_image text,
  invite_code text UNIQUE NOT NULL,
  invite_expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 2. Class members
CREATE TABLE class_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- 3. Teacher courses (private to a class)
CREATE TABLE teacher_courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. Teacher sections
CREATE TABLE teacher_sections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES teacher_courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5. Teacher lessons
CREATE TABLE teacher_lessons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id uuid REFERENCES teacher_sections(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  video_url text,
  duration integer,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 6. Teacher video assets
CREATE TABLE teacher_video_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES teacher_lessons(id) ON DELETE SET NULL,
  filename text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 7. Indexes
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_class_members_class ON class_members(class_id);
CREATE INDEX idx_class_members_student ON class_members(student_id);
CREATE INDEX idx_teacher_courses_class ON teacher_courses(class_id);
CREATE INDEX idx_teacher_sections_course ON teacher_sections(course_id);
CREATE INDEX idx_teacher_lessons_section ON teacher_lessons(section_id);
CREATE INDEX idx_teacher_video_assets_teacher ON teacher_video_assets(teacher_id);

-- 8. Auto-generate invite code
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT upper(substr(md5(random()::text || clock_timestamp()::text), 1, 9));
$$;

CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.invite_code IS NULL THEN
    LOOP
      NEW.invite_code := generate_invite_code();
      BEGIN
        RETURN NEW;
      EXCEPTION WHEN unique_violation THEN
      END;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_classes_set_invite_code
  BEFORE INSERT ON classes
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_code();

-- 9. Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_video_assets ENABLE ROW LEVEL SECURITY;

-- 10. RLS: Classes
DROP POLICY IF EXISTS "Teachers can CRUD own classes" ON classes;
CREATE POLICY "Teachers can CRUD own classes"
  ON classes FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "Students can view enrolled classes" ON classes;
CREATE POLICY "Students can view enrolled classes"
  ON classes FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM class_members WHERE class_id = id AND student_id = auth.uid())
    OR teacher_id = auth.uid()
  );

-- 11. RLS: Class members
DROP POLICY IF EXISTS "Teachers can manage members of own classes" ON class_members;
CREATE POLICY "Teachers can manage members of own classes"
  ON class_members FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
  );

DROP POLICY IF EXISTS "Students can read own memberships" ON class_members;
CREATE POLICY "Students can read own memberships"
  ON class_members FOR SELECT TO authenticated
  USING (student_id = auth.uid());

-- 12. RLS: Teacher courses
DROP POLICY IF EXISTS "Teachers can CRUD own courses" ON teacher_courses;
CREATE POLICY "Teachers can CRUD own courses"
  ON teacher_courses FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
  );

DROP POLICY IF EXISTS "Students can read courses of enrolled classes" ON teacher_courses;
CREATE POLICY "Students can read courses of enrolled classes"
  ON teacher_courses FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM class_members WHERE class_id = teacher_courses.class_id AND student_id = auth.uid())
  );

-- 13. RLS: Teacher sections
DROP POLICY IF EXISTS "Teachers can CRUD own sections" ON teacher_sections;
CREATE POLICY "Teachers can CRUD own sections"
  ON teacher_sections FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM teacher_courses tc JOIN classes c ON c.id = tc.class_id WHERE tc.id = course_id AND c.teacher_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM teacher_courses tc JOIN classes c ON c.id = tc.class_id WHERE tc.id = course_id AND c.teacher_id = auth.uid())
  );

DROP POLICY IF EXISTS "Students can read sections of enrolled classes" ON teacher_sections;
CREATE POLICY "Students can read sections of enrolled classes"
  ON teacher_sections FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM teacher_courses tc JOIN class_members cm ON cm.class_id = tc.class_id WHERE tc.id = course_id AND cm.student_id = auth.uid())
  );

-- 14. RLS: Teacher lessons
DROP POLICY IF EXISTS "Teachers can CRUD own lessons" ON teacher_lessons;
CREATE POLICY "Teachers can CRUD own lessons"
  ON teacher_lessons FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM teacher_sections ts JOIN teacher_courses tc ON tc.id = ts.course_id JOIN classes c ON c.id = tc.class_id WHERE ts.id = section_id AND c.teacher_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM teacher_sections ts JOIN teacher_courses tc ON tc.id = ts.course_id JOIN classes c ON c.id = tc.class_id WHERE ts.id = section_id AND c.teacher_id = auth.uid())
  );

DROP POLICY IF EXISTS "Students can read lessons of enrolled classes" ON teacher_lessons;
CREATE POLICY "Students can read lessons of enrolled classes"
  ON teacher_lessons FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM teacher_sections ts JOIN teacher_courses tc ON tc.id = ts.course_id JOIN class_members cm ON cm.class_id = tc.class_id WHERE ts.id = section_id AND cm.student_id = auth.uid())
  );

-- 15. RLS: Teacher video assets
DROP POLICY IF EXISTS "Teachers can CRUD own assets" ON teacher_video_assets;
CREATE POLICY "Teachers can CRUD own assets"
  ON teacher_video_assets FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "Students can read assets of enrolled class lessons" ON teacher_video_assets;
CREATE POLICY "Students can read assets of enrolled class lessons"
  ON teacher_video_assets FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM teacher_lessons tl JOIN teacher_sections ts ON ts.id = tl.section_id JOIN teacher_courses tc ON tc.id = ts.course_id JOIN class_members cm ON cm.class_id = tc.class_id WHERE tl.id = lesson_id AND cm.student_id = auth.uid())
  );

-- 16. Admin override
DROP POLICY IF EXISTS "Admins have full access to classes" ON classes;
CREATE POLICY "Admins have full access to classes"
  ON classes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins have full access to class_members" ON class_members;
CREATE POLICY "Admins have full access to class_members"
  ON class_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins have full access to teacher_courses" ON teacher_courses;
CREATE POLICY "Admins have full access to teacher_courses"
  ON teacher_courses FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins have full access to teacher_sections" ON teacher_sections;
CREATE POLICY "Admins have full access to teacher_sections"
  ON teacher_sections FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins have full access to teacher_lessons" ON teacher_lessons;
CREATE POLICY "Admins have full access to teacher_lessons"
  ON teacher_lessons FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins have full access to teacher_video_assets" ON teacher_video_assets;
CREATE POLICY "Admins have full access to teacher_video_assets"
  ON teacher_video_assets FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- 18. Storage bucket for teacher videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('teacher-videos', 'teacher-videos', true, 524288000, ARRAY['video/mp4', 'video/quicktime', 'video/webm'])
ON CONFLICT (id) DO NOTHING;

-- 19. Storage RLS: teachers upload/manage own files
DROP POLICY IF EXISTS "Teachers can upload videos" ON storage.objects;
CREATE POLICY "Teachers can upload videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'teacher-videos'
    AND (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('teacher', 'admin')
  );

DROP POLICY IF EXISTS "Teachers can update own videos" ON storage.objects;
CREATE POLICY "Teachers can update own videos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'teacher-videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Teachers can delete own videos" ON storage.objects;
CREATE POLICY "Teachers can delete own videos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'teacher-videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Authenticated can read teacher videos" ON storage.objects;
CREATE POLICY "Authenticated can read teacher videos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'teacher-videos');

DROP POLICY IF EXISTS "Admins can manage all teacher videos" ON storage.objects;
CREATE POLICY "Admins can manage all teacher videos"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'teacher-videos'
    AND (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
  );
