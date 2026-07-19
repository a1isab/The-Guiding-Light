import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { supabase, applyCookies } = createApiSupabaseClient(request);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return applyCookies(NextResponse.json({ error: "Not authenticated" }, { status: 401 }));
    }

    const { error } = await supabase.rpc("auth_confirm_user", {
      p_email: email,
    });

    if (error) {
      console.error("auth_confirm_user error:", error);
      return applyCookies(NextResponse.json({ error: "Failed to confirm email" }, { status: 500 }));
    }

    return applyCookies(NextResponse.json({ success: true }));
  } catch (err) {
    console.error("confirm-email error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
