"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

export function BookmarkButton({ lessonId }: { lessonId: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        const list = data.bookmarks ?? [];
        setBookmarked(list.some((b: { lesson_id: string }) => b.lesson_id === lessonId));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  async function toggle() {
    setBookmarked(!bookmarked);
    try {
      const res = await fetch("/api/student/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.bookmarked);
      }
    } catch {
      setBookmarked(!bookmarked);
    }
  }

  if (loading) return null;

  return (
    <button
      data-testid="bookmark-button"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all"
      style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-subtle)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? "" : ""}`} style={bookmarked ? { color: "var(--success)", fill: "var(--success)" } : undefined} />
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
