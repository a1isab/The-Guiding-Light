-- Add JSONB translation columns for multi-language content
-- Structure: {"en": {"title": "...", "description": "..."}, "ar": {...}, "ur": {...}, "fr": {...}}

ALTER TABLE courses ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;

-- Populate translations from existing columns
UPDATE courses SET translations = translations || jsonb_build_object(
  'en', jsonb_build_object('title', title, 'description', description),
  'ar', jsonb_build_object('title', COALESCE(title_ar, title), 'description', COALESCE(description_ar, description))
) WHERE translations = '{}'::jsonb;

UPDATE sections SET translations = translations || jsonb_build_object(
  'en', jsonb_build_object('title', title),
  'ar', jsonb_build_object('title', COALESCE(title_ar, title))
) WHERE translations = '{}'::jsonb;

UPDATE lessons SET translations = translations || jsonb_build_object(
  'en', jsonb_build_object('title', title, 'content', content),
  'ar', jsonb_build_object('title', COALESCE(title_ar, title), 'content', COALESCE(content, ''), 'arabic_text', COALESCE(arabic_text, ''))
) WHERE translations = '{}'::jsonb;
