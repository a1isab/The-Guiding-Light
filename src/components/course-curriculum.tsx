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
            className="rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden"
          >
            <button
              onClick={() => toggle(section.id)}
              className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-zinc-900/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {allDone ? (
                  <CheckCircle className="h-6 w-6 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="h-6 w-6 shrink-0 text-zinc-600" />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">
                    {getTranslation(section, "title", locale, section.title)}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {sectionProgress(lessons)} lessons
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="border-t border-zinc-800 divide-y divide-zinc-800/50">
                {lessons.map((lesson) => {
                  const done = completedLessons.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/${locale}/courses/${courseSlug}/${section.slug}/${lesson.slug}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-zinc-900/30 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                          {lesson.video_url && (
                            <Film className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                          )}
                          <span
                            className={`text-sm ${
                              done ? "text-zinc-400" : "text-zinc-300"
                            }`}
                          >
                            {getTranslation(lesson, "title", locale, lesson.title)}
                          </span>
                        </span>
                      {done ? (
                        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-zinc-600" />
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
