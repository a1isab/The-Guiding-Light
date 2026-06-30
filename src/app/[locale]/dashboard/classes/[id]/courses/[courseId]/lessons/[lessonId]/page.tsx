import { getTranslations } from "next-intl/server";
import { createServiceClient, createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompleteButton } from "./complete-button";

export const dynamic = "force-dynamic";

export default async function StudentLessonPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; courseId: string; lessonId: string }>;
}) {
  const { locale, id: classId, courseId, lessonId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const service = createServiceClient();

  const { data: lesson } = await service
    .from("teacher_lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const isCompleted = !!(await service
    .from("progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .single()).data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href={`/${locale}/dashboard/classes/${classId}/courses/${courseId}`}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {(await getTranslations("dashboard"))("back")}
      </Link>

      <article className="prose prose-invert max-w-none">
        <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">{lesson.title}</h1>

        {lesson.video_url && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <iframe
              src={lesson.video_url}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {lesson.content && (
          <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {lesson.content}
          </div>
        )}
      </article>

      <div className="mt-10 pt-8 border-t border-zinc-800">
        <CompleteButton lessonId={lessonId} classId={classId} courseId={courseId} initialCompleted={isCompleted} />
      </div>
    </div>
  );
}
