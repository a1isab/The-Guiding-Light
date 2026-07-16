import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, getUserRole, extractBearerToken } from "@/lib/supabase-api";

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const { classId, studentId } = await request.json();
  if (!classId || !studentId) {
    return applyCookies(NextResponse.json({ error: "classId and studentId required" }, { status: 400 }));
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", classId)
    .single()).data as { teacher_id: string } | null;

  if (!cls) {
    return applyCookies(NextResponse.json({ error: "Class not found" }, { status: 404 }));
  }

  const role = await getUserRole(supabase);
  const isOwner = cls.teacher_id === userId;
  const isAdmin = role?.includes("admin");

  if (!isOwner && !isAdmin) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
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
