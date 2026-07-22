import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken } from "@/lib/supabase-api";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const assignmentId = searchParams.get("assignmentId");
  if (!assignmentId) return applyCookies(NextResponse.json({ error: "assignmentId required" }, { status: 400 }));

  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, lesson_id")
    .eq("id", assignmentId)
    .single();

  if (!assignment) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  const { data: lesson } = await supabase
    .from("teacher_lessons")
    .select("section_id")
    .eq("id", assignment.lesson_id)
    .single();
  if (!lesson) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  const { data: section } = await supabase
    .from("teacher_sections")
    .select("course_id")
    .eq("id", lesson.section_id)
    .single();
  if (!section) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  const { data: course } = await supabase
    .from("teacher_courses")
    .select("class_id")
    .eq("id", section.course_id)
    .single();
  if (!course) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  const { data: cls } = await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", course.class_id)
    .single();
  if (cls?.teacher_id !== userId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("id, student_id, body, status, score, feedback, submitted_at")
    .eq("assignment_id", assignmentId)
    .order("submitted_at", { ascending: false });

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));

  const studentIds = [...new Set((data ?? []).map((s) => s.student_id))];
  let profiles: { user_id: string; full_name: string | null }[] = [];
  if (studentIds.length) {
    const { data: p } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", studentIds);
    profiles = p ?? [];
  }

  const enriched = (data ?? []).map((s) => ({
    ...s,
    student_name: profiles.find((p) => p.user_id === s.student_id)?.full_name ?? null,
  }));

  return applyCookies(NextResponse.json({ submissions: enriched }));
}
