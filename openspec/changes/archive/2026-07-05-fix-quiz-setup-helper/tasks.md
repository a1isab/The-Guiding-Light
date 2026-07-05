# Tasks

- [x] ## Task 1: Rewrite createQuizQuestions

**File:** `tests/e2e/helpers/quiz-setup.ts`

- Remove the `SUPABASE_URL` and `SUPABASE_ANON_KEY` constants
- Remove the first `page.evaluate` (JWT extraction from cookies)
- Remove the second `page.evaluate` (cross-origin DELETE + POSTs)
- Add a single `page.evaluate` that POSTs to `/api/teacher/quiz/save`
- Map `correct_index` → `correctIndex` in the payload
- On non-2xx response, throw with status and body
- Keep: `QuizQuestion` interface, `defaultQuestions()`, function signature

- [x] ## Task 2: Verify

Run the quiz-submission E2E tests 3 times consecutively to confirm no flakiness.

```bash
npm run test:e2e -- --workers=1 tests/e2e/quiz-submission.spec.ts
```

- [x] ## Task 3: Run full E2E suite

Run the full E2E suite to confirm no regressions.

```bash
npm run test:e2e -- --workers=1
```
