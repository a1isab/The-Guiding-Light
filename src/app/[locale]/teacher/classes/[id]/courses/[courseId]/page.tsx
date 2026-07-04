import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { SectionManager } from "./section-manager";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; courseId: string }>;
}) {
  const { locale, id: classId, courseId } = await params;
  const t = await getTranslations("teacher");
  const supabase = createServiceClient();

  const { data: course } = await supabase
    .from("teacher_courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { data: sections } = await supabase
    .from("teacher_sections")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  const { data: allLessons } = await supabase
    .from("teacher_lessons")
    .select("*")
    .in("section_id", sections?.map((s) => s.id) ?? [])
    .order("order_index", { ascending: true });

  const lessonsBySection: Record<string, any[]> = {};
  for (const lesson of allLessons ?? []) {
    if (!lessonsBySection[lesson.section_id]) {
      lessonsBySection[lesson.section_id] = [];
    }
    lessonsBySection[lesson.section_id].push(lesson);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-amiri text-2xl font-bold text-zinc-100">{course.title}</h1>
        {course.description && (
          <p className="text-sm text-zinc-500 mt-1">{course.description}</p>
        )}
      </div>

      <SectionManager
        classId={classId}
        courseId={courseId}
        sections={sections ?? []}
        lessonsBySection={lessonsBySection}
        locale={locale}
      />
    </div>
  );
}
