"use client";

import { useState, useRef, useEffect, useCallback, type DragEvent } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-client";

const ACCEPTED_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ACCEPTED_EXTS = ["pdf", "doc", "docx", "txt"];

const MAX_SIZE = 50 * 1024 * 1024;

const PDF_MAGIC = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
const OLE2_MAGIC = new Uint8Array([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]);
const ZIP_MAGIC = new Uint8Array([0x50, 0x4B, 0x03, 0x04]);

function isValidContent(buffer: ArrayBuffer, mimeType: string): boolean {
  if (mimeType === "text/plain") return true;
  const bytes = new Uint8Array(buffer.slice(0, 16));
  if (mimeType === "application/pdf") return bytes.slice(0, 4).every((b, i) => b === PDF_MAGIC[i]);
  if (mimeType === "application/msword") return OLE2_MAGIC.every((b, i) => bytes[i] === b);
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return bytes.slice(0, 4).every((b, i) => b === ZIP_MAGIC[i]);
  }
  return false;
}

interface LessonFile {
  id: string;
  filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
  public_url?: string;
}

export function FileUpload({ lessonId }: { lessonId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const supabase = createClient();
  const [files, setFiles] = useState<LessonFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
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

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ACCEPTED_EXTS.includes(ext)) {
      setError("File extension not allowed. Accepted: PDF, Word (doc/docx), TXT");
      return;
    }

    if (!ACCEPTED_MIMES.includes(file.type)) {
      setError("File type not allowed. Accepted: PDF, Word (doc/docx), TXT");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("File size exceeds 50MB limit");
      return;
    }

    const buffer = await file.arrayBuffer();
    if (!isValidContent(buffer, file.type)) {
      setError("File content does not match declared type");
      return;
    }

    setUploading(true);

    const path = `uploads/${lessonId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("lesson-files")
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("lesson-files")
      .getPublicUrl(path);

    const res = await fetch("/api/teacher/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId,
        filename: file.name,
        mime_type: file.type,
        file_size: file.size,
        storage_path: path,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      await supabase.storage.from("lesson-files").remove([path]);
      setError(result.error ?? "Failed to save file record");
      setUploading(false);
      return;
    }

    setFiles((prev) => [result.file, ...prev]);
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

  async function handleDelete(fileId: string, storagePath: string) {
    try {
      await Promise.all([
        supabase.storage.from("lesson-files").remove([storagePath]),
        fetch(`/api/teacher/files?id=${fileId}`, { method: "DELETE" }),
      ]);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch {
      setError("Failed to delete file");
    }
  }

  return (
    <div className="space-y-3">
      <div
        data-testid="file-upload-area"
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all ${
          dragOver
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-500 hover:bg-zinc-900/50"
        }`}
      >
        {uploading ? (
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Uploading...</p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className={`h-6 w-6 mx-auto mb-2 ${dragOver ? "text-emerald-400" : "text-zinc-500"}`} />
            <p className={`text-xs ${dragOver ? "text-emerald-400" : "text-zinc-400"}`}>
              {dragOver ? "Drop file here" : "Upload Document"}
            </p>
            <p className="text-xs text-zinc-600 mt-1">PDF, Word, TXT — up to 50MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        data-testid="file-input"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

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
                onClick={() => handleDelete(f.id, f.storage_path ?? "")}
                data-testid={`delete-file-${f.id}`}
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
