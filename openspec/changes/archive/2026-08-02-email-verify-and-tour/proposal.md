## Why

The email verification flow is broken: the 6-digit code is generated client-side, stored in `sessionStorage`, and displayed on-screen for the user to read — it's never sent via email. This defeats the purpose of email verification and the code can't even be copy-pasted. Additionally, the site tour (driver.js) has no `data-section` attributes on the student dashboard, so tour steps that target "My Classes", "Badges", and "Streak" highlight nothing.

## What Changes

- **Send verification code via email**: Use Resend (free tier: 100/day) to email the 6-digit code to the user after signup. Generate the code server-side in the `generate-code` API route and store it for verification.
- **Remove on-screen code display**: The verify page no longer shows the code. Users must check their email.
- **Auto-submit on 6 digits**: When all 6 digit inputs are filled, automatically trigger verification without requiring a button click.
- **Add `data-section` attributes to student dashboard**: Add `data-section="my-classes"`, `data-section="badge-grid"`, and `data-section="streak"` to the corresponding dashboard elements so the site tour highlights them correctly.

## Capabilities

### New Capabilities
- `email-verification`: Send 6-digit verification code via Resend email, server-side code generation, auto-submit on complete input

### Modified Capabilities
- `site-tour`: Add missing `data-section` attributes to student dashboard elements so tour steps highlight correctly

## Impact

- **Files modified**:
  - `src/app/api/auth/generate-code/route.ts` — generate 6-digit code server-side, store it, send via Resend
  - `src/app/[locale]/auth/verify/page.tsx` — remove code display, add auto-submit, send code to server for verification
  - `src/app/[locale]/auth/signup/page.tsx` — remove client-side code generation, don't store code in sessionStorage
  - `src/components/onboarding-wizard.tsx` — same client-side code removal
  - `src/app/api/auth/verify-code/route.ts` — accept and verify the 6-digit code server-side
  - `src/app/[locale]/dashboard/page.tsx` — add `data-section` attributes to streak, my-classes, badge-grid elements
- **New dependencies**: `resend` npm package
- **New env var**: `RESEND_API_KEY` in `.env.local`
- **API change**: `verify-code` POST body now requires `code` field (the 6-digit code) in addition to `email` and `token`
