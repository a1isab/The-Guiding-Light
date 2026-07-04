"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Trash2, Pencil, X } from "lucide-react";
import { MarkdownEditor } from "@/components/teacher/markdown-editor";

interface Template {
  id: string;
  name: string;
  description: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Template | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/templates");
    const data = await res.json();
    setTemplates(data.templates ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  function startCreate() {
    setName("");
    setDescription("");
    setContent("");
    setCreating(true);
    setEditing(null);
    setError("");
  }

  function startEdit(t: Template) {
    setName(t.name);
    setDescription(t.description ?? "");
    setContent(t.content);
    setEditing(t);
    setCreating(false);
    setError("");
  }

  async function handleSave() {
    if (!name.trim() || !content.trim()) {
      setError("Name and content are required.");
      return;
    }
    setSaving(true);
    setError("");

    if (editing) {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          name: name.trim(),
          description: description.trim() || null,
          content: content.trim(),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Save failed");
      }
    } else {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          content: content.trim(),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Save failed");
      }
    }

    setSaving(false);
    setCreating(false);
    setEditing(null);
    loadTemplates();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template permanently?")) return;
    const res = await fetch(`/api/admin/templates?id=${id}`, { method: "DELETE" });
    if (res.ok) loadTemplates();
  }

  function cancelEdit() {
    setCreating(false);
    setEditing(null);
    setError("");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={startCreate}
        data-testid="new-template"
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 transition-all"
      >
        <Plus className="h-4 w-4" />
        New Template
      </button>

      {(creating || editing) && (
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-200">
              {editing ? "Edit Template" : "New Template"}
            </h2>
            <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Name</label>
            <input
              type="text"
              data-testid="template-form-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
              placeholder="Template name"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Description (optional)</label>
            <input
              type="text"
              data-testid="template-form-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Content (markdown)</label>
            <MarkdownEditor value={content} onChange={setContent} minHeight={250} />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              onClick={cancelEdit}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              data-testid="template-form-save"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs text-white hover:bg-emerald-500 disabled:opacity-50 transition-all"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {templates.length === 0 && !creating ? (
        <p className="text-sm text-zinc-500">No templates yet. Create your first official template.</p>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              data-testid={`template-item-${t.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#111111] px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                {t.description && (
                  <p className="text-xs text-zinc-500 mt-0.5">{t.description}</p>
                )}
                <p className="text-xs text-zinc-600 mt-1">
                  Updated {new Date(t.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                <button
                  onClick={() => startEdit(t)}
                  data-testid={`edit-template-${t.id}`}
                  className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  data-testid={`delete-template-${t.id}`}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-900/20 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
