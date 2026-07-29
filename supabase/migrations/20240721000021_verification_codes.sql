CREATE TABLE IF NOT EXISTS verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '10 minutes',
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email_code
  ON verification_codes (email, code);

CREATE OR REPLACE FUNCTION generate_verification_code(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_code text;
BEGIN
  -- Invalidate any existing unused codes for this email
  UPDATE public.verification_codes
  SET used_at = now()
  WHERE email = p_email AND used_at IS NULL;

  -- Generate a random 6-digit code
  v_code := lpad(floor(random() * 1000000)::text, 6, '0');

  INSERT INTO public.verification_codes (email, code)
  VALUES (p_email, v_code);

  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION verify_verification_code(p_email text, p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_count int;
BEGIN
  UPDATE public.verification_codes
  SET used_at = now()
  WHERE email = p_email
    AND code = p_code
    AND used_at IS NULL
    AND expires_at > now();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count > 0;
END;
$$;

REVOKE EXECUTE ON FUNCTION generate_verification_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION generate_verification_code(text) TO authenticated;

REVOKE EXECUTE ON FUNCTION verify_verification_code(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION verify_verification_code(text, text) TO authenticated;
