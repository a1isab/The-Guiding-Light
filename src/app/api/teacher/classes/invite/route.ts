import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, getUserRole, extractBearerToken } from "@/lib/supabase-api";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const { classId } = await request.json();
  if (!classId) {
    return applyCookies(NextResponse.json({ error: "classId required" }, { status: 400 }));
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

  const newCode = crypto.randomBytes(5).toString("hex").toUpperCase();

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
