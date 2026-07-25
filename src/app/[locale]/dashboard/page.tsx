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

  // Redirect to onboarding if not completed
  if (profile && !profile.onboarded) {
    redirect(`/${locale}/onboarding`);
  }

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
      <style>{`
        .card-hover:hover { border-color: var(--border); background-color: var(--bg-elevated); }
        .sign-out-btn:hover { background-color: var(--bg-subtle); }
        .cta-primary:hover { background-color: color-mix(in srgb, var(--success) 90%, transparent); }
        .cta-upgrade:hover { background-color: color-mix(in srgb, var(--accent) 20%, transparent); }
        .continue-link:hover .continue-title { color: var(--success); }
      `}</style>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {greeting}{profile ? `, ${profile.display_name || t("student")}` : ""}!
          </h1>
          {studiedToday && (
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 15%, transparent)', color: 'var(--success)' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              {t("studied_today")}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div data-testid="stat-lessons" className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)' }}>
              <BookOpen className="h-5 w-5" style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t("lessons_completed")}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedCount}</p>
            </div>
          </div>
        </div>
        <div data-testid="stat-streak" className="rounded-2xl border p-6" style={{ borderColor: streakAtRisk ? 'var(--border)' : 'color-mix(in srgb, var(--accent) 30%, transparent)', backgroundColor: streakAtRisk ? 'var(--bg-surface)' : 'color-mix(in srgb, var(--accent) 5%, transparent)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: streakAtRisk ? 'var(--bg-subtle)' : 'color-mix(in srgb, var(--accent) 20%, transparent)' }}>
              <Flame className="h-5 w-5" style={{ color: streakAtRisk ? 'var(--text-muted)' : 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t("current_streak")}</p>
              <p className="text-2xl font-bold" style={{ color: streakAtRisk ? 'var(--text-muted)' : 'var(--accent)' }}>
                {t("days", { count: profile?.streak ?? 0 })}
              </p>
              {streakAtRisk && (
                <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'color-mix(in srgb, var(--accent) 70%, transparent)' }}>
                  <AlertTriangle className="h-3 w-3" />
                  Study today to keep your streak
                </p>
              )}
            </div>
          </div>
        </div>
        <div data-testid="stat-plan" className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: isPremium ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--bg-subtle)' }}>
              <Crown className="h-5 w-5" style={{ color: isPremium ? 'var(--accent)' : 'var(--text-muted)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t("your_plan")}</p>
              <p className="text-2xl font-bold" style={{ color: isPremium ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {isPremium ? t("premium") : t("free")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-xl border px-5 py-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" style={{ color: 'var(--success)' }} />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{lessonsThisWeek ?? 0}</strong> lessons this week
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
                className="h-3 w-3 rounded-sm"
                style={{
                  border: i === 6 ? '1px solid color-mix(in srgb, var(--success) 50%, transparent)' : 'none',
                  backgroundColor: i === 6
                    ? 'color-mix(in srgb, var(--success) 20%, transparent)'
                    : i < 3
                    ? 'color-mix(in srgb, var(--success) 40%, transparent)'
                    : 'var(--bg-subtle)',
                }}
                title={dayStr}
              />
            );
          })}
        </div>
      </div>

      {totalLessons > 0 && (
        <div className="mt-8 rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t("overall_progress")}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{percentComplete}%</p>
          </div>
          <div className="h-2.5 rounded-full" style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <div
              className="h-2.5 rounded-full transition-all"
              style={{ backgroundColor: 'var(--success)', width: `${percentComplete}%` }}
            />
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {t("progress_detail", { completed: completedCount, total: totalLessons })}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {totalLessons - completedCount} {t("lessons_remaining")}
          </p>
        </div>
      )}

      {nextLesson && (
        <div data-testid="continue-learning" className="mt-8 rounded-2xl border p-6" style={{ borderColor: 'color-mix(in srgb, var(--success) 30%, transparent)', backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--success)' }}>
            {t("continue_learning")}
          </p>
          <Link
            href={`/${locale}/courses/${nextLesson.courseSlug}/${nextLesson.sectionSlug}/${nextLesson.slug}`}
            className="continue-link group flex items-center justify-between"
          >
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{nextLesson.courseTitle}</p>
              <p className="mt-0.5 text-lg font-semibold continue-title transition-colors" style={{ color: 'var(--text-primary)' }}>
                {nextLesson.title}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 20%, transparent)' }}>
              <TrendingUp className="h-5 w-5" style={{ color: 'var(--success)' }} />
            </div>
          </Link>
        </div>
      )}

      <BadgeGrid badges={earnedBadges} />

      <CertificatesSection />

      <JoinClassCard />

      {myClasses && myClasses.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t("my_classes")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {myClasses.map((cls) => (
              <Link
                key={cls.id}
                data-testid={`class-card-${cls.id}`}
                href={`/${locale}/dashboard/classes/${cls.id}`}
                className="card-hover rounded-2xl border p-5 transition-all"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)' }}>
                    <Users className="h-5 w-5" style={{ color: 'var(--success)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cls.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
          className="cta-primary inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-medium transition-all"
          style={{ backgroundColor: 'var(--success)', color: 'var(--text-primary)', boxShadow: '0 0 20px color-mix(in srgb, var(--success) 20%, transparent)' }}
        >
          <TrendingUp className="h-4 w-4" />
          {t("continue_learning")}
        </Link>
        {!isPremium && (
          <Link
            href={`/${locale}/pricing`}
            className="cta-upgrade inline-flex items-center gap-2 rounded-2xl border px-6 py-2.5 text-sm font-medium transition-all"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}
          >
            <Crown className="h-4 w-4" />
            {t("upgrade_premium")}
          </Link>
        )}
        <a
          href={`/${locale}/auth/logout`}
          className="sign-out-btn inline-flex items-center gap-2 rounded-2xl border px-6 py-2.5 text-sm font-medium transition-all ml-auto"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <LogOut className="h-4 w-4" />
          {t("sign_out")}
        </a>
      </div>
    </div>
  );
}
