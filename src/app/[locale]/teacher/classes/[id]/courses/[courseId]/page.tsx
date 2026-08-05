import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { SectionManager } from "./section-manager";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; courseId: string }>;
}) {
  const { locale, id: classId, courseId } = await params;
  const t = await getTranslations("teacher");
  const supabase = await createServerSupabaseClient();

  const { data: course } = await supabase
    .from("teacher_courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { data: cls } = await supabase
    .from("classes")
    .select("name")
    .eq("id", classId)
    .single();

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

  const lessonsBySection: Record<string, Array<{ id: string; section_id: string; title: string; video_url: string | null; order_index: number }>> = {};
  for (const lesson of allLessons ?? []) {
    if (!lessonsBySection[lesson.section_id]) {
      lessonsBySection[lesson.section_id] = [];
    }
    lessonsBySection[lesson.section_id].push(lesson);
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t("classes"), href: `/${locale}/teacher/classes` },
          { label: cls?.name ?? "Class", href: `/${locale}/teacher/classes/${classId}` },
          { label: course.title },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-h2" style={{ color: 'var(--text-primary)' }}>{course.title}</h1>
        {course.description && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{course.description}</p>
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
