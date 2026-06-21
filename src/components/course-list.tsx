"use client";

import { useState } from "react";
import Link from "next/link";
import type { Course } from "@/lib/types";
import { BookOpen, Film } from "lucide-react";

const levels = ["all", "beginner", "intermediate", "advanced"] as const;

const levelColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400",
  intermediate: "bg-amber-500/10 text-amber-400",
  advanced: "bg-red-500/10 text-red-400",
};

interface Props {
  courses: Course[];
  courseLessonCount: Record<string, number>;
  courseHasVideo: Set<string>;
}

export function CourseList({ courses, courseLessonCount, courseHasVideo }: Props) {
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
            className={`rounded-xl border px-4 py-1.5 text-sm capitalize transition-all ${
              active === filter
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-800 text-zinc-400 hover:border-emerald-700 hover:text-emerald-400"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course: Course) => {
          const lessonCount = courseLessonCount[course.id] ?? 0;
          return (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group rounded-2xl border border-zinc-800 bg-[#111111] p-6 transition-all hover:border-emerald-800/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  {course.title}
                </h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.level] || levelColors.beginner}`}>
                  {course.level}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{course.description}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-zinc-600">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {lessonCount} lessons
                </span>
                {courseHasVideo.has(course.id) && (
                  <span className="flex items-center gap-1 text-emerald-500">
                    <Film className="h-3.5 w-3.5" />
                    Video
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
