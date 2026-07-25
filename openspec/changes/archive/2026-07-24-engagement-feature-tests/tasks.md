## 1. Bug Fixes & Data-testid Attributes

- [ ] 1.1 Fix `SubmissionList` component — replace broken `useState` callback with `useEffect` that fetches submissions from `/api/student/submissions?assignmentId=X` and sets state correctly
- [ ] 1.2 Add `data-testid="certificates-section"` to `CertificatesSection` wrapper div
- [ ] 1.3 Add `data-testid="assignment-section"` to AssignmentSection header in `lesson-content-view.tsx`

## 2. Shared Test Helpers

- [ ] 2.1 Create `tests/e2e/helpers/auth.ts` with `loginAs`, `decodeSupabaseCookie`, `getAccessToken`, `getStudentUserId`, `enrollStudent`
- [ ] 2.2 Update `student.spec.ts` to import from shared auth helpers
- [ ] 2.3 Update `teacher.spec.ts` to import from shared auth helpers
- [ ] 2.4 Update `admin-templates.spec.ts` to import from shared auth helpers

## 3. Engagement E2E Tests — Setup

- [ ] 3.1 Create `tests/e2e/engagement.spec.ts` with test.describe groups and `beforeAll` setup (teacher + student contexts, class creation, enrollment)

## 4. Engagement E2E Tests — Discussions

- [ ] 4.1 Test: student posts a comment on a lesson and it appears in the thread
- [ ] 4.2 Test: student replies to a comment and reply appears nested

## 5. Engagement E2E Tests — Assignments & Submissions

- [ ] 5.1 Test: teacher creates assignment via lesson editor form
- [ ] 5.2 Test: student submits assignment and sees "Submitted" status
- [ ] 5.3 Test: teacher grades submission and score appears in submission list
- [ ] 5.4 Test: student sees graded result with score and feedback

## 6. Engagement E2E Tests — Bookmarks

- [ ] 6.1 Test: student toggles bookmark on lesson (Save → Saved → Save)

## 7. Engagement E2E Tests — Announcements

- [ ] 7.1 Test: teacher posts announcement on class page
- [ ] 7.2 Test: student sees announcement banner on class detail page

## 8. Engagement E2E Tests — Analytics & Certificates

- [ ] 8.1 Test: teacher views analytics page with stat cards and charts
- [ ] 8.2 Test: certificates section renders on student dashboard when certificates exist

## 9. Verification

- [ ] 9.1 Run `npx tsc --noEmit` — typecheck passes
- [ ] 9.2 Run full E2E test suite — all tests pass with no regressions
