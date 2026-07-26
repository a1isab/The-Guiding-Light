import { createClient } from "@/lib/supabase-client";
import { BADGE_DEFINITIONS } from "@/lib/badge-definitions";

export async function awardSectionBadge(
  userId: string,
  lessonId: string
): Promise<{ earned: boolean; sectionTitle: string | null }> {
  const supabase = createClient();

  const { data: lesson } = await supabase
    .from("teacher_lessons")
    .select("section_id")
    .eq("id", lessonId)
    .single();

  if (!lesson) return { earned: false, sectionTitle: null };

  const { data: allInSection } = await supabase
    .from("teacher_lessons")
    .select("id")
    .eq("section_id", lesson.section_id);

  if (!allInSection || allInSection.length === 0) return { earned: false, sectionTitle: null };

  const { data: progress } = await supabase
    .from("teacher_progress")
    .select("lesson_id")
    .eq("student_id", userId)
    .in("lesson_id", allInSection.map((l) => l.id));

  const completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);
  const allDone = allInSection.every((l) => completedIds.has(l.id));

  if (!allDone) return { earned: false, sectionTitle: null };

  const badgeKey = `section_${lesson.section_id}`;

  const { data: existing } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_key", badgeKey)
    .maybeSingle();

  if (existing) return { earned: false, sectionTitle: null };

  const { data: section } = await supabase
    .from("teacher_sections")
    .select("title")
    .eq("id", lesson.section_id)
    .single();

  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_key: badgeKey,
  });

  return { earned: true, sectionTitle: section?.title ?? null };
}

export async function awardBadge(
  userId: string,
  badgeKey: string,
  supabase?: any
): Promise<boolean> {
  const client = supabase ?? createClient();

  const { data: existing } = await client
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_key", badgeKey)
    .maybeSingle();

  if (existing) return false;

  await client.from("user_badges").insert({
    user_id: userId,
    badge_key: badgeKey,
  });

  return true;
}

export async function scanAndAwardBadges(
  userId: string,
  supabase?: any
): Promise<string[]> {
  const client = supabase ?? createClient();
  const earned: string[] = [];

  const { data: existingBadges } = await client
    .from("user_badges")
    .select("badge_key")
    .eq("user_id", userId);

  const held = new Set(existingBadges?.map((b: any) => b.badge_key) ?? []);

  for (const def of BADGE_DEFINITIONS) {
    if (held.has(def.key)) continue;

    const passed = await def.condition(userId, client);
    if (passed) {
      await client.from("user_badges").insert({
        user_id: userId,
        badge_key: def.key,
      });
      earned.push(def.key);
    }
  }

  return earned;
}
