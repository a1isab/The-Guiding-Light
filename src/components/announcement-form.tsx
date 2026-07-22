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
    <div data-testid="announcement-form" className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="h-4 w-4 text-emerald-400" />
        <h4 className="text-sm font-medium text-zinc-200">New Announcement</h4>
      </div>
      <input
        data-testid="announcement-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Announcement title"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-700 focus:outline-none mb-3"
      />
      <textarea
        data-testid="announcement-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Announcement content..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-700 focus:outline-none resize-none mb-3"
      />
      <button
        data-testid="announcement-post"
        onClick={handlePost}
        disabled={!title.trim() || !body.trim() || saving}
        className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
      >
        {saving ? "Posting..." : "Post Announcement"}
      </button>
    </div>
  );
}
