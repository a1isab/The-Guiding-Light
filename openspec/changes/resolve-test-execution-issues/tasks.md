## 1. Remove email-triggering tests from auth.spec.ts

- [x] 1.1 Remove signup-flow describe block (tests 4.1–4.4), keeping only the comment header
- [x] 1.2 Remove verify-page describe block except test 4.7 (no-session redirect)
- [x] 1.3 Remove test 4.10 (forgot password shows sent confirmation)
- [x] 1.4 Add comment block at top explaining why email-triggering tests are removed and conditions for re-enabling

## 2. Renumber remaining tests

- [x] 2.1 Renumber remaining tests sequentially: 4.4→4.1, 4.7→4.2, 4.8→4.3/4.4, 4.9→4.5, 4.11→4.6, 4.12→4.7

## 3. Update CI.md with correct test commands

- [x] 3.1 Add section warning against `--ui` and `--debug` flags
- [x] 3.2 Document that `npm run test:e2e` is the correct local command
- [x] 3.3 Document the removed email-triggering tests as a known gap

## 4. Verify the suite passes

- [x] 4.1 Run the remaining auth tests to confirm they pass
- [x] 4.2 Run the full test suite — 24 passed, 8 pre-existing failures (student + teacher progress, unrelated to this change). No regressions from the email-removal/logout-fix.
