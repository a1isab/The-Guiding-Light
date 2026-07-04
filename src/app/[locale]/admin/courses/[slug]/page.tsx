import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { CourseSectionManager } from "./section-manager";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("admin");
  const supabase = createServiceClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  const { data: allLessons } = await supabase
    .from("lessons")
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
        <p className="text-sm text-zinc-500 mt-1">{course.description}</p>
      </div>

      <CourseSectionManager
        courseSlug={slug}
        courseId={course.id}
        sections={sections ?? []}
        lessonsBySection={lessonsBySection}
        locale={locale}
      />
    </div>
  );
}
