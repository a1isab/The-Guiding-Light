## Why

Two issues block reliable Playwright test execution:

1. **Supabase email rate limits**: 6 tests in `auth.spec.ts` call `supabase.auth.signUp()` or `supabase.auth.resetPasswordForEmail()`. The Supabase free tier enforces strict email quotas — once exceeded, ALL tests fail with "email limit exceeded" errors, blocking the entire suite and CI.

2. **Blank-screen debug mode**: Running tests with `--ui` or `--debug` opens the Playwright Inspector, showing a blank browser that requires clicking "Resume" to proceed. This makes local test execution confusing and slow.

## What Changes

- Remove 6 email-triggering tests: 4.1 (student signup), 4.2 (existing email), 4.3 (teacher signup with invite), 4.5 (verify correct code), 4.6 (verify wrong code), 4.10 (forgot password)
- Keep safe tests: 4.4 (invalid invite — blocked before signUp), 4.7 (verify redirect no session), 4.8 (admin + teacher login), 4.9 (invalid credentials), 4.11 (mismatched passwords), 4.12 (logout)
- Renumber remaining tests sequentially
- Add inline comment documenting why email tests are removed and conditions for re-enabling
- Update CI.md with correct run commands, warning against `--ui`/`--debug`

## Capabilities

### New Capabilities
*(none — maintenance change, no new capabilities)*

### Modified Capabilities
*(none — no behavioral requirements changing)*

## Impact

- `tests/e2e/auth.spec.ts` — ~60 lines removed, tests renumbered, comment added
- `CI.md` — update commands and known-limitations section
