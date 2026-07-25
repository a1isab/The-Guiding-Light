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
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  if (status?.passed) {
    return (
      <div className="rounded-xl border p-6 text-center" style={{ borderColor: "color-mix(in srgb, var(--success) 80%, transparent)", background: "color-mix(in srgb, var(--success) 10%, transparent)" }}>
        <CheckCircle className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--success)" }} />
        <p className="text-sm font-medium" style={{ color: "var(--success)" }}>{t("pass_title")}</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{t("score", { score: result?.score ?? status!.score ?? 0, total: result?.total ?? status!.total ?? 0 })}</p>
      </div>
    );
  }

  if (status?.locked) {
    return (
      <div data-testid="quiz-locked" className="rounded-xl border p-6 text-center" style={{ borderColor: "color-mix(in srgb, var(--accent) 80%, transparent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
        <Clock className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
        <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>Locked</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Too many failed attempts. Retry in {formatTime(status.retryAfter)}
        </p>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div data-testid="quiz-result" className={`rounded-xl border p-6 text-center`}
        style={{
          borderColor: result.passed ? "color-mix(in srgb, var(--success) 80%, transparent)" : "color-mix(in srgb, var(--error) 80%, transparent)",
          background: result.passed ? "color-mix(in srgb, var(--success) 10%, transparent)" : "color-mix(in srgb, var(--error) 10%, transparent)",
        }}
      >
        {result.passed
          ? <CheckCircle className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--success)" }} />
          : <XCircle className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--error)" }} />
        }
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {t("score", { score: result.score, total: result.total })}
        </p>
        {result.passed ? (
          <p className="text-xs mt-1" style={{ color: "var(--success)" }}>{t("pass_title")}</p>
        ) : (
          <div className="mt-3">
            <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{t("fail_msg")}</p>
            <button
              onClick={() => { setSubmitted(false); setResult(null); loadData(); }}
              className="rounded-lg px-4 py-2 text-xs font-medium transition-all"
              style={{ background: "var(--bg-subtle)", color: "var(--text-primary)" }}
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
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        Attempts remaining: {status?.attemptsRemaining ?? 3}
      </p>

      {questions.map((q: QuizQuestion, qIndex: number) => (
        <div key={qIndex} className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-surface) 50%, transparent)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>
            {qIndex + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, optIndex: number) => (
              <label
                key={optIndex}
                className="flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors"
                style={{
                  borderColor: answers[qIndex] === optIndex ? "color-mix(in srgb, var(--success) 60%, transparent)" : "var(--border)",
                  background: answers[qIndex] === optIndex ? "color-mix(in srgb, var(--success) 10%, transparent)" : "transparent",
                }}
              >
                <input
                  type="radio"
                  name={`q-${qIndex}`}
                  checked={answers[qIndex] === optIndex}
                  onChange={() => setAnswers((prev) => prev.map((a, i) => (i === qIndex ? optIndex : a)))}
                  className="h-4 w-4 accent-emerald-500"
                />
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p data-testid="quiz-error" className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}

      <button
        onClick={handleSubmit}
        data-testid="submit-quiz"
        disabled={submitting}
        className="w-full rounded-xl px-6 py-3 text-sm font-medium text-white disabled:opacity-50 transition-all"
        style={{ background: "var(--accent)" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}
