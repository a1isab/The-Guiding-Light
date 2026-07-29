CREATE TABLE IF NOT EXISTS teacher_invites (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  code text NOT NULL UNIQUE,
  created_by uuid REFERENCES profiles(user_id) ON DELETE SET NULL,
  used_by uuid REFERENCES profiles(user_id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE teacher_invites ENABLE ROW LEVEL SECURITY;

-- Admins can read all invites
CREATE POLICY "Admins can read all invites"
  ON teacher_invites FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Admins can insert invites
CREATE POLICY "Admins can insert invites"
  ON teacher_invites FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Admins can update invites (e.g. mark as used)
CREATE POLICY "Admins can update invites"
  ON teacher_invites FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
