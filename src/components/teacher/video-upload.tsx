"use client";

import { useState, useRef, type DragEvent } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { Upload, X, Film, Loader2 } from "lucide-react";

const MAX_SIZE = 500 * 1024 * 1024;
const ACCEPTED = ["video/mp4", "video/quicktime", "video/webm"];

export function VideoUpload({
  lessonId,
  teacherId,
  currentUrl,
  onVideoChange,
}: {
  lessonId: string;
  teacherId: string;
  currentUrl?: string | null;
  onVideoChange: (url: string | null) => void;
}) {
  const t = useTranslations("teacher");
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");

    if (!ACCEPTED.includes(file.type)) {
      setError(t("video_format_error"));
      return;
    }

    if (file.size > MAX_SIZE) {
      setError(t("video_size_error"));
      return;
    }

    setUploading(true);
    setProgress(0);

    const ext = file.name.split(".").pop() || "mp4";
    const path = `${teacherId}/${lessonId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("teacher-videos")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("teacher-videos")
      .getPublicUrl(path);

    const publicUrl = urlData.publicUrl;

    // Track in teacher_video_assets
    await supabase.from("teacher_video_assets").insert({
      teacher_id: teacherId,
      lesson_id: lessonId,
      filename: file.name,
      file_size: file.size,
      mime_type: file.type,
      storage_path: path,
    });

    onVideoChange(publicUrl);
    setUploading(false);
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragOver(true);
    }
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragOver(false);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  async function handleRemove() {
    if (!currentUrl) return;
    const path = currentUrl.split("/").slice(-3).join("/");
    await Promise.all([
      supabase.storage.from("teacher-videos").remove([path]).then(),
      supabase.from("teacher_video_assets").delete().eq("storage_path", path).then(),
    ]);
    onVideoChange(null);
  }

  return (
    <div className="space-y-3">
      {currentUrl ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 overflow-hidden">
          <video
            src={currentUrl}
            controls
            className="w-full aspect-video"
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-700">
            <span className="text-xs text-zinc-500 truncate">{currentUrl.split("/").pop()}</span>
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              <X className="h-3 w-3" />
              {t("remove_video")}
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="video-upload-area"
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
            dragOver
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-500 hover:bg-zinc-900/50"
          }`}
        >
          {uploading ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">{t("uploading_video")}</p>
              {progress > 0 && (
                <div className="mt-2 h-1.5 w-40 rounded-full bg-zinc-800 mx-auto">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Film className={`h-8 w-8 mx-auto mb-2 ${dragOver ? "text-emerald-400" : "text-zinc-500"}`} />
              <p className={`text-sm ${dragOver ? "text-emerald-400" : "text-zinc-400"}`}>
                {dragOver ? "Drop video here" : t("upload_video")}
              </p>
              <p className="text-xs text-zinc-600 mt-1">{t("video_limits")}</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        data-testid="video-input"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
