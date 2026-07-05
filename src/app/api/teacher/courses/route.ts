import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const teacherId = await requireTeacher(supabase);
  if (!teacherId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { classId, title, description } = await request.json();
  if (!classId || !title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "classId and title required" }, { status: 400 });
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", classId)
    .single()).data as { teacher_id: string } | null;

  const { data: role } = await supabase.rpc("get_user_role");
  if (!cls || (cls.teacher_id !== teacherId && !role?.includes("admin"))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const last = (await supabase
    .from("teacher_courses")
    .select("order_index")
    .eq("class_id", classId)
    .order("order_index", { ascending: false })
    .limit(1)).data as { order_index: number }[] | null;

  const orderIndex = (last?.[0]?.order_index ?? -1) + 1;

  const { data, error } = await supabase
    .from("teacher_courses")
    .insert({
      class_id: classId,
      teacher_id: teacherId,
      title: title.trim(),
      description: description?.trim() || null,
      order_index: orderIndex,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ id: (data as { id: string }).id }));
}
