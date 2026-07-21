import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

const MAX_ATTEMPTS_IN_WINDOW = 3;
const LOCKOUT_MINUTES = 30;

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
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const dataClient = createAdminClient() ?? supabase;

  const { data: passedAttempt } = await dataClient
    .from("teacher_quiz_attempts")
    .select("score, total")
    .eq("lesson_id", lessonId)
    .eq("student_id", userId)
    .eq("passed", true)
    .maybeSingle();

  if (passedAttempt) {
    return applyCookies(
      NextResponse.json({
        passed: true,
        score: passedAttempt.score,
        total: passedAttempt.total,
        locked: false,
        totalAttempts: 0,
        retryAfter: 0,
      })
    );
  }

  const { count: totalAttempts } = await dataClient
    .from("teacher_quiz_attempts")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", lessonId)
    .eq("student_id", userId);

  const windowStart = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();

  const { data: recentFails } = await dataClient
    .from("teacher_quiz_attempts")
    .select("completed_at")
    .eq("lesson_id", lessonId)
    .eq("student_id", userId)
    .eq("passed", false)
    .gte("completed_at", windowStart)
    .order("completed_at", { ascending: true });

  const failCount = recentFails?.length ?? 0;

  let locked = false;
  let retryAfter = 0;

  if (failCount >= MAX_ATTEMPTS_IN_WINDOW) {
    locked = true;
    const earliestAttempt = recentFails![0].completed_at;
    const retryAt = new Date(new Date(earliestAttempt).getTime() + LOCKOUT_MINUTES * 60 * 1000);
    retryAfter = Math.max(0, Math.ceil((retryAt.getTime() - Date.now()) / 1000));
  }

  return applyCookies(
    NextResponse.json({
      passed: false,
      locked,
      retryAfter,
      totalAttempts: totalAttempts ?? 0,
      attemptsRemaining: locked ? 0 : Math.max(0, MAX_ATTEMPTS_IN_WINDOW - failCount),
    })
  );
}
