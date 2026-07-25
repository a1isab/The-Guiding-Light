# Tasks: Night Study Redesign

## Foundation
- [x] Rewrite `src/app/globals.css` with CSS variable theme system (dark + light modes)
- [x] Update `src/app/layout.tsx` with theme initialization script (prevents flash)
- [x] Update `src/app/[locale]/layout.tsx` with new fonts (Crimson Pro, Noto Sans Arabic, IBM Plex Mono) and `data-theme` support
- [x] Verify Tailwind v4 `@theme inline` block maps all new tokens correctly

## Landing Page
- [x] Rewrite `src/app/[locale]/page.tsx` with Night Study design (hero, features, stats, testimonial, CTA)
- [x] Add lamplight glow radial gradient effect on hero
- [x] Add page-load fade-in animation
- [x] Ensure responsive layout (mobile → desktop)

## Settings Page
- [x] Create `src/app/[locale]/settings/page.tsx` with dark/light theme toggle
- [x] Implement localStorage persistence for theme preference
- [x] Add language selector to settings page

## Shared Chrome
- [x] Update `src/components/navbar.tsx` — theme tokens, settings link in user dropdown
- [x] Update `src/components/sidebar-nav.tsx` — theme tokens, amber active state
- [x] Update `src/components/footer.tsx` — theme tokens
- [x] Update `src/components/logo.tsx` — theme tokens

## Auth Pages
- [x] Update `src/app/[locale]/auth/login/page.tsx` — retheme
- [x] Update `src/app/[locale]/auth/signup/page.tsx` — retheme
- [x] Update `src/app/[locale]/auth/verify/page.tsx` — retheme
- [x] Update `src/app/[locale]/auth/forgot-password/page.tsx` — retheme
- [x] Update `src/app/[locale]/auth/reset-password/page.tsx` — retheme
- [x] Update `src/app/[locale]/onboarding/page.tsx` — retheme
- [x] Update `src/components/onboarding-wizard.tsx` — retheme

## Student Dashboard
- [x] Update `src/app/[locale]/dashboard/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/dashboard/loading.tsx` — theme tokens
- [x] Update `src/app/[locale]/dashboard/classes/[id]/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/dashboard/classes/[id]/courses/[courseId]/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/dashboard/classes/[id]/courses/[courseId]/lessons/[lessonId]/page.tsx` — theme tokens

## Teacher Dashboard
- [x] Update `src/app/[locale]/teacher/layout.tsx` — sidebar retheme
- [x] Update `src/app/[locale]/teacher/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/teacher/classes/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/teacher/classes/[id]/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/teacher/classes/[id]/progress/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/teacher/classes/[id]/analytics/page.tsx` — theme tokens

## Admin Dashboard
- [x] Update `src/app/[locale]/admin/layout.tsx` — sidebar retheme
- [x] Update `src/app/[locale]/admin/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/admin/users/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/admin/courses/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/admin/invites/page.tsx` — theme tokens
- [x] Update `src/app/[locale]/admin/templates/page.tsx` — theme tokens

## Remaining Components
- [x] Update `src/components/badge-grid.tsx` — theme tokens
- [x] Update `src/components/course-list.tsx` — theme tokens
- [x] Update `src/components/course-curriculum.tsx` — theme tokens
- [x] Update `src/components/student-curriculum.tsx` — theme tokens
- [x] Update `src/components/quiz.tsx` — theme tokens
- [x] Update `src/components/join-class-card.tsx` — theme tokens
- [x] Update `src/components/announcement-banner.tsx` — theme tokens
- [x] Update `src/components/breadcrumbs.tsx` — theme tokens
- [x] Update `src/components/certificate-card.tsx` — theme tokens
- [x] Update `src/components/bookmark-button.tsx` — theme tokens
- [x] Update remaining teacher components (file-upload, markdown-editor, quiz-editor, template-picker, video-upload, class-form, class-list, quiz-viewer, markdown-content) — theme tokens

## Verification
- [x] Run `npm run build` — no errors
- [x] Run `npm run lint` — no new warnings
- [ ] Visual check: dark mode landing page
- [ ] Visual check: light mode landing page
- [ ] Visual check: student dashboard (dark + light)
- [ ] Visual check: teacher dashboard (dark + light)
- [ ] Visual check: admin dashboard (dark + light)
- [ ] Visual check: auth pages (dark + light)
- [ ] Visual check: Arabic/Urdu RTL layout
- [ ] Theme toggle persists across page reloads
- [ ] `prefers-reduced-motion` disables animations
- [ ] Mobile responsive check (320px → 1440px)
