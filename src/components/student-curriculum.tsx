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
          <div key={section.id} data-testid={`student-section-${section.id}`} className="rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full px-5 py-4 hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`h-4 w-4 text-zinc-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
                <span className="text-base font-semibold text-zinc-100">{section.title}</span>
                <span className="text-xs text-zinc-500">
                  {completedCount}/{sectionLessons.length} completed
                </span>
              </div>
              {allCompleted && (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-zinc-800 divide-y divide-zinc-800/50">
                {sectionLessons.map((lesson) => {
                  const isCompleted = completedIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      data-testid={`student-lesson-${lesson.id}`}
                      href={`/${locale}/dashboard/classes/${classId}/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-900/30 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                      ) : lesson.video_url ? (
                        <Film className="h-4 w-4 shrink-0 text-zinc-600" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 text-zinc-600" />
                      )}
                      <span className={`text-sm ${isCompleted ? "text-zinc-500" : "text-zinc-300"}`}>
                        {lesson.title}
                      </span>
                      {lesson.duration && (
                        <span className="text-xs text-zinc-600 ml-auto">
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
