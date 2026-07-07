import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, getUserRole } from "@/lib/supabase-api";
import { createServerClient } from "@supabase/ssr";

async function authorizeBySection(supabase: ReturnType<typeof createServerClient>, sectionId: string, userId: string): Promise<boolean> {
  const section = (await supabase
    .from("teacher_sections")
    .select("course_id")
    .eq("id", sectionId)
    .single()).data as { course_id: string } | null;
  if (!section) return false;

  const course = (await supabase
    .from("teacher_courses")
    .select("class_id")
    .eq("id", section.course_id)
    .single()).data as { class_id: string } | null;
  if (!course) return false;

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", course.class_id)
    .single()).data as { teacher_id: string } | null;
  if (!cls) return false;

  if (cls.teacher_id === userId) return true;

  const role = await getUserRole(supabase);
  return role?.includes("admin") ?? false;
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { courseId, title, orderIndex } = await request.json();
  if (!courseId || !title) {
    return applyCookies(NextResponse.json({ error: "courseId and title required" }, { status: 400 }));
  }

  const course = (await supabase
    .from("teacher_courses")
    .select("class_id")
    .eq("id", courseId)
    .single()).data as { class_id: string } | null;
  if (!course) return applyCookies(NextResponse.json({ error: "Course not found" }, { status: 404 }));

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", course.class_id)
    .single()).data as { teacher_id: string } | null;

  const role = await getUserRole(supabase);
  if (!cls || (cls.teacher_id !== userId && !role?.includes("admin"))) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { data, error } = await supabase
    .from("teacher_sections")
    .insert({
      course_id: courseId,
      title: title.trim(),
      order_index: orderIndex ?? 0,
    })
    .select("id")
    .single();

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ id: (data as { id: string }).id }));
}

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return applyCookies(NextResponse.json({ error: "id required" }, { status: 400 }));

  if (!(await authorizeBySection(supabase, id, userId))) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { error } = await supabase.from("teacher_sections").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return applyCookies(NextResponse.json({ ok: true }));
}
