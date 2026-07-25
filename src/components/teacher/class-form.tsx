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
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{t("class_name")}</label>
        <input
          type="text"
          data-testid="class-name-input"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg-surface) 50%, transparent)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--accent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{t("class_description")}</label>
        <textarea
          rows={3}
          data-testid="class-description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg-surface) 50%, transparent)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--accent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          data-testid="class-submit"
          disabled={loading}
          className="rounded-xl px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 transition-all"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
