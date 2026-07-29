-- Teacher progress tracking: separate table for teacher-created lessons
-- Prevents FK violation on progress.lesson_id which references lessons(id) (public courses)

-- 1. Create teacher_progress table
CREATE TABLE IF NOT EXISTS teacher_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES teacher_lessons(id) ON DELETE CASCADE NOT NULL,
  content_viewed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_tp_student ON teacher_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_tp_lesson ON teacher_progress(lesson_id);

-- 3. RLS
ALTER TABLE teacher_progress ENABLE ROW LEVEL SECURITY;

-- Students can read their own progress
DROP POLICY IF EXISTS "Students can read own progress" ON teacher_progress;
CREATE POLICY "Students can read own progress"
  ON teacher_progress FOR SELECT TO authenticated
  USING (student_id = auth.uid());

-- Students can insert their own progress
DROP POLICY IF EXISTS "Students can insert own progress" ON teacher_progress;
CREATE POLICY "Students can insert own progress"
  ON teacher_progress FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Students can update their own progress
DROP POLICY IF EXISTS "Students can update own progress" ON teacher_progress;
CREATE POLICY "Students can update own progress"
  ON teacher_progress FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Teachers can read progress on their class lessons
DROP POLICY IF EXISTS "Teachers can read progress on own lessons" ON teacher_progress;
CREATE POLICY "Teachers can read progress on own lessons"
  ON teacher_progress FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_lessons tl
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN classes c ON c.id = tc.class_id
      WHERE tl.id = lesson_id AND c.teacher_id = auth.uid()
    )
  );

-- Admins can read all progress
DROP POLICY IF EXISTS "Admins can read all teacher progress" ON teacher_progress;
CREATE POLICY "Admins can read all teacher progress"
  ON teacher_progress FOR SELECT TO authenticated
  USING (get_user_role() = 'admin');
