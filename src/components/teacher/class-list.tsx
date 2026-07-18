"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getClientAccessToken } from "@/lib/supabase-client";
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
    const token = await getClientAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`/api/teacher/classes?id=${id}`, { method: "DELETE", headers, credentials: "omit" });
    if (res.ok) {
      router.refresh();
    }
    setDeleting(null);
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-12 text-center">
        <p className="text-zinc-500">{t("no_classes")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {classes.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#111111] p-4"
        >
          <div className="min-w-0 flex-1">
            <Link
              href={`/${locale}/teacher/classes/${c.id}`}
              className="text-base font-semibold text-zinc-100 hover:text-emerald-400 transition-colors"
            >
              {c.name}
            </Link>
            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
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
              className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(c.id)}
              disabled={deleting === c.id}
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
