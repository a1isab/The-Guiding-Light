"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface CommentFormProps {
  onSubmit: (body: string, parentId?: string) => Promise<void>;
  placeholder?: string;
  compact?: boolean;
}

export function CommentForm({ onSubmit, placeholder = "Write a comment...", compact }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(body.trim());
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`flex gap-3 ${compact ? "" : "mt-4"}`}>
      <div className="flex-1">
        <textarea
          data-testid="comment-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className="w-full rounded-xl border px-4 py-3 text-sm resize-none"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg-surface) 50%, transparent)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--success) 70%, transparent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
      </div>
      <button
        data-testid="comment-submit"
        onClick={handleSubmit}
        disabled={!body.trim() || submitting}
        className="self-end rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 transition-all"
        style={{ background: "var(--accent)" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
