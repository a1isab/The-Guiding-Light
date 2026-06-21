import { createServiceClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import type { Section, Lesson } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const supabase = createServiceClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .single();

  if (!course) notFound();

  const { data: firstSection } = await supabase
    .from("sections")
    .select("id, slug")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true })
    .limit(1)
    .single();

  if (!firstSection) notFound();

  const { data: firstLesson } = await supabase
    .from("lessons")
    .select("slug")
    .eq("section_id", firstSection.id)
    .order("order_index", { ascending: true })
    .limit(1)
    .single();

  if (!firstLesson) notFound();

  redirect(`/courses/${courseSlug}/${firstSection.slug}/${firstLesson.slug}`);
}
