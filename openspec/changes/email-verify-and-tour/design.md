## Context

The email verification flow currently generates a 6-digit code client-side (`Math.random()`), stores it in `sessionStorage`, and displays it on the verify page. The code is never sent via email. The `generate-code` API creates a proof token (random hex) stored in an in-memory Map, but the 6-digit code itself is never persisted server-side. The `verify-code` API only validates the proof token, not the 6-digit code.

The site tour (driver.js) targets `data-section="my-classes"`, `data-section="badge-grid"`, and `data-section="streak"` selectors, but the student dashboard page has none of these attributes — tour steps highlight nothing.

## Goals / Non-Goals

**Goals:**
- Send 6-digit verification code via Resend email after signup
- Store code server-side for verification
- Auto-submit when all 6 digits are entered on the verify page
- Remove on-screen code display
- Add `data-section` attributes to student dashboard for tour targeting

**Non-Goals:**
- Changing Supabase's own email confirmation flow (signUp still sends Supabase's confirmation email)
- Redesigning the tour steps or adding new tour targets
- Implementing rate limiting on code generation (out of scope)

## Decisions

### Use Resend for email delivery
**Choice**: Resend SDK (`resend` npm package)
**Why**: Free tier (100/day, 3000/month), simple API, no SMTP config needed. Supabase Auth OTP was considered but would require disabling the current signUp flow entirely.
**Alternative considered**: Supabase built-in OTP — rejected because it would require removing the custom proof-token flow and restructuring auth.

### Store code in-memory (existing Map pattern)
**Choice**: Extend the existing `proofs` Map in `generate-code/route.ts` to store the 6-digit code alongside the proof token.
**Why**: The existing Map already handles proof tokens with TTL cleanup. Adding the code field is minimal change. No DB migration needed.
**Alternative considered**: Store in `verification_codes` DB table — rejected as overkill for a 15-minute TTL code.

### Auto-submit via useEffect
**Choice**: React `useEffect` watching the `code` array — when all 6 entries are non-empty, call `handleSubmit()`.
**Why**: Standard pattern for OTP inputs. No external library needed.
**Alternative considered**: `onInput` event on the last input — rejected because it doesn't handle paste of full 6-digit code.

### Send code from server, not client
**Choice**: The `generate-code` API generates the 6-digit code, stores it, and sends the email. Client only receives the proof token.
**Why**: Code never touches the client, preventing interception. The client already calls `generate-code` after signUp.

## Risks / Trade-offs

- **Resend free tier limit (100/day)** → Sufficient for current scale. If exceeded, emails silently fail. Mitigation: log errors, show user-friendly "try again later" message.
- **In-memory Map lost on server restart** → Codes expire after 15 minutes anyway. Users can retry. Low risk.
- **Supabase still sends its own confirmation email** → Users receive two emails. Mitigation: could disable Supabase email confirmation in dashboard, but that's a separate change.
- **Auto-submit may trigger before user finishes reviewing** → Only triggers when all 6 digits are entered, which is the intended behavior.
