"use client";

import { useState } from "react";
import type { Lesson } from "@/lib/types";
import { Quiz } from "@/components/quiz";
import { createClient } from "@/lib/supabase-client";

type Stage = "content" | "quiz" | "complete";

export function LessonViewer({
  lesson,
  userId,
}: {
  lesson: Lesson;
  userId: string | null;
}) {
  const [stage, setStage] = useState<Stage>("content");
  const supabase = createClient();

  async function handleComplete() {
    if (!userId) return;
    await supabase.from("progress").upsert({
      user_id: userId,
      lesson_id: lesson.id,
    });
    setStage("complete");
  }

  if (stage === "complete") {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-800 bg-emerald-900/20 p-8 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <p className="text-emerald-400 text-2xl font-bold">Lesson Complete!</p>
        <p className="text-zinc-400 mt-2">
          May Allah bless your efforts.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-8">
      {stage === "content" && (
        <div>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            {lesson.content.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {lesson.arabic_text && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6">
              <h2 className="text-sm font-medium text-zinc-500">Arabic Text</h2>
              <p className="mt-3 text-right font-amiri text-2xl leading-loose text-zinc-100" dir="rtl">
                {lesson.arabic_text}
              </p>
            </div>
          )}

          <button
            onClick={() => setStage("quiz")}
            className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl px-6 py-3 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            Take Quiz &rarr;
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
          <p className="text-zinc-400">Sign in to take the quiz and track your progress.</p>
        </div>
      )}
    </div>
  );
}
