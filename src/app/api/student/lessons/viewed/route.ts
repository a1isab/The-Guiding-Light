import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { lessonId } = await request.json();
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const dataClient = createAdminClient() ?? supabase;

  const { data: teacherLesson } = await dataClient
    .from("teacher_lessons")
    .select("id")
    .eq("id", lessonId)
    .maybeSingle();

  if (teacherLesson) {
    const { error } = await dataClient.from("teacher_progress").upsert(
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
