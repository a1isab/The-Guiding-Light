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
      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 transition-all"
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-emerald-400 text-emerald-400" : ""}`} />
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
