-- =====================================================
-- Migration 025: Teacher Verification + Featured Classes
-- Tables: teacher_verification_requests
-- Columns: profiles.is_verified
-- Storage: verification-documents bucket
-- =====================================================

-- 1. Add is_verified to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- 2. Teacher verification requests
CREATE TABLE IF NOT EXISTS teacher_verification_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  document_type   text NOT NULL CHECK (document_type IN ('passport', 'national_id', 'teaching_certificate', 'other')),
  document_url    text NOT NULL,
  document_number text,
  notes           text,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by     uuid REFERENCES profiles(user_id),
  review_notes    text,
  reviewed_at     timestamptz,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tvr_user ON teacher_verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_tvr_status ON teacher_verification_requests(status);

ALTER TABLE teacher_verification_requests ENABLE ROW LEVEL SECURITY;

-- Teachers can submit their own requests
DROP POLICY IF EXISTS "Teachers can submit verification requests" ON teacher_verification_requests;
CREATE POLICY "Teachers can submit verification requests"
  ON teacher_verification_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Teachers can read their own requests
DROP POLICY IF EXISTS "Teachers can read own verification requests" ON teacher_verification_requests;
CREATE POLICY "Teachers can read own verification requests"
  ON teacher_verification_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins have full access
DROP POLICY IF EXISTS "Admins have full access to verification requests" ON teacher_verification_requests;
CREATE POLICY "Admins have full access to verification requests"
  ON teacher_verification_requests FOR ALL TO authenticated
  USING (get_user_role() = 'admin');

-- 3. Storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: teachers can upload their own
DROP POLICY IF EXISTS "Teachers can upload verification documents" ON storage.objects;
CREATE POLICY "Teachers can upload verification documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Teachers can read own documents
DROP POLICY IF EXISTS "Teachers can read own verification documents" ON storage.objects;
CREATE POLICY "Teachers can read own verification documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Admins can read all verification documents
DROP POLICY IF EXISTS "Admins can read all verification documents" ON storage.objects;
CREATE POLICY "Admins can read all verification documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'verification-documents' AND get_user_role() = 'admin');

-- 4. RLS policies for featured classes: allow all authenticated users to read verified teacher content

-- Classes from verified teachers
DROP POLICY IF EXISTS "Students can browse verified teacher classes" ON classes;
CREATE POLICY "Students can browse verified teacher classes"
  ON classes FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = classes.teacher_id
      AND profiles.is_verified = true
    )
  );

-- Teacher courses from verified teacher classes
DROP POLICY IF EXISTS "Students can browse verified teacher courses" ON teacher_courses;
CREATE POLICY "Students can browse verified teacher courses"
  ON teacher_courses FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes
      JOIN profiles ON profiles.user_id = classes.teacher_id
      WHERE classes.id = teacher_courses.class_id
      AND profiles.is_verified = true
    )
  );

-- Teacher sections from verified teacher courses
DROP POLICY IF EXISTS "Students can browse verified teacher sections" ON teacher_sections;
CREATE POLICY "Students can browse verified teacher sections"
  ON teacher_sections FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_courses
      JOIN classes ON classes.id = teacher_courses.class_id
      JOIN profiles ON profiles.user_id = classes.teacher_id
      WHERE teacher_sections.course_id = teacher_courses.id
      AND profiles.is_verified = true
    )
  );

-- Teacher lessons from verified teacher sections
DROP POLICY IF EXISTS "Students can browse verified teacher lessons" ON teacher_lessons;
CREATE POLICY "Students can browse verified teacher lessons"
  ON teacher_lessons FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_sections
      JOIN teacher_courses ON teacher_courses.id = teacher_sections.course_id
      JOIN classes ON classes.id = teacher_courses.class_id
      JOIN profiles ON profiles.user_id = classes.teacher_id
      WHERE teacher_lessons.section_id = teacher_sections.id
      AND profiles.is_verified = true
    )
  );
