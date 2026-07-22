## Context

The Guiding Light is a Next.js 16 + Supabase Islamic education platform with three roles (student, teacher, admin). The current architecture uses:
- Server components with `createServerSupabaseClient()` for auth and `createAdminClient()` for data queries (bypassing RLS)
- Client components with `use client` for interactivity
- API routes under `/api/teacher/` and `/api/student/` with Bearer token auth
- Supabase PostgreSQL with RLS policies (admin client bypasses for student dashboards)
- `next-intl` for i18n (English/Arabic)
- Tailwind CSS 4 with dark theme (zinc/emerald palette)
- Lucide React icons

The platform has course delivery (lessons, quizzes, progress), teacher content management (courses, sections, lessons, quiz builder, file uploads), and a badge/streak engagement system. Missing: interactivity (discussions, assignments), teacher analytics, completion rewards, and student content curation.

## Goals / Non-Goals

**Goals:**
- Add 6 engagement features that transform passive content consumption into active learning
- Maintain the existing dark emerald/zinc design language
- Follow existing patterns: admin client for data, Bearer token auth, RLS bypass on student pages
- Keep i18n support (all new strings go through `next-intl`)
- Ensure all new features work within the existing role-based routing
- Database-first approach — all state in Supabase, no external services

**Non-Goals:**
- AI features (future change)
- Real-time/WebSocket (future — polling is fine for now)
- Email notifications (future)
- Mobile app (web-only)
- Payment integration (pricing page exists but no Stripe)
- Video/audio hosting (external links only)

## Decisions

### 1. Comments: Flat with parent_id threading (not nested sets)

**Decision**: Use a simple `parent_id` self-reference on `lesson_comments` for threading. Max 2 levels deep (top-level + replies).

**Why**: Supabase RLS handles flat parent_id well. No need for adjacency list complexity. UI renders as flat list with indentation — simpler than tree traversal. Most educational Q&A is 1-2 levels deep.

**Alternatives considered**:
- Nested sets / materialized path: Overkill for this scale
- Flat comments only (no threading): Loses conversational context for Q&A
- External service (Disqus): Adds dependency, no data ownership

### 2. Assignments: Lesson-linked with file upload via Supabase Storage

**Decision**: Assignments are attached to lessons (1:1 or 1:many). Submissions support text body + file attachments uploaded to Supabase Storage bucket `assignment-submissions`.

**Why**: Keeps assignments in the lesson context students already navigate. File upload reuses existing Supabase Storage pattern from `teacher_lesson_files`. No new infrastructure.

**Alternatives considered**:
- Standalone assignments (not lesson-linked): Loses context, students have to navigate separately
- Third-party file upload (S3, Cloudinary): Adds cost and complexity
- Text-only submissions: Too limiting for Islamic education (handwriting Quran, recording recitation)

### 3. Analytics: Server-side aggregation with client-side chart rendering

**Decision**: API routes compute analytics metrics (quiz averages, completion rates, at-risk flags) on the server. Client renders with a lightweight chart library.

**Why**: Computation on server keeps client bundle small. Pre-computed metrics avoid sending raw data to client. Chart library only needed on teacher analytics page.

**Alternatives considered**:
- Client-side computation: Sends too much raw data, slow on large classes
- Database materialized views: Good for scale but premature — Supabase free tier limits
- External analytics service: Adds cost, data privacy concerns for Islamic education

### 4. Certificates: HTML-to-PDF with `@react-pdf/renderer`

**Decision**: Generate certificates as React components, render to PDF client-side, trigger download. No server-side PDF generation.

**Why**: Client-side generation avoids server load. `@react-pdf/renderer` is well-maintained and works with React 19. Certificate is a simple layout (student name, course, date, teacher signature) — no complex PDF work.

**Alternatives considered**:
- Server-side PDF (puppeteer): Heavy dependency, server resource cost
- Static PDF template with form fills: Inflexible for teacher branding
- HTML-only certificate (no PDF): Not shareable, not printable

### 5. Bookmarks: Simple toggle with optimistic UI

**Decision**: Single `bookmarks` table with `(user_id, lesson_id)` unique constraint. Toggle endpoint (POST to add, DELETE to remove). Client uses optimistic UI update.

**Why**: Simplest possible model. Toggle avoids separate "add" and "remove" flows. Optimistic UI makes it feel instant. No need for ordering/sorting — "recently bookmarked" is sufficient with `created_at`.

**Alternatives considered**:
- Bookmark folders/collections: Over-engineering for MVP
- Saved for later with notes: Combines too many features
- Browser-native bookmarks: No cross-device sync, no dashboard integration

### 6. Announcements: Simple text with read tracking

**Decision**: `announcements` table with `class_id`, `title`, `body`, `created_at`. Separate `announcement_reads` table tracks which students have seen each announcement. Banner on class page shows unread count.

**Why**: Read tracking enables "new" indicators without polling. Separate read table keeps announcements immutable. Banner is high-visibility without being intrusive.

**Alternatives considered**:
- No read tracking: Students can't tell what's new
- Push notifications: Requires service worker, too complex for MVP
- Email integration: Future change, out of scope

### 7. New Dependencies

**Decision**: Add `recharts` for analytics charts and `@react-pdf/renderer` for certificates.

**Why**: `recharts` is the most popular React charting library, lightweight, works with Next.js. `@react-pdf/renderer` is the standard for client-side PDF generation in React.

**Alternatives considered**:
- `chart.js`: Heavier, imperative API doesn't fit React well
- `nivo`: Good but larger bundle
- `jspdf` + `html2canvas`: Hacky, poor quality PDFs

## Risks / Trade-offs

- **[Comments moderation]** → Without moderation, comments could be misused. Mitigation: Teachers can delete any comment on their lessons. Students can delete their own. Admin can delete all. No edit capability (only delete).

- **[File upload size]** → Supabase free tier has 50MB storage limit. Assignment submissions with files could fill this fast. Mitigation: Set 10MB per file limit, 3 files per submission. Show storage usage in teacher dashboard.

- **[PDF generation browser compat]** → `@react-pdf/renderer` may not work in all browsers. Mitigation: Show "Download PDF" only in supported browsers (Chrome, Firefox, Edge). Safari support is experimental.

- **[Analytics performance]** → Complex aggregation queries on large classes could timeout. Mitigation: Simple COUNT/AVG queries, add database indexes on `(lesson_id, student_id)` and `(class_id, created_at)`.

- **[i18n scope]** → 6 new features = ~100+ new translation strings. Mitigation: Group by feature, create translation files incrementally. English-only initially, Arabic later.

- **[RLS patterns]** → Must follow existing pattern: `createAdminClient()` for student-facing data queries (bypass RLS), Bearer token auth for API routes. New tables need RLS policies.

## Migration Plan

1. Database migration first: Create all 6 new tables with RLS policies
2. API routes: Build and test each feature's API independently
3. UI components: Build in order of dependency (bookmarks → discussions → assignments → announcements → analytics → certificates)
4. Integration: Wire components into existing pages
5. Testing: Add Playwright tests for each feature
6. No rollback needed — all additive, no existing features modified
