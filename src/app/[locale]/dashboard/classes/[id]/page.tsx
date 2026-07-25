import { getTranslations } from "next-intl/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function StudentClassPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("dashboard");
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) redirect(`/${locale}/auth/login`);

  const dataClient = createAdminClient() ?? supabase;

  const { data: membership } = await dataClient
    .from("class_members")
    .select("id")
    .eq("class_id", id)
    .eq("student_id", userId)
    .single();

  if (!membership) {
    const { data: profile } = await dataClient
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .single<{ role: string }>();
    if (profile?.role !== "admin") notFound();
  }

  const { data: cls } = await dataClient
    .from("classes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cls) notFound();

  const { data: courses } = await dataClient
    .from("teacher_courses")
    .select("id, title, description")
    .eq("class_id", id)
    .order("order_index", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <style>{`
        .course-card:hover { border-color: var(--border); background-color: var(--bg-elevated); }
      `}</style>
      <Breadcrumbs
        items={[
          { label: t("my_classes"), href: `/${locale}/dashboard` },
          { label: cls.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{cls.name}</h1>
        {cls.description && (
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{cls.description}</p>
        )}
      </div>

      <AnnouncementBanner classId={id} />

      {courses && courses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course, idx) => (
            <Link
              key={course.id}
              data-testid={`class-course-card-${course.id}`}
              href={`/${locale}/dashboard/classes/${id}/courses/${course.id}`}
              className="course-card rounded-2xl border p-5 transition-all"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)', color: 'var(--success)' }}>
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                  {course.description && (
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{course.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center" style={{ borderColor: 'var(--border)' }}>
          <BookOpen className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{(await getTranslations("teacher"))("no_courses")}</p>
        </div>
      )}
    </div>
  );
}
