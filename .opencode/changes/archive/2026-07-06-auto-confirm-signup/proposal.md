# Auto-Confirm Signup

## What

Remove the OTP code stage from the signup flow. After `signUp()` succeeds, the existing `POST /api/auth/confirm-email` route is called (which uses the SECURITY DEFINER RPC to confirm the email), followed by `signInWithPassword()` to log the user in, and a redirect to dashboard.

## Why

Supabase's built-in email service is not delivering OTP emails. No custom domain is available for Resend/SendGrid SMTP. Auto-confirm via the admin RPC is the only working path — it's the same security model as the original confirmation-link flow but instant and reliable.

## Out of Scope

- Removing OTP i18n keys from locale files (unused but harmless)
- Email integration fixes (will revisit when a domain is available)
