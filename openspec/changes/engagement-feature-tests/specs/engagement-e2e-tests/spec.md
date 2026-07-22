# engagement-e2e-tests

## Purpose

Functional E2E tests for all 6 engagement features using Playwright with Chromium.

## Test Cases

### Discussions (Lesson Q&A)
1. **Student posts a comment** — Navigate to a teacher-created lesson → type in comment textarea → click submit → comment appears in thread
2. **Student replies to comment** — Post a comment → click Reply button → type reply → submit → reply appears nested under parent

### Assignments & Submissions
3. **Teacher creates assignment** — Navigate to teacher lesson editor → fill assignment form (title, description, max score) → save → assignment saved
4. **Student submits assignment** — Navigate to student lesson view with assignment → fill submission textarea → submit → status shows "Submitted"
5. **Teacher grades submission** — Navigate to teacher lesson editor → submission list shows student submission → click Grade → enter score + feedback → save → status updates to graded
6. **Student sees graded result** — After grading → navigate to student lesson → submission status shows score and feedback

### Bookmarks
7. **Student toggles bookmark** — Navigate to lesson → click bookmark button → text changes to "Saved" → click again → text changes to "Save"

### Announcements
8. **Teacher posts announcement** — Navigate to teacher class page → fill announcement form (title, body) → post → success feedback
9. **Student sees announcement banner** — Navigate to student class detail page → announcement banner is visible with the posted title

### Analytics
10. **Teacher views analytics** — Navigate to class analytics page → stat cards render (total students, avg score, completion, at-risk) → chart elements visible

### Certificates
11. **Certificates section visible** — Seed a certificate via API → navigate to student dashboard → certificates section renders with certificate card

## Setup Requirements

Each test group requires:
- A teacher account (seeded via `loginAs` with `teacher@theguidinglight.com`)
- A student account (seeded via `loginAs` with `student@theguidinglight.com`)
- A class with at least one course, section, and lesson (created via `setupTeacherLesson`)
- Student enrolled in the class (via `enrollStudent` API call)

## Data-testid Elements Used

| Feature | testid | Element |
|---|---|---|
| Comments | `comment-input` | Textarea |
| Comments | `comment-submit` | Submit button |
| Comments | `comment-item` | Comment wrapper |
| Comments | `comment-reply-btn` | Reply button |
| Assignments | `assignment-form` | Form container |
| Assignments | `assignment-title` | Title input |
| Assignments | `assignment-save` | Save button |
| Submissions | `submission-form` | Form container |
| Submissions | `submission-body` | Answer textarea |
| Submissions | `submission-submit` | Submit button |
| Submissions | `submission-status` | Status card |
| Grading | `submission-list` | List container |
| Grading | `grade-btn` | Grade button |
| Grading | `grade-score-input` | Score input |
| Grading | `grade-feedback-input` | Feedback textarea |
| Grading | `grade-submit` | Save Grade button |
| Bookmarks | `bookmark-button` | Toggle button |
| Announcements | `announcement-form` | Form container |
| Announcements | `announcement-title` | Title input |
| Announcements | `announcement-body` | Body textarea |
| Announcements | `announcement-post` | Post button |
| Announcements | `announcement-banner` | Banner container |
| Analytics | `stat-total-students` | Students count |
| Analytics | `stat-avg-score` | Avg score |
| Analytics | `stat-completion` | Completion rate |
| Analytics | `stat-at-risk` | At-risk count |
| Analytics | `quiz-score-chart` | Bar chart |
| Analytics | `completion-timeline` | Line chart |
| Certificates | `certificate-card` | Certificate card |
