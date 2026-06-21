"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import type { QuizQuestion } from "@/lib/types";

interface Props {
  lessonId: string;
  userId: string;
  onPass: () => void;
}

export function Quiz({ lessonId, userId, onPass }: Props) {
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
          setError(error?.message || "No quiz available for this lesson.");
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
      <div className="animate-pulse bg-zinc-800 rounded-2xl h-52 flex items-center justify-center">
        <p className="text-zinc-500">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 text-center">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-emerald-400 text-sm hover:text-emerald-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (score !== null) {
    const passed = score >= 3;
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
        {passed ? (
          <>
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-emerald-400 text-2xl font-bold">Lesson Complete!</p>
            <p className="text-zinc-400 mt-2">
              You got {score} out of {questions.length} correct
            </p>
          </>
        ) : (
          <>
            <p className="text-amber-400 text-xl font-semibold">Almost there!</p>
            <p className="text-zinc-400 mt-2">
              You got {score} out of {questions.length} correct
            </p>
            <p className="text-zinc-500 text-sm mt-1">
              Review the lesson and try again.
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
                className="border border-zinc-700 text-zinc-300 rounded-xl px-5 py-2 text-sm hover:bg-zinc-800"
              >
                Retry Quiz
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
        <p className="text-zinc-500 text-sm">
          Question {index + 1} of {questions.length}
        </p>
        <p className="text-zinc-600 text-xs">
          {Math.round(((index) / questions.length) * 100)}%
        </p>
      </div>

      <div className="h-1.5 bg-zinc-800 rounded-full mb-6">
        <div
          className="h-1.5 bg-emerald-500 rounded-full transition-all duration-700"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-zinc-100 text-lg font-medium mb-4">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((option, i) => {
          let className =
            "w-full text-left px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:border-emerald-700 hover:bg-emerald-900/20 transition-all";

          if (revealed) {
            if (i === q.correct) {
              className += " bg-emerald-900/40 border-emerald-500 text-emerald-300";
            } else if (i === selected) {
              className += " bg-red-900/20 border-red-700 text-red-400";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={className}
              disabled={revealed}
            >
              <span className="text-zinc-500 mr-2">
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
          className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-5 py-2 text-sm font-medium"
        >
          {index < questions.length - 1 ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
}
