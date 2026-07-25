## Why

The platform currently has seeded public courses (Aqeedah, Fiqh, Seerah, etc.) that were created during development and don't represent real teacher-authored content. Meanwhile, verified teachers have no way to publish their classes to the broader student body — classes are only accessible via invite codes shared manually. Students also have no guided tour of the platform's features after signup.

This change removes the placeholder content, introduces a teacher verification system (government ID review by admins), creates a "Featured" section where verified teachers' classes are discoverable by all students, and adds a guided site tour.

## What Changes

- **Remove built-in courses**: Delete the seed script and clean all rows from the public `courses`/`sections`/`lessons`/`quizzes` tables.
- **Teacher verification**: Teachers can submit government documents (passport, national ID, teaching certificate) for admin review. Admins approve/reject requests. Approved teachers get `is_verified = true` on their profile.
- **Featured classes section**: A new `/featured` page replaces the old `/courses` link in the navbar. Students can browse verified teachers and their classes in a toggleable view (Teachers | Classes). Students can view full lesson content (read-only) and one-click join any class.
- **Guided site tour**: Using driver.js, a step-by-step guided tour highlights key UI elements for students, teachers, and admins. Auto-shows on first login; replayable from user dropdown.

## Capabilities

### New Capabilities
- `teacher-verification`: Teacher document submission, admin review workflow, profile `is_verified` flag, storage bucket for documents.
- `featured-classes`: Public browse of verified teacher classes, teacher/class listing toggle, one-click class join, read-only lesson content viewer.
- `site-tour`: driver.js-based guided tour with role-specific steps, localStorage persistence, auto-show on first login.

### Modified Capabilities
- (none — no existing specs)

## Impact

- **Database**: New `teacher_verification_requests` table, `profiles.is_verified` column, new RLS policies for public read of verified classes, new storage bucket `verification-documents`.
- **API routes**: 4 new routes (`/api/teacher/verify`, `/api/admin/verifications`, `/api/featured`, `/api/featured/join`).
- **Pages**: 4 new pages (`/teacher/verify`, `/admin/verifications`, `/featured`, `/featured/classes/[classId]`), 2 new components (`featured-browser.tsx`, `site-tour.tsx`).
- **Navbar**: "Courses" link replaced with "Featured"; teacher dropdown gets "Verify" link; user dropdown gets "Tour" button.
- **Admin sidebar**: New "Verifications" nav item.
- **Dependencies**: +1 new package (`driver.js` ~10KB).
- **i18n**: ~25 new translation keys across all 4 locales (en, ar, ur, fr).
- **Removals**: `scripts/seed-subjects.ts` deleted; `"seed"` script removed from `package.json`.
