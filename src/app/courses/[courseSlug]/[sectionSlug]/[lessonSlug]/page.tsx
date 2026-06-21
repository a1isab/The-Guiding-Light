import { createServiceClient, createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Course, Section, Lesson } from "@/lib/types";
import { LessonViewer } from "./lesson-viewer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoPlayer } from "@/components/video-player";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; sectionSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, sectionSlug, lessonSlug } = await params;
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
        <span className="text-zinc-700">/</span>
        <Link href={`/courses/${courseSlug}`} className="hover:text-emerald-400 transition-colors">{course.title}</Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300">{lesson.title}</span>
      </nav>

      <h1 className="font-amiri text-3xl font-bold text-zinc-100">{lesson.title}</h1>

      <VideoPlayer src={lesson.video_url} />

      <LessonViewer lesson={lesson} userId={user?.id ?? null} />

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-zinc-800 pt-6">
        {prevLesson ? (
          <Link
            href={`/courses/${courseSlug}/${sectionSlug}/${prevLesson.slug}`}
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {prevLesson.title}
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/courses/${courseSlug}/${sectionSlug}/${nextLesson.slug}`}
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {nextLesson.title}
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
