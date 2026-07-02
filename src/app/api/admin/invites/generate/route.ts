import { type NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAdmin } from "@/lib/supabase-api";
import crypto from "crypto";

function generateCode(): string {
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TCH-${rand}`;
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAdmin(supabase);
  if (!userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const code = generateCode();

  const { error } = await supabase
    .from("teacher_invites")
    .insert({ code, created_by: userId });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ code }));
}
