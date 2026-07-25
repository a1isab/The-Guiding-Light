"use client";

interface SubmissionStatusProps {
  submission: {
    status: string;
    score: number | null;
    feedback: string | null;
    submitted_at: string;
  } | null;
  maxScore: number;
}

export function SubmissionStatus({ submission, maxScore }: SubmissionStatusProps) {
  if (!submission) return null;

  return (
    <div data-testid="submission-status" className="mt-3 rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-surface) 30%, transparent)" }}>
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background: submission.status === "graded" ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--accent) 15%, transparent)",
            color: submission.status === "graded" ? "var(--success)" : "var(--accent)",
          }}
        >
          {submission.status === "graded" ? "Graded" : "Submitted"}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {new Date(submission.submitted_at).toLocaleDateString()}
        </span>
      </div>

      {submission.status === "graded" && (
        <>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{submission.score}</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>/ {maxScore}</span>
          </div>
          {submission.feedback && (
            <p className="mt-2 text-sm whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{submission.feedback}</p>
          )}
        </>
      )}
    </div>
  );
}
