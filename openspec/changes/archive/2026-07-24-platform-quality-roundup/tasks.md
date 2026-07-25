## 1. Teacher Progress Tracking (Migration + API + Viewed Endpoint)

- [ ] 1.1 Create `supabase/migration-013-teacher-progress.sql` with `teacher_progress` table, RLS policies, and indexes
- [ ] 1.2 Update `src/app/api/student/lessons/viewed/route.ts` to write to `teacher_progress` for teacher lessons (detect by trying `teacher_lessons` first, fallback to `lessons`)
- [ ] 1.3 Update `src/app/api/teacher/quiz/submit/route.ts` to write completion to `teacher_progress` instead of `progress`

## 2. Class Invite Validation Fix

- [ ] 2.1 Create `src/app/api/student/invites/validate/route.ts` — new endpoint querying `classes.invite_code`
- [ ] 2.2 Update `src/components/join-class-card.tsx` to call `/api/student/invites/validate` instead of `/api/teacher/invites/validate`

## 3. Quiz Submission E2E Tests

- [ ] 3.1 Create `tests/e2e/helpers/quiz-setup.ts` — helper that generates quiz questions for a teacher lesson via direct API (injects into `teacher_quiz_questions`)
- [ ] 3.2 Create `tests/e2e/quiz-submission.spec.ts` with tests for: passing score, failing score, 3-fail lockout (429), and auto-complete verification

## 4. Password Reset Flow

- [ ] 4.1 Add "Forgot password?" link to `src/app/[locale]/auth/login/page.tsx`
- [ ] 4.2 Create `src/app/[locale]/auth/forgot-password/page.tsx` — email input form that calls `supabase.auth.resetPasswordForEmail()`
- [ ] 4.3 Update `src/app/[locale]/auth/callback/route.ts` to handle `type=recovery` redirect to reset-password page
- [ ] 4.4 Create `src/app/[locale]/auth/reset-password/page.tsx` — new password form that calls `supabase.auth.updateUser({ password })`

## 5. Codebase Cleanup

- [ ] 5.1 Update all imports from `@/lib/supabase-server` to `@/lib/supabase` across the codebase
- [ ] 5.2 Delete `src/lib/supabase-server.ts`
- [ ] 5.3 Verify `src/lib/gemini.ts` has no active imports; delete if unused
- [ ] 5.4 Run `npm run build` to confirm no errors

## 6. Verify

- [ ] 6.1 Run full E2E test suite: `npm run test:e2e`
- [ ] 6.2 Run build: `npm run build`
