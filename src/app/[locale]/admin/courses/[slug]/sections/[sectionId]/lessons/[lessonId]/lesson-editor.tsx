"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface LessonData {
  id: string;
  title: string;
  content: string;
  video_url: string | null;
  arabic_text: string | null;
  content_type: string;
}

export function LessonEditor({
  lesson,
  quiz,
  locale,
}: {
  lesson: LessonData;
  quiz: { id: string; questions: QuizQuestion[] } | null;
  locale: string;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState(lesson.content);
  const [videoUrl, setVideoUrl] = useState(lesson.video_url ?? "");
  const [arabicText, setArabicText] = useState(lesson.arabic_text ?? "");
  const [contentType, setContentType] = useState(lesson.content_type);
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz?.questions ?? []);
  const [quizId, setQuizId] = useState(quiz?.id ?? null);

  async function saveLesson() {
    setSaving(true);
    setError("");

    const { error: err } = await supabase
      .from("lessons")
      .update({
        content,
        video_url: videoUrl || null,
        arabic_text: arabicText || null,
        content_type: contentType,
      })
      .eq("id", lesson.id);

    if (err) {
      setError(err.message);
    }
    setSaving(false);
    router.refresh();
  }

  async function saveQuiz() {
    setSaving(true);
    const payload = { lesson_id: lesson.id, questions };

    if (quizId) {
      await supabase.from("quizzes").update({ questions }).eq("id", quizId);
    } else {
      const { data } = await supabase.from("quizzes").insert(payload).select("id").single();
      if (data) setQuizId(data.id);
    }

    setSaving(false);
    router.refresh();
  }

  async function generateQuiz() {
    setGenerating(true);
    setError("");

    const res = await fetch("/api/admin/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, content }),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "Failed to generate quiz");
    } else {
      const data = await res.json();
      setQuestions(data.questions);
    }

    setGenerating(false);
  }

  function updateQuestion(index: number, field: string, value: string | number) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) }
          : q
      )
    );
  }

  return (
    <div className="space-y-8">
      {/* Lesson Content */}
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-100">Lesson Content</h2>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("content_type")}</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("lesson_video_url")}</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("lesson_content")}</label>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 font-mono focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("lesson_arabic_text")}</label>
          <textarea
            rows={4}
            value={arabicText}
            onChange={(e) => setArabicText(e.target.value)}
            dir="rtl"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 font-arabic focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={saveLesson}
          disabled={saving}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {saving ? t("saving") : t("save")}
        </button>
      </div>

      {/* Quiz Editor */}
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">{t("quiz_edit")}</h2>
          <button
            onClick={generateQuiz}
            disabled={generating}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 transition-all"
          >
            {generating ? t("generating") : t("generate_quiz")}
          </button>
        </div>

        {questions.length === 0 ? (
          <p className="text-sm text-zinc-500">No quiz questions yet. Click "Generate Quiz with AI" or add manually.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-zinc-500 shrink-0 mt-1">Q{qi + 1}</span>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(qi, "question", e.target.value)}
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2 ml-6">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correct === oi}
                        onChange={() => updateQuestion(qi, "correct", oi)}
                        className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-zinc-700"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                      />
                      <span className="text-xs text-zinc-600 w-6 text-right">
                        {q.correct === oi ? "✓" : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={saveQuiz}
          disabled={saving}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {saving ? t("saving") : t("save")}
        </button>
      </div>
    </div>
  );
}
