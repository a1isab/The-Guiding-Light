"use client";

import { useState, useEffect } from "react";
import { Loader2, BookTemplate, FileText } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string | null;
  content: string;
  is_official: boolean;
}

export function TemplatePicker({
  sectionId,
  onClose,
  onCreated,
}: {
  sectionId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/teacher/templates", { credentials: "same-origin" });
      const data = await res.json();
      setTemplates(data.templates ?? []);
      setLoading(false);
    })();
  }, []);

  async function createLesson(content: string) {
    if (!title.trim()) {
      setError("Please enter a lesson title.");
      return;
    }
    setCreating(true);
    setError("");

    const res = await fetch("/api/teacher/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        sectionId,
        title: title.trim(),
        content,
        orderIndex: 0,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create lesson");
    } else {
      onCreated();
    }

    setCreating(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-lg rounded-2xl border p-6 space-y-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>New Lesson</h3>

        <div>
          <label className="block text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-subtle)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            placeholder="Enter lesson title"
          />
        </div>

        {error && <p className="text-xs" style={{ color: "var(--error)" }}>{error}</p>}

        <div>
          <label className="block text-xs mb-2" style={{ color: "var(--text-secondary)" }}>Start from a template (optional)</label>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--text-secondary)" }} />
            </div>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <button
                onClick={() => createLesson("")}
                disabled={creating}
                className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all disabled:opacity-50"
                style={{ borderColor: "var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-subtle)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <FileText className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
                <div>
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>Blank Lesson</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Start with empty content</p>
                </div>
              </button>
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => createLesson(t.content)}
                  disabled={creating}
                  className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all disabled:opacity-50"
                  style={{ borderColor: "var(--border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-subtle)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <BookTemplate className="h-4 w-4" style={{ color: t.is_official ? "var(--accent)" : "var(--success)" }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {t.is_official ? "Official template" : "Your template"}
                      {t.description ? ` — ${t.description}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-xs transition-all"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
