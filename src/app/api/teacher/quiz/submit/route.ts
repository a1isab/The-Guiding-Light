import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken, withErrorHandling } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";
import { updateStreak } from "@/lib/streak";
import { scanAndAwardBadges } from "@/lib/badges";

const PASS_THRESHOLD = 0.6;
const MAX_ATTEMPTS_IN_WINDOW = 3;
const LOCKOUT_MINUTES = 30;

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const { lessonId, answers } = await request.json();

  if (!lessonId || !Array.isArray(answers)) {
    return applyCookies(NextResponse.json({ error: "lessonId and answers array required" }, { status: 400 }));
  }

  const dataClient = createAdminClient() ?? supabase;

  const lesson = (await dataClient
    .from("teacher_lessons")
    .select("id")
    .eq("id", lessonId)
    .single()).data as { id: string } | null;

  if (!lesson) {
    return applyCookies(NextResponse.json({ error: "Lesson not found" }, { status: 404 }));
  }

  const windowStart = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();

  const { data: recentAttempts, error: countError } = await dataClient
    .from("teacher_quiz_attempts")
    .select("completed_at")
    .eq("lesson_id", lessonId)
    .eq("student_id", userId)
    .eq("passed", false)
    .gte("completed_at", windowStart)
    .order("completed_at", { ascending: true });

  if (countError) {
    return applyCookies(NextResponse.json({ error: countError.message }, { status: 500 }));
  }

  const failCount = recentAttempts?.length ?? 0;

  const { data: passedAttempt } = await dataClient
    .from("teacher_quiz_attempts")
    .select("id")
    .eq("lesson_id", lessonId)
    .eq("student_id", userId)
    .eq("passed", true)
    .maybeSingle();

  if (passedAttempt) {
    return applyCookies(NextResponse.json({ error: "Already passed this quiz" }, { status: 400 }));
  }

  if (failCount >= MAX_ATTEMPTS_IN_WINDOW) {
    const earliestAttempt = recentAttempts![0].completed_at;
    const retryAt = new Date(new Date(earliestAttempt).getTime() + LOCKOUT_MINUTES * 60 * 1000);
    const retryAfter = Math.ceil((retryAt.getTime() - Date.now()) / 1000);

    return applyCookies(NextResponse.json(
      {
        locked: true,
        message: `Too many failed attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.`,
        retryAfter,
      },
      { status: 429 }
    ));
  }

  const { data: questions, error: qError } = await dataClient
    .from("teacher_quiz_questions")
    .select("id, correct_index")
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (qError || !questions || questions.length === 0) {
    return applyCookies(NextResponse.json({ error: "No quiz questions found" }, { status: 404 }));
  }

  if (answers.length !== questions.length) {
    return applyCookies(NextResponse.json(
      { error: `Expected ${questions.length} answers, got ${answers.length}` },
      { status: 400 }
    ));
  }

  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (Number(answers[i]) === Number(questions[i].correct_index)) {
      score++;
    }
  }

  const total = questions.length;
  const passed = score / total >= PASS_THRESHOLD;

  const { error: insertError } = await dataClient
    .from("teacher_quiz_attempts")
    .insert({
      lesson_id: lessonId,
      student_id: userId,
      score,
      total,
      passed,
    });

  if (insertError) {
    return applyCookies(NextResponse.json({ error: insertError.message }, { status: 500 }));
  }

  if (passed) {
    const { data: existing } = await dataClient
      .from("teacher_progress")
      .select("id")
      .eq("student_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (!existing) {
      await dataClient.from("teacher_progress").insert({
        student_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      });
    } else {
      await dataClient
        .from("teacher_progress")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", existing.id);
    }

    updateStreak(userId, dataClient as any).catch(() => {});
    scanAndAwardBadges(userId, dataClient as any).catch(() => {});
  }

  return applyCookies(
    NextResponse.json({
      score,
      total,
      passed,
      attemptsRemaining: Math.max(0, MAX_ATTEMPTS_IN_WINDOW - failCount - 1),
    })
  );
});
