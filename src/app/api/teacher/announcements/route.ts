import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAuth, extractBearerToken } from "@/lib/supabase-api";

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { classId, title, body } = await request.json();
  if (!classId || !title?.trim() || !body?.trim()) {
    return applyCookies(NextResponse.json({ error: "classId, title, and body required" }, { status: 400 }));
  }

  const { data: cls } = await supabase.from("classes").select("teacher_id").eq("id", classId).single();
  if (!cls || cls.teacher_id !== userId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert({ class_id: classId, teacher_id: userId, title: title.trim(), body: body.trim() })
    .select("id")
    .single();

  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ id: (data as { id: string }).id }));
}

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireAuth(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return applyCookies(NextResponse.json({ error: "id required" }, { status: 400 }));

  const { data: announcement } = await supabase.from("announcements").select("class_id").eq("id", id).single();
  if (!announcement) return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));

  const { data: cls } = await supabase.from("classes").select("teacher_id").eq("id", announcement.class_id).single();
  if (!cls || cls.teacher_id !== userId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  return applyCookies(NextResponse.json({ ok: true }));
}
