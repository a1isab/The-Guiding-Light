-- Teacher Lesson Files: document file support per lesson

-- 1. Lesson files table
CREATE TABLE teacher_lesson_files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid REFERENCES teacher_lessons(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  mime_type text NOT NULL,
  storage_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Indexes
CREATE INDEX idx_tlf_lesson ON teacher_lesson_files(lesson_id);
CREATE INDEX idx_tlf_teacher ON teacher_lesson_files(teacher_id);

-- 3. Enable RLS
ALTER TABLE teacher_lesson_files ENABLE ROW LEVEL SECURITY;

-- 4. RLS: Teachers can CRUD own files
DROP POLICY IF EXISTS "Teachers can CRUD own lesson files" ON teacher_lesson_files;
CREATE POLICY "Teachers can CRUD own lesson files"
  ON teacher_lesson_files FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- 5. RLS: Students can read files of enrolled class lessons
DROP POLICY IF EXISTS "Students can read lesson files" ON teacher_lesson_files;
CREATE POLICY "Students can read lesson files"
  ON teacher_lesson_files FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_lessons tl
      JOIN teacher_sections ts ON ts.id = tl.section_id
      JOIN teacher_courses tc ON tc.id = ts.course_id
      JOIN class_members cm ON cm.class_id = tc.class_id
      WHERE tl.id = lesson_id AND cm.student_id = auth.uid()
    )
  );

-- 6. RLS: Admins full access
DROP POLICY IF EXISTS "Admins have full access to lesson files" ON teacher_lesson_files;
CREATE POLICY "Admins have full access to lesson files"
  ON teacher_lesson_files FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- 7. Storage bucket for lesson files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-files',
  'lesson-files',
  true,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
) ON CONFLICT (id) DO NOTHING;

-- 8. Storage RLS: teachers upload/manage own files
DROP POLICY IF EXISTS "Teachers can upload lesson files" ON storage.objects;
CREATE POLICY "Teachers can upload lesson files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'lesson-files'
    AND (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('teacher', 'admin')
  );

DROP POLICY IF EXISTS "Teachers can delete own lesson files" ON storage.objects;
CREATE POLICY "Teachers can delete own lesson files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'lesson-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Authenticated can read lesson files" ON storage.objects;
CREATE POLICY "Authenticated can read lesson files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'lesson-files');

DROP POLICY IF EXISTS "Admins can manage all lesson files" ON storage.objects;
CREATE POLICY "Admins can manage all lesson files"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'lesson-files'
    AND (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
  );
