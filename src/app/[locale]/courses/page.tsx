import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import { CourseList } from "@/components/course-list";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("courses");
  const supabase = createServiceClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("order_index", { ascending: true });

  const { data: lessonRows } = await supabase
    .from("lessons")
    .select("section_id, sections!inner(course_id)");

  const courseLessonCount: Record<string, number> = {};
  for (const row of lessonRows ?? []) {
    const cid = (row as any).sections.course_id;
    courseLessonCount[cid] = (courseLessonCount[cid] ?? 0) + 1;
  }

  const { data: videoCourses } = await supabase
    .from("lessons")
    .select("section_id, sections!inner(course_id)")
    .not("video_url", "is", null);

  const courseHasVideo = new Set(
    videoCourses?.map((l: any) => l.sections.course_id) ?? []
  );

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p style={{ color: "var(--text-muted)" }}>{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="font-arabic text-4xl font-bold" style={{ color: "var(--text-primary)" }}>{t("title")}</h1>
        <p className="mt-2" style={{ color: "var(--text-secondary)" }}>{t("subtitle")}</p>
      </div>

      <CourseList
        courses={courses}
        courseLessonCount={courseLessonCount}
        courseHasVideo={courseHasVideo}
      />
    </div>
  );
}
