"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { Key, Copy, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <h1 className="text-h2" style={{ color: 'var(--text-primary)' }}>{t("invites")}</h1>
        <Button onClick={generate} testId="generate-invite" disabled={generating}>
          {generating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Key className="h-4 w-4" />
          )}
          {t("generate_invite")}
        </Button>
      </div>

      {error && (
        <p data-testid="invite-error" className="mb-4 text-sm" style={{ color: 'var(--error)' }}>{error}</p>
      )}

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>{t("loading")}</div>
        ) : invites.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>{t("no_invites")}</div>
        ) : (
          <div className="divide-[var(--border)]">
            {invites.map((invite) => {
              const used = !!invite.used_by;
              const expired = invite.expires_at && new Date(invite.expires_at) < new Date();
              return (
                <div key={invite.id} data-testid={`invite-row-${invite.id}`} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <code data-testid={`invite-code-${invite.id}`} className="rounded-lg px-3 py-1.5 text-sm font-mono" style={{ background: 'var(--bg-subtle)', color: 'var(--success)' }}>
                      {invite.code}
                    </code>
                    {used ? (
                      <span data-testid={`invite-status-${invite.id}`} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                        {t("used")}
                      </span>
                    ) : expired ? (
                      <span data-testid={`invite-status-${invite.id}`} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--error)' }}>
                        <XCircle className="h-3.5 w-3.5" />
                        {t("expired")}
                      </span>
                    ) : (
                      <span data-testid={`invite-status-${invite.id}`} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--success)' }}>
                        <Clock className="h-3.5 w-3.5" />
                        {t("active")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(invite.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => copyCode(invite.code, invite.id)}
                      data-testid={`copy-invite-${invite.id}`}
                      className="rounded-lg p-2 hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-all"
                      style={{ color: 'var(--text-muted)' }}
                      title="Copy code"
                    >
                      {copiedId === invite.id ? (
                        <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--success)' }} />
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
