# Tasks

- [x] **Task 1: Refactor middleware RPC call to use profiles.role fallback**
  `src/middleware.ts:44` — replaced with `getUserRole(supabase)`

- [x] **Task 2: Refactor navbar RPC calls to use profiles.role fallback**
  `src/components/navbar.tsx:42,54` — added `getUserRoleClient()` helper in `supabase-client.ts`

- [x] **Task 3: Refactor dashboard page RPC call to use profiles.role fallback**
  `src/app/[locale]/dashboard/page.tsx:38`

- [x] **Task 4: Refactor admin layout RPC call to use profiles.role fallback**
  `src/app/[locale]/admin/layout.tsx:19`

- [x] **Task 5: Refactor all API route RPC calls to use profiles.role fallback**
  All 9 files:
  - `src/app/api/teacher/classes/route.ts`
  - `src/app/api/teacher/courses/route.ts`
  - `src/app/api/teacher/lessons/route.ts`
  - `src/app/api/teacher/sections/route.ts`
  - `src/app/api/teacher/classes/invite/route.ts`
  - `src/app/api/teacher/classes/members/route.ts`
  - `src/app/api/teacher/files/route.ts`
  - `src/app/api/teacher/quiz/save/route.ts`
  - `src/app/api/teacher/quiz/questions/route.ts`
  - Also fixed `role === "student"` bug in questions/route.ts

- [x] **Task 6: Fix confirm-email endpoint to use authenticated client fallback**
  Falls back to user's session if admin client unavailable

- [x] **Task 7: Extend middleware to API routes**
  Added API route handling to middleware for cookie refresh + removed API exclusion from matcher

- [x] **Task 8: Add diagnostic logging for session drops**
  Added `console.warn` to `requireTeacher()` capturing whether getUser() or role check fails
