import { getTranslations } from "next-intl/server";
import { createServiceClient, createAdminClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import type { Profile, Subscription } from "@/lib/types";
import { getUserRole } from "@/lib/supabase-api";
import { BookOpen, Flame, Crown, TrendingUp, LogOut, AlertTriangle } from "lucide-react";
import { BadgeGrid } from "@/components/badge-grid";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");

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

  if (profile && !profile.onboarded) {
    redirect(`/${locale}/onboarding`);
  }

  const { data: sub } = await service
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single<Subscription>();

  const isPremium = sub?.plan === "premium";

  const { count: completedCount } = await service
    .from("teacher_progress")
    .select("*", { count: "exact", head: true })
    .eq("student_id", userId);

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: lessonsThisWeek } = await service
    .from("teacher_progress")
    .select("*", { count: "exact", head: true })
    .eq("student_id", userId)
    .gte("viewed_at", weekAgo);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const studiedToday = profile?.last_activity_at
    ? new Date(profile.last_activity_at).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
    : false;

  const streakAtRisk = profile?.streak && profile?.streak > 0
    ? (() => {
        const last = profile.last_activity_at ? new Date(profile.last_activity_at) : null;
        if (!last) return false;
        return last.toISOString().split("T")[0] !== new Date().toISOString().split("T")[0];
      })()
    : false;

  const { data: userBadges } = await service
    .from("user_badges")
    .select("*")
    .eq("user_id", userId);

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
          .from("teacher_sections")
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
        .cta-upgrade:hover { background-color: color-mix(in srgb, var(--accent) 20%, transparent); }
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
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedCount ?? 0}</p>
            </div>
          </div>
        </div>
        <div data-testid="stat-streak" data-section="streak" className="rounded-2xl border p-6" style={{ borderColor: streakAtRisk ? 'var(--border)' : 'color-mix(in srgb, var(--accent) 30%, transparent)', backgroundColor: streakAtRisk ? 'var(--bg-surface)' : 'color-mix(in srgb, var(--accent) 5%, transparent)' }}>
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

      <div data-section="badge-grid" className="mt-8">
        <BadgeGrid badges={earnedBadges} />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
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
