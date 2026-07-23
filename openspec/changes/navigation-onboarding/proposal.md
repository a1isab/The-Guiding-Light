## Why

The app's nested page hierarchy (Dashboard → Class → Course → Lesson, 4 levels deep) has no wayfinding aids — users rely on browser back buttons and individual "Back" links that only go one level up. Teachers and admins have no active page indicator in their sidebars. The student curriculum page doesn't track teacher-created lesson progress, and sections look collapsible but aren't. New users sign up and land on a generic dashboard with no personalized onboarding, and the `onboarded` flag on the `profiles` table has never been used.

## What Changes

- **Breadcrumb navigation** across all student dashboard, teacher, and admin nested pages using `ChevronRight` separators
- **Active sidebar highlighting** for teacher and admin layouts (currently both links always appear the same)
- **Next/Previous lesson navigation** at the bottom of each student lesson page
- **Collapsible curriculum sections** on the student course page (matching the existing public `CourseCurriculum` component pattern)
- **Fix curriculum progress query** — student course page queries `progress` (public lessons) instead of `teacher_progress`, so teacher lesson completion checkmarks never display
- **Multi-step onboarding wizard** for new users after signup, collecting display name, knowledge level, topic interests, learning goals, and preferred language
- **Onboarding interception** — users with `onboarded: false` are redirected to the wizard before accessing their dashboard
- **Display name integration** — replace "Student" greeting and raw UUIDs in teacher views with the user's chosen display name
- **Database migration** — add `display_name` and `onboarding_data` (JSONB) columns to `profiles`

## Capabilities

### New Capabilities
- `breadcrumbs`: Reusable breadcrumb component with ChevronRight separators, responsive truncation, applied to all nested pages
- `sidebar-active-state`: Client sidebar component using `usePathname()` for active route detection
- `student-curriculum`: Collapsible curriculum with section progress, lesson completion, and correct `teacher_progress` queries
- `lesson-navigation`: Prev/next lesson buttons computed from the ordered lesson list within a course
- `onboarding-wizard`: Multi-step form (stepper pattern) with role-specific flows (student: 5 steps, teacher: 4 steps), all answers bundled and sent on completion
- `onboarding-api`: API route that saves display name, onboarding data, level preference, and flips `onboarded` flag
- `display-name`: Profile display name used in greetings, teacher student tables, and analytics

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

**New files (7):**
- `src/components/breadcrumbs.tsx`
- `src/components/sidebar-nav.tsx`
- `src/components/student-curriculum.tsx`
- `src/app/[locale]/onboarding/page.tsx`
- `src/app/api/onboarding/route.ts`
- `supabase/migration-023-onboarding.sql`
- `messages/en.json` (onboarding namespace additions)

**Modified files (12):**
- `src/lib/types.ts` — add `display_name`, `onboarding_data` to Profile
- `src/app/[locale]/dashboard/page.tsx` — breadcrumbs, onboarding redirect, display name greeting
- `src/app/[locale]/dashboard/classes/[id]/page.tsx` — breadcrumbs
- `src/app/[locale]/dashboard/classes/[id]/courses/[courseId]/page.tsx` — breadcrumbs, fix progress query, use StudentCurriculum
- `src/app/[locale]/dashboard/classes/[id]/courses/[courseId]/lessons/[lessonId]/page.tsx` — breadcrumbs, prev/next query
- `src/app/[locale]/dashboard/classes/[id]/courses/[courseId]/lessons/[lessonId]/lesson-content-view.tsx` — prev/next UI
- `src/app/[locale]/teacher/layout.tsx` — use SidebarNav, onboarding redirect
- `src/app/[locale]/teacher/classes/[id]/page.tsx` — breadcrumbs
- `src/app/[locale]/teacher/classes/[id]/courses/[courseId]/page.tsx` — breadcrumbs
- `src/app/[locale]/teacher/classes/[id]/courses/[courseId]/sections/[sectionId]/lessons/[lessonId]/page.tsx` — breadcrumbs
- `src/app/[locale]/admin/layout.tsx` — use SidebarNav
- `messages/en.json` — onboarding i18n keys

**Dependencies:** No new npm packages required. Uses existing `lucide-react` icons.

**Database:** New migration adds 2 columns to `profiles` (`display_name text`, `onboarding_data jsonb`). The `onboarded boolean` column already exists from the initial schema.
