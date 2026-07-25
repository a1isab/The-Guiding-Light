## Why

The 14+ API routes use a broken Supabase SSR client pattern (`setAll() {}`) that silently returns HTML instead of JSON, making the entire teacher workflow non-functional. Separately, the learning platform lacks quiz/retake mechanics and document file support, which are essential for a complete educational experience.

## What Changes

- Fix all 14 broken API routes by creating a shared `createApiSupabaseClient()` utility with proper cookie handling and moving role checks to `rpc("get_user_role")` instead of direct profile queries
- Add try-catch and locale-aware redirect to `class-form.tsx`
- Add per-lesson quiz system: teacher creates or AI-generates MCQs, students take with retake/lockout mechanics
- Add document file support (pdf, doc, docx, txt) per lesson — upload, list, download
- Add "Join by Code" text input to student dashboard
- Update progress page with quiz scores
- Add translations for all new features across 4 locales (en, ar, ur, fr)

## Capabilities

### New Capabilities
- `api-routes-fix`: Fix all broken API routes with shared utility, proper cookies, and RPC-based role checks
- `lesson-quiz`: Per-lesson quizzing with teacher creation/AI generation, preview, student taking, score calculation, retake/lockout
- `lesson-documents`: Document file support per lesson (pdf, doc, docx, txt) with upload, list, delete, download
- `class-join-by-code`: Student dashboard "Join by Code" text input
- `quiz-progress`: Progress page updates showing quiz attempt scores alongside lesson completion

### Modified Capabilities

None — all capabilities are new.

## Impact

- **API routes**: 14 files in `src/app/api/` — new shared utility at `src/lib/supabase-api.ts`
- **DB**: 3 new migrations — `teacher_quiz_questions`, `teacher_quiz_attempts`, `teacher_lesson_files` tables + RLS
- **Storage**: New `lesson-files` bucket (restricted to pdf/doc/docx/txt)
- **Components**: New `quiz-editor`, `quiz-viewer`, `file-upload` components
- **Pages**: Student lesson view, teacher lesson editor, progress page, dashboard, 4x locale files
- **External**: Gemini API integration for quiz generation (existing pattern in `/api/admin/quiz/generate`)
