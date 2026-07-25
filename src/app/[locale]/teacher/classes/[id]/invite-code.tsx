"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
    const res = await fetch("/api/teacher/classes/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ classId }),
    });
    const data = await res.json();
    if (res.ok && data.invite_code) {
      setCurrentCode(data.invite_code);
    }
    setRegenerating(false);
  }

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
      <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>{t("invite_code")}</h3>
      <div className="flex items-center gap-3">
        <code data-testid="invite-code-value" className="flex-1 rounded-xl border px-4 py-3 text-lg font-mono font-bold tracking-wider select-all" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--accent)' }}>
          {currentCode}
        </code>
        <button
          onClick={handleCopy}
          data-testid="btn-copy-invite"
          className="rounded-xl border p-3 transition-all hover:text-[var(--text-primary)] hover:border-[var(--border)]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          title={t("copy_link")}
        >
          {copied ? (
            <span className="text-xs" style={{ color: 'var(--accent)' }}>{t("copied")}</span>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={handleRegenerate}
          data-testid="btn-regenerate-invite"
          disabled={regenerating}
          className="rounded-xl border p-3 transition-all disabled:opacity-50 hover:text-[var(--text-primary)] hover:border-[var(--border)]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          title={t("regenerate")}
        >
          <RotateCcw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>{t("invite_hint")}</p>
    </div>
  );
}
