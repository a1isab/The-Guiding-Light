-- Enhanced Lesson Experience: columns, templates table, bucket limit bump

-- 0. Raise lesson-files bucket limit from 10MB to 50MB
UPDATE storage.buckets SET file_size_limit = 52428800 WHERE name = 'lesson-files';

-- 1. Add quiz_source_content column to teacher_lessons
ALTER TABLE teacher_lessons ADD COLUMN IF NOT EXISTS quiz_source_content text;

-- 2. Add content_viewed_at column to progress
ALTER TABLE progress ADD COLUMN IF NOT EXISTS content_viewed_at timestamptz;

-- 3. Create teacher_lesson_templates table
CREATE TABLE IF NOT EXISTS teacher_lesson_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE,
  is_official boolean DEFAULT false,
  name text NOT NULL,
  description text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tlt_teacher ON teacher_lesson_templates(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tlt_official ON teacher_lesson_templates(is_official);

-- RLS
ALTER TABLE teacher_lesson_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers can CRUD own templates" ON teacher_lesson_templates;
CREATE POLICY "Teachers can CRUD own templates"
  ON teacher_lesson_templates FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can read official templates" ON teacher_lesson_templates;
CREATE POLICY "Anyone can read official templates"
  ON teacher_lesson_templates FOR SELECT TO authenticated
  USING (is_official = true);

DROP POLICY IF EXISTS "Admins have full access to templates" ON teacher_lesson_templates;
CREATE POLICY "Admins have full access to templates"
  ON teacher_lesson_templates FOR ALL TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');
