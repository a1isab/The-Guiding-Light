import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import { Users, BookOpen, CheckCircle, TrendingUp } from "lucide-react";

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
    .from("progress")
    .select("*", { count: "exact", head: true });

  const { count: totalCourses } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { data: recentProgress } = await supabase
    .from("progress")
    .select("completed_at, user_id, lesson_id")
    .order("completed_at", { ascending: false })
    .limit(10);

  const stats = [
    { label: t("total_users"), value: totalUsers ?? 0, icon: Users, color: "bg-blue-500/10 text-blue-400" },
    { label: t("new_users"), value: newUsers ?? 0, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-400" },
    { label: t("lessons_completed"), value: totalCompleted ?? 0, icon: CheckCircle, color: "bg-amber-500/10 text-amber-400" },
    { label: t("total_courses"), value: totalCourses ?? 0, icon: BookOpen, color: "bg-purple-500/10 text-purple-400" },
  ];

  return (
    <div>
      <h1 className="font-amiri text-2xl font-bold text-zinc-100">{t("title")}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-800 bg-[#111111] p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">{s.value}</p>
                <p className="text-xs text-zinc-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6">
        <h2 className="font-amiri text-lg font-bold text-zinc-100 mb-4">{t("recent_activity")}</h2>
        {recentProgress && recentProgress.length > 0 ? (
          <div className="space-y-3">
            {recentProgress.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-zinc-400">
                  Lesson <span className="text-zinc-300">{p.lesson_id.slice(0, 8)}</span>
                </span>
                <span className="text-zinc-600 ml-auto">
                  {new Date(p.completed_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">{t("no_activity")}</p>
        )}
      </div>
    </div>
  );
}
