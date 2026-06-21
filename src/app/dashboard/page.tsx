import { createServiceClient, createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Profile, Progress, Subscription, Course } from "@/lib/types";
import { BookOpen, Flame, Crown, TrendingUp, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Greeting */}
      <div>
        <h1 className="font-amiri text-3xl font-bold text-zinc-100">
          Welcome back{profile ? `, ${user.email?.split("@")[0]}` : ""}!
        </h1>
        <p className="mt-1 text-zinc-500">Continue your journey of Islamic learning.</p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <BookOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Lessons Completed</p>
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
              <p className="text-sm text-zinc-500">Current Streak</p>
              <p className="text-2xl font-bold text-zinc-100">{profile?.streak ?? 0} days</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isPremium ? "bg-amber-500/10" : "bg-zinc-800"}`}>
              <Crown className={`h-5 w-5 ${isPremium ? "text-amber-400" : "text-zinc-500"}`} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Your Plan</p>
              <p className={`text-2xl font-bold ${isPremium ? "text-amber-400" : "text-zinc-400"}`}>
                {isPremium ? "Premium" : "Free"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalLessons > 0 && (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-zinc-300">Overall Progress</p>
            <p className="text-sm text-zinc-500">{percentComplete}%</p>
          </div>
          <div className="h-2.5 rounded-full bg-zinc-800">
            <div
              className="h-2.5 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            {completedCount} of {totalLessons} lessons completed
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <TrendingUp className="h-4 w-4" />
          Continue Learning
        </Link>
        {!isPremium && (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-2xl border border-amber-700 bg-amber-500/10 px-6 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-500/20 transition-all"
          >
            <Crown className="h-4 w-4" />
            Upgrade to Premium
          </Link>
        )}
        <a
          href="/auth/logout"
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-all ml-auto"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </a>
      </div>
    </div>
  );
}
