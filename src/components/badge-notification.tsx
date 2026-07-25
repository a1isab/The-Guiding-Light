"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Trophy, BookOpen, Layers, Award, Flame, Brain, X } from "lucide-react";

const BADGE_ICONS: Record<string, typeof Trophy> = {
  first_lesson: BookOpen,
  lessons_10: Layers,
  lessons_50: Award,
  streak_7: Flame,
  streak_30: Flame,
  quiz_ace: Brain,
};

const BADGE_TITLE_KEYS: Record<string, string> = {
  first_lesson: "badge.first_lesson_title",
  lessons_10: "badge.lessons_10_title",
  lessons_50: "badge.lessons_50_title",
  streak_7: "badge.streak_7_title",
  streak_30: "badge.streak_30_title",
  quiz_ace: "badge.quiz_ace_title",
};

interface Props {
  sectionTitle: string | null;
  onClose: () => void;
}

export function BadgeNotification({ sectionTitle, onClose }: Props) {
  const t = useTranslations("badge");
  const [visible, setVisible] = useState(false);

  const isNamedBadge = sectionTitle && !sectionTitle.startsWith("section_") && BADGE_ICONS[sectionTitle];
  const Icon = isNamedBadge ? BADGE_ICONS[sectionTitle!] : Trophy;
  const badgeLabel = isNamedBadge
    ? t(BADGE_TITLE_KEYS[sectionTitle!].replace("badge.", ""))
    : sectionTitle ?? "Section";

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border backdrop-blur-lg p-5 transition-all duration-300`}
      style={{
        borderColor: "color-mix(in srgb, var(--success) 80%, transparent)",
        background: "color-mix(in srgb, var(--success) 30%, var(--bg-surface))",
        boxShadow: "0 0 30px var(--glow-subtle)",
        transform: visible ? "translateY(0)" : "translateY(16px)",
        opacity: visible ? 1 : 0,
      }}
    >
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{ color: "var(--text-secondary)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
        className="absolute right-3 top-3"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: "color-mix(in srgb, var(--success) 20%, transparent)" }}>
          <Icon className="h-6 w-6" style={{ color: "var(--success)" }} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--success)" }}>
            {t("earned")}
          </p>
          <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {badgeLabel} {isNamedBadge ? "" : t("completed")}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
            {isNamedBadge ? t("all_done") : "All lessons in this section are done!"}
          </p>
        </div>
      </div>
    </div>
  );
}
