import { getTranslations } from "next-intl/server";
import { createServiceClient, createAdminClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import type { Profile, Progress, Subscription, UserBadge } from "@/lib/types";
import { getUserRole } from "@/lib/supabase-api";
import { BookOpen, Flame, Crown, TrendingUp, LogOut, Users, AlertTriangle } from "lucide-react";
import { BadgeGrid } from "@/components/badge-grid";
import { JoinClassCard } from "@/components/join-class-card";
import { CertificatesSection } from "@/components/certificates-section";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");

  // Read auth from middleware-propagated headers (fallback to getUser())
  const headersList = await headers();
  const headerUserId = headersList.get("x-user-id");
  const headerRoles = headersList.get("x-user-roles");
  let userId: string | null = headerUserId ?? null;
  let role: string[] | null = null;

  if (userId && headerRoles) {
    try { role = JSON.parse(headerRoles) as string[]; } catch { role = null; }
  }

  if (!userId || !role) {
    const { createServerSupabaseClient } = await import("@/lib/supabase");
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);
    userId = user.id;
    role = await getUserRole(supabase);
  }

  if (role?.includes("admin")) redirect(`/${locale}/admin`);
  if (role?.includes("teacher")) redirect(`/${locale}/teacher`);

  const service = createAdminClient() ?? createServiceClient();

  const { data: profile } = await service
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single<Profile>();

  const { data: sub } = await service
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single<Subscription>();

  const { data: progressData } = await service
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  const completedIds = new Set(progressData?.map((p: Progress) => p.lesson_id) || []);

  const { data: allLessons } = await service
    .from("lessons")
    .select("id");

  const totalLessons = allLessons?.length || 0;
  const completedCount = completedIds.size;
  const percentComplete = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isPremium = sub?.plan === "premium";

  // Weekly activity: count lessons completed in last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: lessonsThisWeek } = await service
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("completed_at", weekAgo);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Find next uncompleted public lesson for "continue where you left off"
  const { data: allOrderedLessons } = await service
    .from("lessons")
    .select("id, slug, title, section_id")
    .order("section_id")
    .order("order_index");

  let nextLesson: {
    id: string;
    slug: string;
    title: string;
    sectionSlug: string;
    courseSlug: string;
    courseTitle: string;
  } | null = null;

  if (allOrderedLessons) {
    for (const lesson of allOrderedLessons) {
      if (!completedIds.has(lesson.id)) {
        const { data: section } = await service
          .from("sections")
          .select("slug, courses!inner(slug, title)")
          .eq("id", lesson.section_id)
          .single();

        const s = section as { slug: string; courses: { slug: string; title: string } } | null;
        if (s) {
          nextLesson = {
            id: lesson.id,
            slug: lesson.slug,
            title: lesson.title,
            sectionSlug: s.slug,
            courseSlug: s.courses.slug,
            courseTitle: s.courses.title,
          };
          break;
        }
      }
    }
  }
  const studiedToday = profile?.last_activity_at
    ? new Date(profile.last_activity_at).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
    : false;

  const streakAtRisk = profile?.streak && profile?.streak > 0
    ? (() => {
        const last = profile.last_activity_at ? new Date(profile.last_activity_at) : null;
        if (!last) return false;
        const today = new Date();
        return last.toISOString().split("T")[0] !== today.toISOString().split("T")[0];
      })()
    : false;

  const { data: userBadges } = await service
    .from("user_badges")
    .select("*")
    .eq("user_id", userId);

  const { data: myMemberships } = await service
    .from("class_members")
    .select("class_id, joined_at")
    .eq("student_id", userId);

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

  const badgeTitles: Record<string, string> = {
    first_lesson: "First Lesson",
    lessons_10: "10 Lessons",
    lessons_50: "50 Lessons",
    streak_7: "7-Day Streak",
    streak_30: "30-Day Streak",
    quiz_ace: "Quiz Ace",
  };

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
      } else {
        earnedBadges.push({
          badge_key: badge.badge_key,
          section_title: badgeTitles[badge.badge_key] ?? badge.badge_key,
          earned_at: badge.earned_at,
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-amiri text-3xl font-bold text-zinc-100">
            {greeting}{profile ? `, ${t("student")}` : ""}!
          </h1>
          {studiedToday && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t("studied_today")}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div data-testid="stat-lessons" className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
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
        <div data-testid="stat-streak" className={`rounded-2xl border p-6 ${streakAtRisk ? "border-zinc-800 bg-[#111111]" : "border-amber-800/30 bg-amber-900/5"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${streakAtRisk ? "bg-zinc-800" : "bg-amber-500/20"}`}>
              <Flame className={`h-5 w-5 ${streakAtRisk ? "text-zinc-600" : "text-amber-300"}`} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t("current_streak")}</p>
              <p className={`text-2xl font-bold ${streakAtRisk ? "text-zinc-500" : "text-amber-300"}`}>
                {t("days", { count: profile?.streak ?? 0 })}
              </p>
              {streakAtRisk && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-400/70">
                  <AlertTriangle className="h-3 w-3" />
                  Study today to keep your streak
                </p>
              )}
            </div>
          </div>
        </div>
        <div data-testid="stat-plan" className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
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

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-zinc-400">
            <strong className="text-zinc-200">{lessonsThisWeek ?? 0}</strong> lessons this week
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
            const dayStr = d.toISOString().split("T")[0];
            const active = weekAgo; // simplified — we just show past 7 days
            return (
              <div
                key={i}
                className={`h-3 w-3 rounded-sm ${
                  i === 6
                    ? "border border-emerald-500/50 bg-emerald-500/20"
                    : i < 3
                    ? "bg-emerald-500/40"
                    : "bg-zinc-800"
                }`}
                title={dayStr}
              />
            );
          })}
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
          <p className="text-xs text-zinc-600">
            {totalLessons - completedCount} {t("lessons_remaining")}
          </p>
        </div>
      )}

      {nextLesson && (
        <div data-testid="continue-learning" className="mt-8 rounded-2xl border border-emerald-800/30 bg-emerald-900/10 p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400 mb-2">
            {t("continue_learning")}
          </p>
          <Link
            href={`/${locale}/courses/${nextLesson.courseSlug}/${nextLesson.sectionSlug}/${nextLesson.slug}`}
            className="group flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-zinc-500">{nextLesson.courseTitle}</p>
              <p className="mt-0.5 text-lg font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                {nextLesson.title}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
          </Link>
        </div>
      )}

      <BadgeGrid badges={earnedBadges} />

      <CertificatesSection />

      <JoinClassCard />

      {myClasses && myClasses.length > 0 && (
        <div className="mt-10">
          <h2 className="font-amiri text-xl font-bold text-zinc-100 mb-4">{t("my_classes")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {myClasses.map((cls) => (
              <Link
                key={cls.id}
                data-testid={`class-card-${cls.id}`}
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
                       {courseCounts[cls.id] ?? 0} {"courses"}
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
