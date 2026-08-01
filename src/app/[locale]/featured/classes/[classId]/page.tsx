import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FeaturedJoinButton } from "@/components/featured-join-button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function FeaturedClassDetailPage({
  params,
}: {
  params: Promise<{ locale: string; classId: string }>;
}) {
  const { locale, classId } = await params;
  const t = await getTranslations("featured");
  const admin = createAdminClient();

  if (!admin) notFound();

  const { data: cls } = await admin
    .from("classes")
    .select("*")
    .eq("id", classId)
    .single();

  if (!cls) notFound();

  const { data: teacherProfile } = await admin
    .from("profiles")
    .select("is_verified, display_name")
    .eq("user_id", cls.teacher_id)
    .single();

  if (!teacherProfile?.is_verified) notFound();

  const { data: courses } = await admin
    .from("teacher_courses")
    .select("id, title, description")
    .eq("class_id", classId)
    .order("order_index", { ascending: true });

  const enrichedCourses = [];
  for (const course of courses ?? []) {
    const { data: sections } = await admin
      .from("teacher_sections")
      .select("id, title")
      .eq("course_id", course.id)
      .order("order_index", { ascending: true });

    const enrichedSections = [];
    for (const section of sections ?? []) {
      const { data: lessons } = await admin
        .from("teacher_lessons")
        .select("id, title")
        .eq("section_id", section.id)
        .order("order_index", { ascending: true });

      enrichedSections.push({
        ...section,
        lessons: lessons ?? [],
      });
    }

    enrichedCourses.push({
      ...course,
      sections: enrichedSections,
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <style>{`
        .lesson-link:hover { color: var(--success); }
      `}</style>
      <Breadcrumbs
        items={[
          { label: t("title"), href: `/${locale}/featured` },
          { label: cls.name },
        ]}
      />

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-h1" style={{ color: 'var(--text-primary)' }}>{cls.name}</h1>
          {cls.description && (
            <p className="mt-2 max-w-2xl" style={{ color: 'var(--text-muted)' }}>{cls.description}</p>
          )}
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t("by_teacher", { name: teacherProfile.display_name ?? "Unknown" })}
          </p>
        </div>
        <FeaturedJoinButton classId={classId} inviteCode={cls.invite_code} />
      </div>

      {enrichedCourses.length === 0 ? (
        <Card className="rounded-2xl border-dashed p-12 text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t("no_courses")}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {enrichedCourses.map((course) => (
            <Card
              key={course.id}
              hoverable
              testId={`featured-curriculum-course-${course.id}`}
              className="curriculum-course"
            >
              <h2 className="text-h4 mb-4" style={{ color: 'var(--text-primary)' }}>{course.title}</h2>
              {course.description && (
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{course.description}</p>
              )}
              {course.sections.length > 0 && (
                <div className="space-y-3">
                  {course.sections.map((section) => (
                    <div key={section.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                      <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{section.title}</h3>
                      {section.lessons.length > 0 && (
                        <div className="space-y-1">
                          {section.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={`/${locale}/featured/classes/${classId}/lessons/${lesson.id}`}
                              data-testid={`featured-lesson-link-${lesson.id}`}
                              className="lesson-link flex items-center gap-2 text-sm transition-colors py-1"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              {lesson.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
