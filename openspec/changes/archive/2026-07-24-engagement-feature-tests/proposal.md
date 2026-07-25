## Why

The engagement features (discussions, assignments, analytics, certificates, bookmarks, announcements) were shipped with zero E2E test coverage. The existing 24 tests only cover auth, student dashboard/quiz, and teacher class management. These new features involve multi-role interactions (teacher creates assignment → student submits → teacher grades) and cross-component state that unit tests can't catch. We need functional Playwright tests to verify the full flows work end-to-end.

## What Changes

- Add a new `engagement.spec.ts` Playwright test file with 11 functional test cases covering all 6 engagement features
- Fix the `SubmissionList` component bug: submissions are never fetched (uses `useState` callback instead of `useEffect`, empty `lessonId` param in fetch URL)
- Add missing `data-testid` attributes: `certificates-section` wrapper, `assignment-section` header
- Extract shared test utilities (`loginAs`, `decodeSupabaseCookie`, `getAccessToken`, `enrollStudent`) into `tests/e2e/helpers/auth.ts` to reduce duplication

## Capabilities

### New Capabilities
- `engagement-e2e-tests`: Functional E2E tests for all 6 engagement features — lesson discussions, assignments/submissions/grading, bookmarks, announcements, certificates, and teacher analytics

### Modified Capabilities
_(none — no existing specs in openspec/specs/)_

## Impact

- **Tests**: New `tests/e2e/engagement.spec.ts` file (~11 test cases)
- **Components**: `SubmissionList` bug fix (`submission-list.tsx` line 29-37), missing testids on `CertificatesSection`, `AssignmentSection`
- **Test helpers**: New shared `tests/e2e/helpers/auth.ts`
- **Dependencies**: No new packages needed
