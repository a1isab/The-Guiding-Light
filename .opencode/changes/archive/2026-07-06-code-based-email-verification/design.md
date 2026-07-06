# Design: Code-Based Email Verification

## State Machine

```
FORM → OTP → DONE
```

## FORM Stage (unchanged)

- email, password, role, inviteCode fields
- On submit: `supabase.auth.signUp({ email, password, options })`
  - `emailRedirectTo` uses `NEXT_PUBLIC_SITE_URL || window.location.origin`
- On success → transition to OTP stage
- `signInWithOtp({ email })` fires to send 6-digit code

## OTP Stage (new)

- 6 `<input>` elements, `type="text" inputMode="numeric" maxLength={1}`, ref array
- On input → auto-advance to next box
- On Backspace → clear current, focus previous
- On paste of 6 digits → fill all boxes simultaneously
- Auto-submit on 6th digit → `verifyOtp({ email, token, type: 'email' })`
- On success → `POST /api/auth/confirm-email` (confirms email + teacher upgrade)
- On error → shake animation, clear boxes, refocus first
- Resend button with 30s cooldown, calls `signInWithOtp`
- Fallback link to original confirmation URL from `signUp`

## DONE Stage

- Brief "Welcome!" then redirect to dashboard

## API: POST /api/auth/confirm-email

Receives `{ email }` from authenticated client, calls `auth_confirm_user` RPC.

## Migration 017

SECURITY DEFINER function `auth_confirm_user(p_email text)`:
- Sets `email_confirmed_at` on `auth.users`
- If role=teacher, updates profile + marks invite used

## Changed Files

| File | Action |
|------|--------|
| `.env.local` | Add `NEXT_PUBLIC_SITE_URL` |
| `supabase/migration-017-auth-helpers.sql` | Create |
| `src/app/api/auth/confirm-email/route.ts` | Create |
| `src/app/[locale]/auth/signup/page.tsx` | Modify — add OTP stage |
| `src/app/[locale]/auth/forgot-password/page.tsx` | Modify — fix redirectTo |
| `src/app/[locale]/auth/callback/route.ts` | Modify — remove teacher upgrade |
| `messages/en.json` | Modify — add 8 OTP keys |
| `messages/ar.json` | Modify — add 8 OTP keys |
| `messages/ur.json` | Modify — add 8 OTP keys |
| `messages/fr.json` | Modify — add 8 OTP keys |
