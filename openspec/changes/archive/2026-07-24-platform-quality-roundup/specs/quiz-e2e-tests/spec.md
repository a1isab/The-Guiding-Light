## ADDED Requirements

### Requirement: Quiz submission pass/fail test
The E2E test SHALL submit quiz answers for a teacher lesson and verify the scoring response.

#### Scenario: Correct answers return passing score
- **WHEN** a student submits all correct answers for a teacher lesson quiz
- **THEN** the response SHALL contain `{ passed: true, score: N, total: N }`

#### Scenario: Wrong answers return failing score
- **WHEN** a student submits all incorrect answers for a teacher lesson quiz
- **THEN** the response SHALL contain `{ passed: false, score: 0, total: N }`

### Requirement: Quiz lockout test
The E2E test SHALL verify the 3-fail lockout behavior by submitting 3 failing attempts within the time window.

#### Scenario: Third fail returns lockout
- **WHEN** a student submits 3 consecutive failing quiz attempts for the same lesson
- **THEN** the third response SHALL have HTTP 429 with `{ locked: true, retryAfter: N }`

### Requirement: Quiz auto-complete lesson test
The E2E test SHALL verify that passing a quiz auto-records lesson completion.

#### Scenario: Quiz pass creates teacher_progress record
- **WHEN** a student passes a teacher lesson quiz
- **THEN** a corresponding `teacher_progress` record with `completed_at` is created

### Requirement: Quiz submission via page.evaluate
The E2E test SHALL use `page.evaluate` with native `fetch` to submit quiz answers directly to the API, using the student's auth cookies from the browser context.

#### Scenario: Quiz submission uses authenticated fetch
- **WHEN** a student is logged in and the test calls `page.evaluate` to POST to `/api/teacher/quiz/submit`
- **THEN** the request carries the student's Supabase auth cookie and succeeds
