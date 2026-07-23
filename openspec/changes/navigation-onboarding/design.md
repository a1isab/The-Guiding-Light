## Context

The Guiding Light is a Next.js 16 Islamic education platform with three user roles: student, teacher, admin. The app has a deep nesting pattern (Dashboard → Class → Course → Lesson = 4 levels). Currently:

- **No breadcrumbs** on any dashboard/teacher/admin pages (only one public lesson page has them)
- **No active sidebar state** — teacher and admin sidebars show identical styling regardless of current page
- **No lesson-to-lesson navigation** — students must go back to the course page to find the next lesson
- **Student curriculum page** queries the wrong progress table (`progress` instead of `teacher_progress`), so teacher-lesson completion checkmarks never display
- **Student curriculum sections** have a static `ChevronDown` icon that looks interactive but isn't
- **The `onboarded` column** on `profiles` exists but is never read or written — no onboarding flow exists
- **No display names** — student greeting says "Student", teacher views show raw UUIDs for student IDs

## Goals / Non-Goals

**Goals:**
- Users always know where they are and how to navigate up/across
- Teachers and admins see which page is active in their sidebar
- Students can move sequentially through lessons without returning to the course page
- New users receive a personalized onboarding experience that tailors the platform to their interests and level
- The student curriculum correctly reflects teacher-created content completion

**Non-Goals:**
- Mobile navigation for teacher/admin sidebars (separate future work)
- Auto-save or unsaved-changes warnings in the lesson editor
- Success toasts or error boundaries (separate feature)
- Modifying the existing public `CourseCurriculum` component (student dashboard gets its own)
- Changing the auth flow or middleware (no middleware exists; interception happens in page components)

## Decisions

### D1: Breadcrumb implementation — client component, not server-rendered

**Decision:** Client component using `useTranslations` and accepting a static `items` array.

**Why:** Server components can't use `usePathname()` which we'd need if breadcrumbs were self-aware. Instead, each page server-renders the breadcrumb data (labels, hrefs) and passes it to a thin client component. This keeps the breadcrumbs lightweight (no extra queries) while allowing hover transitions and responsive behavior.

**Alternative considered:** Self-aware server component that reads `params` — rejected because it would need to query every parent entity to get names, adding N extra queries per page.

### D2: Active sidebar — client wrapper, not per-page server conditional

**Decision:** Extract nav rendering into a `SidebarNav` client component that uses `usePathname()`.

**Why:** The layouts are server components. We can't use hooks in them. A small client wrapper keeps the layout as a server component (preserving auth checks and SSR) while only the nav portion is client-rendered.

**Alternative considered:** Passing `currentPath` as a prop from the server layout using `headers()` — rejected because Next.js headers don't reliably contain the pathname in all rendering contexts.

### D3: Student curriculum — new component, not modifying CourseCurriculum

**Decision:** Create `StudentCurriculum` as a separate component with different link format and progress data source.

**Why:** The public `CourseCurriculum` uses slug-based URLs (`/courses/{slug}/{sectionSlug}/{lessonSlug}`) while the student dashboard uses UUID-based URLs (`/dashboard/classes/{id}/courses/{courseId}/lessons/{lessonId}`). Forcing both into one component would require prop-driving the URL format, making it harder to maintain. The student version also needs `teacher_progress` instead of `progress`.

### D4: Prev/next navigation — server-side computation, not client-side fetch

**Decision:** The lesson page server component queries all course lessons and computes prev/next before rendering.

**Why:** The course curriculum page already demonstrates this query pattern (sections → lessons → ordered list). Computing prev/next on the server avoids an extra client-side fetch and ensures the navigation is available immediately on page load (no loading flash). The query is lightweight (select id, title, order_index from ~5-20 lessons).

### D5: Onboarding — page-level interception, not middleware

**Decision:** Check `profile.onboarded` in the dashboard/teacher layout server components and redirect to `/onboarding` if false.

**Why:** There is no middleware in this project. Adding one would require restructuring the entire auth flow (currently each layout/page does its own `createServerSupabaseClient().auth.getUser()` check). Page-level interception is consistent with the existing pattern and avoids a risky refactor.

### D6: Onboarding data storage — JSONB column, not individual columns

**Decision:** Store all onboarding answers in a single `onboarding_data jsonb` column.

**Why:** The onboarding answers are write-once, read-rarely (for future personalization). A JSONB column avoids schema changes if we add/remove onboarding questions. The `display_name` and `level` are extracted into proper columns since they're used frequently in queries and display.

### D7: Step animation — CSS transitions, not framer-motion

**Decision:** Use CSS `transition` and conditional rendering for step transitions.

**Why:** Adding framer-motion (~30kB gzipped) for a single onboarding page is overkill. CSS `opacity` + `translateY` transitions with `AnimatePresence`-like patterns (keyed rendering) achieve smooth step changes without the dependency.

## Risks / Trade-offs

**[Risk] Onboarding redirect loop** → Mitigation: The onboarding page itself checks `onboarded` and redirects to dashboard if already true. The dashboard checks `!profile.onboarded` before redirecting. This creates a clean one-way gate.

**[Risk] Performance of lesson list query on every lesson page load** → Mitigation: The query selects only `id, title, order_index, section_id` from ~5-20 lessons. This is sub-10ms on Supabase. Could be cached with `unstable_cache` if needed later.

**[Risk] Breadcrumbs add visual clutter on shallow pages** → Mitigation: Only render breadcrumbs on pages with 2+ nesting levels. The dashboard root and teacher root pages don't show breadcrumbs.

**[Trade-off] Student curriculum component duplication** → We accept maintaining two curriculum components (public `CourseCurriculum` and new `StudentCurriculum`) because the URL patterns and data sources are fundamentally different. The shared visual pattern (expand/collapse, completion icons) is simple enough that DRY isn't worth the coupling.

## Migration Plan

1. Run `migration-023-onboarding.sql` in Supabase SQL Editor (adds `display_name`, `onboarding_data` columns)
2. Deploy code — existing users see no change (onboarding redirect only triggers for `onboarded: false`)
3. Existing users with `onboarded: false` (all of them) will be redirected to onboarding on next login → add a "Skip for now" button so they can bypass

## Open Questions

- Should existing users (all with `onboarded: false`) be forced through onboarding or given a skip option? → **Decision: Add "Skip for now" link so existing users aren't disrupted.**
- Should teachers also go through onboarding? → **Decision: Yes, but with a shorter 4-step flow focused on teaching preferences.**
