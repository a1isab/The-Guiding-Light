import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { LessonEditor } from "./lesson-editor";

export const dynamic = "force-dynamic";

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; courseId: string; sectionId: string; lessonId: string }>;
}) {
  const { locale, id: classId, courseId, sectionId, lessonId } = await params;
  const t = await getTranslations("teacher");

  const supabase = createServiceClient();

  const { data: lesson } = await supabase
    .from("teacher_lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  return (
    <div>
      <LessonEditor lesson={lesson} locale={locale} />
    </div>
  );
}
