import { getTranslations } from "next-intl/server";
import { createServiceClient, createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import type { Course, Section, Lesson, Locale } from "@/lib/types";
import { getTranslation } from "@/lib/types";
import { CourseCurriculum } from "@/components/course-curriculum";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; courseSlug: string }>;
}) {
  const { locale: rawLocale, courseSlug } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations("courses");
  const supabase = createServiceClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", courseSlug)
    .single<Course>();

  if (!course) notFound();

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  if (!sections || sections.length === 0) notFound();

  const { data: allLessons } = await supabase
    .from("lessons")
    .select("*")
    .in("section_id", sections.map((s) => s.id))
    .order("order_index", { ascending: true });

  const lessonsBySection: Record<string, Lesson[]> = {};
  for (const lesson of allLessons ?? []) {
    if (!lessonsBySection[lesson.section_id]) {
      lessonsBySection[lesson.section_id] = [];
    }
    lessonsBySection[lesson.section_id].push(lesson);
  }

  const sb = await createServerSupabaseClient();
  const { data: { user } } = await sb.auth.getUser();
  let completedIds = new Set<string>();

  if (user) {
    const { data: progress } = await supabase
      .from("progress")
      .select("lesson_id")
      .eq("user_id", user.id);
    completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);
  }

  const totalLessons = allLessons?.length ?? 0;
  const completedCount = completedIds.size;
  const percentComplete =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-amiri text-3xl font-bold text-zinc-100">
          {getTranslation(course, "title", locale, course.title)}
        </h1>
        <p className="mt-2 text-zinc-400">
          {getTranslation(course, "description", locale, course.description)}
        </p>
        {totalLessons > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-zinc-800">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <span className="text-sm text-zinc-500 shrink-0">
              {completedCount}/{totalLessons}
            </span>
          </div>
        )}
      </div>

      <CourseCurriculum
        courseSlug={courseSlug}
        sections={sections}
        lessonsBySection={lessonsBySection}
        completedLessons={completedIds}
        locale={locale}
      />
    </div>
  );
}
