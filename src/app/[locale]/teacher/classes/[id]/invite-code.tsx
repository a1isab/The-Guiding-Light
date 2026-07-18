"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getClientAccessToken } from "@/lib/supabase-client";
import { Copy, RotateCcw } from "lucide-react";

export function InviteCodeDisplay({
  code,
  url,
  locale,
  classId,
}: {
  code: string;
  url: string;
  locale: string;
  classId: string;
}) {
  const t = useTranslations("teacher");
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRegenerate() {
    if (!confirm(t("regenerate_confirm"))) return;
    setRegenerating(true);
    const token = await getClientAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("/api/teacher/classes/invite", {
      method: "POST",
      headers,
      credentials: "omit",
      body: JSON.stringify({ classId }),
    });
    const data = await res.json();
    if (res.ok && data.invite_code) {
      setCurrentCode(data.invite_code);
    }
    setRegenerating(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-5">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">{t("invite_code")}</h3>
      <div className="flex items-center gap-3">
        <code data-testid="invite-code-value" className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-lg font-mono font-bold tracking-wider text-emerald-400 select-all">
          {currentCode}
        </code>
        <button
          onClick={handleCopy}
          data-testid="btn-copy-invite"
          className="rounded-xl border border-zinc-700 p-3 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all"
          title={t("copy_link")}
        >
          {copied ? (
            <span className="text-xs text-emerald-400">{t("copied")}</span>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={handleRegenerate}
          data-testid="btn-regenerate-invite"
          disabled={regenerating}
          className="rounded-xl border border-zinc-700 p-3 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all disabled:opacity-50"
          title={t("regenerate")}
        >
          <RotateCcw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="mt-2 text-xs text-zinc-600">{t("invite_hint")}</p>
    </div>
  );
}
