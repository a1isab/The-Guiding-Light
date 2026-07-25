import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function FeaturedLessonPage({
  params,
}: {
  params: Promise<{ locale: string; classId: string; lessonId: string }>;
}) {
  const { locale, classId, lessonId } = await params;
  const t = await getTranslations("featured");
  const admin = createAdminClient();

  if (!admin) notFound();

  const { data: lesson } = await admin
    .from("teacher_lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const { data: cls } = await admin
    .from("classes")
    .select("id, name")
    .eq("id", classId)
    .single();

  if (!cls) notFound();

  const { data: section } = await admin
    .from("teacher_sections")
    .select("id, title, course_id")
    .eq("id", lesson.section_id)
    .single();

  const { data: course } = section
    ? await admin
        .from("teacher_courses")
        .select("id, title")
        .eq("id", section.course_id)
        .single()
    : { data: null };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs
        items={[
          { label: t("title"), href: `/${locale}/featured` },
          { label: cls.name, href: `/${locale}/featured/classes/${classId}` },
          { label: lesson.title },
        ]}
      />

      <div className="mb-6">
        <Link
          href={`/${locale}/featured/classes/${classId}`}
          className="inline-flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_class")}
        </Link>
      </div>

      <article>
        <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{lesson.title}</h1>

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
          <div
            className="prose prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}

        {lesson.arabic_text && (
          <div
            className="rounded-2xl border p-6 mb-8"
            dir="rtl"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              {t("arabic_text")}
            </p>
            <p className="text-lg leading-relaxed font-arabic" style={{ color: 'var(--text-primary)' }}>
              {lesson.arabic_text}
            </p>
          </div>
        )}
      </article>

      <div
        className="mt-8 rounded-2xl border p-6 text-center"
        style={{ borderColor: 'var(--accent)', backgroundColor: 'color-mix(in srgb, var(--accent) 5%, transparent)' }}
      >
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          {t("join_to_access")}
        </p>
        <Link
          href={`/${locale}/featured/classes/${classId}`}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
          style={{
            backgroundColor: 'var(--success)',
            color: 'var(--text-primary)',
            boxShadow: '0 0 20px color-mix(in srgb, var(--success) 20%, transparent)',
          }}
        >
          {t("join_class")}
        </Link>
      </div>
    </div>
  );
}
