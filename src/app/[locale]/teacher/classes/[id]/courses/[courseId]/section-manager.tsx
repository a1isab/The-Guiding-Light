"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Film,
} from "lucide-react";
import { TemplatePicker } from "@/components/teacher/template-picker";

interface Section {
  id: string;
  title: string;
  order_index: number;
}

interface Lesson {
  id: string;
  section_id: string;
  title: string;
  video_url: string | null;
  order_index: number;
}

export function SectionManager({
  classId,
  courseId,
  sections,
  lessonsBySection,
  locale,
}: {
  classId: string;
  courseId: string;
  sections: Section[];
  lessonsBySection: Record<string, Lesson[]>;
  locale: string;
}) {
  const t = useTranslations("teacher");
  const router = useRouter();
  const [expandedSections, setExpanded] = useState<Set<string>>(
    () => new Set(sections.map((s) => s.id))
  );
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [sectionOrder, setSectionOrder] = useState(sections.length + 1);
  const [newLesson, setNewLesson] = useState<{ sectionId: string; title: string } | null>(null);
  const [templatePicker, setTemplatePicker] = useState<string | null>(null);
  const [addingSection, setAddingSection] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function toggleSection(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function addSection() {
    if (!newSectionTitle.trim()) return;
    const res = await fetch("/api/teacher/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ courseId, title: newSectionTitle.trim(), orderIndex: sectionOrder }),
    });
    if (res.ok) {
      setNewSectionTitle("");
      setSectionOrder((o) => o + 1);
      setAddingSection(false);
      router.refresh();
    }
  }

  async function deleteSection(id: string) {
    if (!confirm(t("delete_section_confirm"))) return;
    setDeleting(id);
    await fetch(`/api/teacher/sections?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    });
    setDeleting(null);
    router.refresh();
  }

  async function addLesson(sectionId: string) {
    if (!newLesson || !newLesson.title.trim()) return;
    const lessons = lessonsBySection[sectionId] ?? [];
    const res = await fetch("/api/teacher/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        sectionId,
        title: newLesson.title.trim(),
        orderIndex: lessons.length + 1,
      }),
    });
    if (res.ok) {
      setNewLesson(null);
      router.refresh();
    }
  }

  async function deleteLesson(id: string) {
    if (!confirm(t("delete_lesson_confirm"))) return;
    await fetch(`/api/teacher/lessons?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    });
    router.refresh();
  }

  const baseLessonPath = `/${locale}/teacher/classes/${classId}/courses/${courseId}/sections`;

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const lessons = lessonsBySection[section.id] ?? [];
        const isExpanded = expandedSections.has(section.id);
        return (
          <div key={section.id} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
            <div
              onClick={() => toggleSection(section.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection(section.id); }}
              role="button"
              tabIndex={0}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className="h-4 w-4 transition-transform" style={{ color: 'var(--text-muted)' }}
                />
                <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{section.title}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({lessons.length})</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                disabled={deleting === section.id}
                className="p-1 cursor-pointer hover:text-[var(--error)]"
                style={{ color: 'var(--error)' }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {isExpanded && (
              <div className="border-t divide-y divide-[var(--border)]" style={{ borderColor: 'var(--border)' }}>
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--bg-elevated)]">
                    <Link
                      href={`${baseLessonPath}/${section.id}/lessons/${lesson.id}`}
                      className="flex items-center gap-2 min-w-0 flex-1"
                    >
                      {lesson.video_url ? (
                        <Film className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                      ) : (
                        <FileText className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                      )}
                      <span className="text-sm transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                        {lesson.title}
                      </span>
                    </Link>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Link
                        href={`${baseLessonPath}/${section.id}/lessons/${lesson.id}`}
                        className="rounded-lg p-1.5 hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all" style={{ color: 'var(--text-muted)' }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => deleteLesson(lesson.id)}
                        className="rounded-lg p-1.5 transition-all hover:bg-[color-mix(in_srgb,var(--error)_20%,transparent)]"
                        style={{ color: 'var(--error)' }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {newLesson?.sectionId === section.id ? (
                  <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <input
                      type="text"
                      placeholder={t("lesson_title_placeholder")}
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      className="flex-1 rounded-lg border px-3 py-1.5 text-sm focus:border-[var(--accent)] focus:outline-none"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                    />
                    <button
                      onClick={() => addLesson(section.id)}
                      className="rounded-lg px-3 py-1.5 text-xs text-white hover:bg-[var(--accent)]"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {t("add")}
                    </button>
                    <button
                      onClick={() => setNewLesson(null)}
                      className="rounded-lg border px-3 py-1.5 text-xs hover:text-[var(--text-primary)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setTemplatePicker(section.id)}
                    className="flex w-full items-center gap-2 px-5 py-3 text-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("add_lesson")}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {addingSection ? (
        <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>{t("add_section")}</h3>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder={t("section_title_placeholder")}
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
            />
            <input
              type="number"
              placeholder={t("order")}
              value={sectionOrder}
              onChange={(e) => setSectionOrder(Number(e.target.value))}
              className="w-20 rounded-lg border px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addSection}
              className="rounded-lg px-4 py-2 text-sm text-white hover:bg-[var(--accent)]"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {t("save")}
            </button>
            <button
              onClick={() => setAddingSection(false)}
              className="rounded-lg border px-4 py-2 text-sm hover:text-[var(--text-primary)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingSection(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-sm hover:text-[var(--text-primary)] hover:border-[var(--border)] transition-all"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <Plus className="h-4 w-4" />
          {t("add_section")}
        </button>
      )}

      {templatePicker && (
        <TemplatePicker
          sectionId={templatePicker}
          onClose={() => setTemplatePicker(null)}
          onCreated={() => { setTemplatePicker(null); router.refresh(); }}
        />
      )}
    </div>
  );
}
