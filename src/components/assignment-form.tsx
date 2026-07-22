"use client";

import { useState } from "react";
import { Plus, Edit2 } from "lucide-react";

interface AssignmentFormProps {
  lessonId: string;
  existing?: { id: string; title: string; description: string | null; max_score: number; due_date: string | null };
  onSaved: () => void;
}

export function AssignmentForm({ lessonId, existing, onSaved }: AssignmentFormProps) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [maxScore, setMaxScore] = useState(existing?.max_score ?? 100);
  const [dueDate, setDueDate] = useState(existing?.due_date?.slice(0, 10) ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const url = existing ? "/api/teacher/assignments" : "/api/teacher/assignments";
      const method = existing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(existing ? { id: existing.id } : { lessonId }),
          title: title.trim(),
          description: description.trim() || null,
          maxScore,
          dueDate: dueDate || null,
        }),
      });
      if (res.ok) onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div data-testid="assignment-form" className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-5 mt-4">
      <div className="flex items-center gap-2 mb-4">
        {existing ? <Edit2 className="h-4 w-4 text-emerald-400" /> : <Plus className="h-4 w-4 text-emerald-400" />}
        <h4 className="text-sm font-medium text-zinc-200">{existing ? "Edit Assignment" : "New Assignment"}</h4>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Title</label>
          <input
            data-testid="assignment-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-700 focus:outline-none"
            placeholder="Assignment title"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Description</label>
          <textarea
            data-testid="assignment-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-700 focus:outline-none resize-none"
            placeholder="Instructions for students..."
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Max Score</label>
            <input
              data-testid="assignment-max-score"
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-700 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Due Date (optional)</label>
            <input
              data-testid="assignment-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        data-testid="assignment-save"
        onClick={handleSave}
        disabled={!title.trim() || saving}
        className="mt-4 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
      >
        {saving ? "Saving..." : existing ? "Update" : "Create Assignment"}
      </button>
    </div>
  );
}
