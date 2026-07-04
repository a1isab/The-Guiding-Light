import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireAdmin } from "@/lib/supabase-api";

export async function GET(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAdmin(supabase);
  if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data } = await supabase
    .from("teacher_lesson_templates")
    .select("*")
    .eq("is_official", true)
    .order("name");

  return applyCookies(NextResponse.json({ templates: data ?? [] }));
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAdmin(supabase);
  if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, description, content } = await request.json();
  if (!name || !content) {
    return NextResponse.json({ error: "name and content required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("teacher_lesson_templates")
    .insert({
      teacher_id: null,
      is_official: true,
      name: name.trim(),
      description: description ?? null,
      content,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return applyCookies(NextResponse.json({ ok: true, id: data?.id }));
}

export async function PATCH(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAdmin(supabase);
  if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, name, description, content } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name.trim();
  if (description !== undefined) updates.description = description;
  if (content !== undefined) updates.content = content;

  const { error } = await supabase.from("teacher_lesson_templates").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return applyCookies(NextResponse.json({ ok: true }));
}

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireAdmin(supabase);
  if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("teacher_lesson_templates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return applyCookies(NextResponse.json({ ok: true }));
}
