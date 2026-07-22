"use client";

import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
}

export function AnnouncementBanner({ classId }: { classId: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/announcements?classId=${classId}`)
      .then((r) => r.json())
      .then((data) => setAnnouncements(data.announcements ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  async function markRead() {
    const unread = announcements.filter((a) => !a.is_read);
    if (unread.length === 0) return;
    await fetch("/api/student/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ announcementIds: unread.map((a) => a.id) }),
    });
    setAnnouncements((prev) => prev.map((a) => ({ ...a, is_read: true })));
  }

  useEffect(() => {
    if (!loading && announcements.length > 0) markRead();
  }, [loading]);

  if (loading || announcements.length === 0) return null;

  return (
    <div data-testid="announcement-banner" className="mb-6 space-y-3">
      {announcements.map((a) => (
        <div
          key={a.id}
          className={`rounded-xl border p-4 ${
            a.is_read
              ? "border-zinc-800 bg-zinc-900/30"
              : "border-blue-800/30 bg-blue-900/5"
          }`}
        >
          <div className="flex items-start gap-3">
            <Megaphone className={`h-5 w-5 mt-0.5 shrink-0 ${a.is_read ? "text-zinc-500" : "text-blue-400"}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-zinc-200">{a.title}</h4>
                {!a.is_read && <span className="h-2 w-2 rounded-full bg-blue-400" />}
              </div>
              <p className="mt-1 text-xs text-zinc-400 whitespace-pre-wrap">{a.body}</p>
              <p className="mt-2 text-[10px] text-zinc-600">{new Date(a.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
