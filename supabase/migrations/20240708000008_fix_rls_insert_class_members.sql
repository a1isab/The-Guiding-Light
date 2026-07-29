-- Bug 1: Students need INSERT permission on class_members to join by code
-- Existing policies only allow teachers/admins to insert. Students can only SELECT.

DROP POLICY IF EXISTS "Students can join classes" ON class_members;
CREATE POLICY "Students can join classes"
  ON class_members FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());
