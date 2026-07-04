import { getTranslations } from "next-intl/server";
import { createServiceClient, createServerSupabaseClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LessonContentView } from "./lesson-content-view";

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

  const { data: progress } = await service
    .from("progress")
    .select("content_viewed_at")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const contentViewedAt = progress?.content_viewed_at ?? null;

  const { count: quizCount } = await service
    .from("teacher_quiz_questions")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", lessonId);

  const hasQuiz = (quizCount ?? 0) > 0;

  const { data: lessonFiles } = await service
    .from("teacher_lesson_files")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: false });

  const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lesson-files`;

  function getFileIcon(mime: string): string {
    if (mime === "application/pdf") return "PDF";
    if (mime.includes("word")) return "DOC";
    if (mime === "text/plain") return "TXT";
    return "FILE";
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href={`/${locale}/dashboard/classes/${classId}/courses/${courseId}`}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {(await getTranslations("dashboard"))("back")}
      </Link>

      <article>
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

        <LessonContentView
          lessonId={lessonId}
          lessonContent={lesson.content}
          videoUrl={lesson.video_url}
          initialViewedAt={contentViewedAt}
          hasQuiz={hasQuiz}
        />
      </article>

      {lessonFiles && lessonFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Lesson Files</h2>
          <div className="space-y-2">
            {lessonFiles.map((f) => (
              <a
                key={f.id}
                href={`${storageUrl}/${f.storage_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 hover:border-zinc-600 transition-all"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                  {getFileIcon(f.mime_type)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-200 truncate">{f.filename}</p>
                  <p className="text-xs text-zinc-600">{formatFileSize(f.file_size)}</p>
                </div>
                <svg className="h-4 w-4 flex-shrink-0 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
