import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import { Users, BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");
  const supabase = createServiceClient();

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: newUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo);

  const { count: totalCompleted } = await supabase
    .from("teacher_progress")
    .select("*", { count: "exact", head: true });

  const { count: totalCourses } = await supabase
    .from("teacher_courses")
    .select("*", { count: "exact", head: true });

  const { data: recentProgress } = await supabase
    .from("teacher_progress")
    .select("viewed_at, student_id, lesson_id")
    .order("viewed_at", { ascending: false })
    .limit(10);

  const stats = [
    { key: "total-users", label: t("total_users"), value: totalUsers ?? 0, icon: Users, iconStyle: { background: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)' } },
    { key: "new-users", label: t("new_users"), value: newUsers ?? 0, icon: TrendingUp, iconStyle: { background: 'color-mix(in srgb, var(--success) 10%, transparent)', color: 'var(--success)' } },
    { key: "lessons-completed", label: t("lessons_completed"), value: totalCompleted ?? 0, icon: CheckCircle, iconStyle: { background: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)' } },
    { key: "total-courses", label: t("total_courses"), value: totalCourses ?? 0, icon: BookOpen, iconStyle: { background: 'color-mix(in srgb, var(--text-secondary) 10%, transparent)', color: 'var(--text-secondary)' } },
  ];

  return (
    <div>
      <h1 className="text-h2" style={{ color: 'var(--text-primary)' }}>{t("title")}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.key} testId={`stat-${s.key}`} hoverable>
            <div className="flex items-center gap-3">
              <div style={s.iconStyle} className="flex h-10 w-10 items-center justify-center rounded-xl">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-h3" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div data-testid="recent-activity" className="mt-8 rounded-2xl border p-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <h2 className="text-h4 mb-4" style={{ color: 'var(--text-primary)' }}>{t("recent_activity")}</h2>
        {recentProgress && recentProgress.length > 0 ? (
          <div data-testid="recent-activity-list" className="space-y-3">
            {recentProgress.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--success)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  Lesson <span style={{ color: 'var(--text-secondary)' }}>{p.lesson_id.slice(0, 8)}</span>
                </span>
                <span className="ml-auto" style={{ color: 'var(--text-muted)' }}>
                  {new Date(p.viewed_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t("no_activity")}</p>
        )}
      </div>
    </div>
  );
}
