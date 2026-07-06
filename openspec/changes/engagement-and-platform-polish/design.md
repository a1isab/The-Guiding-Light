## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   ENGAGEMENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ StreakSystem │  │ BadgeManager │  │ ProgressVisualizer   │  │
│  │ (lib/        │  │ (lib/        │  │ (components/)        │  │
│  │  streak.ts)  │  │  badges.ts)  │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                 │                                     │
│         ▼                 ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Dashboard / Lesson Viewer / Course Pages               │   │
│  │  (consume engagement data, render UI components)        │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                 │                                     │
│         ▼                 ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Supabase (profiles, user_badges, progress,             │   │
│  │            teacher_progress, teacher_quiz_attempts)     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Design Decisions

### Decision 1: Streaks — utility function, no new API routes
Streak calculation lives in `src/lib/streak.ts`. It reads the user's last activity date from `profiles.updated_at` (or a new `last_activity_at` column) and the current streak value, then decides whether to increment (same day → no-op, new day → increment, missed day → reset to 1). Called from the lesson completion flow.

```typescript
// src/lib/streak.ts
export async function updateStreak(userId: string): Promise<number> {
  // 1. Fetch profile (last_activity_at, current streak)
  // 2. Compare today vs last_activity_at
  // 3. If same day: return current streak (already counted)
  // 4. If yesterday: increment streak
  // 5. If >1 day ago: reset streak to 1
  // 6. Return new streak value
}
```

### Decision 2: Badge conditions — config-driven, extensible
Badge definitions are a config object, not hardcoded logic. Each definition has a `key`, `condition` function, and `meta` (title, description, icon).

```typescript
// src/lib/badge-definitions.ts
const BADGE_DEFINITIONS = [
  {
    key: "first_lesson",
    condition: async (userId) => { /* progress count >= 1 */ },
    meta: { titleKey: "badge.first_lesson", icon: "BookOpen" }
  },
  // ...
];
```

The existing `scanAndAwardBadges()` or a new `awardBadges()` iterates all definitions, checks conditions, and awards any that aren't held yet.

### Decision 3: Social proof — lightweight counters
No new tables. Counts are derived from existing data:
- **Lesson completions**: `SELECT COUNT(*) FROM progress WHERE lesson_id = $1 UNION ALL SELECT COUNT(*) FROM teacher_progress WHERE lesson_id = $1`
- **Course enrollment**: `SELECT COUNT(DISTINCT user_id) FROM progress WHERE lesson_id IN (lessons for this course)`
- Cached with a short SWR/stale-while-revalidate pattern to avoid hammering the DB

### Decision 4: Continue-where-you-left-off — query-based
The dashboard queries for the first uncompleted lesson across both public courses and teacher classes, ordered by course/section/lesson order. Shows as a prominent "Continue Learning" card with course name and lesson title.

### Decision 5: Migration-013 — apply as-is
The existing `supabase/migration-013-teacher-progress.sql` is correct. No changes needed. Just apply it.

### Decision 6: Proxy header propagation — complete existing work
The `fix-nav-redirect-loop` change's design requires the proxy middleware to call `getUser()` and set `x-user-id` / `x-user-roles` headers on the request. The current `src/proxy.ts` needs the actual header-setting code added.

### Decision 7: Completion celebration — client-side only
Celebration effects (confetti, card animation) are purely client-side, triggered when the user hits certain milestones. No backend changes needed. Use a lightweight confetti library or CSS-only animation.

## Data Model Changes

### Existing tables used (no new tables)
- `profiles` — add `last_activity_at timestamptz` if not present (check first)
- `user_badges` — already supports arbitrary `badge_key` values
- `progress`, `teacher_progress` — for completion counts
- `teacher_quiz_attempts` — for quiz ace badge

### New columns
- `profiles.last_activity_at` (timestamptz, nullable) — if not already present

## Component Tree

```
Dashboard page
├── StreakDisplay (flame icon, count, milestone indicator)
├── ContinueLearningCard (next uncompleted lesson)
├── WeeklyActivity (last 7 days mini-heatmap)
├── ProgressSummary (course completion donuts)
├── BadgeGrid (existing, enhanced with more badges)
└── DailyCheckin (subtle greeting/acknowledgment)

Lesson Viewer
├── CompletionCelebration (on course/section complete)
├── SmartNextAction (auto-navigate to next lesson)
└── SocialProofCounter ("X students completed this")

Course Page
├── SocialProofCounter ("Y enrolled")
└── ProgressBreakdown (per-section completion)
