-- Add last_activity_at column to profiles for streak tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_at timestamptz;
