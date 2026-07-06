# Tasks: Auto-Confirm Signup

- [x] Remove OTP state variables, refs, useEffect from signup page
- [x] Remove handleOtpChange, handleOtpKeyDown, handleOtpPaste, handleOtpVerify, handleResend functions
- [x] Remove OTP stage render block and "done" stage render block
- [x] After signUp() succeeds: POST /api/auth/confirm-email, signInWithPassword(), redirect to dashboard
- [x] Remove unused shake animation from globals.css
- [x] Verify npm run build passes with 0 errors
