import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Admin client not available" }, { status: 500 });

  const { table, data, onConflict } = await request.json();
  if (!table || !data) return NextResponse.json({ error: "table and data required" }, { status: 400 });

  const { error } = await admin.from(table).upsert(data, onConflict ? { onConflict } : undefined);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
