import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, getUserRole, extractBearerToken } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return applyCookies(NextResponse.json({ error: "lessonId required" }, { status: 400 }));
  }

  const dataClient = createAdminClient() ?? supabase;

  const lesson = (await dataClient
    .from("teacher_lessons")
    .select("section_id")
    .eq("id", lessonId)
    .single()).data as { section_id: string } | null;

  if (!lesson) {
    return applyCookies(NextResponse.json({ error: "Lesson not found" }, { status: 404 }));
  }

  const role = await getUserRole(supabase);
  let isTeacher = role?.includes("admin") ?? false;

  if (role?.includes("teacher")) {
    const section = (await dataClient
      .from("teacher_sections")
      .select("course_id")
      .eq("id", lesson.section_id)
      .single()).data as { course_id: string } | null;

    if (section) {
      const course = (await dataClient
        .from("teacher_courses")
        .select("class_id")
        .eq("id", section.course_id)
        .single()).data as { class_id: string } | null;

      if (course) {
        const cls = (await dataClient
          .from("classes")
          .select("teacher_id")
          .eq("id", course.class_id)
          .single()).data as { teacher_id: string } | null;

        if (cls && cls.teacher_id === userId) {
          isTeacher = true;
        }
      }
    }
  }

  if (!isTeacher && !role?.includes("teacher") && !role?.includes("admin")) {
    const section = (await dataClient
      .from("teacher_sections")
      .select("course_id")
      .eq("id", lesson.section_id)
      .single()).data as { course_id: string } | null;

    if (section) {
      const course = (await dataClient
        .from("teacher_courses")
        .select("class_id")
        .eq("id", section.course_id)
        .single()).data as { class_id: string } | null;

      if (course) {
        const { data: membership } = await dataClient
          .from("class_members")
          .select("id")
          .eq("class_id", course.class_id)
          .eq("student_id", userId)
          .single();

        if (!membership) {
          return applyCookies(NextResponse.json({ error: "Not enrolled in this class" }, { status: 403 }));
        }
      }
    }
  }

  const selectCols = isTeacher
    ? "id, question, options, correct_index, order_index"
    : "id, question, options, order_index";

  const { data: questions, error } = await dataClient
    .from("teacher_quiz_questions")
    .select(selectCols)
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ questions: questions ?? [] }));
}
