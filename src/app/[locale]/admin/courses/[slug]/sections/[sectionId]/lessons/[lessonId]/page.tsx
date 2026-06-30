import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { LessonEditor } from "./lesson-editor";

export const dynamic = "force-dynamic";

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; sectionId: string; lessonId: string }>;
}) {
  const { locale, lessonId } = await params;
  const t = await getTranslations("admin");
  const supabase = createServiceClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, questions")
    .eq("lesson_id", lessonId)
    .maybeSingle();

  return (
    <div>
      <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">
        {t("edit")}: {lesson.title}
      </h1>

      <LessonEditor
        lesson={lesson}
        quiz={quiz ? { id: quiz.id, questions: quiz.questions as any[] } : null}
        locale={locale}
      />
    </div>
  );
}
