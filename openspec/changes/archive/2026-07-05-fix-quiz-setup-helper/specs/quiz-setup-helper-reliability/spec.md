# Quiz Setup Helper Reliability

## Description

Make `createQuizQuestions` use same-origin Next.js API routes instead of cross-origin Supabase REST API calls with manually extracted JWT tokens.

## Requirements

### R1: Same-origin API call
`createQuizQuestions` MUST call `/api/teacher/quiz/save` via same-origin `fetch` within `page.evaluate`, relying on browser auth cookies.

### R2: No JWT extraction
`createQuizQuestions` MUST NOT parse `document.cookie` to extract Supabase auth tokens or make cross-origin calls to `supabase.co/rest/v1/`.

### R3: Correct payload mapping
The `QuizQuestion` interface uses `correct_index` (number). The `/api/teacher/quiz/save` route expects `correctIndex`. The helper MUST map between them.

### R4: Error reporting
If the API route returns a non-2xx response, the helper MUST throw an error containing the HTTP status and response body for debugging.

### R5: Backward-compatible signature
The function signature `createQuizQuestions(teacherPage, lessonId, questions?)` MUST remain unchanged. All existing callers must work without modification.

### R6: No test logic changes
Test files importing `createQuizQuestions` MUST NOT require changes.

## Acceptance Criteria

AC1: The helper no longer references `SUPABASE_URL` or `SUPABASE_ANON_KEY`
AC2: The helper no longer accesses `document.cookie`
AC3: `tests/e2e/quiz-submission.spec.ts` passes all 4 tests without flakiness
AC4: The `/api/teacher/quiz/save` route handles the request correctly (tested implicitly via passing E2E tests)
