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
    <div data-testid="submission-status" className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          submission.status === "graded"
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-amber-500/15 text-amber-400"
        }`}>
          {submission.status === "graded" ? "Graded" : "Submitted"}
        </span>
        <span className="text-xs text-zinc-600">
          {new Date(submission.submitted_at).toLocaleDateString()}
        </span>
      </div>

      {submission.status === "graded" && (
        <>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-zinc-100">{submission.score}</span>
            <span className="text-sm text-zinc-500">/ {maxScore}</span>
          </div>
          {submission.feedback && (
            <p className="mt-2 text-sm text-zinc-400 whitespace-pre-wrap">{submission.feedback}</p>
          )}
        </>
      )}
    </div>
  );
}
