# Design: Auto-Confirm Signup

## Flow

```
FORM → handleSubmit
          │
          ├── validate invite (if teacher)
          ├── supabase.auth.signUp({ email, password, data: { role, inviteCode } })
          ├── POST /api/auth/confirm-email  ← existing route, calls SECURITY DEFINER RPC
          ├── supabase.auth.signInWithPassword({ email, password })  ← log in
          └── router.push("/{locale}/dashboard")
```

## Removed

- OTP stage (state `"otp"`)
- "done" stage (state `"done"`)
- OTP state: `otp`, `otpError`, `otpVerifying`, `resendCooldown`, `resendSent`, `shakeKey`
- OTP refs: `inputRefs`
- OTP handlers: `handleOtpChange`, `handleOtpKeyDown`, `handleOtpPaste`, `handleOtpVerify`, `handleResend`
- OTP useEffect for `resendCooldown` timer
- Imports: `ShieldCheck`, `Loader2`, `RefreshCw` (used only by OTP stage)

## Files Changed

| File | Change |
|------|--------|
| `src/app/[locale]/auth/signup/page.tsx` | Remove OTP stage, add auto-confirm + redirect after signUp |
