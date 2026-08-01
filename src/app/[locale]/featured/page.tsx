import { getTranslations } from "next-intl/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { FeaturedBrowser } from "@/components/featured-browser";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function FeaturedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("featured");

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const admin = createAdminClient();

  const { data: verifiedTeachers } = admin
    ? await admin
        .from("profiles")
        .select("user_id, display_name, email")
        .eq("is_verified", true)
    : { data: [] };

  if (!verifiedTeachers || verifiedTeachers.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <Breadcrumbs
          items={[
            { label: t("title") },
          ]}
        />
        <h1 className="text-h1 mb-8" style={{ color: 'var(--text-primary)' }}>{t("title")}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t("no_teachers")}</p>
      </div>
    );
  }

  const teacherIds = verifiedTeachers.map((t) => t.user_id);

  const { data: classes } = admin
    ? await admin
        .from("classes")
        .select("id, name, description, cover_image, invite_code, teacher_id")
        .in("teacher_id", teacherIds)
    : { data: [] };

  const classIds = classes?.map((c) => c.id) ?? [];
  const allCourseIds = ((
    admin
      ? await admin
          .from("teacher_courses")
          .select("id, class_id")
          .in("class_id", classIds)
      : { data: [] }
  ).data ?? []) as { id: string; class_id: string }[];

  const courseToClass: Record<string, string> = {};
  for (const c of allCourseIds) {
    courseToClass[c.id] = c.class_id;
  }

  const allSections = ((
    admin && allCourseIds.length
      ? await admin
          .from("teacher_sections")
          .select("id, course_id")
          .in("course_id", allCourseIds.map((c) => c.id))
      : { data: [] }
  ).data ?? []) as { id: string; course_id: string }[];

  const sectionToClass: Record<string, string> = {};
  for (const s of allSections) {
    sectionToClass[s.id] = courseToClass[s.course_id] ?? "";
  }

  const allLessons = ((
    admin && allSections.length
      ? await admin
          .from("teacher_lessons")
          .select("id, section_id")
          .in("section_id", allSections.map((s) => s.id))
      : { data: [] }
  ).data ?? []) as { id: string; section_id: string }[];

  // Course count per class
  const classCourseCount: Record<string, number> = {};
  for (const c of allCourseIds) {
    classCourseCount[c.class_id] = (classCourseCount[c.class_id] ?? 0) + 1;
  }

  // Lesson count per class
  const classLessonCount: Record<string, number> = {};
  for (const l of allLessons) {
    const clsId = sectionToClass[l.section_id];
    if (clsId) {
      classLessonCount[clsId] = (classLessonCount[clsId] ?? 0) + 1;
    }
  }

  // Teacher stats
  const teacherStats: Record<string, { class_count: number; lesson_count: number }> = {};
  for (const t of verifiedTeachers) {
    teacherStats[t.user_id] = { class_count: 0, lesson_count: 0 };
  }

  const enrichedClasses = (classes ?? []).map((cls) => {
    const s = teacherStats[cls.teacher_id];
    if (s) s.class_count += 1;
    if (s) s.lesson_count += classLessonCount[cls.id] ?? 0;

    return {
      id: cls.id,
      name: cls.name,
      description: cls.description,
      cover_image: cls.cover_image,
      invite_code: cls.invite_code,
      teacher_id: cls.teacher_id,
      teacher_display_name: verifiedTeachers.find((t) => t.user_id === cls.teacher_id)?.display_name ?? null,
      course_count: classCourseCount[cls.id] ?? 0,
      lesson_count: classLessonCount[cls.id] ?? 0,
    };
  });

  const enrichedTeachers = verifiedTeachers.map((t) => ({
    user_id: t.user_id,
    display_name: t.display_name,
    email: t.email,
    class_count: teacherStats[t.user_id].class_count,
    lesson_count: teacherStats[t.user_id].lesson_count,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs
        items={[
          { label: t("title") },
        ]}
      />
      <h1 className="text-h1 mb-2" style={{ color: 'var(--text-primary)' }}>{t("title")}</h1>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t("subtitle")}</p>
      <FeaturedBrowser teachers={enrichedTeachers} classes={enrichedClasses} />
    </div>
  );
}
