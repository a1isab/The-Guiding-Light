import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher } from "@/lib/supabase-api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, applyCookies } = createApiSupabaseClient(request);
  const userId = await requireTeacher(supabase);
  if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { data: template } = await supabase
    .from("teacher_lesson_templates")
    .select("teacher_id")
    .eq("id", id)
    .single();

  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (template.teacher_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("teacher_lesson_templates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return applyCookies(NextResponse.json({ ok: true }));
}
