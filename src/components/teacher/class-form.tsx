"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  defaultValues?: {
    name: string;
    description: string;
  };
  classId?: string;
  onSave?: (id: string) => void;
  locale?: string;
}

export function ClassForm({ defaultValues, classId, onSave, locale }: Props) {
  const t = useTranslations("teacher");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/teacher/classes", {
        method: classId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(classId ? { ...form, id: classId } : form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t("error"));
        setLoading(false);
        return;
      }

      if (onSave) {
        onSave(data.id);
      } else {
        router.push(`/${locale ?? ""}/teacher/classes/${data.id}`);
        router.refresh();
      }
    } catch {
      setError(t("error"));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("class_name")}</label>
        <input
          type="text"
          data-testid="class-name-input"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{t("class_description")}</label>
        <textarea
          rows={3}
          data-testid="class-description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          data-testid="class-submit"
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {loading ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
