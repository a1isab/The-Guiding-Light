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
    <div data-testid="submission-form" className="rounded-xl border p-5 mt-4" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-surface) 50%, transparent)" }}>
      <h4 className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>Your Submission</h4>

      <textarea
        data-testid="submission-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        className="w-full rounded-lg border px-3 py-2 text-sm resize-none"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-subtle)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--success) 70%, transparent)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        placeholder="Write your answer here..."
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          data-testid="submission-submit"
          onClick={handleSubmit}
          disabled={!body.trim() || submitting}
          className="rounded-xl px-5 py-2 text-sm font-medium text-white disabled:opacity-50 transition-all"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {submitting ? "Submitting..." : existing ? "Update Submission" : "Submit"}
        </button>
        {message && (
          <span className="text-xs" style={{ color: message.includes("success") ? "var(--success)" : "var(--error)" }}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
