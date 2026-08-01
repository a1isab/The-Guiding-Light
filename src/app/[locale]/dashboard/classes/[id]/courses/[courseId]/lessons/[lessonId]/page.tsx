import { getTranslations } from "next-intl/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import { LessonContentView } from "./lesson-content-view";
import { BookmarkButton } from "@/components/bookmark-button";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function StudentLessonPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; courseId: string; lessonId: string }>;
}) {
  const { locale, id: classId, courseId, lessonId } = await params;
  const t = await getTranslations("dashboard");
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) redirect(`/${locale}/auth/login`);

  const dataClient = createAdminClient() ?? supabase;

  const { data: lesson } = await dataClient
    .from("teacher_lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const [{ data: cls }, { data: course }] = await Promise.all([
    dataClient.from("classes").select("name").eq("id", classId).single(),
    dataClient.from("teacher_courses").select("title").eq("id", courseId).single(),
  ]);

  // Fetch all lessons in the course for prev/next navigation
  const { data: sections } = await dataClient
    .from("teacher_sections")
    .select("id")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  const sectionIds = sections?.map((s) => s.id) ?? [];

  const { data: allLessons } = sectionIds.length
    ? await dataClient
        .from("teacher_lessons")
        .select("id, title, section_id, order_index")
        .in("section_id", sectionIds)
        .order("order_index", { ascending: true })
    : { data: [] };

  // Compute prev/next
  const currentIndex = allLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons![currentIndex - 1] : null;
  const nextLesson = currentIndex < (allLessons?.length ?? 0) - 1 ? allLessons![currentIndex + 1] : null;

  const { data: progress } = await dataClient
    .from("teacher_progress")
    .select("content_viewed_at")
    .eq("student_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const contentViewedAt = progress?.content_viewed_at ?? null;

  const { count: quizCount } = await dataClient
    .from("teacher_quiz_questions")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", lessonId);

  const hasQuiz = (quizCount ?? 0) > 0;

  const { data: lessonFiles } = await dataClient
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
      <style>{`
        .file-link:hover { border-color: var(--border); background-color: var(--bg-elevated); }
      `}</style>
      <Breadcrumbs
        items={[
          { label: t("my_classes"), href: `/${locale}/dashboard` },
          { label: cls?.name ?? "Class", href: `/${locale}/dashboard/classes/${classId}` },
          { label: course?.title ?? "Course", href: `/${locale}/dashboard/classes/${classId}/courses/${courseId}` },
          { label: lesson.title },
        ]}
      />

      <article>
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-h2" style={{ color: 'var(--text-primary)' }}>{lesson.title}</h1>
          <BookmarkButton lessonId={lessonId} />
        </div>

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
          prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null}
          nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
          classId={classId}
          courseId={courseId}
          locale={locale}
        />
      </article>

      {lessonFiles && lessonFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Lesson Files</h2>
          <div className="space-y-2">
            {lessonFiles.map((f) => (
              <a
                key={f.id}
                href={`${storageUrl}/${f.storage_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="file-link flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)', color: 'var(--success)' }}>
                  {getFileIcon(f.mime_type)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{f.filename}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatFileSize(f.file_size)}</p>
                </div>
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
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
