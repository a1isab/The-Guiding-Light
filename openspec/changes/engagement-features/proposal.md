## Why

The Guiding Light currently supports course delivery (lessons, quizzes, progress tracking) but lacks the interactive and social features that drive student retention and teacher effectiveness. Students consume content passively with no way to ask questions, save material, or receive updates. Teachers have no assignment workflow, no class announcements, and no visual analytics. Adding these features transforms the platform from a content repository into an active learning community.

## What Changes

- **Lesson Discussions (Q&A)**: Students and teachers can post threaded comments on any lesson. Students ask clarifying questions about Islamic content; teachers and peers respond. Supports the educational mission directly.
- **Assignments / Homework**: Teachers create assignments attached to lessons with text or file submissions. Students submit work. Teachers review, grade, and provide feedback. Completes the teacher-student feedback loop.
- **Teacher Analytics Dashboard**: Visual charts on class performance — quiz score averages, completion rates, at-risk students (low streak), enrollment trends. Teachers currently have a raw student table but no actionable insights.
- **Certificates of Completion**: When a student completes all lessons in a course, they receive a downloadable PDF certificate. Teachers can customize branding. Drives completion motivation and shareability.
- **Bookmarks / Saved Lessons**: Students can bookmark any lesson for later. A "Saved" section in the dashboard provides quick access. Reduces friction for revisiting content.
- **Class Announcements**: Teachers post announcements (text, optional link) to their classes. Displayed as a banner/notification on the student's class page. Keeps students informed without email.

## Capabilities

### New Capabilities

- `lesson-discussions`: Threaded comment system on lessons — students ask questions, teachers/peers reply. Includes CRUD operations, threading, and real-time display.
- `assignments`: Teacher-created assignments with student submissions, grading workflow, and feedback. Covers the full assignment lifecycle.
- `teacher-analytics`: Dashboard visualizations for teachers — class performance metrics, student engagement tracking, at-risk identification.
- `certificates`: Automated certificate generation when students complete a course. PDF download with teacher branding.
- `bookmarks`: Student bookmarking of lessons with a saved-items view on the dashboard.
- `announcements`: Teacher-to-class announcements with display on student class pages and notification indicators.

### Modified Capabilities

(none — all are new capabilities)

## Impact

- **Database**: 6 new tables (`lesson_comments`, `assignments`, `submissions`, `certificates`, `bookmarks`, `announcements`) plus potential views for analytics aggregation
- **API Routes**: ~15 new API routes across `/api/student/` and `/api/teacher/`
- **Pages**: New dashboard sections (saved lessons, certificates), new teacher pages (analytics, assignment management, announcements), comment sections on lesson pages
- **Components**: ~10 new React components (comment thread, assignment form, submission viewer, charts, bookmark button, announcement banner, certificate preview)
- **Dependencies**: Chart library (recharts or similar) for analytics, PDF generation library (e.g., `@react-pdf/renderer`) for certificates
- **Existing code affected**: Lesson page (`lesson-content-view.tsx`) needs comment section appended; teacher class page needs new tabs; student dashboard needs bookmark/certificate sections; quiz viewer may link to assignments
