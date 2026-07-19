"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  level: string;
  is_published: boolean;
  order_index: number;
}

export function AdminCourseList({ courses, locale }: { courses: Course[]; locale: string }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm(t("delete_confirm"))) return;
    setDeleting(id);
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (!error) {
      router.refresh();
    }
    setDeleting(null);
  }

  if (courses.length === 0) {
    return (
      <div data-testid="courses-empty" className="rounded-2xl border border-zinc-800 bg-[#111111] p-12 text-center">
        <p className="text-zinc-500">{t("no_courses")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <div
          key={course.id}
          data-testid={`course-row-${course.slug}`}
          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#111111] p-4"
        >
          <div className="min-w-0 flex-1">
            <Link
              href={`/${locale}/admin/courses/${course.slug}`}
              className="text-base font-semibold text-zinc-100 hover:text-emerald-400 transition-colors"
            >
              {course.title}
            </Link>
            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
              <span className="capitalize">{course.level}</span>
              <span className={course.is_published ? "text-emerald-400" : "text-zinc-600"}>
                {course.is_published ? "Published" : "Draft"}
              </span>
              <span>Order: {course.order_index}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <Link
              href={`/${locale}/admin/courses/${course.slug}`}
              data-testid={`view-course-${course.slug}`}
              className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/admin/courses/${course.slug}/edit`}
              data-testid={`edit-course-${course.slug}`}
              className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(course.id)}
              disabled={deleting === course.id}
              data-testid={`delete-course-${course.slug}`}
              className="rounded-lg border border-zinc-700 p-2 text-red-400 hover:bg-red-900/20 hover:border-red-700 transition-all disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
