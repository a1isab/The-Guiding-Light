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
    { label: t("total_classes"), value: classes?.length ?? 0, icon: LayoutDashboard, color: "bg-blue-500/10 text-blue-400" },
    { label: t("total_students"), value: totalStudents ?? 0, icon: Users, color: "bg-emerald-500/10 text-emerald-400" },
    { label: t("total_courses"), value: totalCourses ?? 0, icon: BookOpen, color: "bg-purple-500/10 text-purple-400" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-amiri text-2xl font-bold text-zinc-100">{t("dashboard")}</h1>
        <Link
          href={`/${locale}/teacher/classes/new`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-all"
        >
          <Plus className="h-4 w-4" />
          {t("new_class")}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-800 bg-[#111111] p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-[#111111]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">{t("recent_classes")}</h2>
          <Link
            href={`/${locale}/teacher/classes`}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {t("view_all")}
          </Link>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {classes?.length ? (
            classes.map((c) => (
              <Link
                key={c.id}
                href={`/${locale}/teacher/classes/${c.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-900/30 transition-colors"
              >
                <span className="text-sm text-zinc-300">{c.name}</span>
                <span className="text-xs text-zinc-600">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-zinc-500 text-center">{t("no_classes")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
