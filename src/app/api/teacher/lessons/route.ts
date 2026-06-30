import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

async function authorize(supabase: ReturnType<typeof createServerClient>, sectionId: string, userId: string): Promise<boolean> {
  const section = (await supabase
    .from("teacher_sections")
    .select("course_id")
    .eq("id", sectionId)
    .single()).data as { course_id: string } | null;
  if (!section) return false;

  const course = (await supabase
    .from("teacher_courses")
    .select("class_id")
    .eq("id", section.course_id)
    .single()).data as { class_id: string } | null;
  if (!course) return false;

  const cls = (await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", course.class_id)
    .single()).data as { teacher_id: string } | null;
  if (!cls) return false;

  if (cls.teacher_id === userId) return true;

  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single()).data as { role: string } | null;
  return profile?.role === "admin";
}

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

  const { sectionId, title, orderIndex, content, videoUrl } = await request.json();
  if (!sectionId || !title) {
    return NextResponse.json({ error: "sectionId and title required" }, { status: 400 });
  }

  if (!(await authorize(supabase, sectionId, user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("teacher_lessons").insert({
    section_id: sectionId,
    title: title.trim(),
    content: content ?? null,
    video_url: videoUrl ?? null,
    order_index: orderIndex ?? 0,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
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

  const { id, title, content, videoUrl, duration, orderIndex } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const lesson = (await supabase
    .from("teacher_lessons")
    .select("section_id")
    .eq("id", id)
    .single()).data as { section_id: string } | null;

  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!(await authorize(supabase, lesson.section_id, user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title.trim();
  if (content !== undefined) updates.content = content;
  if (videoUrl !== undefined) updates.video_url = videoUrl;
  if (duration !== undefined) updates.duration = duration;
  if (orderIndex !== undefined) updates.order_index = orderIndex;

  const { error } = await supabase.from("teacher_lessons").update(updates).eq("id", id);
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

  const lesson = (await supabase
    .from("teacher_lessons")
    .select("section_id")
    .eq("id", id)
    .single()).data as { section_id: string } | null;

  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!(await authorize(supabase, lesson.section_id, user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("teacher_lessons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
