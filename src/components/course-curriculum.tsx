"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CheckCircle, Circle, Film } from "lucide-react";
import type { Section, Lesson, Locale } from "@/lib/types";
import { getTranslation } from "@/lib/types";

interface Props {
  courseSlug: string;
  sections: Section[];
  lessonsBySection: Record<string, Lesson[]>;
  completedLessons: Set<string>;
  locale: Locale;
}

export function CourseCurriculum({
  courseSlug,
  sections,
  lessonsBySection,
  completedLessons,
  locale,
}: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const first = sections[0];
    return new Set(first ? [first.id] : []);
  });

  function toggle(sectionId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }

  function sectionProgress(lessons: Lesson[]) {
    const done = lessons.filter((l) => completedLessons.has(l.id)).length;
    return `${done}/${lessons.length}`;
  }

  function sectionComplete(lessons: Lesson[]) {
    return lessons.every((l) => completedLessons.has(l.id));
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const lessons = lessonsBySection[section.id] ?? [];
        const isExpanded = expanded.has(section.id);
        const allDone = sectionComplete(lessons);

        return (
          <div
            key={section.id}
            data-testid={`curriculum-section-${section.id}`}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
          >
            <button
              onClick={() => toggle(section.id)}
              className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--bg-surface) 50%, transparent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div className="flex items-center gap-4">
                {allDone ? (
                  <CheckCircle className="h-6 w-6 shrink-0" style={{ color: "var(--success)" }} />
                ) : (
                  <Circle className="h-6 w-6 shrink-0" style={{ color: "var(--text-muted)" }} />
                )}
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                    {getTranslation(section, "title", locale, section.title)}
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {sectionProgress(lessons)} lessons
                  </p>
                </div>
              </div>
              <ChevronDown
                className="h-5 w-5 transition-transform duration-200"
                style={{ color: "var(--text-secondary)", transform: isExpanded ? "rotate(180deg)" : undefined }}
              />
            </button>

            {isExpanded && (
              <div className="border-t" style={{ borderColor: "var(--border)" }}>
                {lessons.map((lesson) => {
                  const done = completedLessons.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      data-testid={`curriculum-lesson-${lesson.id}`}
                      href={`/${locale}/courses/${courseSlug}/${section.slug}/${lesson.slug}`}
                      className="flex items-center justify-between px-6 py-4 transition-colors"
                      style={{ borderColor: "color-mix(in srgb, var(--border) 50%, transparent)", borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--bg-surface) 30%, transparent)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <span className="flex items-center gap-2">
                          {lesson.video_url && (
                            <Film className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                          )}
                          <span
                            className="text-sm"
                            style={{ color: done ? "var(--text-secondary)" : "var(--text-primary)" }}
                          >
                            {getTranslation(lesson, "title", locale, lesson.title)}
                          </span>
                        </span>
                      {done ? (
                        <CheckCircle className="h-5 w-5 shrink-0" style={{ color: "var(--success)" }} />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0" style={{ color: "var(--text-muted)" }} />
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
