import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher, getUserRole, extractBearerToken, withErrorHandling } from "@/lib/supabase-api";
import { createServerClient } from "@supabase/ssr";

async function isAdmin(supabase: ReturnType<typeof createServerClient>): Promise<boolean> {
  const role = await getUserRole(supabase);
  return role?.includes("admin") ?? false;
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const teacherId = await requireTeacher(supabase, jwt);
  if (!teacherId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { name, description } = await request.json();
  if (!name || typeof name !== "string" || !name.trim()) {
    return applyCookies(NextResponse.json({ error: "Name is required" }, { status: 400 }));
  }

  const { data, error } = await supabase
    .from("classes")
    .insert({ teacher_id: teacherId, name: name.trim(), description: description?.trim() || null })
    .select("id")
    .single();

  if (error) {
    return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  }

  return applyCookies(NextResponse.json({ id: data.id }));
});

export const PATCH = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const teacherId = await requireTeacher(supabase, jwt);
  if (!teacherId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { id, name, description } = await request.json();
  if (!id) {
    return applyCookies(NextResponse.json({ error: "Class ID is required" }, { status: 400 }));
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", id)
    .single()).data as { teacher_id: string } | null;

  if (!cls || (cls.teacher_id !== teacherId && !(await isAdmin(supabase)))) {
    return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));
  }

  const { error } = await supabase
    .from("classes")
    .update({ name: name?.trim(), description: description?.trim() })
    .eq("id", id);

  if (error) {
    return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  }

  return applyCookies(NextResponse.json({ ok: true }));
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const jwt = extractBearerToken(request);
  const teacherId = await requireTeacher(supabase, jwt);
  if (!teacherId) {
    return applyCookies(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return applyCookies(NextResponse.json({ error: "Class ID is required" }, { status: 400 }));
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", id)
    .single()).data as { teacher_id: string } | null;

  if (!cls || (cls.teacher_id !== teacherId && !(await isAdmin(supabase)))) {
    return applyCookies(NextResponse.json({ error: "Not found" }, { status: 404 }));
  }

  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) {
    return applyCookies(NextResponse.json({ error: error.message }, { status: 500 }));
  }

  return applyCookies(NextResponse.json({ ok: true }));
});
