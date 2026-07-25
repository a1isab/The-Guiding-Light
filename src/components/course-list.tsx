"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import type { Course, Locale } from "@/lib/types";
import { getTranslation } from "@/lib/types";
import { BookOpen, Film } from "lucide-react";

const levels = ["all", "beginner", "intermediate", "advanced"] as const;

interface Props {
  courses: Course[];
  courseLessonCount: Record<string, number>;
  courseHasVideo: Set<string>;
}

export function CourseList({ courses, courseLessonCount, courseHasVideo }: Props) {
  const t = useTranslations("courses");
  const locale = useLocale() as Locale;
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all"
    ? courses
    : courses.filter((c) => c.level === active);

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {levels.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className="rounded-xl border px-4 py-1.5 text-sm capitalize transition-all"
            style={{
              borderColor: active === filter ? "var(--accent)" : "var(--border)",
              background: active === filter ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
              color: active === filter ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            {t(filter)}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course: Course) => {
          const lessonCount = courseLessonCount[course.id] ?? 0;
          return (
            <Link
              key={course.id}
              data-testid={`course-card-${course.slug}`}
              href={`/${locale}/courses/${course.slug}`}
              className="group rounded-2xl border p-6 transition-all"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-surface)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "color-mix(in srgb, var(--accent) 50%, transparent)";
                el.style.boxShadow = "0 0 30px var(--glow-hover)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "none";
              }}
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold transition-colors" style={{ color: "var(--text-primary)" }}>
                  {getTranslation(course, "title", locale, course.title)}
                </h2>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    background: course.level === "advanced" ? "color-mix(in srgb, var(--error) 10%, transparent)" : course.level === "intermediate" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "color-mix(in srgb, var(--success) 10%, transparent)",
                    color: course.level === "advanced" ? "var(--error)" : course.level === "intermediate" ? "var(--accent)" : "var(--success)",
                  }}
                >
                  {course.level}
                </span>
              </div>
              <p className="mt-2 text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                {getTranslation(course, "description", locale, course.description)}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {t("lessons", { count: lessonCount })}
                </span>
                {courseHasVideo.has(course.id) && (
                  <span className="flex items-center gap-1" style={{ color: "var(--accent)" }}>
                    <Film className="h-3.5 w-3.5" />
                    {t("video")}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
