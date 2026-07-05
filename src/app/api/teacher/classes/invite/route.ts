import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAuth(supabase);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { classId } = await request.json();
  if (!classId) {
    return NextResponse.json({ error: "classId required" }, { status: 400 });
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", classId)
    .single()).data as { teacher_id: string } | null;

  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const { data: role } = await supabase.rpc("get_user_roles");
  const isOwner = cls.teacher_id === userId;
  const isAdmin = role?.includes("admin");

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newCode = Array.from({ length: 9 }, () =>
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)]
  ).join("");

  const { data, error } = await supabase
    .from("classes")
    .update({ invite_code: newCode, invite_expires_at: null })
    .eq("id", classId)
    .select("invite_code")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ invite_code: (data as { invite_code: string }).invite_code }));
}
