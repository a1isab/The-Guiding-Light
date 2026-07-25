"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Lesson, Locale } from "@/lib/types";
import { getTranslation } from "@/lib/types";
import { Quiz } from "@/components/quiz";
import { BadgeNotification } from "@/components/badge-notification";
import { Confetti } from "@/components/confetti";
import { createClient } from "@/lib/supabase-client";
import { awardSectionBadge } from "@/lib/badges";
import { updateStreak } from "@/lib/streak";
import { scanAndAwardBadges } from "@/lib/badges";
import { ChevronLeft, ChevronRight, Flame, X } from "lucide-react";

type Stage = "content" | "quiz" | "complete";

export function LessonViewer({
  lesson,
  userId,
  courseSlug,
  sectionSlug,
  prevLesson,
  nextLesson,
}: {
  lesson: Lesson;
  userId: string | null;
  courseSlug: string;
  sectionSlug: string;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
}) {
  const t = useTranslations("lesson");
  const locale = useLocale() as Locale;
  const [stage, setStage] = useState<Stage>("content");
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [streakMilestone, setStreakMilestone] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (stage === "complete") setShowConfetti(true);
  }, [stage]);

  async function handleComplete() {
    if (!userId) return;
    await supabase.from("progress").upsert({
      user_id: userId,
      lesson_id: lesson.id,
    });
    setStage("complete");

    const [badgeResult, streakResult, newBadges] = await Promise.all([
      awardSectionBadge(userId, lesson.id),
      updateStreak(userId),
      scanAndAwardBadges(userId),
    ]);

    if (badgeResult.earned) {
      setNewBadge(badgeResult.sectionTitle);
    } else if (newBadges.length > 0) {
      setNewBadge(newBadges[0]);
    }
    if (streakResult.milestone) {
      setStreakMilestone(streakResult.milestone);
    }
  }

  return (
    <>
      <div className="mt-6 space-y-8">
        {stage === "content" && (
          <div>
            <div data-testid="lesson-content" className="space-y-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {getTranslation(lesson, "content", locale, lesson.content).split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {(getTranslation(lesson, "arabic_text", locale, "")) && (
              <div className="mt-8 rounded-2xl p-6" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <h2 className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("arabic_text")}</h2>
                <p className="mt-3 text-right font-arabic text-2xl leading-loose" dir="rtl" style={{ color: "var(--text-primary)" }}>
                  {lesson.arabic_text}
                </p>
              </div>
            )}

            <button
              data-testid="take-quiz"
              onClick={() => setStage("quiz")}
              className="mt-6 text-white rounded-2xl px-6 py-3 text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--accent)",
                boxShadow: "0 0 20px var(--glow-hover)",
              }}
            >
              {t("take_quiz")}
            </button>
          </div>
        )}

        {stage === "quiz" && userId && (
          <Quiz
            lessonId={lesson.id}
            userId={userId}
            onPass={handleComplete}
          />
        )}

        {stage === "quiz" && !userId && (
          <div className="rounded-2xl p-6 text-center" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <p style={{ color: "var(--text-secondary)" }}>{t("sign_in_quiz")}</p>
          </div>
        )}
      </div>

      {stage === "complete" && (
        <div
          className="mt-8 rounded-2xl p-8 text-center"
          style={{
            border: "1px solid color-mix(in srgb, var(--success) 30%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)",
          }}
        >
          {showConfetti && <Confetti />}
          <p className="text-5xl mb-4">🎉</p>
          <p className="text-2xl font-bold" style={{ color: "var(--success)" }}>{t("complete_title")}</p>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            {t("complete_msg")}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {nextLesson ? (
              <Link
                data-testid="next-lesson"
                href={`/${locale}/courses/${courseSlug}/${sectionSlug}/${nextLesson.slug}`}
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium text-white transition-all"
                style={{
                  backgroundColor: "var(--accent)",
                  boxShadow: "0 0 20px var(--glow-hover)",
                }}
              >
                {t("continue_to_next")} <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`/${locale}/courses/${courseSlug}/${sectionSlug}`}
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium transition-all"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                }}
              >
                {t("back_to_section")}
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 flex items-center justify-between pt-6" style={{ borderTop: "1px solid var(--border)" }}>
        {prevLesson ? (
          <Link
            data-testid="prev-lesson"
            href={`/${locale}/courses/${courseSlug}/${sectionSlug}/${prevLesson.slug}`}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--accent)" }}
          >
            <ChevronLeft className="h-4 w-4" />
            {getTranslation(prevLesson, "title", locale, prevLesson.title)}
          </Link>
        ) : (
          <div />
        )}
        {nextLesson && stage === "complete" ? (
          <Link
            href={`/${locale}/courses/${courseSlug}/${sectionSlug}/${nextLesson.slug}`}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--accent)" }}
          >
            {getTranslation(nextLesson, "title", locale, nextLesson.title)}
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {newBadge && (
        <BadgeNotification
          sectionTitle={newBadge}
          onClose={() => setNewBadge(null)}
        />
      )}

      {streakMilestone && (
        <StreakMilestoneNotification
          days={streakMilestone}
          onClose={() => setStreakMilestone(null)}
        />
      )}
    </>
  );
}

function StreakMilestoneNotification({
  days,
  onClose,
}: {
  days: number;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

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
      className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl backdrop-blur-lg p-5 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
      style={{
        border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
        boxShadow: "0 0 30px var(--glow-subtle)",
      }}
    >
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="absolute right-3 top-3"
        style={{ color: "var(--text-muted)" }}
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }}
        >
          <Flame className="h-6 w-6" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            {days}-Day Streak!
          </p>
          <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Keep going! You&apos;re on fire!
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
            Come back tomorrow to keep your streak alive.
          </p>
        </div>
      </div>
    </div>
  );
}
