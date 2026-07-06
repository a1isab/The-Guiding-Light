import { getTranslations } from "next-intl/server";
import { createServiceClient, createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Course, Section, Lesson, Locale } from "@/lib/types";
import { getTranslation } from "@/lib/types";
import { LessonViewer } from "./lesson-viewer";
import { VideoPlayer } from "@/components/video-player";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; courseSlug: string; sectionSlug: string; lessonSlug: string }>;
}) {
  const { locale: rawLocale, courseSlug, sectionSlug, lessonSlug } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations("courses");
  const supabase = createServiceClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", courseSlug)
    .single();

  if (!course) notFound();

  const { data: section } = await supabase
    .from("sections")
    .select("*")
    .eq("course_id", course.id)
    .eq("slug", sectionSlug)
    .single();

  if (!section) notFound();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("section_id", section.id)
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) notFound();

  const { data: allLessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("section_id", section.id)
    .order("order_index", { ascending: true });

  const currentIndex = allLessons?.findIndex((l: Lesson) => l.id === lesson.id) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex < (allLessons?.length ?? 0) - 1 ? allLessons?.[currentIndex + 1] : null;

  const sb = await createServerSupabaseClient();
  const { data: { user } } = await sb.auth.getUser();

  // Social proof: count students who completed this lesson
  const { count: lessonCompletedCount } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", lesson.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href={`/${locale}/courses`} className="hover:text-emerald-400 transition-colors">{t("breadcrumb_courses")}</Link>
        <span className="text-zinc-700">/</span>
        <Link href={`/${locale}/courses/${courseSlug}`} className="hover:text-emerald-400 transition-colors">
          {getTranslation(course, "title", locale, course.title)}
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300">
          {getTranslation(lesson, "title", locale, lesson.title)}
        </span>
      </nav>

      <h1 className="font-amiri text-3xl font-bold text-zinc-100">
        {getTranslation(lesson, "title", locale, lesson.title)}
      </h1>

      <p className="mt-1 text-xs text-zinc-600">
        {lessonCompletedCount ?? 0} students completed this lesson
      </p>

      <VideoPlayer src={lesson.video_url} />

      <LessonViewer
        lesson={lesson}
        userId={user?.id ?? null}
        courseSlug={courseSlug}
        sectionSlug={sectionSlug}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    </div>
  );
}
