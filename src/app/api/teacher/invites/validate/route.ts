import { type NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, message: "Code is required" }, { status: 400 });
  }

  const { data: invite, error } = await supabase
    .from("teacher_invites")
    .select("id, code, used_by, used_at, expires_at")
    .eq("code", code.trim())
    .single();

  if (error || !invite) {
    return applyCookies(NextResponse.json({ valid: false, message: "Invalid invite code" }));
  }

  if (invite.used_by) {
    return applyCookies(NextResponse.json({ valid: false, message: "This invite code has already been used" }));
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return applyCookies(NextResponse.json({ valid: false, message: "This invite code has expired" }));
  }

  return applyCookies(NextResponse.json({ valid: true, message: "Invite code is valid" }));
}
