"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { Key, Copy, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";

interface Invite {
  id: number;
  code: string;
  created_at: string;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
}

export default function AdminInvitesPage() {
  const t = useTranslations("admin");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function loadInvites() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("teacher_invites")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setInvites(data);
    setLoading(false);
  }

  useEffect(() => {
    loadInvites();
  }, []);

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invites/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate code");
        return;
      }
      await loadInvites();
    } catch {
      setError("Network error");
    } finally {
      setGenerating(false);
    }
  }

  async function copyCode(code: string, id: number) {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-amiri text-2xl font-bold text-zinc-100">{t("invites")}</h1>
        <button
          onClick={generate}
          data-testid="generate-invite"
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {generating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Key className="h-4 w-4" />
          )}
          {t("generate_invite")}
        </button>
      </div>

      {error && (
        <p data-testid="invite-error" className="mb-4 text-sm text-red-400">{error}</p>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-500">{t("loading")}</div>
        ) : invites.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">{t("no_invites")}</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {invites.map((invite) => {
              const used = !!invite.used_by;
              const expired = invite.expires_at && new Date(invite.expires_at) < new Date();
              return (
                <div key={invite.id} data-testid={`invite-row-${invite.id}`} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <code data-testid={`invite-code-${invite.id}`} className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-mono text-emerald-400">
                      {invite.code}
                    </code>
                    {used ? (
                      <span data-testid={`invite-status-${invite.id}`} className="flex items-center gap-1.5 text-sm text-zinc-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-zinc-600" />
                        {t("used")}
                      </span>
                    ) : expired ? (
                      <span data-testid={`invite-status-${invite.id}`} className="flex items-center gap-1.5 text-sm text-red-400">
                        <XCircle className="h-3.5 w-3.5" />
                        {t("expired")}
                      </span>
                    ) : (
                      <span data-testid={`invite-status-${invite.id}`} className="flex items-center gap-1.5 text-sm text-emerald-400">
                        <Clock className="h-3.5 w-3.5" />
                        {t("active")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">
                      {new Date(invite.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => copyCode(invite.code, invite.id)}
                      data-testid={`copy-invite-${invite.id}`}
                      className="rounded-lg p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
                      title="Copy code"
                    >
                      {copiedId === invite.id ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
