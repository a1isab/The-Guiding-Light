## Why

The `createQuizQuestions` E2E helper (`tests/e2e/helpers/quiz-setup.ts`) intermittently fails because it calls the Supabase REST API cross-origin with a manually extracted JWT. This causes auth failures (403 Forbidden) when the cookie-extracted token doesn't match the SSR auth context — making quiz-submission E2E tests flaky.

## What Changes

- Rewrite `createQuizQuestions` to call the existing `/api/teacher/quiz/save` Next.js API route instead of hitting `supabase.co/rest/v1/` directly
- Remove the manual JWT extraction logic (cookie parsing + `atob` decoding)
- Remove the two-step `page.evaluate` pattern (extract token → make cross-origin calls)
- The helper becomes a simple same-origin `fetch` via `page.evaluate`, same as `apiPost` in `teacher-setup.ts`
- No changes to test assertions or test logic — only the data-seeding mechanism

## Capabilities

### New Capabilities
- `quiz-setup-helper-reliability`: Make `createQuizQuestions` use same-origin API routes instead of cross-origin Supabase REST API calls, eliminating JWT extraction and CORS issues

### Modified Capabilities

None.

## Impact

- `tests/e2e/helpers/quiz-setup.ts` — rewritten
- `tests/e2e/quiz-submission.spec.ts` — no changes needed (only the helper changes)
- No API changes, no package changes, no DB changes
