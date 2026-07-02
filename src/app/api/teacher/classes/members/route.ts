import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { classId, studentId } = await request.json();
  if (!classId || !studentId) {
    return NextResponse.json({ error: "classId and studentId required" }, { status: 400 });
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", classId)
    .single()).data as { teacher_id: string } | null;

  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const { data: role } = await supabase.rpc("get_user_role");
  const isOwner = cls.teacher_id === userId;
  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("class_members")
    .delete()
    .eq("class_id", classId)
    .eq("student_id", studentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ ok: true }));
}
