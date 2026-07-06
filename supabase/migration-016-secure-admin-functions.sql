-- Restrict SECURITY DEFINER functions to authenticated users only
REVOKE EXECUTE ON FUNCTION e2e_create_quiz(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION e2e_create_quiz(uuid, jsonb) TO authenticated;

REVOKE EXECUTE ON FUNCTION e2e_delete_quiz(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION e2e_delete_quiz(uuid) TO authenticated;
