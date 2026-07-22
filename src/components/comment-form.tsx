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
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-700 focus:outline-none resize-none"
        />
      </div>
      <button
        data-testid="comment-submit"
        onClick={handleSubmit}
        disabled={!body.trim() || submitting}
        className="self-end rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
