import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher, extractBearerToken } from "@/lib/supabase-api";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireTeacher(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));

  const { data } = await supabase
    .from("teacher_lesson_templates")
    .select("*")
    .or(`teacher_id.eq.${userId},is_official.eq.true`)
    .order("name");

  return applyCookies(NextResponse.json({ templates: data ?? [] }));
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const userId = await requireTeacher(supabase, jwt);
  if (!userId) return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));

  const { name, description, content } = await request.json();
  if (!name || !content) {
    return NextResponse.json({ error: "name and content required" }, { status: 400 });
  }

  const { error } = await supabase.from("teacher_lesson_templates").insert({
    teacher_id: userId,
    name: name.trim(),
    description: description ?? null,
    content: content,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return applyCookies(NextResponse.json({ ok: true }));
}
