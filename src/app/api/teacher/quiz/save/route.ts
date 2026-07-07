import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher, getUserRole } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const teacherId = await requireTeacher(supabase);
  if (!teacherId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { lessonId, questions } = await request.json();

  if (!lessonId || !Array.isArray(questions) || questions.length < 1) {
    return NextResponse.json({ error: "lessonId and questions array required" }, { status: 400 });
  }

  if (questions.length < 3 || questions.length > 10) {
    return NextResponse.json({ error: "Questions count must be between 3 and 10" }, { status: 400 });
  }

  for (const q of questions) {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctIndex !== "number") {
      return NextResponse.json({ error: "Each question must have question text, 4 options, and correctIndex" }, { status: 400 });
    }
  }

  // Verify ownership: teacher must own the lesson's class
  const lesson = (await supabase
    .from("teacher_lessons")
    .select("section_id")
    .eq("id", lessonId)
    .single()).data as { section_id: string } | null;

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const section = (await supabase
    .from("teacher_sections")
    .select("course_id")
    .eq("id", lesson.section_id)
    .single()).data as { course_id: string } | null;

  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const course = (await supabase
    .from("teacher_courses")
    .select("class_id")
    .eq("id", section.course_id)
    .single()).data as { class_id: string } | null;

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", course.class_id)
    .single()).data as { teacher_id: string } | null;

  if (!cls || cls.teacher_id !== teacherId) {
    const role = await getUserRole(supabase);
    if (!role?.includes("admin")) {
      return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }
  }

  // Delete existing questions and insert new ones
  const { error: deleteError } = await supabase
    .from("teacher_quiz_questions")
    .delete()
    .eq("lesson_id", lessonId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const rows = questions.map((q: { question: string; options: string[]; correctIndex: number }, i: number) => ({
    lesson_id: lessonId,
    question: q.question,
    options: q.options,
    correct_index: q.correctIndex,
    order_index: i,
  }));

  const { data, error } = await supabase
    .from("teacher_quiz_questions")
    .insert(rows)
    .select("id, question, options, order_index");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ questions: data }));
}
