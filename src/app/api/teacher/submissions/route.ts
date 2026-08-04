import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken, retryQuery } from "@/lib/supabase-api";

async function isOwnedByTeacher(
  supabase: ReturnType<typeof import("@supabase/ssr").createServerClient>,
  assignmentId: string,
  userId: string,
): Promise<boolean> {
  const { data } = await retryQuery(() =>
    supabase
      .from("assignments")
      .select("id, teacher_lessons!inner(teacher_sections!inner(teacher_courses!inner(classes!inner(teacher_id))))")
      .eq("id", assignmentId)
      .eq("teacher_lessons.teacher_sections.teacher_courses.classes.teacher_id", userId)
      .maybeSingle(),
  );
  return !!data;
}

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const assignmentId = searchParams.get("assignmentId");
  if (!assignmentId) return applyCookies(NextResponse.json({ error: "assignmentId required" }, { status: 400 }));

  if (!(await isOwnedByTeacher(supabase, assignmentId, userId))) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { data, error } = await retryQuery(() =>
    supabase
      .from("submissions")
      .select("id, student_id, body, status, score, feedback, submitted_at")
      .eq("assignment_id", assignmentId)
      .order("submitted_at", { ascending: false }),
  );

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));

  const studentIds = [...new Set((data ?? []).map((s: any) => s.student_id))];
  let profiles: { user_id: string; full_name: string | null }[] = [];
  if (studentIds.length) {
    const { data: p } = await retryQuery(() =>
      supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", studentIds),
    );
    profiles = p ?? [];
  }

  const enriched = (data ?? []).map((s: any) => ({
    ...s,
    student_name: profiles.find((p) => p.user_id === s.student_id)?.full_name ?? null,
  }));

  return applyCookies(NextResponse.json({ submissions: enriched }));
}
