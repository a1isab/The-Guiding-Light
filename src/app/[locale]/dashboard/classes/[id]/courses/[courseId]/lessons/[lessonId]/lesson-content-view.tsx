"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle } from "lucide-react";
import { MarkdownContent } from "@/components/teacher/markdown-content";
import { QuizViewer } from "@/components/teacher/quiz-viewer";

export function LessonContentView({
  lessonId,
  lessonContent,
  videoUrl,
  initialViewedAt,
  hasQuiz,
}: {
  lessonId: string;
  lessonContent: string | null;
  videoUrl: string | null;
  initialViewedAt: string | null;
  hasQuiz: boolean;
}) {
  const router = useRouter();
  const [viewedAt, setViewedAt] = useState<string | null>(initialViewedAt);
  const [viewing, setViewing] = useState(false);

  async function handleMarkViewed() {
    setViewing(true);
    try {
      const res = await fetch("/api/student/lessons/viewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (res.ok) {
        setViewedAt(new Date().toISOString());
        router.refresh();
      }
    } finally {
      setViewing(false);
    }
  }

  return (
    <div>
      {lessonContent && <MarkdownContent content={lessonContent} />}

      {!viewedAt && (
        <div className="mt-6">
          <button
            onClick={handleMarkViewed}
            data-testid="mark-viewed"
            disabled={viewing}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
          >
            <Eye className="h-5 w-5" />
            {viewing ? "Marking..." : "Mark as Viewed"}
          </button>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-zinc-800">
        {hasQuiz && viewedAt ? (
          <QuizViewer lessonId={lessonId} />
        ) : hasQuiz && !viewedAt ? (
          <p data-testid="quiz-locked" className="text-sm text-zinc-500">Mark the content as viewed above to unlock the quiz.</p>
        ) : (
          <p className="text-sm text-zinc-500">No quiz for this lesson.</p>
        )}
      </div>
    </div>
  );
}
