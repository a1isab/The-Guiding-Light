## 1. Foundation — Fix All API Routes

- [x] 1.1 Create `src/lib/supabase-api.ts` with `createApiSupabaseClient(request)` (proper cookie getAll/setAll) and `getUserRole(client)` (calls `rpc("get_user_role")`)
- [x] 1.2 Fix `src/app/api/teacher/classes/route.ts` — use shared utility, replace broken client + profile queries
- [x] 1.3 Fix `src/app/api/teacher/sections/route.ts` — use shared utility
- [x] 1.4 Fix `src/app/api/teacher/lessons/route.ts` — use shared utility
- [x] 1.5 Fix `src/app/api/teacher/courses/route.ts` — use shared utility
- [x] 1.6 Fix `src/app/api/teacher/classes/members/route.ts` — use shared utility
- [x] 1.7 Fix `src/app/api/teacher/classes/invite/route.ts` — use shared utility
- [x] 1.8 Fix `src/app/api/teacher/invites/validate/route.ts` — use shared utility
- [x] 1.9 Fix `src/app/api/admin/invites/generate/route.ts` — use shared utility
- [x] 1.10 Fix `src/app/api/admin/quiz/generate/route.ts` — use shared utility
- [x] 1.11 Fix `src/components/teacher/class-form.tsx` — add try-catch around API calls, fix locale-aware redirect URL
- [x] 1.12 Run `npm run lint && npm run typecheck` to verify no regressions

## 2. Quiz System — Database Migration

- [x] 2.1 Create `supabase/migration-006-teacher-quiz.sql` with `teacher_quiz_questions` table (id, lesson_id, question, options JSONB, correct_index, order_index, created_at) + RLS policies (teachers can CRUD their own, students can read without correct_index)
- [x] 2.2 Add `teacher_quiz_attempts` table (id, lesson_id, student_id, score, total, passed, completed_at) + RLS (students insert own, teachers read for their classes)
- [x] 2.3 Run migration against local/dev database

## 3. Quiz System — API Routes

- [x] 3.1 Create `src/app/api/teacher/quiz/generate/route.ts` — POST, accepts lesson content + question count, calls Gemini, returns draft JSON (no persistence)
- [x] 3.2 Create `src/app/api/teacher/quiz/save/route.ts` — POST, upserts questions for a lesson (teacher only)
- [x] 3.3 Create `src/app/api/teacher/quiz/questions/route.ts` — GET, returns questions for a lesson without correct_index (students), or with correct_index (owning teacher)
- [x] 3.4 Create `src/app/api/teacher/quiz/submit/route.ts` — POST, validates lockout, scores answers, records attempt, auto-completes lesson on pass (>=60%)
- [x] 3.5 Create `src/app/api/teacher/quiz/status/route.ts` — GET, returns attempt count, passed status, lock info (locked + retryAfter seconds)

## 4. Quiz System — Teacher UI

- [x] 4.1 Create `src/components/teacher/quiz-editor.tsx` — component with: question list (editable text, 4 options, correct answer selector), "Generate from Content" button (calls Gemini, populates editable fields), "Save Quiz" button, question count selector (3-10)
- [x] 4.2 Integrate quiz-editor into lesson editor page (`src/app/[locale]/teacher/classes/[id]/courses/[courseId]/sections/[sectionId]/lessons/[lessonId]/lesson-editor.tsx`)
- [x] 4.3 Update lesson editor to show quiz section (collapsible, shows "No quiz — Create One" or existing quiz summary)

## 5. Quiz System — Student UI

- [x] 5.1 Create `src/components/teacher/quiz-viewer.tsx` — student quiz component with: radio button questions, submit button, score display, retry message, lockout countdown timer
- [x] 5.2 Update student lesson page (`src/app/[locale]/dashboard/classes/[id]/courses/[courseId]/lessons/[lessonId]/page.tsx`) to check for quiz existence and replace/hide "Mark Complete" button when quiz exists
- [x] 5.3 Integrate quiz-viewer into student lesson page (loads questions via API, handles submit, shows status)

## 6. Document Files — Database & Storage

- [x] 6.1 Create `supabase/migration-007-teacher-files.sql` with `teacher_lesson_files` table (id, lesson_id, teacher_id, filename, mime_type, storage_path, file_size, created_at) + RLS (teachers CRUD own, students read enrolled)
- [x] 6.2 Create `lesson-files` storage bucket via migration, set MIME restrictions (pdf, doc, docx, txt only)
- [x] 6.3 Run migration against local/dev database

## 7. Document Files — API Routes

- [x] 7.1 Create `src/app/api/teacher/files/upload/route.ts` — POST, validates MIME type (pdf/doc/docx/txt only), uploads to storage bucket, inserts metadata row
- [x] 7.2 Create `src/app/api/teacher/files/route.ts` — GET (list files for lessonId), DELETE (delete file by id, verifies ownership)

## 8. Document Files — UI

- [x] 8.1 Create `src/components/teacher/file-upload.tsx` — upload component with drag/drop, file type validation, progress indicator (reuse pattern from video-upload.tsx)
- [x] 8.2 Integrate file-upload into lesson editor — show existing files with delete, upload new files
- [x] 8.3 Update student lesson view — show downloadable file list with name, type icon, download link

## 9. Join by Code — Student Dashboard

- [x] 9.1 Update `src/app/[locale]/dashboard/page.tsx` — add "Join a Class" card with invite code text input and "Join" button
- [x] 9.2 Wire input to call `/api/teacher/invites/validate` and redirect to `/join/[code]` on success
- [x] 9.3 Show inline error message on invalid code

## 10. Progress Page — Quiz Scores

- [x] 10.1 Update student progress view in lesson page — show best quiz score, attempt count, lockout status
- [x] 10.2 Update teacher progress page (`src/app/[locale]/teacher/classes/[id]/progress/page.tsx`) — add quiz score column per lesson per student

## 11. Translations

- [ ] 11.1 Add all new UI strings to `messages/en.json` (quiz editor, quiz viewer, files, join by code, progress scores)
- [ ] 11.2 Sync translations to `messages/ar.json`
- [ ] 11.3 Sync translations to `messages/ur.json`
- [ ] 11.4 Sync translations to `messages/fr.json`

## 12. Verification

- [ ] 12.1 Run `npm run lint && npm run typecheck` — zero errors
- [ ] 12.2 Test full teacher flow: create class → add course → add section → add lesson → upload video → add documents → create quiz (manual + AI generate) → save quiz
- [ ] 12.3 Test full student flow: join class by code → view lesson → download documents → take quiz → fail 3 times → see lockout timer → wait/reset → retake → pass → see lesson complete
- [ ] 12.4 Verify all 4 locales display correctly
- [ ] 12.5 Verify RLS prevents students from reading quiz answers (correct_index hidden)





