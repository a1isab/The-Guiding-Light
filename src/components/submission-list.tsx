"use client";

import { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";

interface SubmissionItem {
  id: string;
  student_id: string;
  body: string | null;
  status: string;
  score: number | null;
  feedback: string | null;
  submitted_at: string;
  student_name?: string;
}

interface SubmissionListProps {
  assignmentId: string;
  maxScore: number;
}

export function SubmissionList({ assignmentId, maxScore }: SubmissionListProps) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");

  useState(() => {
    fetch(`/api/teacher/assignments?lessonId=&assignmentId=${assignmentId}`)
      .then((r) => r.json())
      .then(() => {
        // Fetch submissions through a different approach
        setLoading(false);
      })
      .catch(() => setLoading(false));
  });

  async function handleGrade(submissionId: string) {
    const res = await fetch("/api/teacher/submissions/grade", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId,
        score: gradeScore ? Number(gradeScore) : null,
        feedback: gradeFeedback || null,
      }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, status: "graded", score: Number(gradeScore), feedback: gradeFeedback }
            : s
        )
      );
      setGradingId(null);
      setGradeScore("");
      setGradeFeedback("");
    }
  }

  if (loading) return <p className="text-xs text-zinc-600">Loading submissions...</p>;

  return (
    <div data-testid="submission-list" className="mt-4">
      <h4 className="text-sm font-medium text-zinc-300 mb-3">Submissions</h4>
      {submissions.length === 0 ? (
        <p className="text-xs text-zinc-600">No submissions yet.</p>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub) => (
            <div key={sub.id} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-200">{sub.student_name ?? sub.student_id.slice(0, 8)}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    sub.status === "graded" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                  }`}>
                    {sub.status === "graded" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {sub.status === "graded" ? `${sub.score}/${maxScore}` : "Pending"}
                  </span>
                </div>
                {sub.status !== "graded" && (
                  <button
                    data-testid="grade-btn"
                    onClick={() => setGradingId(gradingId === sub.id ? null : sub.id)}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    Grade
                  </button>
                )}
              </div>

              {sub.body && <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{sub.body}</p>}

              {gradingId === sub.id && (
                <div className="mt-3 space-y-2">
                  <input
                    data-testid="grade-score-input"
                    type="number"
                    value={gradeScore}
                    onChange={(e) => setGradeScore(e.target.value)}
                    placeholder={`Score (0-${maxScore})`}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 focus:border-emerald-700 focus:outline-none"
                  />
                  <textarea
                    data-testid="grade-feedback-input"
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    placeholder="Feedback..."
                    rows={2}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 focus:border-emerald-700 focus:outline-none resize-none"
                  />
                  <button
                    data-testid="grade-submit"
                    onClick={() => handleGrade(sub.id)}
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400"
                  >
                    Save Grade
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
