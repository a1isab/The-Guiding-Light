import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { createApiSupabaseClient, requireAuth, extractBearerToken, withErrorHandling } from "@/lib/supabase-api";

export const GET = withErrorHandling(async (request) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const admin = createAdminClient() ?? supabase;

  const { data: verifiedTeachers } = await admin
    .from("profiles")
    .select("user_id, display_name, email")
    .eq("is_verified", true);

  if (!verifiedTeachers || verifiedTeachers.length === 0) {
    return applyCookies(NextResponse.json({ teachers: [], classes: [] }));
  }

  const teacherIds = verifiedTeachers.map((t) => t.user_id);

  const { data: classes } = await admin
    .from("classes")
    .select("id, name, description, cover_image, invite_code, teacher_id")
    .in("teacher_id", teacherIds);

  const classIds = classes?.map((c) => c.id) ?? [];

  const { data: allCourses } = classIds.length
    ? await admin
        .from("teacher_courses")
        .select("id, class_id")
        .in("class_id", classIds)
    : { data: [] };

  const courseToClass: Record<string, string> = {};
  for (const c of allCourses ?? []) {
    courseToClass[c.id] = c.class_id;
  }

  const courseIds = (allCourses ?? []).map((c: { id: string }) => c.id);

  const { data: allSections } = courseIds.length
    ? await admin
        .from("teacher_sections")
        .select("id, course_id")
        .in("course_id", courseIds)
    : { data: [] };

  const sectionToClass: Record<string, string> = {};
  for (const s of allSections ?? []) {
    sectionToClass[s.id] = courseToClass[s.course_id] ?? "";
  }

  const sectionIds = (allSections ?? []).map((s: { id: string }) => s.id);

  const { data: allLessons } = sectionIds.length
    ? await admin
        .from("teacher_lessons")
        .select("id, section_id")
        .in("section_id", sectionIds)
    : { data: [] };

  // Course count per class
  const classCourseCount: Record<string, number> = {};
  for (const c of allCourses ?? []) {
    classCourseCount[c.class_id] = (classCourseCount[c.class_id] ?? 0) + 1;
  }

  // Lesson count per class
  const classLessonCount: Record<string, number> = {};
  for (const l of allLessons ?? []) {
    const clsId = sectionToClass[l.section_id];
    if (clsId) {
      classLessonCount[clsId] = (classLessonCount[clsId] ?? 0) + 1;
    }
  }

  // Build teacher stats
  const teacherMap = new Map(verifiedTeachers.map((t) => [t.user_id, t]));
  const teacherStats: Record<string, { class_count: number; lesson_count: number }> = {};
  for (const t of verifiedTeachers) {
    teacherStats[t.user_id] = { class_count: 0, lesson_count: 0 };
  }

  const enrichedClasses = (classes ?? []).map((cls) => {
    const t = teacherStats[cls.teacher_id];
    if (t) t.class_count += 1;
    if (t) t.lesson_count += classLessonCount[cls.id] ?? 0;

    return {
      ...cls,
      teacher_display_name: teacherMap.get(cls.teacher_id)?.display_name ?? null,
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

  return applyCookies(NextResponse.json({ teachers: enrichedTeachers, classes: enrichedClasses }));
});
