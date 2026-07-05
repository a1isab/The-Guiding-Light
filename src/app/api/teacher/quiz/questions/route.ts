import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  // Determine if the user is the teacher/owner of this lesson's class
  const lesson = (await supabase
    .from("teacher_lessons")
    .select("section_id")
    .eq("id", lessonId)
    .single()).data as { section_id: string } | null;

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Check if user is teacher/owner
  const { data: role } = await supabase.rpc("get_user_roles");
  let isTeacher = role?.includes("admin") ?? false;

  if (role?.includes("teacher")) {
    const section = (await supabase
      .from("teacher_sections")
      .select("course_id")
      .eq("id", lesson.section_id)
      .single()).data as { course_id: string } | null;

    if (section) {
      const course = (await supabase
        .from("teacher_courses")
        .select("class_id")
        .eq("id", section.course_id)
        .single()).data as { class_id: string } | null;

      if (course) {
        const cls = (await supabase
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

  // Enrolled student check
  if (!isTeacher && role === "student") {
    const section = (await supabase
      .from("teacher_sections")
      .select("course_id")
      .eq("id", lesson.section_id)
      .single()).data as { course_id: string } | null;

    if (section) {
      const course = (await supabase
        .from("teacher_courses")
        .select("class_id")
        .eq("id", section.course_id)
        .single()).data as { class_id: string } | null;

      if (course) {
        const { data: membership } = await supabase
          .from("class_members")
          .select("id")
          .eq("class_id", course.class_id)
          .eq("student_id", userId)
          .single();

        if (!membership) {
          return NextResponse.json({ error: "Not enrolled in this class" }, { status: 403 });
        }
      }
    }
  }

  // Fetch questions
  const selectCols = isTeacher
    ? "id, question, options, correct_index, order_index"
    : "id, question, options, order_index";

  const { data: questions, error } = await supabase
    .from("teacher_quiz_questions")
    .select(selectCols)
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ questions: questions ?? [] }));
}
