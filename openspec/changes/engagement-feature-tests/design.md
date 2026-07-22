## Context

The project uses Playwright for E2E testing with Chromium, running in headless mode with 2 workers. Tests are in `tests/e2e/` with helpers in `tests/e2e/helpers/`. The existing test infrastructure uses:

- `setupTeacherLesson(page)` helper that creates a class (UI), course/section/lesson (API), and returns IDs + JWT
- Multi-context pattern for teacher+student tests (separate browser contexts per role)
- `page.evaluate(fetch(...))` for API calls with auth tokens extracted from Supabase cookies
- `test.describe.configure({ timeout: 120000 })` on all major describe blocks

6 engagement features were recently added with zero test coverage. They span both student-facing and teacher-facing components across multiple pages and API routes.

## Goals / Non-Goals

**Goals:**
- Functional E2E tests for all 6 engagement features (discussions, assignments, submissions/grading, bookmarks, announcements, certificates, analytics)
- Fix the `SubmissionList` bug that prevents teacher grading from working
- Add missing `data-testid` attributes needed by tests
- Extract duplicated auth helpers into a shared module

**Non-Goals:**
- Performance/load testing
- Visual regression testing
- API-only tests (all tests go through UI flows or setup via API then assert via UI)
- Testing certificate PDF generation (no UI for it yet)
- ar/ur/fr i18n translations for new features

## Decisions

### 1. Single spec file vs per-feature spec files
**Decision**: Single `engagement.spec.ts` with grouped `test.describe` blocks per feature.

**Rationale**: The 11 tests share the same setup pattern (teacher creates class → student enrolls). A single file avoids duplicating `beforeAll` setup across 6 files. Each `test.describe` block handles its own setup.

### 2. Test setup strategy
**Decision**: Use `test.beforeAll` with `setupTeacherLesson` for shared class/course/lesson creation, then per-test API calls to create feature-specific data (comments, assignments, announcements).

**Rationale**: `setupTeacherLesson` already handles the complex multi-step class creation. Feature-specific data (assignments, announcements) is lightweight and faster to create via API in `beforeAll` than duplicating full UI flows.

### 3. Bug fix approach for SubmissionList
**Decision**: Replace the broken `useState` callback with a proper `useEffect` that fetches submissions from `/api/student/submissions?assignmentId=X` (student endpoint) with the teacher's auth context.

**Rationale**: The current code uses `useState(() => {...})` which is not guaranteed to run reliably, and the fetch URL has an empty `lessonId` param causing a 400. The submissions are never loaded into state. Using `useEffect` is the React-correct pattern for side effects on mount.

### 4. Shared auth helpers
**Decision**: Create `tests/e2e/helpers/auth.ts` with `loginAs`, `decodeSupabaseCookie`, `getAccessToken`, `getStudentUserId`, `enrollStudent`.

**Rationale**: These 5 functions are duplicated across `student.spec.ts`, `teacher.spec.ts`, and `admin-templates.spec.ts`. Extracting them reduces maintenance burden and ensures consistency. Existing files will be updated to import from the shared module.

### 5. Multi-context test isolation
**Decision**: Each test group creates its own teacher and student contexts in `beforeAll`, enrolls the student, then closes setup contexts. Individual tests use a fresh page from the shared context.

**Rationale**: Follows the existing pattern in `student.spec.ts` (test 8.1) and `teacher.spec.ts` (tests 6.8/6.9). Prevents state leakage between test groups.

## Risks / Trade-offs

- **[Flaky multi-role tests]** → Mitigation: Use `waitForLoadState("networkidle")` after navigation and `page.evaluate` for API-heavy setup to avoid UI timing issues
- **[Database state pollution]** → Mitigation: Each test group creates its own class with unique timestamp name; no shared state between describe blocks
- **[SubmissionList bug fix scope]** → The fix changes how submissions are fetched on the teacher lesson editor page. If the submissions API endpoint has issues, the grading UI will still be broken. Mitigation: The test for grading (test 5) verifies the full flow end-to-end.
