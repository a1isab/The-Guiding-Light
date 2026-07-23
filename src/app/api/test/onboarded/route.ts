import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Admin client not available" }, { status: 500 });

  const { userId, onboarded } = await request.json();
  if (!userId || typeof onboarded !== "boolean") {
    return NextResponse.json({ error: "userId and onboarded (boolean) required" }, { status: 400 });
  }

  const { error } = await admin
    .from("profiles")
    .update({ onboarded })
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
