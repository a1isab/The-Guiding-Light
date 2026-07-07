import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  try {
    const { supabase, applyCookies } = createApiSupabaseClient(request);
    const userId = await requireAuth(supabase);
    if (!userId) {
      return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    }

    const { inviteCode } = await request.json();
    if (!inviteCode || typeof inviteCode !== "string") {
      return applyCookies(NextResponse.json({ error: "Invite code is required" }, { status: 400 }));
    }

    const { data: cls, error: clsErr } = await supabase
      .from("classes")
      .select("id, name, invite_expires_at")
      .eq("invite_code", inviteCode.toUpperCase())
      .single();

    if (clsErr || !cls) {
      return applyCookies(NextResponse.json({ error: "Invalid invite code" }, { status: 404 }));
    }

    if (cls.invite_expires_at && new Date(cls.invite_expires_at) < new Date()) {
      return applyCookies(NextResponse.json({ error: "expired", className: cls.name }, { status: 410 }));
    }

    const { data: existing } = await supabase
      .from("class_members")
      .select("id")
      .eq("class_id", cls.id)
      .eq("student_id", userId)
      .single();

    if (existing) {
      return applyCookies(NextResponse.json({ error: "already_member", className: cls.name }, { status: 409 }));
    }

    const { error: joinErr } = await supabase
      .from("class_members")
      .insert({ class_id: cls.id, student_id: userId });

    if (joinErr) {
      console.error("class_members insert error:", joinErr);
      return applyCookies(NextResponse.json({ error: joinErr.message }, { status: 500 }));
    }

    const { error: rpcErr } = await supabase.rpc("use_invite_code", { p_class_id: cls.id });
    if (rpcErr) {
      console.error("use_invite_code error:", rpcErr);
    }

    return applyCookies(NextResponse.json({ success: true, className: cls.name }));
  } catch (err) {
    console.error("classes/join error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
