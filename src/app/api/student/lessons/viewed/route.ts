import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { lessonId } = await request.json();
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  // Detect if this is a teacher lesson or public lesson
  const { data: teacherLesson } = await supabase
    .from("teacher_lessons")
    .select("id")
    .eq("id", lessonId)
    .maybeSingle();

  if (teacherLesson) {
    const { error } = await supabase.from("teacher_progress").upsert(
      {
        student_id: userId,
        lesson_id: lessonId,
        content_viewed_at: new Date().toISOString(),
      },
      { onConflict: "student_id, lesson_id" }
    );

    if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
    return applyCookies(NextResponse.json({ ok: true }));
  }

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      content_viewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id, lesson_id" }
  );

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ ok: true }));
}
