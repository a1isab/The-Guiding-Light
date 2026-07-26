import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      console.error("verifyOtp error:", error);
      return NextResponse.json(
        { error: "Invalid or expired verification code. Please try again." },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { error: confirmError } = await admin.rpc("auth_confirm_user", {
      p_email: email,
    });

    if (confirmError) {
      console.error("auth_confirm_user error:", confirmError);
      return NextResponse.json({ error: "Failed to confirm email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("verify-code error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
