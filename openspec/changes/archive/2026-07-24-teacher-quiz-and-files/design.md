## Context

The project is a Next.js 16 Islamic learning platform with Supabase Auth + PostgreSQL, Tailwind v4, next-intl (en/ar/ur/fr), and React 19. All 14+ API route handlers use a broken Supabase SSR client pattern — `setAll() {}` — that silently returns HTML instead of JSON, making the teacher workflow non-functional. The dashboard and proxy middleware already use `rpc("get_user_role")` successfully, proving the fix pattern.

The platform has an existing migration base (003-rbac, 004-teacher-classes) with invite codes, classes, courses, sections, lessons, and student progress tracking. Gemini AI is already integrated for admin quiz generation at `/api/admin/quiz/generate`.

## Goals / Non-Goals

**Goals:**
- Fix all broken API routes so they return proper JSON responses
- Add per-lesson quizzing with teacher manual creation and AI generation (Gemini)
- Add student quiz taking with >=60% passing, 3 attempts → 30-min lockout → 2 retakes (unlimited cycles)
- Add document file support per lesson (pdf, doc, docx, txt)
- Add "Join by Code" text input to student dashboard
- Show quiz scores on the progress page
- Add translations for all new features in all 4 locales
- Ensure all new resources are protected by RLS

**Non-Goals:**
- Not changing the existing video upload system
- Not changing the existing video asset system
- Not adding question types other than multiple choice (MCQ)
- Not adding quiz reporting/analytics beyond basic scores
- Not changing the existing lesson content text/video structure

## Decisions

### 1. Shared API Utility (`src/lib/supabase-api.ts`)
**Decision:** Create a single `createApiSupabaseClient(request)` function that handles cookie parsing/setting, and a `getUserRole(client)` wrapper that calls `rpc("get_user_role")`.
**Rationale:** Eliminates the duplicated broken pattern across 14+ files. The RPC approach is proven (dashboard + proxy already use it). Single source of truth for cookie handling means one fix if Supabase SSR API changes.
**Alternative considered:** "Fix each route individually" — rejected because it duplicates effort and the cookie handling bug is identical in every file.

### 2. Quiz Retake Lockout Mechanism
**Decision:** Count attempts within a rolling 30-minute window. If count >= 3, reject with `locked: true, retryAfter: <seconds until earliest attempt + 30 min>`. After window passes, count resets and 2 attempts are available.
**Rationale:** No complex state machine needed. Pure database query on `teacher_quiz_attempts` with a WHERE `completed_at > now() - interval '30 minutes'`. Stateless and correct.
**Implementation:** The lockout logic lives in the quiz submit API (`/api/teacher/quiz/submit`). It runs BEFORE scoring — if locked, return 429 with retry-after header and remaining seconds.

### 3. Quiz Flow — Generate vs Save
**Decision:** Two separate API calls: `POST /api/teacher/quiz/generate` (Gemini, returns JSON draft, does NOT persist) and `POST /api/teacher/quiz/save` (persists questions to DB).
**Rationale:** The teacher must preview and edit before saving. Gemini generation is stateless — the draft is returned to the client, the teacher edits in the UI, then saves. This matches the user requirement: "Gives a chance for the teacher to see the quiz before publishing/saving."

### 4. Document Storage
**Decision:** Store files in a dedicated `lesson-files` Supabase Storage bucket, restrict uploads to `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`. Metadata in `teacher_lesson_files` table.
**Rationale:** Storage bucket approach matches existing video upload pattern. MIME restriction is enforced both client-side and server-side.
**Alternative considered:** "Store as base64 in DB" — rejected for performance and storage cost reasons.

### 5. Auto-Lesson Completion on Quiz Pass
**Decision:** When a student passes a quiz (>=60%), the submit API writes to the `progress` table automatically, marking the lesson as complete. No separate "Mark Complete" button needed when a quiz exists.
**Rationale:** The user specified "Student must be forced to take quiz before lesson is marked complete." This enforces that. If no quiz exists for a lesson, the existing "Mark Complete" button remains.
**Implementation check:** Before inserting into `progress`, check if a row already exists for `(student_id, lesson_id)` — if so, skip (don't overwrite or duplicate).

### 6. Join by Code
**Decision:** Add a text input card to the student dashboard that accepts an invite code, validates it via the existing `/api/teacher/invites/validate` endpoint, and redirects to `/join/[code]` on success.
**Rationale:** Reuses existing infrastructure. The validate endpoint is broken (setAll issue) — fixing Phase 1 will make it work.

### 7. Gemini Quiz Generation
**Decision:** Adapt the existing admin quiz generate pattern. The new endpoint takes lesson content as input and returns a JSON array of { question, options[], correctIndex }.
**Rationale:** Existing Gemini integration code at `/api/admin/quiz/generate` provides the base pattern. We create a separate teacher endpoint to avoid coupling with admin routing.

## Risks / Trade-offs

- **[Risk] Supabase SSR `createServerClient` API changes between versions** → Mitigation: Shared utility at `src/lib/supabase-api.ts` means one change point
- **[Risk] Gemini API key not configured or rate-limited** → Mitigation: Quiz generation has clear error UI; teacher can always create quizzes manually instead
- **[Risk] Large file uploads hitting storage limits** → Mitigation: Enforce max file size (10MB), provide clear error messages
- **[Risk] RLS policy mistakes could expose quiz answers** → Mitigation: All new tables have strict RLS — `teacher_quiz_questions.correct_index` is readable by teachers only, not students
- **[Risk] Cookie handling doesn't work in Edge runtime** → Mitigation: All API routes use Node.js runtime (not Edge). The shared utility can be adapted if needed
- **[Trade-off] Unlimited retake cycles** → The 30-minute lockout provides a natural cooldown. Without infinite cycles, a single network issue could permanently block a student
