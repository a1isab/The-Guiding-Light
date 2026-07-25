"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";

interface AnnouncementFormProps {
  classId: string;
  onPosted: () => void;
}

export function AnnouncementForm({ classId, onPosted }: AnnouncementFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function handlePost() {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/teacher/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, title: title.trim(), body: body.trim() }),
      });
      if (res.ok) {
        setTitle("");
        setBody("");
        onPosted();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div data-testid="announcement-form" className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-surface) 50%, transparent)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="h-4 w-4" style={{ color: "var(--accent)" }} />
        <h4 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>New Announcement</h4>
      </div>
      <input
        data-testid="announcement-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Announcement title"
        className="w-full rounded-lg border px-3 py-2 text-sm mb-3"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-subtle)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--success) 70%, transparent)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
      />
      <textarea
        data-testid="announcement-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Announcement content..."
        className="w-full rounded-lg border px-3 py-2 text-sm resize-none mb-3"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-subtle)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--success) 70%, transparent)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
      />
      <button
        data-testid="announcement-post"
        onClick={handlePost}
        disabled={!title.trim() || !body.trim() || saving}
        className="rounded-xl px-5 py-2 text-sm font-medium text-white disabled:opacity-50 transition-all"
        style={{ background: "var(--accent)" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        {saving ? "Posting..." : "Post Announcement"}
      </button>
    </div>
  );
}
