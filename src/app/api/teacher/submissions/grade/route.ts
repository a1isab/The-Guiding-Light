import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken, getUserRole } from "@/lib/supabase-api";

export async function PUT(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { submissionId, score, feedback } = await request.json();
  if (!submissionId) {
    return applyCookies(NextResponse.json({ error: "submissionId required" }, { status: 400 }));
  }

  const { data: submission } = await supabase
    .from("submissions")
    .select("id, assignment_id")
    .eq("id", submissionId)
    .single();

  if (!submission) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  const { data: assignment } = await supabase
    .from("assignments")
    .select("lesson_id")
    .eq("id", submission.assignment_id)
    .single();

  if (!assignment) return applyCookies(NextResponse.json({ error: "Assignment not found" }, { status: 404 }));

  const lesson = (await supabase.from("teacher_lessons").select("section_id").eq("id", assignment.lesson_id).single()).data as { section_id: string } | null;
  if (!lesson) return applyCookies(NextResponse.json({ error: "Lesson not found" }, { status: 404 }));

  const section = (await supabase.from("teacher_sections").select("course_id").eq("id", lesson.section_id).single()).data as { course_id: string } | null;
  if (!section) return applyCookies(NextResponse.json({ error: "Section not found" }, { status: 404 }));

  const course = (await supabase.from("teacher_courses").select("class_id").eq("id", section.course_id).single()).data as { class_id: string } | null;
  if (!course) return applyCookies(NextResponse.json({ error: "Course not found" }, { status: 404 }));

  const cls = (await supabase.from("classes").select("teacher_id").eq("id", course.class_id).single()).data as { teacher_id: string } | null;
  if (cls?.teacher_id !== userId) {
    const role = await getUserRole(supabase);
    if (!role?.includes("admin")) {
      return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }
  }

  const { error } = await supabase
    .from("submissions")
    .update({
      score: score ?? null,
      feedback: feedback ?? null,
      status: "graded",
      graded_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ ok: true }));
}
