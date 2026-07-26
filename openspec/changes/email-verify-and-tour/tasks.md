## 1. Setup

- [x] 1.1 Install Resend npm package (`npm install resend`)
- [x] 1.2 Add `RESEND_API_KEY` to `.env.local` (user must provide their own key from resend.com)
- [x] 1.3 Add "Already have an account? Sign in" link to onboarding wizard signup step

## 2. Server-Side Code Generation & Email

- [x] 2.1 Update `src/app/api/auth/generate-code/route.ts` — extend `ProofEntry` to include `code` field, generate 6-digit numeric code, store it alongside the proof token
- [x] 2.2 Add Resend email sending in `generate-code/route.ts` — import Resend SDK, send email with the 6-digit code after generating proof token
- [x] 2.3 Add error handling for missing `RESEND_API_KEY` — log error, return user-friendly message

## 3. Client-Side Signup Changes

- [x] 3.1 Update `src/app/[locale]/auth/signup/page.tsx` — remove client-side code generation (line 89), remove `sv_code` sessionStorage write, keep only email/password/token storage
- [x] 3.2 Update `src/components/onboarding-wizard.tsx` — same changes: remove client-side code generation, remove `sv_code` sessionStorage write

## 4. Verify Page Changes

- [x] 4.1 Update `src/app/[locale]/auth/verify/page.tsx` — remove code display block (lines 124-129), remove `expectedCode` state and sessionStorage read for `sv_code`
- [x] 4.2 Add auto-submit `useEffect` — watch `code` array, trigger `handleSubmit()` when all 6 entries are non-empty
- [x] 4.3 Update `handleSubmit` to send the entered code to `/api/auth/verify-code` in the POST body

## 5. Server-Side Code Verification

- [x] 5.1 Update `src/app/api/auth/verify-code/route.ts` — accept `code` field in POST body, verify it against the stored code in the proof Map before consuming the proof token
- [x] 5.2 Return appropriate error messages for incorrect code vs expired code

## 6. Dashboard Tour Attributes

- [x] 6.1 Add `data-section="streak"` to the streak stat card in `src/app/[locale]/dashboard/page.tsx`
- [x] 6.2 Add `data-section="my-classes"` to the My Classes section wrapper in `src/app/[locale]/dashboard/page.tsx`
- [x] 6.3 Add `data-section="badge-grid"` to the BadgeGrid component wrapper in `src/app/[locale]/dashboard/page.tsx``

## 7. Verification

- [ ] 7.1 Start dev server and test signup flow — verify email is received with 6-digit code
- [ ] 7.2 Test verify page — confirm code is not displayed, auto-submit works when 6 digits entered
- [ ] 7.3 Test incorrect code — verify error message appears
- [ ] 7.4 Test expired code — wait 15 minutes or modify TTL, verify expiration error
- [ ] 7.5 Test student dashboard tour — verify all tour steps highlight correct elements
- [x] 7.6 Run existing E2E tests to confirm no regressions
