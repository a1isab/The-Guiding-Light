import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { LessonEditor } from "./lesson-editor";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; courseId: string; sectionId: string; lessonId: string }>;
}) {
  const { locale, id: classId, courseId, sectionId, lessonId } = await params;
  const t = await getTranslations("teacher");

  const supabase = await createServerSupabaseClient();

  const { data: lesson } = await supabase
    .from("teacher_lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const [{ data: cls }, { data: course }, { data: section }] = await Promise.all([
    supabase.from("classes").select("name").eq("id", classId).single(),
    supabase.from("teacher_courses").select("title").eq("id", courseId).single(),
    supabase.from("teacher_sections").select("title, course_id").eq("id", sectionId).single(),
  ]);

  let teacherId = "";

  if (section) {
    const { data: courseData } = await supabase
      .from("teacher_courses")
      .select("teacher_id")
      .eq("id", section.course_id)
      .single();
    if (courseData) teacherId = courseData.teacher_id ?? "";
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t("classes"), href: `/${locale}/teacher/classes` },
          { label: cls?.name ?? "Class", href: `/${locale}/teacher/classes/${classId}` },
          { label: course?.title ?? "Course", href: `/${locale}/teacher/classes/${classId}/courses/${courseId}` },
          { label: lesson.title },
        ]}
      />

      <LessonEditor lesson={lesson} teacherId={teacherId} />
    </div>
  );
}
