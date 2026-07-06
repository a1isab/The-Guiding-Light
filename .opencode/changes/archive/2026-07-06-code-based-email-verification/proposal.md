# Code-Based Email Verification

## What

Replace the current post-signup confirmation-link flow with a 6-digit OTP code verification flow. After signing up, users enter a code sent via email into 6 individual input boxes. On 6th digit entry, the code is auto-verified and the user is redirected to dashboard.

## Why

- Users forget to click confirmation links (low conversion)
- Links can be marked as spam, lost, or expire
- OTP in-app is faster and more reliable
- Auto-submit on 6th digit removes friction
- User is logged in instantly after code entry — no separate login step

## Out of Scope

- 2FA on login (future feature)
- Passwordless auth (password field stays)
- Social login
