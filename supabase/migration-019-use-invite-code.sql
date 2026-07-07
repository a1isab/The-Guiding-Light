-- SECURITY DEFINER function to use an invite code (mark invite as expired)
-- Only callable by authenticated users; invoked from /api/classes/join

CREATE OR REPLACE FUNCTION use_invite_code(p_class_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.classes
  SET invite_expires_at = now()
  WHERE id = p_class_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION use_invite_code(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION use_invite_code(uuid) TO authenticated;
