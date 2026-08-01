import { getTranslations } from "next-intl/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronDown, FileText, Film, CheckCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StudentCurriculum } from "@/components/student-curriculum";

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

  const dataClient = createAdminClient() ?? supabase;

  const { data: course } = await dataClient
    .from("teacher_courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { data: cls } = await dataClient
    .from("classes")
    .select("name")
    .eq("id", classId)
    .single();

  const { data: sections } = await dataClient
    .from("teacher_sections")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  const sectionIds = sections?.map((s) => s.id) ?? [];

  const { data: lessons } = sectionIds.length
    ? await dataClient
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

  const { data: progressData } = await dataClient
    .from("teacher_progress")
    .select("lesson_id")
    .eq("student_id", userId);

  const completedIds = new Set(progressData?.map((p: any) => p.lesson_id) ?? []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs
        items={[
          { label: t("my_classes"), href: `/${locale}/dashboard` },
          { label: cls?.name ?? "Class", href: `/${locale}/dashboard/classes/${classId}` },
          { label: course.title },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-h2" style={{ color: 'var(--text-primary)' }}>{course.title}</h1>
        {course.description && (
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{course.description}</p>
        )}
      </div>

      <StudentCurriculum
        classId={classId}
        courseId={courseId}
        sections={sections ?? []}
        lessonsBySection={lessonsBySection}
        completedIds={completedIds}
        locale={locale}
      />
    </div>
  );
}
