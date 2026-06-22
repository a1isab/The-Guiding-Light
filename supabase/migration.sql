-- ============================================
-- The Guiding Light — Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Profiles table (created on user signup via trigger)
CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  level text DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  streak integer DEFAULT 0,
  onboarded boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 3. Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  title_ar text,
  description text NOT NULL,
  description_ar text,
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  slug text UNIQUE NOT NULL,
  image_url text,
  thumbnail_url text,
  is_published boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. Sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  title_ar text,
  slug text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- 5. Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  title_ar text,
  slug text NOT NULL,
  content text NOT NULL,
  content_type text DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'both')),
  video_url text,
  arabic_text text,
  is_published boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(section_id, slug)
);

-- 6. Lesson embeddings (pgvector)
CREATE TABLE IF NOT EXISTS lesson_embeddings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL UNIQUE,
  embedding vector(768),
  created_at timestamptz DEFAULT now()
);

-- 7. User progress
CREATE TABLE IF NOT EXISTS progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 8. Subscriptions (ready for Phase 4 Stripe integration)
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  created_at timestamptz DEFAULT now()
);

-- 9. Auth trigger: auto-create profile + subscription on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role)
  VALUES (NEW.id, 'student');

  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 10. HNSW index for fast similarity search
CREATE INDEX IF NOT EXISTS idx_lesson_embeddings_vector
  ON lesson_embeddings
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 200);

-- 11. Function: find similar lessons by cosine similarity
CREATE OR REPLACE FUNCTION find_similar_lessons(
  query_embedding vector(768),
  similarity_threshold float DEFAULT 0.78
)
RETURNS TABLE (
  id uuid,
  lesson_id uuid,
  lesson_title text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    le.id,
    le.lesson_id,
    l.title AS lesson_title,
    1 - (le.embedding <=> query_embedding) AS similarity
  FROM lesson_embeddings le
  JOIN lessons l ON l.id = le.lesson_id
  WHERE le.embedding IS NOT NULL
    AND 1 - (le.embedding <=> query_embedding) >= similarity_threshold
  ORDER BY similarity DESC
  LIMIT 5;
END;
$$;

-- 12. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 13. RLS Policies (idempotent: drop first, then create)

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read courses" ON courses;
CREATE POLICY "Anyone can read courses"
  ON courses FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read sections" ON sections;
CREATE POLICY "Anyone can read sections"
  ON sections FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read lessons" ON lessons;
CREATE POLICY "Anyone can read lessons"
  ON lessons FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read embeddings" ON lesson_embeddings;
CREATE POLICY "Anyone can read embeddings"
  ON lesson_embeddings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can read own progress" ON progress;
CREATE POLICY "Users can read own progress"
  ON progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON progress;
CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own subscription" ON subscriptions;
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 14. Quizzes table (auto-generated by Gemini per lesson)
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL UNIQUE,
  questions jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 15. User answers table
CREATE TABLE IF NOT EXISTS user_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  answers jsonb NOT NULL,
  score int NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read quizzes" ON quizzes;
CREATE POLICY "Anyone can read quizzes"
  ON quizzes FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can read own answers" ON user_answers;
CREATE POLICY "Users can read own answers"
  ON user_answers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own answers" ON user_answers;
CREATE POLICY "Users can insert own answers"
  ON user_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 16. Flashcards table (AI-generated, cached)
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL UNIQUE,
  cards jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read flashcards" ON flashcards;
CREATE POLICY "Anyone can read flashcards"
  ON flashcards FOR SELECT
  TO anon, authenticated
  USING (true);

-- 17. User badges (earned for completing sections)
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  badge_key text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_key)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own badges" ON user_badges;
CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own badges" ON user_badges;
CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 18. Add columns for Arabic content & publishing (safe for existing DBs)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS title_ar text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS description_ar text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;

ALTER TABLE sections ADD COLUMN IF NOT EXISTS title_ar text;

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS title_ar text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'text'
  CHECK (content_type IN ('text', 'video', 'both'));
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;
