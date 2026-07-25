"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import {
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Film,
  Ellipsis,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  slug: string;
  order_index: number;
}

interface Lesson {
  id: string;
  section_id: string;
  title: string;
  slug: string;
  content_type: string;
  video_url: string | null;
  order_index: number;
}

export function CourseSectionManager({
  courseSlug,
  courseId,
  sections,
  lessonsBySection,
  locale,
}: {
  courseSlug: string;
  courseId: string;
  sections: Section[];
  lessonsBySection: Record<string, Lesson[]>;
  locale: string;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const supabase = createClient();
  const [expandedSections, setExpanded] = useState<Set<string>>(() => new Set(sections.map((s) => s.id)));
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionSlug, setNewSectionSlug] = useState("");
  const [sectionOrder, setSectionOrder] = useState(sections.length + 1);
  const [newLesson, setNewLesson] = useState<{ sectionId: string; title: string; slug: string } | null>(null);
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
    if (!newSectionTitle.trim() || !newSectionSlug.trim()) return;
    const { error } = await supabase.from("sections").insert({
      course_id: courseId,
      title: newSectionTitle,
      slug: newSectionSlug,
      order_index: sectionOrder,
    });
    if (!error) {
      setNewSectionTitle("");
      setNewSectionSlug("");
      setSectionOrder((o) => o + 1);
      setAddingSection(false);
      router.refresh();
    }
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section and all its lessons?")) return;
    setDeleting(id);
    await supabase.from("sections").delete().eq("id", id);
    setDeleting(null);
    router.refresh();
  }

  async function addLesson(sectionId: string) {
    if (!newLesson || !newLesson.title.trim() || !newLesson.slug.trim()) return;
    const lessons = lessonsBySection[sectionId] ?? [];
    const { error } = await supabase.from("lessons").insert({
      section_id: sectionId,
      title: newLesson.title,
      slug: newLesson.slug,
      content: "",
      content_type: "text",
      order_index: lessons.length + 1,
    });
    if (!error) {
      setNewLesson(null);
      router.refresh();
    }
  }

  async function deleteLesson(id: string) {
    if (!confirm("Delete this lesson?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    router.refresh();
  }

  const sectionCardStyle = { borderColor: 'var(--border)', background: 'var(--bg-surface)' } as const;
  const inputStyle = { borderColor: 'var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' } as const;

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const lessons = lessonsBySection[section.id] ?? [];
        const isExpanded = expandedSections.has(section.id);
        return (
          <div key={section.id} className="rounded-2xl border overflow-hidden" style={sectionCardStyle}>
            <div
              onClick={() => toggleSection(section.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection(section.id); }}
              role="button"
              tabIndex={0}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  style={{ color: 'var(--text-muted)' }}
                />
                <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {section.title}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({lessons.length})</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                disabled={deleting === section.id}
                className="hover:text-[var(--error)] p-1 cursor-pointer"
                style={{ color: 'var(--error)' }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {isExpanded && (
              <div className="border-t divide-[var(--border)]" style={{ borderColor: 'var(--border)' }}>
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--bg-elevated)]">
                    <Link
                      href={`/${locale}/admin/courses/${courseSlug}/sections/${section.id}/lessons/${lesson.id}`}
                      className="flex items-center gap-2 min-w-0 flex-1"
                    >
                      {lesson.video_url ? (
                        <Film className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                      ) : (
                        <FileText className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                      )}
                      <span className="text-sm hover:text-[var(--success)] transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        {lesson.title}
                      </span>
                    </Link>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Link
                        href={`/${locale}/admin/courses/${courseSlug}/sections/${section.id}/lessons/${lesson.id}`}
                        className="rounded-lg p-1.5 hover:text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-all"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => deleteLesson(lesson.id)}
                        className="rounded-lg p-1.5 hover:bg-[color-mix(in_srgb,var(--error)_20%,transparent)] transition-all"
                        style={{ color: 'var(--error)' }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {newLesson?.sectionId === section.id ? (
                  <div className="flex items-center gap-2 px-5 py-3" style={{ background: 'var(--bg-elevated)' }}>
                    <input
                      type="text"
                      placeholder="Lesson title"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      className="flex-1 rounded-lg border px-3 py-1.5 text-sm focus:border-[var(--accent)] focus:outline-none"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="slug"
                      value={newLesson.slug}
                      onChange={(e) => setNewLesson({ ...newLesson, slug: e.target.value })}
                      className="w-28 rounded-lg border px-3 py-1.5 text-sm focus:border-[var(--accent)] focus:outline-none"
                      style={inputStyle}
                    />
                    <button
                      onClick={() => addLesson(section.id)}
                      className="rounded-lg px-3 py-1.5 text-xs text-white hover:brightness-110"
                      style={{ background: 'var(--accent)' }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setNewLesson(null)}
                      className="rounded-lg border px-3 py-1.5 text-xs hover:text-[var(--text-primary)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setNewLesson({ sectionId: section.id, title: "", slug: "" })}
                    className="flex w-full items-center gap-2 px-5 py-3 text-sm hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
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
        <div className="rounded-2xl border p-5" style={sectionCardStyle}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>{t("add_section")}</h3>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Section title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="slug"
              value={newSectionSlug}
              onChange={(e) => setNewSectionSlug(e.target.value)}
              className="w-32 rounded-lg border px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Order"
              value={sectionOrder}
              onChange={(e) => setSectionOrder(Number(e.target.value))}
              className="w-20 rounded-lg border px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              style={inputStyle}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addSection}
              className="rounded-lg px-4 py-2 text-sm text-white hover:brightness-110"
              style={{ background: 'var(--accent)' }}
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-sm hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <Plus className="h-4 w-4" />
          {t("add_section")}
        </button>
      )}
    </div>
  );
}
