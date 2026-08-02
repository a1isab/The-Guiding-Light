-- auth_confirm_user was only called by the removed /api/auth/confirm-email route.
-- The signup flow uses Supabase magic-link confirmation via /auth/callback.
DROP FUNCTION IF EXISTS public.auth_confirm_user(text);
