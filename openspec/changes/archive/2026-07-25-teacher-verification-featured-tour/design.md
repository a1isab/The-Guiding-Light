## Context

The platform is a Next.js 16 + Supabase + next-intl app with two course systems:
1. **Public courses** (`courses`/`sections`/`lessons` tables) — seeded with 9 placeholder Islamic courses during development. These are not real teacher content.
2. **Teacher classes** (`classes`/`teacher_courses`/`teacher_sections`/`teacher_lessons`) — teachers create classes, invite students via codes. Classes are private by default (RLS restricts to enrolled students + teacher).

The `profiles` table has `role` (student/teacher/admin) and `roles[]` (multi-role array). There is no verification status column. RLS uses `get_user_role()` SECURITY DEFINER functions to avoid circular recursion.

Current auth pattern: `createApiSupabaseClient()` + Bearer token for API routes; `createAdminClient()` (service role) for server-side data queries bypassing RLS.

## Goals / Non-Goals

**Goals:**
- Remove placeholder public courses and replace with real teacher-authored featured content
- Allow teachers to prove their identity via government documents
- Let admins review and approve/reject teacher verification requests
- Make verified teachers' classes publicly browsable by all students
- Enable one-click class join (no manual invite code entry)
- Provide a guided tour of platform features for all roles

**Non-Goals:**
- Automated document verification (manual admin review only)
- Paid/premium class monetization
- Public lesson commenting or social features on featured classes
- Changing the existing private class / invite code flow for non-verified teachers
- Modifying the onboarding wizard (it already works)

## Decisions

### D1: One migration file for all DB changes
**Choice**: Single `migration-025-teacher-verification.sql` containing the new table, column, RLS policies, and storage bucket.

**Why**: All changes are tightly coupled (verification → is_verified → featured read policies). One migration is easier to review, apply, and rollback. The existing codebase uses single-file migrations for related changes (e.g., migration-004, migration-022).

**Alternative considered**: Separate migrations per feature — rejected because the featured-class RLS policies depend on the `is_verified` column added in the same change.

### D2: One-click join via embedded invite code
**Choice**: The featured page server component fetches each class's `invite_code` and passes it to the client. The "Join" button calls `POST /api/featured/join` with `{ classId, inviteCode }`.

**Why**: Students shouldn't need to manually copy/paste codes. The invite code is already stored on the `classes` table and is not secret (it's shared openly by design). Embedding it in the featured page response is safe because:
- The code is already visible to anyone the teacher shares it with
- RLS ensures only the teacher can see it in the private class context
- For featured classes, the code is intentionally public

**Alternative considered**: Admin-generated public join links — rejected as over-engineered; the existing invite code system works fine.

### D3: Read-only featured class detail (no quizzes/progress)
**Choice**: Featured class detail pages show full lesson content (text + video) but no quizzes, progress tracking, or certificates. Students must join the class to access those features.

**Why**: Keeps the incentive to join. Progress/certificates require enrollment for data integrity. Quizzes need `teacher_quiz_attempts` which requires `student_id` enrollment context.

### D4: driver.js for site tour
**Choice**: Install `driver.js` (~10KB, zero deps) for the guided tour.

**Why**: Lightweight, well-maintained, excellent React integration. Provides element highlighting, popover text, step navigation, and keyboard shortcuts out of the box.

**Alternative considered**: Custom-built tour — rejected because driver.js solves this perfectly with minimal footprint. Shepherd.js is heavier (~30KB).

### D5: Separate browse route for featured classes
**Choice**: Create `/featured/classes/[classId]` as a separate route from `/dashboard/classes/[classId]`.

**Why**: The existing student class detail page (`/dashboard/classes/[classId]`) is tightly coupled to enrollment — it checks `class_members`, queries `teacher_progress`, renders quizzes, etc. Retrofitting non-enrolled access would require extensive conditional logic. A dedicated browse route keeps concerns clean.

### D6: Storage bucket for verification documents
**Choice**: Private bucket `verification-documents` with path structure `{user_id}/{filename}`.

**Why**: Documents contain sensitive PII (government IDs). Must not be publicly accessible. RLS on storage objects limits access to the uploading teacher and admins only.

## Risks / Trade-offs

- **[Risk] RLS performance on featured class queries** → The new policies use multi-table JOINs (classes → profiles, teacher_courses → classes → profiles, etc.). Mitigation: These are simple foreign key lookups, not circular. Add composite indexes on `profiles.user_id + is_verified` and `classes.teacher_id` if query plans are slow.

- **[Risk] Invite code exposure in featured page** → The invite code is embedded in the server-rendered page. Mitigation: The code is already designed to be shared; it expires when used or when the teacher regenerates it. Featured classes are intentionally public.

- **[Risk] Storage costs for verification documents** → Government ID images can be large. Mitigation: Accept standard document formats (JPG, PNG, PDF). The upload form should validate file type and size (max 10MB).

- **[Trade-off] Separate browse vs. unified route** → Two routes for class detail means some code duplication. Mitigation: Extract shared components (lesson content renderer, curriculum tree) into reusable components that both routes import.

- **[Trade-off] driver.js adds a dependency** → New npm package. Mitigation: ~10KB gzipped, zero transitive deps, actively maintained. Acceptable for the UX value.
