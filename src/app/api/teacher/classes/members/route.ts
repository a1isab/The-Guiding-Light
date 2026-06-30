import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function DELETE(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { classId, studentId } = await request.json();
  if (!classId || !studentId) {
    return NextResponse.json({ error: "classId and studentId required" }, { status: 400 });
  }

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", classId)
    .single()).data as { teacher_id: string } | null;

  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()).data as { role: string } | null;

  const isOwner = cls.teacher_id === user.id;
  const isAdmin = profile?.role === "admin";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("class_members")
    .delete()
    .eq("class_id", classId)
    .eq("student_id", studentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
