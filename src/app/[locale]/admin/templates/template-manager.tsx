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

  const loadTemplates = useCallback(async (): Promise<Template[]> => {
    const res = await fetch("/api/admin/templates");
    const data = await res.json();
    return data.templates ?? [];
  }, []);

  useEffect(() => {
    loadTemplates().then(setTemplates).finally(() => setLoading(false));
  }, [loadTemplates]);

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
    setTemplates(await loadTemplates());
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template permanently?")) return;
    const res = await fetch(`/api/admin/templates?id=${id}`, { method: "DELETE" });
    if (res.ok) setTemplates(await loadTemplates());
  }

  function cancelEdit() {
    setCreating(false);
    setEditing(null);
    setError("");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--success)' }} />
      </div>
    );
  }

  const formPanelStyle = { borderColor: 'var(--border)', background: 'var(--bg-elevated)' } as const;
  const inputStyle = { borderColor: 'var(--border)', background: 'var(--bg-subtle)', color: 'var(--text-primary)' } as const;
  const labelStyle = { color: 'var(--text-muted)' } as const;

  return (
    <div className="space-y-6">
      <button
        onClick={startCreate}
        data-testid="new-template"
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition-all"
        style={{ background: 'var(--accent)' }}
      >
        <Plus className="h-4 w-4" />
        New Template
      </button>

      {(creating || editing) && (
        <div className="rounded-2xl border p-6 space-y-4" style={formPanelStyle}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {editing ? "Edit Template" : "New Template"}
            </h2>
            <button data-testid="template-cancel" onClick={cancelEdit} style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--text-secondary)]">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs mb-1" style={labelStyle}>Name</label>
            <input
              type="text"
              data-testid="template-form-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              style={inputStyle}
              placeholder="Template name"
            />
          </div>

          <div>
            <label className="block text-xs mb-1" style={labelStyle}>Description (optional)</label>
            <input
              type="text"
              data-testid="template-form-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              style={inputStyle}
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="block text-xs mb-1" style={labelStyle}>Content (markdown)</label>
            <MarkdownEditor value={content} onChange={setContent} minHeight={250} />
          </div>

          {error && <p data-testid="template-error" className="text-xs" style={{ color: 'var(--error)' }}>{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              onClick={cancelEdit}
              className="rounded-lg border px-4 py-2 text-xs hover:text-[var(--text-primary)] transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              data-testid="template-form-save"
              disabled={saving}
              className="rounded-lg px-4 py-2 text-xs text-white hover:brightness-110 disabled:opacity-50 transition-all"
              style={{ background: 'var(--accent)' }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {templates.length === 0 && !creating ? (
        <p data-testid="templates-empty" className="text-sm" style={{ color: 'var(--text-muted)' }}>No templates yet. Create your first official template.</p>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              data-testid={`template-item-${t.id}`}
              className="flex items-center justify-between rounded-xl border px-5 py-4"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                {t.description && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
                )}
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Updated {new Date(t.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                <button
                  onClick={() => startEdit(t)}
                  data-testid={`edit-template-${t.id}`}
                  className="rounded-lg p-1.5 hover:text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-all"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  data-testid={`delete-template-${t.id}`}
                  className="rounded-lg p-1.5 hover:bg-[color-mix(in_srgb,var(--error)_20%,transparent)] transition-all"
                  style={{ color: 'var(--error)' }}
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
