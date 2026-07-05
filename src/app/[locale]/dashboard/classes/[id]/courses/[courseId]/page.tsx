import { getTranslations } from "next-intl/server";
import { createServiceClient, createServerSupabaseClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, FileText, Film, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentCoursePage({
  params,
}: {
  params: Promise<{ locale: string; id: string; courseId: string }>;
}) {
  const { locale, id: classId, courseId } = await params;
  const t = await getTranslations("dashboard");
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) redirect(`/${locale}/auth/login`);

  const service = createServiceClient();

  const { data: course } = await service
    .from("teacher_courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { data: sections } = await service
    .from("teacher_sections")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  const sectionIds = sections?.map((s) => s.id) ?? [];

  const { data: lessons } = sectionIds.length
    ? await service
        .from("teacher_lessons")
        .select("*")
        .in("section_id", sectionIds)
        .order("order_index", { ascending: true })
    : { data: [] };

  const lessonsBySection: Record<string, any[]> = {};
  for (const lesson of lessons ?? []) {
    if (!lessonsBySection[lesson.section_id]) {
      lessonsBySection[lesson.section_id] = [];
    }
    lessonsBySection[lesson.section_id].push(lesson);
  }

  const { data: progressData } = await service
    .from("progress")
    .select("lesson_id")
    .eq("user_id", userId);

  const completedIds = new Set(progressData?.map((p: any) => p.lesson_id) ?? []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href={`/${locale}/dashboard/classes/${classId}`}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <div className="mb-8">
        <h1 className="font-amiri text-2xl font-bold text-zinc-100">{course.title}</h1>
        {course.description && (
          <p className="mt-1 text-sm text-zinc-500">{course.description}</p>
        )}
      </div>

      <div className="space-y-3">
        {sections?.map((section) => {
          const sectionLessons = lessonsBySection[section.id] ?? [];
          return (
            <div key={section.id} className="rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                  <span className="text-base font-semibold text-zinc-100">{section.title}</span>
                  <span className="text-xs text-zinc-500">({sectionLessons.length})</span>
                </div>
              </div>
              <div className="border-t border-zinc-800 divide-y divide-zinc-800/50">
                {sectionLessons.map((lesson) => {
                  const isCompleted = completedIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/${locale}/dashboard/classes/${classId}/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-900/30 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                      ) : lesson.video_url ? (
                        <Film className="h-4 w-4 shrink-0 text-zinc-600" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 text-zinc-600" />
                      )}
                      <span className={`text-sm ${isCompleted ? "text-zinc-500" : "text-zinc-300"}`}>
                        {lesson.title}
                      </span>
                      {lesson.duration && (
                        <span className="text-xs text-zinc-600 ml-auto">
                          {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
