-- E2E test helpers: create/delete quizzes bypassing RLS via SECURITY DEFINER
-- Applied manually for test environments only.

CREATE OR REPLACE FUNCTION e2e_create_quiz(p_lesson_id uuid, p_questions jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.quizzes (lesson_id, questions)
  VALUES (p_lesson_id, p_questions)
  ON CONFLICT (lesson_id)
  DO UPDATE SET questions = EXCLUDED.questions
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION e2e_delete_quiz(p_lesson_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.quizzes WHERE lesson_id = p_lesson_id;
END;
$$;
