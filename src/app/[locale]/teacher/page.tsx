import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("teacher");
  const supabase = await createServerSupabaseClient();

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const classIds = classes?.map((c) => c.id) ?? [];

  const { count: totalStudents } = classIds.length
    ? await supabase
        .from("class_members")
        .select("*", { count: "exact", head: true })
        .in("class_id", classIds)
    : { count: 0 };

  const { count: totalCourses } = classIds.length
    ? await supabase
        .from("teacher_courses")
        .select("*", { count: "exact", head: true })
        .in("class_id", classIds)
    : { count: 0 };

  const stats = [
    { label: t("total_classes"), value: classes?.length ?? 0, icon: LayoutDashboard, iconBg: "var(--accent)", iconColor: "var(--accent)" },
    { label: t("total_students"), value: totalStudents ?? 0, icon: Users, iconBg: "var(--accent)", iconColor: "var(--accent)" },
    { label: t("total_courses"), value: totalCourses ?? 0, icon: BookOpen, iconBg: "var(--accent)", iconColor: "var(--accent)" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t("dashboard")}</h1>
        <Link
          href={`/${locale}/teacher/classes/new`}
          data-testid="new-class"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent)] transition-all"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="h-4 w-4" />
          {t("new_class")}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-3">
              <div className="rounded-xl p-2.5" style={{ backgroundColor: `color-mix(in srgb, ${stat.iconBg} 10%, transparent)` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.iconColor }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t("recent_classes")}</h2>
          <Link
            href={`/${locale}/teacher/classes`}
            className="text-xs transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--accent)' }}
          >
            {t("view_all")}
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {classes?.length ? (
            classes.map((c) => (
              <Link
                key={c.id}
                href={`/${locale}/teacher/classes/${c.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>{t("no_classes")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
