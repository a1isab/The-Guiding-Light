"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle, ClipboardList } from "lucide-react";
import { MarkdownContent } from "@/components/teacher/markdown-content";
import { QuizViewer } from "@/components/teacher/quiz-viewer";
import { CommentThread } from "@/components/comment-thread";
import { SubmissionForm } from "@/components/submission-form";
import { SubmissionStatus } from "@/components/submission-status";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  max_score: number;
  due_date: string | null;
}

interface Submission {
  status: string;
  score: number | null;
  feedback: string | null;
  submitted_at: string;
}

function AssignmentSection({ lessonId }: { lessonId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/student/lessons/comments?lessonId=${lessonId}`).then(() => {}),
      fetch(`/api/teacher/assignments?lessonId=${lessonId}`).then((r) => r.json()),
    ])
      .then(([_, data]) => {
        const list = data.assignments ?? [];
        setAssignments(list);
        if (list.length > 0) {
          return fetch(`/api/student/submissions?assignmentId=${list[0].id}`).then((r) => r.json());
        }
      })
      .then((subData) => {
        if (subData?.submission) setSubmission(subData.submission);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading || assignments.length === 0) return null;

  const assignment = assignments[0];

  return (
    <div className="mt-8 pt-6 border-t border-zinc-800">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardList className="h-5 w-5 text-emerald-400" />
        <h3 className="text-sm font-medium text-zinc-200">Assignment</h3>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h4 className="text-sm font-semibold text-zinc-100">{assignment.title}</h4>
        {assignment.description && (
          <p className="mt-1 text-xs text-zinc-400 whitespace-pre-wrap">{assignment.description}</p>
        )}
        <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
          <span>Max score: {assignment.max_score}</span>
          {assignment.due_date && (
            <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <SubmissionStatus submission={submission} maxScore={assignment.max_score} />

      {!submission || submission.status !== "graded" ? (
        <SubmissionForm
          assignmentId={assignment.id}
          existing={submission ? { id: "", body: null, file_urls: [], status: submission.status } : null}
          onSubmitted={() => {
            fetch(`/api/student/submissions?assignmentId=${assignment.id}`)
              .then((r) => r.json())
              .then((data) => { if (data.submission) setSubmission(data.submission); });
          }}
        />
      ) : null}
    </div>
  );
}

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

      <AssignmentSection lessonId={lessonId} />

      <CommentThread lessonId={lessonId} />
    </div>
  );
}
