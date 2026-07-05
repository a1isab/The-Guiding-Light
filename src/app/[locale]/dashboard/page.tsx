import { getTranslations } from "next-intl/server";
import { createServiceClient, createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Profile, Progress, Subscription, UserBadge } from "@/lib/types";
import { BookOpen, Flame, Crown, TrendingUp, LogOut, Users } from "lucide-react";
import { BadgeGrid } from "@/components/badge-grid";
import { JoinClassCard } from "@/components/join-class-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  const { data: role } = await supabase.rpc("get_user_roles");

  if (role?.includes("admin")) redirect(`/${locale}/admin`);
  if (role?.includes("teacher")) redirect(`/${locale}/teacher`);

  const service = createServiceClient();

  const { data: profile } = await service
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single<Profile>();

  const { data: sub } = await service
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single<Subscription>();

  const { data: progressData } = await service
    .from("progress")
    .select("*")
    .eq("user_id", user.id);

  const completedIds = new Set(progressData?.map((p: Progress) => p.lesson_id) || []);

  const { data: allLessons } = await service
    .from("lessons")
    .select("id");

  const totalLessons = allLessons?.length || 0;
  const completedCount = completedIds.size;
  const percentComplete = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isPremium = sub?.plan === "premium";

  const { data: userBadges } = await service
    .from("user_badges")
    .select("*")
    .eq("user_id", user.id);

  const { data: myMemberships } = await service
    .from("class_members")
    .select("class_id, joined_at")
    .eq("student_id", user.id);

  const myClassIds = myMemberships?.map((m) => m.class_id) ?? [];

  const { data: myClasses } = myClassIds.length
    ? await service
        .from("classes")
        .select("id, name, description")
        .in("id", myClassIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: myCourseCounts } = myClassIds.length
    ? await service
        .from("teacher_courses")
        .select("class_id")
        .in("class_id", myClassIds)
    : { data: [] };

  const courseCounts: Record<string, number> = {};
  for (const c of myCourseCounts ?? []) {
    courseCounts[c.class_id] = (courseCounts[c.class_id] ?? 0) + 1;
  }

  const earnedBadges: { badge_key: string; section_title: string; earned_at: string }[] = [];
  if (userBadges && userBadges.length > 0) {
    for (const badge of userBadges) {
      if (badge.badge_key.startsWith("section_")) {
        const sectionId = badge.badge_key.replace("section_", "");
        const { data: section } = await service
          .from("sections")
          .select("title")
          .eq("id", sectionId)
          .single();
        earnedBadges.push({
          badge_key: badge.badge_key,
          section_title: section?.title ?? "Unknown Section",
          earned_at: badge.earned_at,
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div>
        <h1 className="font-amiri text-3xl font-bold text-zinc-100">
          {t("welcome_back")}{profile ? `, ${user.email?.split("@")[0]}` : ""}!
        </h1>
        <p className="mt-1 text-zinc-500">{t("subtitle")}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <BookOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t("lessons_completed")}</p>
              <p className="text-2xl font-bold text-zinc-100">{completedCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Flame className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t("current_streak")}</p>
              <p className="text-2xl font-bold text-zinc-100">{t("days", { count: profile?.streak ?? 0 })}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isPremium ? "bg-amber-500/10" : "bg-zinc-800"}`}>
              <Crown className={`h-5 w-5 ${isPremium ? "text-amber-400" : "text-zinc-500"}`} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t("your_plan")}</p>
              <p className={`text-2xl font-bold ${isPremium ? "text-amber-400" : "text-zinc-400"}`}>
                {isPremium ? t("premium") : t("free")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {totalLessons > 0 && (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-zinc-300">{t("overall_progress")}</p>
            <p className="text-sm text-zinc-500">{percentComplete}%</p>
          </div>
          <div className="h-2.5 rounded-full bg-zinc-800">
            <div
              className="h-2.5 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            {t("progress_detail", { completed: completedCount, total: totalLessons })}
          </p>
        </div>
      )}

      <BadgeGrid badges={earnedBadges} />

      <JoinClassCard />

      {myClasses && myClasses.length > 0 && (
        <div className="mt-10">
          <h2 className="font-amiri text-xl font-bold text-zinc-100 mb-4">{t("my_classes")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {myClasses.map((cls) => (
              <Link
                key={cls.id}
                href={`/${locale}/dashboard/classes/${cls.id}`}
                className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Users className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{cls.name}</p>
                    <p className="text-xs text-zinc-500">
                      {courseCounts[cls.id] ?? 0} {(t as any)("courses") ?? "courses"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href={`/${locale}/courses`}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <TrendingUp className="h-4 w-4" />
          {t("continue_learning")}
        </Link>
        {!isPremium && (
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center gap-2 rounded-2xl border border-amber-700 bg-amber-500/10 px-6 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-500/20 transition-all"
          >
            <Crown className="h-4 w-4" />
            {t("upgrade_premium")}
          </Link>
        )}
        <a
          href={`/${locale}/auth/logout`}
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-all ml-auto"
        >
          <LogOut className="h-4 w-4" />
          {t("sign_out")}
        </a>
      </div>
    </div>
  );
}
