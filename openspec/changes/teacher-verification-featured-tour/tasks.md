## 1. Remove Built-in Courses

- [x] 1.1 Delete `scripts/seed-subjects.ts`
- [x] 1.2 Remove `"seed"` script from `package.json`
- [x] 1.3 Create `scripts/clean-public-courses.ts` — DELETE from `quizzes`, `lessons`, `sections`, `courses` using service role client
- [x] 1.4 Add `"clean-courses"` script to `package.json`
- [x] 1.5 Verify `src/components/course-list.tsx` handles empty state gracefully

## 2. Database Migration

- [x] 2.1 Create `supabase/migration-025-teacher-verification.sql` with: `teacher_verification_requests` table, `profiles.is_verified` column, RLS policies, storage bucket + policies
- [x] 2.2 Add RLS policies enabling all authenticated users to SELECT `classes`, `teacher_courses`, `teacher_sections`, `teacher_lessons` where teacher is verified

## 3. TypeScript Types

- [x] 3.1 Add `VerificationRequest` type to `src/lib/types.ts`
- [x] 3.2 Add `is_verified` to `Profile` type in `src/lib/types.ts`

## 4. Teacher Verification — API

- [x] 4.1 Create `src/app/api/teacher/verify/route.ts` — POST (submit request with file upload), GET (check status)
- [x] 4.2 Create `src/app/api/admin/verifications/route.ts` — GET (list all), PATCH (approve/reject, set profiles.is_verified)

## 5. Teacher Verification — Pages

- [x] 5.1 Create `src/app/[locale]/teacher/verify/page.tsx` — form with document type, file upload, document number, notes, status display
- [x] 5.2 Create `src/app/[locale]/admin/verifications/page.tsx` — table of requests, approve/reject buttons, document view link
- [x] 5.3 Add "Verifications" nav item to `src/app/[locale]/admin/layout.tsx` sidebar with ShieldCheck icon
- [x] 5.4 Add "Verify" link to teacher section in `src/components/navbar.tsx` (show if teacher and not verified; show verified badge if already verified)

## 6. Featured Classes — API

- [x] 6.1 Create `src/app/api/featured/route.ts` — GET returns verified teachers + classes with stats
- [x] 6.2 Create `src/app/api/featured/join/route.ts` — POST joins class using embedded invite code

## 7. Featured Classes — Pages & Components

- [x] 7.1 Create `src/app/[locale]/featured/page.tsx` — server component fetching verified teachers + classes
- [x] 7.2 Create `src/components/featured-browser.tsx` — client component with Teachers | Classes toggle, responsive grid, join buttons
- [x] 7.3 Create `src/app/[locale]/featured/classes/[classId]/page.tsx` — read-only class detail with curriculum tree, lesson content, join CTA
- [x] 7.4 Replace "Courses" link with "Featured" in `src/components/navbar.tsx`

## 8. Site Tour

- [x] 8.1 Install `driver.js` dependency
- [x] 8.2 Create `src/components/site-tour.tsx` — driver.js integration with role-specific steps, localStorage persistence
- [x] 8.3 Add "Tour" button to user dropdown in `src/components/navbar.tsx`
- [x] 8.4 Trigger tour automatically on first login (check localStorage in site-tour component)

## 9. i18n

- [x] 9.1 Add featured/verify/tour translation keys to `messages/en.json`
- [x] 9.2 Add featured/verify/tour translation keys to `messages/ar.json`
- [x] 9.3 Add featured/verify/tour translation keys to `messages/ur.json`
- [x] 9.4 Add featured/verify/tour translation keys to `messages/fr.json`

## 10. Verification & Testing

- [x] 10.1 Run `npm run build` — no errors
- [ ] 10.2 Run `npm run lint` — no new warnings
- [ ] 10.3 E2E: Teacher can submit verification request
- [ ] 10.4 E2E: Admin can approve/reject verification
- [ ] 10.5 E2E: Featured page shows verified classes
- [ ] 10.6 E2E: Student can one-click join from featured
- [ ] 10.7 E2E: Student can browse featured class content (read-only)
- [ ] 10.8 E2E: Site tour displays on first login
