import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { consumeProof, getProofCode } from "../generate-code/route";

export async function POST(request: NextRequest) {
  try {
    const { email, token, code } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Proof token is required" }, { status: 401 });
    }

    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
    }

    const storedCode = getProofCode(token, email);
    if (storedCode === null) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 401 });
    }

    if (storedCode !== code) {
      return NextResponse.json({ error: "Incorrect verification code. Please try again." }, { status: 401 });
    }

    if (!consumeProof(token, email)) {
      return NextResponse.json({ error: "Invalid or expired proof token" }, { status: 401 });
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
