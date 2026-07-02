"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Trash2, Sparkles } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface SavedQuestion extends Question {
  id?: string;
}

export function QuizEditor({ lessonId, lessonContent }: { lessonId: string; lessonContent: string }) {
  const [questions, setQuestions] = useState<SavedQuestion[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [qCount, setQCount] = useState(5);

  interface ApiQuestion {
    id: string;
    question: string;
    options: string[];
    correct_index: number;
  }

  interface ApiGenerated {
    question: string;
    options: string[];
    correct: number;
  }

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/quiz/questions?lessonId=${lessonId}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      if (data.questions?.length) {
        const mapped = data.questions.map((q: ApiQuestion) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correct_index,
        }));
        setQuestions(mapped);
        setSavedCount(mapped.length);
      }
    } catch {
      setError("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQuestion(index: number, value: string) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, question: value } : q)));
  }

  function updateOption(qIndex: number, optIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.map((o, j) => (j === optIndex ? value : o)) } : q
      )
    );
  }

  function updateCorrect(qIndex: number, optIndex: number) {
    setQuestions((prev) => prev.map((q, i) => (i === qIndex ? { ...q, correctIndex: optIndex } : q)));
  }

  async function handleGenerate() {
    if (!lessonContent || lessonContent.trim().length < 10) {
      setError("Lesson content is too short to generate a quiz.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/teacher/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: lessonContent, questionCount: qCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const mapped = data.questions.map((q: ApiGenerated) => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correct,
      }));
      setQuestions(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    const valid = questions.every(
      (q) => q.question.trim() && q.options.every((o) => o.trim())
    );
    if (!valid) {
      setError("All questions and options must be filled in.");
      return;
    }
    if (questions.length < 3 || questions.length > 10) {
      setError("Quiz must have between 3 and 10 questions.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/teacher/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, questions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSavedCount(questions.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-zinc-700 bg-zinc-900/30 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">Quiz Questions</h3>
        {savedCount > 0 && (
          <span className="text-xs text-emerald-400">{savedCount} questions saved</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500 disabled:opacity-50 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {generating ? "Generating..." : "Generate with AI"}
        </button>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-zinc-500">Qty:</label>
          <select
            value={qCount}
            onChange={(e) => setQCount(Number(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <button
          onClick={addQuestion}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {questions.length === 0 && !loading && (
        <p className="py-4 text-center text-xs text-zinc-600">
          No quiz yet. Create questions manually or generate with AI.
        </p>
      )}

      <div className="space-y-4">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, e.target.value)}
                placeholder={`Question ${qIndex + 1}`}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-2.5 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={() => removeQuestion(qIndex)}
                className="flex-shrink-0 rounded p-1 text-zinc-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, optIndex) => (
                <label
                  key={optIndex}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 cursor-pointer transition-colors ${
                    q.correctIndex === optIndex
                      ? "border-emerald-600 bg-emerald-500/10"
                      : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctIndex === optIndex}
                    onChange={() => updateCorrect(qIndex, optIndex)}
                    className="h-3.5 w-3.5 accent-emerald-500"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    className="flex-1 bg-transparent text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : "Save Quiz"}
        </button>
      )}
    </div>
  );
}
