export interface BadgeDefinition {
  key: string;
  titleKey: string;
  descKey: string;
  icon: string;
  condition: (userId: string, supabase: any) => Promise<boolean>;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    key: "first_lesson",
    titleKey: "badge.first_lesson_title",
    descKey: "badge.first_lesson_desc",
    icon: "BookOpen",
    condition: async (userId, supabase) => {
      const { count } = await supabase.from("teacher_progress").select("*", { count: "exact", head: true }).eq("student_id", userId);
      return (count ?? 0) >= 1;
    },
  },
  {
    key: "lessons_10",
    titleKey: "badge.lessons_10_title",
    descKey: "badge.lessons_10_desc",
    icon: "Layers",
    condition: async (userId, supabase) => {
      const { count } = await supabase.from("teacher_progress").select("*", { count: "exact", head: true }).eq("student_id", userId);
      return (count ?? 0) >= 10;
    },
  },
  {
    key: "lessons_50",
    titleKey: "badge.lessons_50_title",
    descKey: "badge.lessons_50_desc",
    icon: "Award",
    condition: async (userId, supabase) => {
      const { count } = await supabase.from("teacher_progress").select("*", { count: "exact", head: true }).eq("student_id", userId);
      return (count ?? 0) >= 50;
    },
  },
  {
    key: "streak_7",
    titleKey: "badge.streak_7_title",
    descKey: "badge.streak_7_desc",
    icon: "Flame",
    condition: async (userId, supabase) => {
      const { data } = await supabase
        .from("profiles")
        .select("streak")
        .eq("user_id", userId)
        .single();
      return data?.streak >= 7;
    },
  },
  {
    key: "streak_30",
    titleKey: "badge.streak_30_title",
    descKey: "badge.streak_30_desc",
    icon: "Flame",
    condition: async (userId, supabase) => {
      const { data } = await supabase
        .from("profiles")
        .select("streak")
        .eq("user_id", userId)
        .single();
      return data?.streak >= 30;
    },
  },
  {
    key: "quiz_ace",
    titleKey: "badge.quiz_ace_title",
    descKey: "badge.quiz_ace_desc",
    icon: "Brain",
    condition: async (userId, supabase) => {
      const { count } = await supabase
        .from("teacher_quiz_attempts")
        .select("*", { count: "exact", head: true })
        .eq("student_id", userId)
        .eq("passed", true);
      return (count ?? 0) >= 1;
    },
  },
];

export function getBadgeDefinition(key: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.key === key);
}

export function isDynamicBadgeKey(key: string): boolean {
  return key.startsWith("section_") || key.startsWith("course_");
}
