"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";

interface SubmissionFormProps {
  assignmentId: string;
  existing?: { id: string; body: string | null; file_urls: string[]; status: string } | null;
  onSubmitted: () => void;
}

export function SubmissionForm({ assignmentId, existing, onSubmitted }: SubmissionFormProps) {
  const [body, setBody] = useState(existing?.body ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    if (!body.trim()) return;
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/student/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, body: body.trim(), fileUrls: [] }),
      });
      if (res.ok) {
        setMessage("Submitted successfully!");
        onSubmitted();
      } else {
        const data = await res.json();
        setMessage(data.error ?? "Submission failed");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (existing?.status === "graded") {
    return null;
  }

  return (
    <div data-testid="submission-form" className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-5 mt-4">
      <h4 className="text-sm font-medium text-zinc-200 mb-3">Your Submission</h4>

      <textarea
        data-testid="submission-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-700 focus:outline-none resize-none"
        placeholder="Write your answer here..."
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          data-testid="submission-submit"
          onClick={handleSubmit}
          disabled={!body.trim() || submitting}
          className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {submitting ? "Submitting..." : existing ? "Update Submission" : "Submit"}
        </button>
        {message && (
          <span className={`text-xs ${message.includes("success") ? "text-emerald-400" : "text-red-400"}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
