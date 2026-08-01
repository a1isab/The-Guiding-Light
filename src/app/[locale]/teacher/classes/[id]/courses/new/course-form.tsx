"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateCourseForm({ classId, locale }: { classId: string; locale: string }) {
  const t = useTranslations("teacher");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/teacher/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ classId, title: title.trim(), description: description.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? t("error"));
      setLoading(false);
      return;
    }

    router.push(`/${locale}/teacher/classes/${classId}/courses/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <Input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label={t("course_title")}
      />

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t("course_description")}</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)]"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
        />
      </div>

      {error && <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>}

      <Button type="submit" disabled={loading} loading={loading}>
        {loading ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
