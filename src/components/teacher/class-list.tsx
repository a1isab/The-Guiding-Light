"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Users, Trash2, ExternalLink } from "lucide-react";

interface ClassItem {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_at: string;
  student_count?: number;
}

export function ClassList({ classes }: { classes: ClassItem[] }) {
  const t = useTranslations("teacher");
  const locale = useLocale();
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm(t("delete_confirm"))) return;
    setDeleting(id);
    const res = await fetch(`/api/teacher/classes?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    });
    if (res.ok) {
      router.refresh();
    }
    setDeleting(null);
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-2xl border p-12 text-center" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <p style={{ color: "var(--text-secondary)" }}>{t("no_classes")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {classes.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between rounded-2xl border p-4"
          style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
        >
          <div className="min-w-0 flex-1">
            <Link
              href={`/${locale}/teacher/classes/${c.id}`}
              className="text-base font-semibold transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
            >
              {c.name}
            </Link>
            <div className="mt-1 flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {c.student_count ?? 0}
              </span>
              <span>{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <Link
              href={`/${locale}/teacher/classes/${c.id}`}
              className="rounded-lg border p-2 transition-all"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--text-secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(c.id)}
              disabled={deleting === c.id}
              className="rounded-lg border p-2 transition-all disabled:opacity-50"
              style={{ borderColor: "var(--border)", color: "var(--error)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--error) 20%, transparent)"; e.currentTarget.style.borderColor = "var(--error)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
