"use client";

import { useTranslations } from "next-intl";
import { Trophy, Lock, BookOpen, Layers, Award, Flame, Brain } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BadgeItem {
  badge_key: string;
  section_title: string;
  earned_at: string | null;
}

interface Props {
  badges: BadgeItem[];
}

const BADGE_CATALOG: { key: string; icon: LucideIcon; titleKey: string; descKey: string }[] = [
  { key: "first_lesson", icon: BookOpen, titleKey: "badge.first_lesson_title", descKey: "badge.first_lesson_desc" },
  { key: "lessons_10", icon: Layers, titleKey: "badge.lessons_10_title", descKey: "badge.lessons_10_desc" },
  { key: "lessons_50", icon: Award, titleKey: "badge.lessons_50_title", descKey: "badge.lessons_50_desc" },
  { key: "streak_7", icon: Flame, titleKey: "badge.streak_7_title", descKey: "badge.streak_7_desc" },
  { key: "streak_30", icon: Flame, titleKey: "badge.streak_30_title", descKey: "badge.streak_30_desc" },
  { key: "quiz_ace", icon: Brain, titleKey: "badge.quiz_ace_title", descKey: "badge.quiz_ace_desc" },
];

export function BadgeGrid({ badges }: Props) {
  const t = useTranslations("badge");

  const earnedMap = new Map<string, string>();
  for (const b of badges) {
    if (b.earned_at) earnedMap.set(b.badge_key, b.earned_at);
  }

  const sectionBadges = badges.filter((b) => b.badge_key.startsWith("section_") && b.earned_at);
  const hasAnyBadge = sectionBadges.length > 0 || [...earnedMap.keys()].some((k) => !k.startsWith("section_"));

  if (!hasAnyBadge) return null;

  return (
    <div className="mt-8" data-testid="badge-grid">
      <h2 className="font-display text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }} data-testid="achievements">
        {t("achievements")}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {sectionBadges.length > 0 && sectionBadges.map((badge) => (
          <div
            key={badge.badge_key}
            className="flex items-center gap-3 rounded-xl border p-4"
            style={{ borderColor: "color-mix(in srgb, var(--success) 50%, transparent)", background: "color-mix(in srgb, var(--success) 10%, transparent)" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: "color-mix(in srgb, var(--success) 20%, transparent)" }}>
              <Trophy className="h-5 w-5" style={{ color: "var(--success)" }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {badge.section_title}
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {new Date(badge.earned_at!).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}

        {BADGE_CATALOG.map((def) => {
          const earnedAt = earnedMap.get(def.key);
          const isEarned = !!earnedAt;
          const Icon = def.icon;

          return (
            <div
              key={def.key}
              className="flex items-center gap-3 rounded-xl border p-4"
              style={{
                borderColor: isEarned ? "color-mix(in srgb, var(--success) 50%, transparent)" : "var(--border)",
                background: isEarned ? "color-mix(in srgb, var(--success) 10%, transparent)" : "color-mix(in srgb, var(--bg-surface) 50%, transparent)",
                opacity: isEarned ? 1 : 0.6,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: isEarned ? "color-mix(in srgb, var(--success) 20%, transparent)" : "var(--bg-subtle)" }}
              >
                {isEarned ? (
                  <Icon className="h-5 w-5" style={{ color: "var(--success)" }} />
                ) : (
                  <Lock className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: isEarned ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {t(def.titleKey.replace("badge.", ""))}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {isEarned
                    ? new Date(earnedAt).toLocaleDateString()
                    : t(def.descKey.replace("badge.", ""))}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
