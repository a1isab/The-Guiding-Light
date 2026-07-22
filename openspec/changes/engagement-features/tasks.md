## 1. Database & Infrastructure

- [x] 1.1 Create Supabase migration for all 6 new tables: `lesson_comments`, `assignments`, `submissions`, `certificates`, `bookmarks`, `announcements`, `announcement_reads`
- [x] 1.2 Add RLS policies for all new tables (students see own data, teachers manage class data, admin bypass)
- [x] 1.3 Create database indexes for performance: `(lesson_id)` on lesson_comments, `(lesson_id)` on assignments, `(student_id, lesson_id)` on submissions, `(user_id)` on bookmarks, `(class_id)` on announcements
- [ ] 1.4 Create Supabase Storage bucket `assignment-submissions` with 10MB file limit
- [x] 1.5 Add `recharts` and `@react-pdf/renderer` dependencies to package.json

## 2. Lesson Discussions (Q&A)

- [x] 2.1 Create API route `POST /api/student/lessons/comments` — post a comment on a lesson
- [x] 2.2 Create API route `DELETE /api/student/lessons/comments` — delete own comment (or teacher delete any)
- [x] 2.3 Create API route `GET /api/student/lessons/comments` — fetch comments for a lesson (with author info)
- [x] 2.4 Create `CommentThread` component — renders threaded comments with author, timestamp, reply/delete buttons
- [x] 2.5 Create `CommentForm` component — textarea with submit button for posting new comments and replies
- [x] 2.6 Integrate `CommentThread` into `lesson-content-view.tsx` below the quiz section
- [x] 2.7 Add data-testid attributes for comment form, comment items, reply buttons
- [ ] 2.8 Write Playwright tests for posting, replying, and deleting comments

## 3. Assignments / Homework

- [x] 3.1 Create API route `POST /api/teacher/assignments` — create assignment for a lesson
- [x] 3.2 Create API route `PUT /api/teacher/assignments` — update assignment
- [x] 3.3 Create API route `GET /api/teacher/assignments` — list assignments for a class
- [x] 3.4 Create API route `POST /api/student/submissions` — submit text + files for an assignment
- [x] 3.5 Create API route `PUT /api/teacher/submissions/grade` — grade a submission with score + feedback
- [x] 3.6 Create API route `GET /api/student/submissions` — fetch own submissions for a class
- [x] 3.7 Create `AssignmentForm` component — teacher form for creating/editing assignments
- [x] 3.8 Create `SubmissionForm` component — student form with text area + file upload (max 3 files, 10MB each)
- [x] 3.9 Create `SubmissionList` component — teacher view showing all submissions with status and grade actions
- [x] 3.10 Create `SubmissionStatus` component — student view showing their submission status, score, feedback
- [x] 3.11 Add assignment section to teacher lesson editor page
- [x] 3.12 Add assignment/submission section to student lesson page
- [ ] 3.13 Add data-testid attributes for all assignment/submission components
- [ ] 3.14 Write Playwright tests for creating assignments, submitting, and grading

## 4. Teacher Analytics Dashboard

- [x] 4.1 Create API route `GET /api/teacher/analytics/:classId` — compute class overview metrics
- [x] 4.2 Create API route `GET /api/teacher/analytics/:classId/quizzes` — quiz score distribution
- [x] 4.3 Create API route `GET /api/teacher/analytics/:classId/completion` — completion timeline data
- [x] 4.4 Create API route `GET /api/teacher/analytics/:classId/at-risk` — at-risk student list
- [x] 4.5 Create API route `GET /api/teacher/analytics/:classId/lessons` — per-lesson completion rates
- [x] 4.6 Create `AnalyticsOverview` component — metric cards (students, avg score, completion, at-risk)
- [x] 4.7 Create `QuizScoreChart` component — bar chart showing score distribution using recharts
- [x] 4.8 Create `CompletionTimeline` component — line chart showing completions over 30 days
- [x] 4.9 Create `AtRiskList` component — table of at-risk students with last active date
- [x] 4.10 Create `LessonBreakdown` component — per-lesson completion with progress bars
- [x] 4.11 Create analytics page at `teacher/classes/[id]/analytics/page.tsx`
- [x] 4.12 Add analytics tab/link to teacher class navigation
- [ ] 4.13 Add data-testid attributes for all analytics components
- [ ] 4.14 Write Playwright tests for analytics page rendering

## 5. Certificates

- [x] 5.1 Create API route `GET /api/student/certificates` — list earned certificates
- [x] 5.2 Create API route `GET /api/student/certificates/:id` — get certificate details
- [x] 5.3 Add certificate auto-generation logic to mark-viewed API (check course completion)
- [x] 5.4 Create `CertificateCard` component — styled card showing certificate details
- [x] 5.5 Create `CertificatePDF` component — React-PDF renderer for downloadable certificate
- [x] 5.6 Add "Certificates" section to student dashboard page
- [x] 5.7 Add certificate settings to teacher class settings (custom title, logo URL)
- [ ] 5.8 Add data-testid attributes for certificate components
- [ ] 5.9 Write Playwright tests for certificate generation and display

## 6. Bookmarks

- [x] 6.1 Create API route `POST /api/student/bookmarks` — toggle bookmark on a lesson
- [x] 6.2 Create API route `GET /api/student/bookmarks` — list bookmarked lessons
- [x] 6.3 Create `BookmarkButton` component — toggle icon with optimistic UI (outline ↔ filled)
- [x] 6.4 Add `BookmarkButton` to student lesson page header
- [x] 6.5 Create "Saved Lessons" section on student dashboard
- [x] 6.6 Add data-testid attributes for bookmark button and saved lessons section
- [x] 6.7 Write Playwright tests for bookmarking/unbookmarking and dashboard display

## 7. Announcements

- [x] 7.1 Create API route `POST /api/teacher/announcements` — post announcement to a class
- [x] 7.2 Create API route `DELETE /api/teacher/announcements` — delete announcement
- [x] 7.3 Create API route `GET /api/student/announcements` — fetch announcements with read status
- [x] 7.4 Create API route `POST /api/student/announcements/read` — mark announcements as read
- [x] 7.5 Create `AnnouncementBanner` component — displays announcements at top of class page
- [x] 7.6 Create `AnnouncementForm` component — teacher form for posting announcements
- [x] 7.7 Add unread count badge to student dashboard class cards
- [x] 7.8 Add announcement management section to teacher class page
- [ ] 7.9 Add data-testid attributes for announcement components
- [ ] 7.10 Write Playwright tests for posting, viewing, and read-tracking announcements

## 8. i18n & Polish

- [ ] 8.1 Add English translation keys for all 6 features (discussions, assignments, analytics, certificates, bookmarks, announcements)
- [ ] 8.2 Add `data-testid` attributes to all new components for E2E testing
- [ ] 8.3 Update teacher class page navigation to include new tabs (Analytics, Announcements)
- [ ] 8.4 Update student dashboard layout to include Saved Lessons and Certificates sections
- [ ] 8.5 Run full test suite and fix any regressions
- [ ] 8.6 Commit and push all changes
