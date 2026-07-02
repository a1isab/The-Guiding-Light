"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export function QuizViewer({ lessonId }: { lessonId: string }) {
  const t = useTranslations("quiz");
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    attemptsRemaining: number;
  } | null>(null);
  const [status, setStatus] = useState<{
    passed: boolean;
    locked: boolean;
    retryAfter: number;
    totalAttempts: number;
    attemptsRemaining: number;
    score?: number;
    total?: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [quizRes, statusRes] = await Promise.all([
        fetch(`/api/teacher/quiz/questions?lessonId=${lessonId}`),
        fetch(`/api/teacher/quiz/status?lessonId=${lessonId}`),
      ]);
      const quizData = await quizRes.json();
      const statusData = await statusRes.json();

      if (quizData.questions) {
        setQuestions(quizData.questions);
        setAnswers(new Array(quizData.questions.length).fill(-1));
      }
      setStatus(statusData);
    } catch {
      setError("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmit() {
    if (answers.some((a) => a === -1)) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/teacher/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 && data.locked) {
          setStatus((prev) => prev ? { ...prev, locked: true, retryAfter: data.retryAfter } : null);
          setError(data.message);
          return;
        }
        throw new Error(data.error ?? "Submit failed");
      }
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  // Lock countdown
  useEffect(() => {
    if (!status?.locked || !status?.retryAfter || status.retryAfter <= 0) return;
    const timer = setInterval(() => {
      setStatus((prev) => {
        if (!prev || prev.retryAfter <= 1) {
          clearInterval(timer);
          loadData();
          return prev ? { ...prev, locked: false, retryAfter: 0, attemptsRemaining: 2 } : null;
        }
        return { ...prev, retryAfter: prev.retryAfter - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status?.locked, status?.retryAfter, loadData]);

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  // Already passed
  if (status?.passed) {
    return (
      <div className="rounded-xl border border-emerald-800 bg-emerald-500/10 p-6 text-center">
        <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-emerald-400">{t("pass_title")}</p>
        <p className="text-xs text-zinc-500 mt-1">{t("score", { score: result?.score ?? status!.score ?? 0, total: result?.total ?? status!.total ?? 0 })}</p>
      </div>
    );
  }

  // Locked
  if (status?.locked) {
    return (
      <div className="rounded-xl border border-amber-800 bg-amber-500/10 p-6 text-center">
        <Clock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-amber-400">Locked</p>
        <p className="text-xs text-zinc-400 mt-1">
          Too many failed attempts. Retry in {formatTime(status.retryAfter)}
        </p>
      </div>
    );
  }

  // Submitted result
  if (submitted && result) {
    return (
      <div className={`rounded-xl border p-6 text-center ${
        result.passed ? "border-emerald-800 bg-emerald-500/10" : "border-red-800 bg-red-500/10"
      }`}>
        {result.passed
          ? <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
          : <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
        }
        <p className="text-sm font-medium text-zinc-200">
          {t("score", { score: result.score, total: result.total })}
        </p>
        {result.passed ? (
          <p className="text-xs text-emerald-400 mt-1">{t("pass_title")}</p>
        ) : (
          <div className="mt-3">
            <p className="text-xs text-zinc-500 mb-2">{t("fail_msg")}</p>
            <button
              onClick={() => { setSubmitted(false); setResult(null); loadData(); }}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-all"
            >
              {t("retry_quiz")}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">
        Attempts remaining: {status?.attemptsRemaining ?? 3}
      </p>

      {questions.map((q: QuizQuestion, qIndex: number) => (
        <div key={qIndex} className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
          <p className="text-sm font-medium text-zinc-200 mb-3">
            {qIndex + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, optIndex: number) => (
              <label
                key={optIndex}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                  answers[qIndex] === optIndex
                    ? "border-emerald-600 bg-emerald-500/10"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${qIndex}`}
                  checked={answers[qIndex] === optIndex}
                  onChange={() => setAnswers((prev) => prev.map((a, i) => (i === qIndex ? optIndex : a)))}
                  className="h-4 w-4 accent-emerald-500"
                />
                <span className="text-sm text-zinc-300">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-all"
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}
