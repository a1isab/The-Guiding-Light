"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, FileText, Film, CheckCircle } from "lucide-react";

interface Lesson {
  id: string;
  section_id: string;
  title: string;
  video_url: string | null;
  duration: number | null;
}

interface Section {
  id: string;
  title: string;
}

interface StudentCurriculumProps {
  classId: string;
  courseId: string;
  sections: Section[];
  lessonsBySection: Record<string, Lesson[]>;
  completedIds: Set<string>;
  locale: string;
}

export function StudentCurriculum({
  classId,
  courseId,
  sections,
  lessonsBySection,
  completedIds,
  locale,
}: StudentCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (sections.length > 0) {
      initial.add(sections[0].id);
    }
    return initial;
  });

  function toggleSection(sectionId: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const sectionLessons = lessonsBySection[section.id] ?? [];
        const completedCount = sectionLessons.filter((l) => completedIds.has(l.id)).length;
        const allCompleted = sectionLessons.length > 0 && completedCount === sectionLessons.length;
        const isExpanded = expandedSections.has(section.id);

        return (
          <div key={section.id} data-testid={`student-section-${section.id}`} className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full px-5 py-4 transition-colors"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--bg-surface) 30%, transparent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className="h-4 w-4 transition-transform"
                  style={{ color: "var(--text-secondary)", transform: isExpanded ? "rotate(180deg)" : undefined }}
                />
                <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{section.title}</span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {completedCount}/{sectionLessons.length} completed
                </span>
              </div>
              {allCompleted && (
                <CheckCircle className="h-5 w-5" style={{ color: "var(--success)" }} />
              )}
            </button>

            {isExpanded && (
              <div className="border-t" style={{ borderColor: "var(--border)" }}>
                {sectionLessons.map((lesson) => {
                  const isCompleted = completedIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      data-testid={`student-lesson-${lesson.id}`}
                      href={`/${locale}/dashboard/classes/${classId}/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors"
                      style={{ borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--bg-surface) 30%, transparent)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} />
                      ) : lesson.video_url ? (
                        <Film className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                      )}
                      <span className="text-sm" style={{ color: isCompleted ? "var(--text-secondary)" : "var(--text-primary)" }}>
                        {lesson.title}
                      </span>
                      {lesson.duration && (
                        <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
                          {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
