"use client";

import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";

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

  async function markAllRead(list: Announcement[]): Promise<Announcement[]> {
    const unread = list.filter((a) => !a.is_read);
    if (unread.length === 0) return list;
    await fetch("/api/student/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ announcementIds: unread.map((a) => a.id) }),
    });
    return list.map((a) => ({ ...a, is_read: true }));
  }

  useEffect(() => {
    if (!loading && announcements.length > 0) {
      markAllRead(announcements).then(setAnnouncements).catch(() => {});
    }
  }, [loading, announcements]);

  if (loading || announcements.length === 0) return null;

  return (
    <div data-testid="announcement-banner" className="mb-6 space-y-3">
      {announcements.map((a) => (
        <div
          key={a.id}
          className="rounded-xl border p-4"
          style={{
            borderColor: a.is_read ? "var(--border)" : "color-mix(in srgb, var(--accent) 30%, transparent)",
            background: a.is_read ? "color-mix(in srgb, var(--bg-surface) 30%, transparent)" : "color-mix(in srgb, var(--accent) 5%, transparent)",
          }}
        >
          <div className="flex items-start gap-3">
            <Megaphone className="h-5 w-5 mt-0.5 shrink-0" style={{ color: a.is_read ? "var(--text-secondary)" : "var(--accent)" }} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{a.title}</h4>
                {!a.is_read && <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />}
              </div>
              <p className="mt-1 text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{a.body}</p>
              <p className="mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>{new Date(a.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
