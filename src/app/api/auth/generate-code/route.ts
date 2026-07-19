import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("generate-code error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
