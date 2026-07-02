"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";

const ACCEPTED = [".pdf", ".doc", ".docx", ".txt"];
const ACCEPTED_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

interface LessonFile {
  id: string;
  filename: string;
  mime_type: string;
  file_size: number;
  created_at: string;
  public_url?: string;
}

export function FileUpload({ lessonId }: { lessonId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<LessonFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/files?lessonId=${lessonId}`);
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch {
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleFile(file: File) {
    setError("");

    if (!ACCEPTED_MIMES.includes(file.type)) {
      setError("File type not allowed. Accepted: PDF, Word (doc/docx), TXT");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lessonId", lessonId);

    try {
      const res = await fetch("/api/teacher/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFiles((prev) => [data.file, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(fileId: string) {
    try {
      const res = await fetch(`/api/teacher/files?id=${fileId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch {
      setError("Failed to delete file");
    }
  }

  return (
    <div className="space-y-3">
      {/* Upload drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/30 p-6 hover:border-zinc-500 hover:bg-zinc-900/50 transition-all"
      >
        {uploading ? (
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Uploading...</p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="h-6 w-6 text-zinc-500 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">Upload Document</p>
            <p className="text-xs text-zinc-600 mt-1">PDF, Word, TXT — up to 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* File list */}
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
        </div>
      ) : files.length > 0 ? (
        <div className="space-y-1.5">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-300 truncate">{f.filename}</p>
                  <p className="text-[10px] text-zinc-600">{formatSize(f.file_size)}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(f.id)}
                className="flex-shrink-0 rounded p-1 text-zinc-600 hover:text-red-400 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
