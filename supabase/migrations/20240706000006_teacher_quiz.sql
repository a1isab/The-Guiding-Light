-- Teacher Quiz System: per-lesson quizzes with retake/lockout mechanics

-- 1. Quiz questions
CREATE TABLE teacher_quiz_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid REFERENCES teacher_lessons(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_index integer NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Quiz attempts
CREATE TABLE teacher_quiz_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid REFERENCES teacher_lessons(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  passed boolean NOT NULL DEFAULT false,
  completed_at timestamptz DEFAULT now()
);

-- 3. Indexes
CREATE INDEX idx_tqq_lesson ON teacher_quiz_questions(lesson_id);
CREATE INDEX idx_tqq_order ON teacher_quiz_questions(lesson_id, order_index);
CREATE INDEX idx_tqa_lesson_student ON teacher_quiz_attempts(lesson_id, student_id);
CREATE INDEX idx_tqa_completed ON teacher_quiz_attempts(lesson_id, student_id, completed_at);

-- 4. Enable RLS
ALTER TABLE teacher_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 5. RLS: teacher_quiz_questions
-- Teachers can CRUD questions via the lesson ownership chain
DROP POLICY IF EXISTS "Teachers can CRUD quiz questions" ON teacher_quiz_questions;
CREATE POLICY "Teachers can CRUD quiz questions"
  ON teacher_quiz_questions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_lessons tl
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN classes c ON c.id = tc.class_id
      WHERE tl.id = lesson_id AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teacher_lessons tl
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN classes c ON c.id = tc.class_id
      WHERE tl.id = lesson_id AND c.teacher_id = auth.uid()
    )
  );

-- Students can read questions (without correct_index) for enrolled class lessons
DROP POLICY IF EXISTS "Students can read quiz questions" ON teacher_quiz_questions;
CREATE POLICY "Students can read quiz questions"
  ON teacher_quiz_questions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_lessons tl
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN class_members cm ON cm.class_id = tc.class_id
      WHERE tl.id = lesson_id AND cm.student_id = auth.uid()
    )
  );

-- Admins full access
DROP POLICY IF EXISTS "Admins have full access to quiz questions" ON teacher_quiz_questions;
CREATE POLICY "Admins have full access to quiz questions"
  ON teacher_quiz_questions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- 6. RLS: teacher_quiz_attempts
-- Students can insert their own attempts
DROP POLICY IF EXISTS "Students can insert own attempts" ON teacher_quiz_attempts;
CREATE POLICY "Students can insert own attempts"
  ON teacher_quiz_attempts FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Students can read their own attempts
DROP POLICY IF EXISTS "Students can read own attempts" ON teacher_quiz_attempts;
CREATE POLICY "Students can read own attempts"
  ON teacher_quiz_attempts FOR SELECT TO authenticated
  USING (student_id = auth.uid());

-- Teachers can read attempts for lessons in their classes
DROP POLICY IF EXISTS "Teachers can read attempts for own lessons" ON teacher_quiz_attempts;
CREATE POLICY "Teachers can read attempts for own lessons"
  ON teacher_quiz_attempts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_lessons tl
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN classes c ON c.id = tc.class_id
      WHERE tl.id = lesson_id AND c.teacher_id = auth.uid()
    )
  );

-- Admins full access
DROP POLICY IF EXISTS "Admins have full access to quiz attempts" ON teacher_quiz_attempts;
CREATE POLICY "Admins have full access to quiz attempts"
  ON teacher_quiz_attempts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
