## 1. Fix Critical API Bugs

- [x] 1.1 Add auth guard to `POST /api/auth/confirm-email` — reject unauthenticated requests
- [x] 1.2 Add auth guard to `POST /api/auth/verify-code` — proof token pattern via generate-code
- [x] 1.3 Pass JWT from `Authorization` header to `requireAuth`/`requireTeacher` on quiz status, questions, submit, save, generate routes (5 routes)
- [x] 1.4 Pass JWT to `requireTeacher` on `teacher/templates/[id]` DELETE route
- [x] 1.5 Pass JWT to `requireAuth` on `student/lessons/viewed` and `classes/join` routes
- [x] 1.6 Fix quiz scoring comparison in `POST /api/teacher/quiz/submit` — coerce both sides to same type before `===`
- [x] 1.7 Add ownership check on `POST /api/teacher/files` — verify user is teacher/owner of the lesson's class
- [x] 1.8 Replace `Math.random()` with `crypto.randomBytes()` in `POST /api/teacher/classes/invite`
- [ ] 1.9 Add `applyCookies` calls to all error response paths that are missing them across all API routes
- [ ] 1.10 Add try/catch wrappers to all 20 route files that lack them
- [ ] 1.11 Normalize error response shapes across inconsistent routes (`teacher/invites/validate`, `student/invites/validate`, `classes/join`, `quiz/submit`)

## 2. Add data-testid Attributes to All Pages

- [ ] 2.1 Add testids to signup page: email, password, role buttons, invite code, submit, error
- [ ] 2.2 Add testids to verify page: code inputs (0-5), displayed code, submit, error
- [ ] 2.3 Add testids to forgot password page: email, submit, error, sent confirmation
- [ ] 2.4 Fix duplicate `go-to-dashboard` testid on join page (make unique per state)
- [ ] 2.5 Add testids to student dashboard: stat cards, continue learning, class cards, join class card
- [ ] 2.6 Add testids to student class detail and course curriculum pages
- [ ] 2.7 Add testids to student lesson view: lesson title, video, mark viewed, quiz components, navigation
- [ ] 2.8 Add testids to teacher dashboard: stat cards, new class button
- [ ] 2.9 Add testids to teacher class detail: heading, student list, course list, progress link, new course link
- [ ] 2.10 Add testids to teacher progress matrix: table, student rows, completion cells
- [ ] 2.11 Add testids to admin dashboard: stat cards, activity list
- [ ] 2.12 Add testids to admin courses: course rows, edit/view/delete buttons, create link, empty state
- [ ] 2.13 Add testids to admin users: user rows, role dropdown
- [ ] 2.14 Add testids to admin invites: generate button, invite rows, copy button, status badges
- [ ] 2.15 Add missing testids to admin templates: cancel button, error message, empty state
- [ ] 2.16 Add testids to course catalog and course detail pages
- [ ] 2.17 Add testids to public lesson viewer: content, video, take quiz button, navigation

## 3. Fix Hardcoded English Text

- [ ] 3.1 Move dashboard time-of-day greeting to i18n keys (`greeting_morning`, `greeting_afternoon`, `greeting_evening`)
- [ ] 3.2 Move badge titles to i18n keys (`badge_first_lesson`, `badge_ten_lessons`, etc.)
- [ ] 3.3 Move "Mark as Viewed" button text to i18n key
- [ ] 3.4 Move "courses" label on student dashboard to i18n key
- [ ] 3.5 Remove unreachable `success` state dead code in signup page

## 4. Write Playwright Tests — Auth

- [ ] 4.1 Write test: student signup → verify → auto-login → dashboard redirect
- [ ] 4.2 Write test: signup with existing email shows error
- [ ] 4.3 Write test: teacher signup with valid invite code
- [ ] 4.4 Write test: teacher signup with invalid invite code shows error
- [ ] 4.5 Write test: verify page — correct code enters dashboard
- [ ] 4.6 Write test: verify page — wrong code shows error
- [ ] 4.7 Write test: verify page — direct navigation redirects to signup
- [ ] 4.8 Write test: login redirects by role (admin → /admin, teacher → /teacher, student → /dashboard)
- [ ] 4.9 Write test: invalid credentials show error
- [ ] 4.10 Write test: forgot password flow
- [ ] 4.11 Write test: reset password with matching/mismatched passwords
- [ ] 4.12 Write test: logout clears session and redirects to home

## 5. Write Playwright Tests — Student

- [ ] 5.1 Write test: student dashboard shows all stat cards
- [ ] 5.2 Write test: student dashboard shows class list with course counts
- [ ] 5.3 Write test: student dashboard shows "continue learning" when lessons exist
- [ ] 5.4 Write test: student joins class with valid invite code
- [ ] 5.5 Write test: student joins class — already member, expired, invalid states
- [ ] 5.6 Write test: student class detail shows courses
- [ ] 5.7 Write test: student course curriculum shows sections and lessons with icons
- [ ] 5.8 Write test: student lesson view — mark as viewed
- [ ] 5.9 Write test: student lesson view — quiz locked before viewing, unlocked after
- [ ] 5.10 Write test: student lesson view — "no quiz" message
- [ ] 5.11 Write test: student takes quiz and sees completion celebration

## 6. Write Playwright Tests — Teacher

- [ ] 6.1 Write test: teacher dashboard shows stats and class list
- [ ] 6.2 Write test: teacher creates a class
- [ ] 6.3 Write test: teacher class detail — invite code display, copy, regenerate
- [ ] 6.4 Write test: teacher creates course, section, and lesson
- [ ] 6.5 Write test: teacher lesson editor — all elements load
- [ ] 6.6 Write test: teacher preview mode toggle
- [ ] 6.7 Write test: teacher saves lesson as template
- [ ] 6.8 Write test: teacher views student progress matrix
- [ ] 6.9 Write test: teacher removes student from class
- [ ] 6.10 Write test: empty states (no classes, no courses, no students)

## 7. Write Playwright Tests — Admin

- [ ] 7.1 Write test: admin dashboard shows stat cards and activity
- [ ] 7.2 Write test: admin creates a course
- [ ] 7.3 Write test: admin views course list with empty state
- [ ] 7.4 Write test: admin changes user role
- [ ] 7.5 Write test: admin generates teacher invite code
- [ ] 7.6 Write test: admin creates a template
- [ ] 7.7 Write test: admin edits a template
- [ ] 7.8 Write test: admin role guard — student redirected from /admin

## 8. Set Up CI

- [ ] 8.1 Create `.github/workflows/playwright.yml` with checkout, install deps, install Playwright browsers, run tests
- [ ] 8.2 Configure GitHub secrets for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] 8.3 Verify CI passes on push to main
- [ ] 8.4 Verify CI reports results on PR

## 9. Stabilize and Verify

- [ ] 9.1 Run all 13 existing Playwright tests — confirm no regressions
- [ ] 9.2 Run all 20+ new Playwright tests — confirm all pass
- [ ] 9.3 Run `npm run build` — confirm app builds cleanly
- [ ] 9.4 Run `npm run lint` — confirm no lint errors from testid additions
