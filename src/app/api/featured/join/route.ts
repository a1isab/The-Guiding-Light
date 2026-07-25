import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { createApiSupabaseClient, requireAuth, extractBearerToken, withErrorHandling } from "@/lib/supabase-api";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) {
    return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const { classId, inviteCode } = await request.json();
  if (!classId || !inviteCode) {
    return applyCookies(NextResponse.json({ error: "classId and inviteCode are required" }, { status: 400 }));
  }

  const admin = createAdminClient() ?? supabase;

  const { data: cls, error: clsErr } = await admin
    .from("classes")
    .select("id, name, invite_code, invite_expires_at, teacher_id")
    .eq("id", classId)
    .single();

  if (clsErr || !cls) {
    return applyCookies(NextResponse.json({ error: "Class not found" }, { status: 404 }));
  }

  if (cls.invite_code !== inviteCode.toUpperCase()) {
    return applyCookies(NextResponse.json({ error: "Invalid invite code" }, { status: 400 }));
  }

  if (cls.invite_expires_at && new Date(cls.invite_expires_at) < new Date()) {
    return applyCookies(NextResponse.json({ error: "Invite expired" }, { status: 410 }));
  }

  // Verify teacher is verified
  const { data: teacherProfile } = await admin
    .from("profiles")
    .select("is_verified")
    .eq("user_id", cls.teacher_id)
    .single();

  if (!teacherProfile?.is_verified) {
    return applyCookies(NextResponse.json({ error: "Teacher is not verified" }, { status: 403 }));
  }

  // Check existing membership
  const { data: existing } = await admin
    .from("class_members")
    .select("id")
    .eq("class_id", classId)
    .eq("student_id", userId)
    .single();

  if (existing) {
    return applyCookies(NextResponse.json({ success: true, className: cls.name, alreadyMember: true }));
  }

  const { error: joinErr } = await admin
    .from("class_members")
    .insert({ class_id: classId, student_id: userId });

  if (joinErr) {
    return applyCookies(NextResponse.json({ error: joinErr.message }, { status: 500 }));
  }

  await supabase.rpc("use_invite_code", { p_class_id: classId });

  return applyCookies(NextResponse.json({ success: true, className: cls.name }));
});
