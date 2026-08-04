import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken, getUserRole, retryQuery } from "@/lib/supabase-api";

async function authorizeByLesson(supabase: ReturnType<typeof import("@supabase/ssr").createServerClient>, lessonId: string, userId: string): Promise<boolean> {
  const { data } = await retryQuery(() =>
    supabase
      .from("teacher_lessons")
      .select("id, teacher_sections!inner(teacher_courses!inner(classes!inner(teacher_id)))")
      .eq("id", lessonId)
      .eq("teacher_sections.teacher_courses.classes.teacher_id", userId)
      .maybeSingle(),
  );

  if (data) return true;

  const role = await getUserRole(supabase);
  return role?.includes("admin") ?? false;
}

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) return applyCookies(NextResponse.json({ error: "lessonId required" }, { status: 400 }));

  const { data, error } = await retryQuery(() =>
    supabase
      .from("assignments")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: false }),
  );

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ assignments: data }));
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { lessonId, title, description, maxScore, dueDate } = await request.json();
  if (!lessonId || !title?.trim()) {
    return applyCookies(NextResponse.json({ error: "lessonId and title required" }, { status: 400 }));
  }

  if (!(await authorizeByLesson(supabase, lessonId, userId))) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { data, error } = await retryQuery(() =>
    supabase
      .from("assignments")
      .insert({
        lesson_id: lessonId,
        title: title.trim(),
        description: description ?? null,
        max_score: maxScore ?? 100,
        due_date: dueDate ?? null,
      })
      .select("id")
      .single(),
  );

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ id: (data as { id: string }).id }));
}

export async function PATCH(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { id, title, description, maxScore, dueDate } = await request.json();
  if (!id) return applyCookies(NextResponse.json({ error: "id required" }, { status: 400 }));

  const assignment = (await retryQuery(() => supabase.from("assignments").select("lesson_id").eq("id", id).single())).data as { lesson_id: string } | null;
  if (!assignment) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  if (!(await authorizeByLesson(supabase, assignment.lesson_id, userId))) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description;
  if (maxScore !== undefined) updates.max_score = maxScore;
  if (dueDate !== undefined) updates.due_date = dueDate;

  const { error } = await retryQuery(() => supabase.from("assignments").update(updates).eq("id", id));
  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ ok: true }));
}

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return applyCookies(NextResponse.json({ error: "id required" }, { status: 400 }));

  const assignment = (await retryQuery(() => supabase.from("assignments").select("lesson_id").eq("id", id).single())).data as { lesson_id: string } | null;
  if (!assignment) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  if (!(await authorizeByLesson(supabase, assignment.lesson_id, userId))) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { error } = await retryQuery(() => supabase.from("assignments").delete().eq("id", id));
  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ ok: true }));
}
