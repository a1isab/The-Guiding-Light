## 1. Database Migration

- [x] 1.1 Create `supabase/migration-023-onboarding.sql` with `display_name text` and `onboarding_data jsonb` columns added to `profiles` table

## 2. Type Updates

- [x] 2.1 Update `src/lib/types.ts` Profile interface with `display_name: string | null` and `onboarding_data: Record<string, unknown> | null`

## 3. Breadcrumbs Component

- [x] 3.1 Create `src/components/breadcrumbs.tsx` client component with ChevronRight separators, responsive truncation, testids
- [x] 3.2 Add breadcrumbs to student dashboard pages (`dashboard/classes/[id]/page.tsx`, `dashboard/classes/[id]/courses/[courseId]/page.tsx`, `dashboard/classes/[id]/courses/[courseId]/lessons/[lessonId]/page.tsx`)
- [x] 3.3 Add breadcrumbs to teacher pages (`teacher/classes/[id]/page.tsx`, `teacher/classes/[id]/courses/[courseId]/page.tsx`, `teacher/classes/[id]/courses/[courseId]/sections/[sectionId]/lessons/[lessonId]/page.tsx`)
- [x] 3.4 Remove existing `<ArrowLeft> Back` links from pages that get breadcrumbs

## 4. Sidebar Active State

- [x] 4.1 Create `src/components/sidebar-nav.tsx` client component using `usePathname()` for active route detection
- [x] 4.2 Update `src/app/[locale]/teacher/layout.tsx` to use `<SidebarNav>` with active state
- [x] 4.3 Update `src/app/[locale]/admin/layout.tsx` to use `<SidebarNav>` with active state

## 5. Student Curriculum

- [x] 5.1 Create `src/components/student-curriculum.tsx` with collapsible sections, section progress, correct `teacher_progress` query
- [x] 5.2 Update `src/app/[locale]/dashboard/classes/[id]/courses/[courseId]/page.tsx` to use `<StudentCurriculum>` and fix progress query from `progress` to `teacher_progress` with `student_id`

## 6. Lesson Navigation

- [x] 6.1 Update lesson page server component to query all course lessons and compute prev/next
- [x] 6.2 Add prev/next navigation buttons to `lesson-content-view.tsx` with testids

## 7. Onboarding Wizard

- [x] 7.1 Create `src/app/[locale]/onboarding/page.tsx` with multi-step wizard (student: 5 steps, teacher: 4 steps)
- [x] 7.2 Add step indicator, Previous/Next/Complete/Skip buttons, step transitions
- [x] 7.3 Create `src/app/api/onboarding/route.ts` POST endpoint that saves displayName, onboardingData, level, and sets onboarded=true

## 8. Onboarding Interception

- [x] 8.1 Update student dashboard layout to check `profile.onboarded` and redirect to `/onboarding` if false
- [x] 8.2 Update teacher layout to check `profile.onboarded` and redirect to `/onboarding` if false
- [x] 8.3 Add "Skip for now" link on wizard that redirects to dashboard without saving

## 9. Display Name Integration

- [x] 9.1 Update student dashboard greeting to use `display_name` (fallback to "Student")
- [x] 9.2 Update teacher class detail student list to show `display_name` instead of UUIDs
- [x] 9.3 Update teacher analytics to show `display_name` instead of UUIDs

## 10. i18n Keys

- [x] 10.1 Add onboarding namespace keys to `messages/en.json`
- [x] 10.2 Add breadcrumb-related i18n keys if needed

## 11. Testing

- [x] 11.1 Run full E2E suite to verify no regressions
- [x] 11.2 Add testids for new components (breadcrumbs, sidebar, curriculum, onboarding wizard)
