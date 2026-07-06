## 1. Infrastructure Fixes

- [ ] 1.1 Apply migration-013 to dev/prod database — creates `teacher_progress` table
- [x] 1.2 Complete proxy middleware header propagation (`x-user-id`, `x-user-roles`)
- [x] 1.3 Add password reset flow (forgot-password link, reset page, callback handler)
- [x] 1.4 Sync quiz/files/join strings to ar.json, ur.json, fr.json
- [x] 1.5 Delete `src/lib/supabase-server.ts`, clean up dead code in `src/lib/gemini.ts`
- [ ] 1.6 Verify all 3 test users: no redirect loops, correct role routing
- [x] 1.7 Run `npm run build && npm run lint` — zero errors

## 2. Live Streak System

- [x] 2.1 Create `src/lib/streak.ts` with `updateStreak(userId)` utility
- [x] 2.2 Call `updateStreak` on lesson completion and quiz pass
- [x] 2.3 Add streak milestone notification at 3, 7, 30 days (via StreakMilestoneNotification)
- [x] 2.4 Add streak-at-risk UI (flame dims, "Study today to keep your streak")
- [x] 2.5 Add i18n strings for streak milestones and streak-at-risk

## 3. Badges Expansion

- [x] 3.1 Create `src/lib/badge-definitions.ts` with config-driven badge definitions
- [x] 3.2 Add new badge types: `first_lesson`, `streak_7`, `streak_30`, `quiz_ace`, `lessons_10`, `lessons_50`
- [x] 3.3 Update `src/lib/badges.ts` — `scanAndAwardBadges()` iterates all definitions
- [x] 3.4 Update `BadgeGrid` to show locked badge previews with unlock conditions
- [x] 3.5 Update `BadgeNotification` for each new badge type (different icons/messages)

## 4. Progress Visualization

- [x] 4.1 Weekly activity indicator on dashboard (last 7 days, mini heatmap)
- [x] 4.2 Course completion percentage with clearer visual (existing progress bar)
- [x] 4.3 "Lessons this week" counter with weekly goal
- [x] 4.4 Estimated lessons remaining per course/section

## 5. Retention Flow

- [x] 5.1 "Continue where you left off" on dashboard — query first uncompleted lesson
- [x] 5.2 Smart next-action after lesson completion (auto-suggest next lesson)
- [x] 5.3 Completion celebration on course/section complete (confetti animation)
- [x] 5.4 Track `last_activity_at` on profiles for retention analytics

## 6. Social Proof

- [x] 6.1 Counter on lesson pages: "X students completed this lesson"
- [x] 6.2 Counter on course pages: "Y enrolled in this course"

## 7. Daily Check-in

- [x] 7.1 Track daily learning sessions (use existing data or `last_activity_at`)
- [x] 7.2 Dashboard greeting: "You studied today ✓" acknowledgment
- [x] 7.3 Time-of-day greeting on dashboard

## 8. Final Verification

- [ ] 8.1 Full E2E test: student logs in → sees streak → completes lesson → sees streak increment → earns badge → sees notification → continues → sees social proof
- [ ] 8.2 Verify all 4 locales render correctly
- [x] 8.3 `npm run build` — zero TypeScript errors
