"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { ExternalLink, Check, X } from "lucide-react";
import type { VerificationRequest } from "@/lib/types";

interface EnrichedRequest extends VerificationRequest {
  email: string;
}

const DOC_LABELS: Record<string, string> = {
  passport: "Passport",
  national_id: "National ID",
  teaching_certificate: "Teaching Certificate",
  other: "Other",
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" },
  approved: { bg: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)" },
  rejected: { bg: "color-mix(in srgb, var(--error) 10%, transparent)", color: "var(--error)" },
};

export function VerificationList({ requests }: { requests: EnrichedRequest[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const supabase = createClient();
  const [processing, setProcessing] = useState<string | null>(null);

  async function handleAction(id: string, action: "approve" | "reject", reviewNotes?: string) {
    setProcessing(id);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setProcessing(null); return; }

    await fetch("/api/admin/verifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ id, action, review_notes: reviewNotes || null }),
    });

    setProcessing(null);
    router.refresh();
  }

  function handleReject(id: string) {
    const notes = window.prompt(t("reject_notes_prompt"));
    if (notes !== null) {
      handleAction(id, "reject", notes);
    }
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              <th className="px-5 py-3 font-medium">{t("teacher_email")}</th>
              <th className="px-5 py-3 font-medium">{t("document_type")}</th>
              <th className="px-5 py-3 font-medium">{t("submitted")}</th>
              <th className="px-5 py-3 font-medium">{t("status")}</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-[var(--border)]">
            {requests.map((r) => (
              <tr key={r.id} data-testid={`verification-row-${r.id}`} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <td className="px-5 py-4">{r.email || "—"}</td>
                <td className="px-5 py-4">{DOC_LABELS[r.document_type] ?? r.document_type}</td>
                <td className="px-5 py-4" style={{ color: "var(--text-muted)" }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                    style={STATUS_STYLES[r.status]}
                    data-testid={`verification-status-${r.id}`}
                  >
                    {r.status}
                  </span>
                  {r.review_notes && (
                    <p className="text-xs mt-1 max-w-[200px] truncate" style={{ color: "var(--text-muted)" }} title={r.review_notes}>
                      {r.review_notes}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {r.document_url && (
                      <a
                        href={r.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`verification-view-doc-${r.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-[var(--bg-elevated)]"
                        style={{ color: "var(--accent)" }}
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t("view")}
                      </a>
                    )}
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(r.id, "approve")}
                          disabled={processing === r.id}
                          data-testid={`verification-approve-${r.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-white transition-all disabled:opacity-50"
                          style={{ backgroundColor: "var(--success)" }}
                        >
                          <Check className="h-3 w-3" />
                          {t("approve")}
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          disabled={processing === r.id}
                          data-testid={`verification-reject-${r.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-white transition-all disabled:opacity-50"
                          style={{ backgroundColor: "var(--error)" }}
                        >
                          <X className="h-3 w-3" />
                          {t("reject")}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-sm text-center" style={{ color: "var(--text-muted)" }}>
                  {t("no_verification_requests")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
