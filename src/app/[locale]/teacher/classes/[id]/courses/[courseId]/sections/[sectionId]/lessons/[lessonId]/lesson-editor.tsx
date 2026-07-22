"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Copy, Save, BookTemplate } from "lucide-react";
import { VideoUpload } from "@/components/teacher/video-upload";
import { QuizEditor } from "@/components/teacher/quiz-editor";
import { FileUpload } from "@/components/teacher/file-upload";
import { MarkdownEditor } from "@/components/teacher/markdown-editor";
import { MarkdownContent } from "@/components/teacher/markdown-content";
import { AssignmentForm } from "@/components/assignment-form";
import { SubmissionList } from "@/components/submission-list";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  quiz_source_content: string | null;
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
  const [quizSourceContent, setQuizSourceContent] = useState(lesson.quiz_source_content ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson.video_url ?? "");
  const [duration, setDuration] = useState(lesson.duration ?? 0);
  const [preview, setPreview] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [assignment, setAssignment] = useState<{ id: string; title: string; description: string | null; max_score: number; due_date: string | null } | null>(null);
  const [assignmentLoaded, setAssignmentLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/teacher/assignments?lessonId=${lesson.id}`)
      .then((r) => r.json())
      .then((data) => {
        const list = data.assignments ?? [];
        if (list.length > 0) setAssignment(list[0]);
      })
      .catch(() => {})
      .finally(() => setAssignmentLoaded(true));
  }, [lesson.id]);

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
        quizSourceContent: quizSourceContent.trim() || null,
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

  async function handleSaveTemplate() {
    if (!templateName.trim()) return;
    setSavingTemplate(true);
    await fetch("/api/teacher/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: templateName.trim(),
        description: templateDesc.trim() || null,
        content: content.trim(),
      }),
    });
    setSavingTemplate(false);
    setTemplateDialog(false);
    setTemplateName("");
    setTemplateDesc("");
  }

  if (preview) {
    return (
      <div className="space-y-6">
        <div data-testid="preview-banner" className="flex items-center justify-between rounded-xl border border-emerald-700 bg-emerald-500/10 px-4 py-3">
          <p className="text-sm text-emerald-400 font-medium">Preview Mode – Students will see this page</p>
          <button
            onClick={() => setPreview(false)}
            data-testid="back-to-edit"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-all"
          >
            <EyeOff className="h-3.5 w-3.5" />
            Back to Edit
          </button>
        </div>

        <article className="max-w-4xl">
          <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">{title || "Lesson Title"}</h1>

          {videoUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <iframe
                src={videoUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}

          <MarkdownContent content={content} />
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Lesson Editor</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplateDialog(true)}
            data-testid="save-template"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <Save className="h-3.5 w-3.5" />
            Save as Template
          </button>
          <button
            onClick={handleSave}
            data-testid="save-lesson"
            disabled={saving}
            className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
          >
            {saving ? t("saving") : t("save")}
          </button>
          <button
            onClick={() => setPreview(true)}
            data-testid="preview-toggle"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-all"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("lesson_title")}</label>
        <input
          type="text"
          data-testid="lesson-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("lesson_content")}</label>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">
          Quiz Source Content
          <span className="text-xs text-zinc-500 font-normal ml-2">Required for AI Generation</span>
        </label>
        <div className="space-y-2">
          <textarea
            rows={6}
            value={quizSourceContent}
            onChange={(e) => setQuizSourceContent(e.target.value)}
            placeholder="Enter plain text content for AI quiz generation, or copy from lesson content above..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
          />
          <button
            onClick={() => setQuizSourceContent(content)}
            data-testid="copy-from-content"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy from content
          </button>
        </div>
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

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Documents</label>
        <FileUpload lessonId={lesson.id} />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Quiz</label>
        <QuizEditor lessonId={lesson.id} lessonContent={quizSourceContent || content} />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Assignment</label>
        {assignmentLoaded && (
          <>
            <AssignmentForm
              lessonId={lesson.id}
              existing={assignment ?? undefined}
              onSaved={() => {
                fetch(`/api/teacher/assignments?lessonId=${lesson.id}`)
                  .then((r) => r.json())
                  .then((data) => {
                    const list = data.assignments ?? [];
                    if (list.length > 0) setAssignment(list[0]);
                  });
              }}
            />
            {assignment && (
              <SubmissionList assignmentId={assignment.id} maxScore={assignment.max_score} />
            )}
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {templateDialog && (
        <div data-testid="template-dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 space-y-4">
            <h3 className="text-sm font-medium text-zinc-200">Save as Template</h3>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Name</label>
              <input
                type="text"
                data-testid="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                placeholder="My template name"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Description (optional)</label>
              <textarea
                rows={3}
                data-testid="template-desc"
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                placeholder="Brief description..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTemplateDialog(false)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                data-testid="template-save"
                disabled={savingTemplate || !templateName.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs text-white hover:bg-emerald-500 disabled:opacity-50 transition-all"
              >
                {savingTemplate ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
