-- Fix circular RLS dependency between classes and class_members
-- classes policy queries class_members; class_members policy queries classes
-- Break the cycle using SECURITY DEFINER helper function

-- SECURITY DEFINER function to check class ownership (bypasses RLS)
CREATE OR REPLACE FUNCTION is_class_teacher(class_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.classes WHERE id = class_id AND teacher_id = user_id);
$$;

-- Fix class_members: "Teachers can manage members of own classes"
-- Use is_class_teacher() which bypasses RLS, breaking the cycle
DROP POLICY IF EXISTS "Teachers can manage members of own classes" ON class_members;
CREATE POLICY "Teachers can manage members of own classes"
  ON class_members FOR ALL TO authenticated
  USING (is_class_teacher(class_id, auth.uid()))
  WITH CHECK (is_class_teacher(class_id, auth.uid()));
