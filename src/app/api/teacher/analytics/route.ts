import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken, getUserRole } from "@/lib/supabase-api";
import { createAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  if (!classId) return applyCookies(NextResponse.json({ error: "classId required" }, { status: 400 }));

  const cls = (await supabase.from("classes").select("teacher_id").eq("id", classId).single()).data as { teacher_id: string } | null;
  if (!cls || cls.teacher_id !== userId) {
    const role = await getUserRole(supabase);
    if (!role?.includes("admin")) {
      return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }
  }

  const admin = createAdminClient() ?? supabase;

  const { data: members } = await admin
    .from("class_members")
    .select("student_id")
    .eq("class_id", classId);

  const studentIds = (members ?? []).map((m) => m.student_id);
  const totalStudents = studentIds.length;

  const { data: courses } = await admin
    .from("teacher_courses")
    .select("id")
    .eq("class_id", classId);

  const courseIds = (courses ?? []).map((c) => c.id);

  const { data: sections } = courseIds.length
    ? await admin.from("teacher_sections").select("id").in("course_id", courseIds)
    : { data: [] };

  const sectionIds = (sections ?? []).map((s) => s.id);

  const { data: lessons } = sectionIds.length
    ? await admin.from("teacher_lessons").select("id, section_id, title").in("section_id", sectionIds)
    : { data: [] };

  const lessonIds = (lessons ?? []).map((l) => l.id);

  const { data: progress } = studentIds.length && lessonIds.length
    ? await admin.from("teacher_progress").select("student_id, lesson_id, content_viewed_at").in("student_id", studentIds).in("lesson_id", lessonIds)
    : { data: [] };

  const { data: quizAttempts } = lessonIds.length
    ? await admin.from("teacher_quiz_attempts").select("student_id, lesson_id, score, total_questions, passed").in("lesson_id", lessonIds)
    : { data: [] };

  const totalCompletions = (progress ?? []).filter((p) => p.content_viewed_at).length;
  const totalPossible = totalStudents * lessonIds.length;
  const completionRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;

  const scores = (quizAttempts ?? []).map((a) => a.total_questions > 0 ? Math.round((a.score / a.total_questions) * 100) : 0);
  const avgQuizScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const scoreDistribution = [
    { range: "0-20%", count: 0 },
    { range: "21-40%", count: 0 },
    { range: "41-60%", count: 0 },
    { range: "61-80%", count: 0 },
    { range: "81-100%", count: 0 },
  ];
  for (const s of scores) {
    if (s <= 20) scoreDistribution[0].count++;
    else if (s <= 40) scoreDistribution[1].count++;
    else if (s <= 60) scoreDistribution[2].count++;
    else if (s <= 80) scoreDistribution[3].count++;
    else scoreDistribution[4].count++;
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const completionTimeline: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStr = d.toISOString().split("T")[0];
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);
    const count = (progress ?? []).filter((p) => {
      if (!p.content_viewed_at) return false;
      const t = new Date(p.content_viewed_at);
      return t >= dayStart && t <= dayEnd;
    }).length;
    completionTimeline.push({ date: dayStr, count });
  }

  const atRisk: { student_id: string; display_name: string | null; last_active: string | null }[] = [];
  if (studentIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("user_id, streak, last_activity_at, display_name")
      .in("user_id", studentIds);

    for (const p of profiles ?? []) {
      if ((p.streak ?? 0) === 0) {
        const lastActive = p.last_activity_at ? new Date(p.last_activity_at) : null;
        if (!lastActive || (now.getTime() - lastActive.getTime()) > 3 * 24 * 60 * 60 * 1000) {
          atRisk.push({ student_id: p.user_id, display_name: p.display_name, last_active: p.last_activity_at });
        }
      }
    }
  }

  const lessonBreakdown = (lessons ?? []).map((l) => {
    const completed = (progress ?? []).filter((p) => p.lesson_id === l.id && p.content_viewed_at).length;
    return {
      lesson_id: l.id,
      title: l.title,
      completed,
      total: totalStudents,
      rate: totalStudents > 0 ? Math.round((completed / totalStudents) * 100) : 0,
    };
  });

  return applyCookies(NextResponse.json({
    totalStudents,
    avgQuizScore,
    completionRate,
    atRiskCount: atRisk.length,
    scoreDistribution,
    completionTimeline,
    atRisk,
    lessonBreakdown,
  }));
}
