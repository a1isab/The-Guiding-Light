"use client";

import { useState, useEffect } from "react";
import { getClientAccessToken } from "@/lib/supabase-client";
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
      const token = await getClientAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/teacher/templates", { headers });
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

    const token = await getClientAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("/api/teacher/lessons", {
      method: "POST",
      headers,
      credentials: "omit",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 p-6 space-y-4">
        <h3 className="text-sm font-medium text-zinc-200">New Lesson</h3>

        <div>
          <label className="block text-xs text-zinc-500 mb-1">Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Enter lesson title"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div>
          <label className="block text-xs text-zinc-500 mb-2">Start from a template (optional)</label>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            </div>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <button
                onClick={() => createLesson("")}
                disabled={creating}
                className="flex w-full items-center gap-3 rounded-xl border border-zinc-700 px-3 py-2.5 text-left hover:bg-zinc-800/50 transition-all disabled:opacity-50"
              >
                <FileText className="h-4 w-4 text-zinc-500" />
                <div>
                  <p className="text-sm text-zinc-200">Blank Lesson</p>
                  <p className="text-xs text-zinc-600">Start with empty content</p>
                </div>
              </button>
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => createLesson(t.content)}
                  disabled={creating}
                  className="flex w-full items-center gap-3 rounded-xl border border-zinc-700 px-3 py-2.5 text-left hover:bg-zinc-800/50 transition-all disabled:opacity-50"
                >
                  <BookTemplate className={`h-4 w-4 ${t.is_official ? "text-purple-400" : "text-emerald-400"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-200 truncate">{t.name}</p>
                    <p className="text-xs text-zinc-600 truncate">
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
            className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
