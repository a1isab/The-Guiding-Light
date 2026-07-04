import { type NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, message: "Code is required" }, { status: 400 });
  }

  const trimmed = code.trim().toUpperCase();

  const { data: cls, error } = await supabase
    .from("classes")
    .select("id, invite_expires_at")
    .eq("invite_code", trimmed)
    .maybeSingle();

  if (error || !cls) {
    return applyCookies(NextResponse.json({ valid: false, message: "Invalid invite code" }));
  }

  if (cls.invite_expires_at && new Date(cls.invite_expires_at) < new Date()) {
    return applyCookies(NextResponse.json({ valid: false, message: "This invite code has expired" }));
  }

  return applyCookies(NextResponse.json({ valid: true, message: "Invite code is valid" }));
}
