"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import type { QuizQuestion, Locale } from "@/lib/types";
import { getQuizQuestion } from "@/lib/types";

interface Props {
  lessonId: string;
  userId: string;
  onPass: () => void;
}

export function Quiz({ lessonId, userId, onPass }: Props) {
  const t = useTranslations("quiz");
  const locale = useLocale() as Locale;
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("quizzes")
      .select("id, questions")
      .eq("lesson_id", lessonId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setError(error?.message || t("no_quiz"));
        } else {
          setQuestions(data.questions as QuizQuestion[]);
          setQuizId(data.id);
        }
        setLoading(false);
      });
  }, [lessonId]);

  function handleSelect(optionIndex: number) {
    if (revealed) return;
    setSelected(optionIndex);
    setRevealed(true);
  }

  function nextQuestion() {
    const correct = questions[index].correct === selected ? 1 : 0;
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);

    if (index < questions.length - 1) {
      setIndex(index + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      const totalScore = newAnswers.filter(Boolean).length;
      setScore(totalScore);

      if (totalScore >= 3) {
        saveProgress(newAnswers, totalScore);
      }
    }
  }

  async function saveProgress(ans: number[], sc: number) {
    if (submitting) return;
    setSubmitting(true);
    const supabase = createClient();

    await supabase.from("user_answers").insert({
      user_id: userId,
      quiz_id: quizId,
      answers: ans,
      score: sc,
    });

    await supabase.from("progress").upsert({
      user_id: userId,
      lesson_id: lessonId,
    });

    onPass();
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl h-52 flex items-center justify-center" style={{ background: "var(--bg-subtle)" }}>
        <p style={{ color: "var(--text-secondary)" }}>{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm"
          style={{ color: "var(--success)" }}
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (score !== null) {
    const passed = score >= 3;
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        {passed ? (
          <>
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-2xl font-bold" style={{ color: "var(--success)" }}>{t("pass_title")}</p>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              {t("score", { score, total: questions.length })}
            </p>
          </>
        ) : (
          <>
            <p className="text-xl font-semibold" style={{ color: "var(--accent)" }}>{t("fail_title")}</p>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              {t("score", { score, total: questions.length })}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {t("fail_msg")}
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setScore(null);
                  setIndex(0);
                  setSelected(null);
                  setRevealed(false);
                  setAnswers([]);
                }}
                className="border rounded-xl px-5 py-2 text-sm transition-all"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-subtle)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {t("retry_quiz")}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const q = questions[index];
  if (!q) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {t("question_of", { current: index + 1, total: questions.length })}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {Math.round(((index) / questions.length) * 100)}%
        </p>
      </div>

      <div className="h-1.5 rounded-full mb-6" style={{ background: "var(--bg-subtle)" }}>
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ background: "var(--success)", width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-lg font-medium mb-4" style={{ color: "var(--text-primary)" }}>{getQuizQuestion(q, locale).question}</p>

      <div className="space-y-2">
        {getQuizQuestion(q, locale).options.map((option, i) => {
          let borderColor = "var(--border)";
          let bg = "transparent";
          let textColor = "var(--text-primary)";

          if (revealed) {
            if (i === q.correct) {
              borderColor = "var(--success)";
              bg = "color-mix(in srgb, var(--success) 20%, transparent)";
              textColor = "var(--success)";
            } else if (i === selected) {
              borderColor = "var(--error)";
              bg = "color-mix(in srgb, var(--error) 10%, transparent)";
              textColor = "var(--error)";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="w-full text-left px-4 py-3 rounded-xl border transition-all"
              style={{ borderColor, background: bg, color: textColor }}
              disabled={revealed}
              onMouseEnter={(e) => {
                if (!revealed) {
                  e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 70%, transparent)";
                  e.currentTarget.style.background = "color-mix(in srgb, var(--success) 10%, transparent)";
                }
              }}
              onMouseLeave={(e) => {
                if (!revealed) {
                  e.currentTarget.style.borderColor = borderColor;
                  e.currentTarget.style.background = bg;
                }
              }}
            >
              <span className="mr-2" style={{ color: "var(--text-secondary)" }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {revealed && (
        <button
          onClick={nextQuestion}
          className="mt-4 rounded-xl px-5 py-2 text-sm font-medium text-white"
          style={{ background: "var(--success)" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {index < questions.length - 1 ? t("next_question") : t("see_results")}
        </button>
      )}
    </div>
  );
}
