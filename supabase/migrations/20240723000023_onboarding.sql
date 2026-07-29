-- Migration 023: Onboarding - add display_name and onboarding_data columns to profiles

-- Add display_name column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name text;

-- Add onboarding_data column for storing wizard answers as JSONB
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_data jsonb;

-- The 'onboarded' boolean column already exists from the initial schema
-- (see migration.sql line 15: onboarded boolean DEFAULT false)
-- No changes needed for that column.
