import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, message: "Code is required" }, { status: 400 });
  }

  const trimmed = code.trim().toUpperCase();

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ valid: false, message: "Server configuration error" }, { status: 500 });
  }

  const { data: cls, error } = await admin
    .from("classes")
    .select("id, invite_expires_at")
    .eq("invite_code", trimmed)
    .maybeSingle();

  if (error || !cls) {
    return NextResponse.json({ valid: false, message: "Invalid invite code" });
  }

  if (cls.invite_expires_at && new Date(cls.invite_expires_at) < new Date()) {
    return NextResponse.json({ valid: false, message: "This invite code has expired" });
  }

  return NextResponse.json({ valid: true, message: "Invite code is valid" });
}
