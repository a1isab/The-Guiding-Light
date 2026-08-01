import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, BookOpen, BarChart3 } from "lucide-react";
import { InviteCodeDisplay } from "./invite-code";
import { StudentTable } from "./students/student-table";
import { AnnouncementSection } from "@/components/announcement-section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("teacher");
  const supabase = await createServerSupabaseClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cls) notFound();

  const { data: members } = await supabase
    .from("class_members")
    .select("student_id, joined_at")
    .eq("class_id", id);

  const studentIds = members?.map((m) => m.student_id) ?? [];

  const { data: profiles } = studentIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, role, display_name")
        .in("user_id", studentIds)
    : { data: [] };

  const studentProfiles = profiles ?? [];
  const enrichedMembers = (members ?? []).map((m) => ({
    ...m,
    profile: studentProfiles.find((p) => p.user_id === m.student_id),
  }));

  const { data: courses } = await supabase
    .from("teacher_courses")
    .select("id, title, order_index, created_at")
    .eq("class_id", id)
    .order("order_index", { ascending: true });

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://theguidinglight.app"}/${locale}/join/${cls.invite_code}`;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t("classes"), href: `/${locale}/teacher/classes` },
          { label: cls.name },
        ]}
      />

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 data-testid="class-heading" className="text-h2" style={{ color: 'var(--text-primary)' }}>{cls.name}</h1>
          {cls.description && (
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{cls.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {members?.length ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {courses?.length ?? 0}
          </span>
        </div>
      </div>

      {/* Invite Code */}
      <InviteCodeDisplay code={cls.invite_code} url={inviteUrl} locale={locale} classId={id} />

      {/* Progress Link */}
      <div className="mt-6">
        <Link
          data-testid="view-progress"
          href={`/${locale}/teacher/classes/${id}/progress`}
          className="flex items-center gap-2 rounded-xl border px-4 py-3 hover:bg-[var(--bg-elevated)] transition-colors"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
        >
          <BarChart3 className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{t("view_progress")}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t("view_progress_desc")}</p>
          </div>
        </Link>
      </div>

      {/* Analytics Link */}
      <div className="mt-3">
        <Link
          data-testid="view-analytics"
          href={`/${locale}/teacher/classes/${id}/analytics`}
          className="flex items-center gap-2 rounded-xl border px-4 py-3 hover:bg-[var(--bg-elevated)] transition-colors"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
        >
          <BarChart3 className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Class Analytics</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>View quiz scores, completion rates, and at-risk students</p>
          </div>
        </Link>
      </div>

      {/* Students */}
      <div className="mt-8 rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 data-testid="students-heading" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t("students")}</h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{members?.length ?? 0}</span>
        </div>
        <StudentTable members={enrichedMembers} locale={locale} classId={id} />
      </div>

      {/* Courses */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 data-testid="courses-heading" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t("courses")}</h2>
          <Button
            testId="new-course-link"
            size="sm"
            href={`/${locale}/teacher/classes/${id}/courses/new`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t("new_course")}
          </Button>
        </div>

        {courses?.length ? (
          <div className="space-y-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/${locale}/teacher/classes/${id}/courses/${course.id}`}
                className="flex items-center justify-between rounded-xl border px-4 py-3 hover:bg-[var(--bg-elevated)] transition-colors"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
              >
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{course.title}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-8 rounded-2xl border border-dashed" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
            {t("no_courses")}
          </p>
        )}
      </div>

      {/* Announcements */}
      <div className="mt-8">
        <AnnouncementSection classId={id} />
      </div>
    </div>
  );
}
