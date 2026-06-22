"use client";

import { useTranslations } from "next-intl";
import { Trophy, Lock } from "lucide-react";

interface BadgeItem {
  badge_key: string;
  section_title: string;
  earned_at: string | null;
}

interface Props {
  badges: BadgeItem[];
}

export function BadgeGrid({ badges }: Props) {
  const t = useTranslations("badge");
  if (badges.length === 0) return null;

  const earned = badges.filter((b) => b.earned_at);
  const locked = badges.filter((b) => !b.earned_at);

  return (
    <div className="mt-8">
      <h2 className="font-amiri text-xl font-bold text-zinc-100 mb-4">
        {t("achievements")}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {earned.map((badge) => (
          <div
            key={badge.badge_key}
            className="flex items-center gap-3 rounded-xl border border-emerald-800/50 bg-emerald-900/10 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
              <Trophy className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">
                {badge.section_title}
              </p>
              <p className="text-xs text-zinc-500">
                {new Date(badge.earned_at!).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}

        {locked.slice(0, 6).map((badge) => (
          <div
            key={badge.badge_key}
            className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 opacity-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
              <Lock className="h-5 w-5 text-zinc-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-500 truncate">
                {badge.section_title}
              </p>
              <p className="text-xs text-zinc-600">{t("locked")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
