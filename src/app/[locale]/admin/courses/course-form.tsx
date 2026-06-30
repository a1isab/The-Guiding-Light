"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";

interface Props {
  defaultValues?: {
    title: string;
    title_ar: string;
    description: string;
    description_ar: string;
    level: string;
    slug: string;
    order_index: number;
    is_published: boolean;
  };
  courseId?: string;
}

export function CourseForm({ defaultValues, courseId }: Props) {
  const t = useTranslations("admin");
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: defaultValues?.title ?? "",
    title_ar: defaultValues?.title_ar ?? "",
    description: defaultValues?.description ?? "",
    description_ar: defaultValues?.description_ar ?? "",
    level: defaultValues?.level ?? "beginner",
    slug: defaultValues?.slug ?? "",
    order_index: defaultValues?.order_index ?? 0,
    is_published: defaultValues?.is_published ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      order_index: Number(form.order_index),
    };

    const { error: err } = courseId
      ? await supabase.from("courses").update(payload).eq("id", courseId)
      : await supabase.from("courses").insert(payload);

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    router.push(`/admin/courses`);
    router.refresh();
  }

  function handleChange(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("course_title")}</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("course_title")} (العربية)</label>
        <input
          type="text"
          value={form.title_ar}
          onChange={(e) => handleChange("title_ar", e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          dir="rtl"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("course_description")}</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("course_description")} (العربية)</label>
        <textarea
          rows={3}
          value={form.description_ar}
          onChange={(e) => handleChange("description_ar", e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          dir="rtl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("course_level")}</label>
          <select
            value={form.level}
            onChange={(e) => handleChange("level", e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("course_slug")}</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">{t("course_order")}</label>
          <input
            type="number"
            value={form.order_index}
            onChange={(e) => handleChange("order_index", e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => handleChange("is_published", e.target.checked)}
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
        />
        <span className="text-sm text-zinc-300">{t("published")}</span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {loading ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
