-- =====================================================
-- Migration 022: Engagement Features
-- Tables: lesson_comments, assignments, submissions,
--         certificates, bookmarks, announcements,
--         announcement_reads
-- =====================================================

-- 1. LESSON COMMENTS (threaded Q&A)
CREATE TABLE IF NOT EXISTS lesson_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL,
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  body text NOT NULL,
  parent_id uuid REFERENCES lesson_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lc_lesson ON lesson_comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lc_parent ON lesson_comments(parent_id);

ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can read comments on accessible lessons" ON lesson_comments;
CREATE POLICY "Students can read comments on accessible lessons"
  ON lesson_comments FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert comments" ON lesson_comments;
CREATE POLICY "Authenticated users can insert comments"
  ON lesson_comments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own comments" ON lesson_comments;
CREATE POLICY "Users can delete own comments"
  ON lesson_comments FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- 2. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  max_score integer DEFAULT 100,
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assign_lesson ON assignments(lesson_id);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can read assignments on accessible lessons" ON assignments;
CREATE POLICY "Students can read assignments on accessible lessons"
  ON assignments FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Teachers can manage assignments" ON assignments;
CREATE POLICY "Teachers can manage assignments"
  ON assignments FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_lessons tl
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN classes c ON c.id = tc.class_id
      WHERE tl.id = lesson_id AND c.teacher_id = auth.uid()
    )
  );

-- 3. SUBMISSIONS
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  body text,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded')),
  score integer,
  feedback text,
  file_urls jsonb DEFAULT '[]'::jsonb,
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_sub_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_sub_student ON submissions(student_id);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can read own submissions" ON submissions;
CREATE POLICY "Students can read own submissions"
  ON submissions FOR SELECT TO authenticated
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can insert own submissions" ON submissions;
CREATE POLICY "Students can insert own submissions"
  ON submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can update own submissions" ON submissions;
CREATE POLICY "Students can update own submissions"
  ON submissions FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can read submissions for own classes" ON submissions;
CREATE POLICY "Teachers can read submissions for own classes"
  ON submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN teacher_lessons tl ON tl.id = a.lesson_id
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN classes c ON c.id = tc.class_id
      WHERE a.id = assignment_id AND c.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Teachers can update submissions for own classes" ON submissions;
CREATE POLICY "Teachers can update submissions for own classes"
  ON submissions FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN teacher_lessons tl ON tl.id = a.lesson_id
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN classes c ON c.id = tc.class_id
      WHERE a.id = assignment_id AND c.teacher_id = auth.uid()
    )
  );

-- 4. CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  course_id uuid NOT NULL,
  class_id uuid NOT NULL,
  student_name text NOT NULL,
  course_name text NOT NULL,
  teacher_name text,
  class_name text,
  custom_title text,
  custom_logo_url text,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id, class_id)
);

CREATE INDEX IF NOT EXISTS idx_cert_user ON certificates(user_id);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can read own certificates" ON certificates;
CREATE POLICY "Students can read own certificates"
  ON certificates FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 5. BOOKMARKS
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_bm_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bm_lesson ON bookmarks(lesson_id);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can read own bookmarks" ON bookmarks;
CREATE POLICY "Students can read own bookmarks"
  ON bookmarks FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Students can insert own bookmarks" ON bookmarks;
CREATE POLICY "Students can insert own bookmarks"
  ON bookmarks FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Students can delete own bookmarks" ON bookmarks;
CREATE POLICY "Students can delete own bookmarks"
  ON bookmarks FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- 6. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ann_class ON announcements(class_id);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can read announcements for enrolled classes" ON announcements;
CREATE POLICY "Students can read announcements for enrolled classes"
  ON announcements FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_members cm
      WHERE cm.class_id = announcements.class_id AND cm.student_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Teachers can manage announcements for own classes" ON announcements;
CREATE POLICY "Teachers can manage announcements for own classes"
  ON announcements FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_id AND c.teacher_id = auth.uid()
    )
  );

-- 7. ANNOUNCEMENT READS
CREATE TABLE IF NOT EXISTS announcement_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid REFERENCES announcements(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(announcement_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_annread_ann ON announcement_reads(announcement_id);
CREATE INDEX IF NOT EXISTS idx_annread_student ON announcement_reads(student_id);

ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can read own read tracking" ON announcement_reads;
CREATE POLICY "Students can read own read tracking"
  ON announcement_reads FOR SELECT TO authenticated
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can insert own read tracking" ON announcement_reads;
CREATE POLICY "Students can insert own read tracking"
  ON announcement_reads FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());
