import { createClient } from "@/lib/supabase-client";

const STREAK_MILESTONES = [3, 7, 30] as const;

export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

export interface StreakResult {
  newStreak: number;
  milestone: StreakMilestone | null;
}

export async function updateStreak(
  userId: string,
  supabase?: any
): Promise<StreakResult> {
  const client = supabase ?? createClient();

  const { data: profile } = (await client
    .from("profiles")
    .select("streak, last_activity_at")
    .eq("user_id", userId)
    .single()) as { data: { streak: number; last_activity_at: string | null } | null };

  if (!profile) return { newStreak: 1, milestone: null };

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const lastActivity = profile.last_activity_at
    ? new Date(profile.last_activity_at)
    : null;
  const lastActivityStr = lastActivity
    ? lastActivity.toISOString().split("T")[0]
    : null;

  if (lastActivityStr === todayStr) {
    return { newStreak: profile.streak, milestone: null };
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak: number;
  if (lastActivityStr === yesterdayStr) {
    newStreak = profile.streak + 1;
  } else {
    newStreak = 1;
  }

  await client
    .from("profiles")
    .update({
      streak: newStreak,
      last_activity_at: today.toISOString(),
    })
    .eq("user_id", userId);

  const milestone = STREAK_MILESTONES.includes(newStreak as StreakMilestone)
    ? (newStreak as StreakMilestone)
    : null;

  return { newStreak, milestone };
}

export function isStreakAtRisk(lastActivityAt: string | null): boolean {
  if (!lastActivityAt) return false;
  const last = new Date(lastActivityAt);
  const today = new Date();
  return last.toISOString().split("T")[0] !== today.toISOString().split("T")[0];
}
