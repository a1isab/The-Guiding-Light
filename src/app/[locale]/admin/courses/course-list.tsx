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
      <div data-testid="courses-empty" className="rounded-2xl border p-12 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <p style={{ color: 'var(--text-muted)' }}>{t("no_courses")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <div
          key={course.id}
          data-testid={`course-row-${course.slug}`}
          className="flex items-center justify-between rounded-2xl border p-4"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
        >
          <div className="min-w-0 flex-1">
            <Link
              href={`/${locale}/admin/courses/${course.slug}`}
              className="text-base font-semibold hover:text-[var(--success)] transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {course.title}
            </Link>
            <div className="mt-1 flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="capitalize">{course.level}</span>
              <span style={{ color: course.is_published ? 'var(--success)' : 'var(--text-muted)' }}>
                {course.is_published ? "Published" : "Draft"}
              </span>
              <span>Order: {course.order_index}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <Link
              href={`/${locale}/admin/courses/${course.slug}`}
              data-testid={`view-course-${course.slug}`}
              className="rounded-lg border p-2 hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/admin/courses/${course.slug}/edit`}
              data-testid={`edit-course-${course.slug}`}
              className="rounded-lg border p-2 hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(course.id)}
              disabled={deleting === course.id}
              data-testid={`delete-course-${course.slug}`}
              className="rounded-lg border p-2 hover:bg-[color-mix(in_srgb,var(--error)_20%,transparent)] hover:border-[var(--error)] transition-all disabled:opacity-50"
              style={{ borderColor: 'var(--border)', color: 'var(--error)' }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
