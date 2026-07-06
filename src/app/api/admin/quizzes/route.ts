import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const teacherId = await requireTeacher(supabase);
  if (!teacherId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonSlug } = await request.json();
  if (!lessonSlug) {
    return NextResponse.json({ error: "lessonSlug required" }, { status: 400 });
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id")
    .eq("slug", lessonSlug)
    .single();

  if (lessonError || !lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const questions = [
    { question: "What is 2+2?", options: ["3", "4", "5", "6"], correct: 1 },
    { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correct: 1 },
    { question: "What year did WWII end?", options: ["1943", "1944", "1945", "1946"], correct: 2 },
  ];

  const { data: quizId, error } = await supabase.rpc("e2e_create_quiz", {
    p_lesson_id: lesson.id,
    p_questions: questions,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ ok: true, lessonId: lesson.id, quizId }));
}

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const teacherId = await requireTeacher(supabase);
  if (!teacherId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await request.json();
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const { error } = await supabase.rpc("e2e_delete_quiz", {
    p_lesson_id: lessonId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ ok: true }));
}
