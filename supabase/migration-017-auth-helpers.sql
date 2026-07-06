CREATE OR REPLACE FUNCTION auth_confirm_user(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, now())
  WHERE email = p_email;

  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = p_email
      AND raw_user_meta_data->>'role' = 'teacher'
  ) THEN
    UPDATE public.profiles
    SET role = 'teacher'
    FROM auth.users
    WHERE auth.users.id = profiles.user_id
      AND auth.users.email = p_email;

    UPDATE public.teacher_invites ti
    SET used_by = u.id, used_at = now()
    FROM auth.users u
    WHERE u.email = p_email
      AND ti.code = (u.raw_user_meta_data->>'inviteCode')
      AND ti.used_by IS NULL;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION auth_confirm_user(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION auth_confirm_user(text) TO authenticated;
