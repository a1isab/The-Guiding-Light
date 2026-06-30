import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
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
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId, title, orderIndex } = await request.json();
  if (!courseId || !title) {
    return NextResponse.json({ error: "courseId and title required" }, { status: 400 });
  }

  const course = (await supabase
    .from("teacher_courses")
    .select("class_id")
    .eq("id", courseId)
    .single()).data as { class_id: string } | null;

  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", course.class_id)
    .single()).data as { teacher_id: string } | null;

  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()).data as { role: string } | null;

  if (!cls || (cls.teacher_id !== user.id && profile?.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("teacher_sections").insert({
    course_id: courseId,
    title: title.trim(),
    order_index: orderIndex ?? 0,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

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
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const section = (await supabase
    .from("teacher_sections")
    .select("course_id")
    .eq("id", id)
    .single()).data as { course_id: string } | null;

  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const course = (await supabase
    .from("teacher_courses")
    .select("class_id")
    .eq("id", section.course_id)
    .single()).data as { class_id: string } | null;

  const cls = course
    ? (await supabase.from("classes").select("teacher_id").eq("id", course.class_id).single()).data as { teacher_id: string } | null
    : null;

  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()).data as { role: string } | null;

  if (!cls || (cls.teacher_id !== user.id && profile?.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("teacher_sections").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
