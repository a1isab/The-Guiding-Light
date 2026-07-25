import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Admin client not available" }, { status: 500 });

  const { table, data, onConflict } = await request.json();
  if (!table || !data) return NextResponse.json({ error: "table and data required" }, { status: 400 });

  // Ensure profiles always have onboarded: true for test accounts
  const payload = table === "profiles"
    ? (Array.isArray(data) ? data.map((d: Record<string, unknown>) => ({ ...d, onboarded: true })) : { ...data, onboarded: true })
    : data;

  const { error } = await admin.from(table).upsert(payload, onConflict ? { onConflict } : undefined);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
