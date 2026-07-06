# Tasks: Code-Based Email Verification

- [x] Add `NEXT_PUBLIC_SITE_URL` to `.env.local`
- [x] Create `supabase/migration-017-auth-helpers.sql` with SECURITY DEFINER function
- [x] Add OTP i18n keys to `messages/en.json`
- [x] Add OTP i18n keys to `messages/ar.json`
- [x] Add OTP i18n keys to `messages/ur.json`
- [x] Add OTP i18n keys to `messages/fr.json`
- [x] Create `src/app/api/auth/confirm-email/route.ts`
- [x] Modify signup page with OTP state machine, 6-box input, auto-submit, resend cooldown
- [x] Fix redirectTo URL in forgot-password page using `NEXT_PUBLIC_SITE_URL`
- [x] Remove teacher upgrade logic from callback route
- [x] Verify `npm run build` passes with 0 errors
