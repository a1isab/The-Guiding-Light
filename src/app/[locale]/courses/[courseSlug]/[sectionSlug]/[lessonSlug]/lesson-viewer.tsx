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
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              {getTranslation(lesson, "content", locale, lesson.content).split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {(getTranslation(lesson, "arabic_text", locale, "")) && (
              <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6">
                <h2 className="text-sm font-medium text-zinc-500">{t("arabic_text")}</h2>
                <p className="mt-3 text-right font-amiri text-2xl leading-loose text-zinc-100" dir="rtl">
                  {lesson.arabic_text}
                </p>
              </div>
            )}

            <button
              onClick={() => setStage("quiz")}
              className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl px-6 py-3 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
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
          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 text-center">
            <p className="text-zinc-400">{t("sign_in_quiz")}</p>
          </div>
        )}
      </div>

      {stage === "complete" && (
        <div className="mt-8 rounded-2xl border border-emerald-800 bg-emerald-900/20 p-8 text-center">
          {showConfetti && <Confetti />}
          <p className="text-5xl mb-4">🎉</p>
          <p className="text-emerald-400 text-2xl font-bold">{t("complete_title")}</p>
          <p className="text-zinc-400 mt-2">
            {t("complete_msg")}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {nextLesson ? (
              <Link
                href={`/${locale}/courses/${courseSlug}/${sectionSlug}/${nextLesson.slug}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400"
              >
                {t("continue_to_next")} <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`/${locale}/courses/${courseSlug}/${sectionSlug}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-200 transition-all hover:bg-zinc-700"
              >
                {t("back_to_section")}
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 flex items-center justify-between border-t border-zinc-800 pt-6">
        {prevLesson ? (
          <Link
            href={`/${locale}/courses/${courseSlug}/${sectionSlug}/${prevLesson.slug}`}
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
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
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
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
      className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-amber-800 bg-amber-900/30 backdrop-blur-lg p-5 shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
          <Flame className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-amber-400">
            {days}-Day Streak!
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-100">
            Keep going! You&apos;re on fire!
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            Come back tomorrow to keep your streak alive.
          </p>
        </div>
      </div>
    </div>
  );
}
