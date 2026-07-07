import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Admin client not configured" }, { status: 500 });
    }

    const { error } = await supabase.rpc("auth_confirm_user", {
      p_email: email,
    });

    if (error) {
      console.error("auth_confirm_user error:", error);
      return NextResponse.json({ error: "Failed to confirm email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("confirm-email error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
