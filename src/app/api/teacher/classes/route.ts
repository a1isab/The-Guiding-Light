import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher } from "@/lib/supabase-api";
import { createServerClient } from "@supabase/ssr";

async function isAdmin(supabase: ReturnType<typeof createServerClient>): Promise<boolean> {
  const { data: role } = await supabase.rpc("get_user_role");
  return role?.includes("admin") ?? false;
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const teacherId = await requireTeacher(supabase);
  if (!teacherId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, description } = await request.json();
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("classes")
    .insert({ teacher_id: teacherId, name: name.trim(), description: description?.trim() || null })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ id: data.id }));
}

export async function PATCH(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const teacherId = await requireTeacher(supabase);
  if (!teacherId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, name, description } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", id)
    .single()).data as { teacher_id: string } | null;

  if (!cls || (cls.teacher_id !== teacherId && !(await isAdmin(supabase)))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("classes")
    .update({ name: name?.trim(), description: description?.trim() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ ok: true }));
}

export async function DELETE(request: NextRequest) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const teacherId = await requireTeacher(supabase);
  if (!teacherId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", id)
    .single()).data as { teacher_id: string } | null;

  if (!cls || (cls.teacher_id !== teacherId && !(await isAdmin(supabase)))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return applyCookies(NextResponse.json({ ok: true }));
}
