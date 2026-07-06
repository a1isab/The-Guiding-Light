## Why

The platform has all the bones of a great Islamic learning experience — structured courses, interactive quizzes, teacher classes, file sharing — but it doesn't yet **compel users to return**. Two things hold it back:

1. **Unaddressed production bugs**: migration-013 (`teacher_progress`) is referenced by live API routes but was never applied. The auth middleware's header propagation is incomplete. The platform-quality-roundup spec is already partially implemented but the tasks don't reflect reality. Teachers can't reset passwords. Dead code sits in the codebase.

2. **No retention loops**: The streak counter sits at zero forever. There's only one badge type (section completion). The dashboard shows progress but doesn't celebrate it or guide the user to the next action. There's no daily check-in, no social proof, no "come back tomorrow" mechanic. Users complete lessons and leave — there's nothing pulling them back.

This change addresses both layers: fix what's broken, then build the engagement mechanics that turn a functional LMS into a **habit-forming learning experience**.

## What Changes

### Infrastructure & Polish
- **Apply migration-013** — creates `teacher_progress` table so quiz/submit and viewed routes stop crashing with "relation does not exist"
- **Complete proxy middleware** — ensure `x-user-id` and `x-user-roles` headers are propagated to Server Components
- **Sync translations** — wire all new quiz, file, and join-by-code strings across ar.json, ur.json, fr.json
- **Final verification** — full teacher flow, student flow, all 4 locales, RLS correctness
- **Fix-nav-redirect-loop verification** — login as 3 test users and confirm no redirect loops
- **Codebase cleanup** — delete `supabase-server.ts`, remove dead `gemini.ts` code
- **Password reset** — forgot-password link on login, reset page, callback handler for recovery

### Engagement Mechanics
- **Live Streak System** — wire up the existing `profiles.streak` column with a daily trigger (complete a lesson → increment streak for today). Show streak milestones (3, 7, 30 days) with visual celebration. Streak-at-risk messaging.
- **Badges Expansion** — add course completion badges, streak milestone badges (7-day, 30-day), quiz ace badges (100% on a quiz), first lesson badge, knowledge seeker (10 lessons), dedicated scholar (50 lessons). Tiered visuals.
- **Progress Visualization** — weekly activity indicator, "lessons this week", course completion percentage with clear visual, estimated remaining lessons per course.
- **Retention Flow** — "Continue where you left off" on dashboard (pointing to exact next uncompleted lesson). Smart next-action after lesson completion. Completion celebration (confetti animation). Course completion certificate/shareable card.
- **Social Proof** — "X students completed this lesson" count on lesson pages. "Y enrolled in this course" on course pages.
- **Daily Check-in** — subtle "You studied today!" acknowledgment. Track daily learning sessions.

## Capabilities

### New Capabilities
- `streak-system`: Daily streak tracking with auto-increment on lesson completion, milestone celebration, streak-at-risk messaging
- `badges-expansion`: Multiple badge types with tiered visuals and unlock notifications
- `progress-visualization`: Enhanced progress display with weekly activity and course completion insights
- `retention-flow`: Continue-where-you-left-off, smart next action, completion celebration
- `social-proof`: Social proof counters on lesson and course pages
- `daily-check-in`: Daily learning session tracking and acknowledgment
- `infrastructure-fixes`: Migration-013 application, proxy header completion, translation sync, password reset, code cleanup

### Modified Capabilities
- `teacher-progress-tracking`: Existing spec from platform-quality-roundup — migration-013 will be applied as part of this change
- `class-invite-validation`: Already implemented in code, spec will be synced to reality
- `quiz-submit/viewed` routes: Will function correctly once migration-013 is applied

## Impact

- **Database**: Apply existing migration-013 (no new migration needed). Optionally add index on `profiles.streak` if needed.
- **API routes**: No new API routes for engagement features (handled client-side with direct Supabase queries or via existing session).
- **Components**: New engagement components. Modified dashboard, lesson viewer, course page.
- **Messages**: New i18n strings for engagement features (badge names, streak messaging, social proof, completion celebration).
- **Pages**: Dashboard gets "Continue where you left off" section. Lesson viewer gets completion celebration. Courses get social proof.
- **Infrastructure**: proxy.ts gets header propagation completed. supabase-server.ts deleted.
