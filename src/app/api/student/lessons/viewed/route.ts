import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId } = await request.json();
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      content_viewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id, lesson_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return applyCookies(NextResponse.json({ ok: true }));
}
