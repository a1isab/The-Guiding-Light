import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function createSupabase(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );
}

async function getTeacherId(supabase: ReturnType<typeof createServerClient>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()).data as { role: string } | null;
  if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) return null;
  return user.id;
}

export async function POST(request: NextRequest) {
  const supabase = createSupabase(request);
  const teacherId = await getTeacherId(supabase);
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

  return NextResponse.json({ id: data.id });
}

export async function PATCH(request: NextRequest) {
  const supabase = createSupabase(request);
  const teacherId = await getTeacherId(supabase);
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

  if (!cls || (cls.teacher_id !== teacherId && !(await isAdmin(supabase, teacherId)))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("classes")
    .update({ name: name?.trim(), description: description?.trim() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = createSupabase(request);
  const teacherId = await getTeacherId(supabase);
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

  if (!cls || (cls.teacher_id !== teacherId && !(await isAdmin(supabase, teacherId)))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

async function isAdmin(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<boolean> {
  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single()).data as { role: string } | null;
  return profile?.role === "admin";
}
