import { createClient } from "@/lib/supabase-client";

export async function awardSectionBadge(
  userId: string,
  lessonId: string
): Promise<{ earned: boolean; sectionTitle: string | null }> {
  const supabase = createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("section_id")
    .eq("id", lessonId)
    .single();

  if (!lesson) return { earned: false, sectionTitle: null };

  const { data: allInSection } = await supabase
    .from("lessons")
    .select("id")
    .eq("section_id", lesson.section_id);

  if (!allInSection || allInSection.length === 0) return { earned: false, sectionTitle: null };

  const { data: progress } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", userId)
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
    .from("sections")
    .select("title")
    .eq("id", lesson.section_id)
    .single();

  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_key: badgeKey,
  });

  return { earned: true, sectionTitle: section?.title ?? null };
}
