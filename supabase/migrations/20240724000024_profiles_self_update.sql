-- Allow authenticated users to update their own profile (display_name, onboarding_data, onboarded)
-- Required for /api/onboarding which uses the user's auth client
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
