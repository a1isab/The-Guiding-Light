"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetch(`/api/teacher/submissions?assignmentId=${assignmentId}`)
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(data.submissions ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [assignmentId]);

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

  if (loading) return <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading submissions...</p>;

  return (
    <div data-testid="submission-list" className="mt-4">
      <h4 className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>Submissions</h4>
      {submissions.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>No submissions yet.</p>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub) => (
            <div key={sub.id} className="rounded-lg border p-3" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-surface) 30%, transparent)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>{sub.student_name ?? sub.student_id.slice(0, 8)}</span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: sub.status === "graded" ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--accent) 15%, transparent)",
                      color: sub.status === "graded" ? "var(--success)" : "var(--accent)",
                    }}
                  >
                    {sub.status === "graded" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {sub.status === "graded" ? `${sub.score}/${maxScore}` : "Pending"}
                  </span>
                </div>
                {sub.status !== "graded" && (
                  <button
                    data-testid="grade-btn"
                    onClick={() => setGradingId(gradingId === sub.id ? null : sub.id)}
                    className="text-xs"
                    style={{ color: "var(--accent)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    Grade
                  </button>
                )}
              </div>

              {sub.body && <p className="mt-2 text-xs line-clamp-2" style={{ color: "var(--text-secondary)" }}>{sub.body}</p>}

              {gradingId === sub.id && (
                <div className="mt-3 space-y-2">
                  <input
                    data-testid="grade-score-input"
                    type="number"
                    value={gradeScore}
                    onChange={(e) => setGradeScore(e.target.value)}
                    placeholder={`Score (0-${maxScore})`}
                    className="w-full rounded-lg border px-3 py-1.5 text-xs"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-subtle)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--success) 70%, transparent)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  />
                  <textarea
                    data-testid="grade-feedback-input"
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    placeholder="Feedback..."
                    rows={2}
                    className="w-full rounded-lg border px-3 py-1.5 text-xs resize-none"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-subtle)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--success) 70%, transparent)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  />
                  <button
                    data-testid="grade-submit"
                    onClick={() => handleGrade(sub.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                    style={{ background: "var(--accent)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
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
