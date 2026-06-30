"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { VideoUpload } from "@/components/teacher/video-upload";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  duration: number | null;
}

export function LessonEditor({
  lesson,
  locale,
  teacherId,
}: {
  lesson: Lesson;
  locale: string;
  teacherId: string;
}) {
  const t = useTranslations("teacher");
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson.video_url ?? "");
  const [duration, setDuration] = useState(lesson.duration ?? 0);

  async function handleSave() {
    setSaving(true);
    setError("");

    const res = await fetch("/api/teacher/lessons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lesson.id,
        title: title.trim(),
        content: content.trim(),
        video_url: videoUrl.trim() || null,
        duration: duration > 0 ? duration : null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? t("error"));
    } else {
      router.refresh();
    }

    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("lesson_title")}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("lesson_content")}</label>
        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("video")}</label>
        <VideoUpload
          lessonId={lesson.id}
          teacherId={teacherId}
          currentUrl={videoUrl}
          onVideoChange={(url) => setVideoUrl(url ?? "")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("video_url_fallback")}</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("duration_seconds")}</label>
          <input
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {saving ? t("saving") : t("save")}
        </button>
      </div>
    </div>
  );
}
