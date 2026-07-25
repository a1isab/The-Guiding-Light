"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { ShieldCheck, Clock, XCircle, Upload, FileText } from "lucide-react";

type VerificationStatus = "none" | "pending" | "approved" | "rejected";

interface VerificationData {
  id: string;
  status: VerificationStatus;
  document_type: string;
  document_url: string;
  notes: string | null;
  review_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const DOC_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "national_id", label: "National ID" },
  { value: "teaching_certificate", label: "Teaching Certificate" },
  { value: "other", label: "Other" },
];

export default function TeacherVerifyPage() {
  const t = useTranslations("verify");
  const supabase = createClient();

  const [status, setStatus] = useState<VerificationStatus>("none");
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [docType, setDocType] = useState("passport");
  const [docNumber, setDocNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/teacher/verify", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.request) {
          setData(json.request);
          setStatus(json.request.status);
        } else {
          setStatus("none");
        }
      }
      setLoading(false);
    }
    fetchStatus();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Not authenticated");
        setSubmitting(false);
        return;
      }

      let documentUrl = "";

      if (file) {
        const filePath = `${session.user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("verification-documents")
          .upload(filePath, file, { contentType: file.type, upsert: true });

        if (uploadError) {
          setError(uploadError.message);
          setSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("verification-documents")
          .getPublicUrl(filePath);
        documentUrl = urlData.publicUrl;
      }

      const res = await fetch("/api/teacher/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          document_type: docType,
          document_url: documentUrl,
          document_number: docNumber || null,
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Submission failed");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setStatus("pending");
      const json = await res.json();
      setData(json.request);
    } catch {
      setError("An unexpected error occurred");
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        {t("title")}
      </h1>

      {status === "none" && !success && (
        <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            {t("description")}
          </p>

          {error && (
            <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "color-mix(in srgb, var(--error) 10%, transparent)", color: "var(--error)" }} data-testid="verify-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                {t("document_type")} *
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                data-testid="verify-doc-type"
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              >
                {DOC_TYPES.map((dt) => (
                  <option key={dt.value} value={dt.value}>{dt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                {t("document_number")}
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                data-testid="verify-doc-number"
                placeholder={t("document_number_placeholder")}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                {t("notes")}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="verify-notes"
                rows={3}
                placeholder={t("notes_placeholder")}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none resize-none"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                {t("upload_document")} *
              </label>
              <div
                className="flex items-center gap-3 rounded-xl border border-dashed px-4 py-6 justify-center cursor-pointer transition-colors hover:border-[var(--accent)]"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                onClick={() => document.getElementById("verify-file-input")?.click()}
                data-testid="verify-file-drop"
              >
                {file ? (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
                    <FileText className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    <span>{file.name}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {t("click_to_upload")}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {t("file_limits")}
                    </p>
                  </div>
                )}
              </div>
              <input
                id="verify-file-input"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                data-testid="verify-file-input"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size <= 10 * 1024 * 1024) {
                    setFile(f);
                    setError(null);
                  } else if (f) {
                    setError(t("file_too_large"));
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !file}
              data-testid="verify-submit"
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
          </form>
        </div>
      )}

      {status === "pending" && (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }} data-testid="verify-status-pending">
          <Clock className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }}>
            {t("status_under_review")}
          </span>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {t("under_review_msg")}
          </p>
          {data?.created_at && (
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              {t("submitted")}: {new Date(data.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {status === "approved" && (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }} data-testid="verify-status-approved">
          <ShieldCheck className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--success)" }} />
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3" style={{ backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)" }}>
            {t("status_verified")}
          </span>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {t("verified_msg")}
          </p>
          {data?.reviewed_at && (
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              {t("reviewed")}: {new Date(data.reviewed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {status === "rejected" && (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }} data-testid="verify-status-rejected">
          <XCircle className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--error)" }} />
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3" style={{ backgroundColor: "color-mix(in srgb, var(--error) 10%, transparent)", color: "var(--error)" }}>
            {t("status_not_approved")}
          </span>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {t("not_approved_msg")}
          </p>
          {data?.review_notes && (
            <div className="mt-4 rounded-xl px-4 py-3 text-sm text-left" style={{ backgroundColor: "color-mix(in srgb, var(--error) 5%, transparent)", color: "var(--text-secondary)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{t("review_notes")}:</p>
              {data.review_notes}
            </div>
          )}
          <button
            onClick={() => { setStatus("none"); setData(null); }}
            data-testid="verify-resubmit"
            className="mt-6 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {t("resubmit")}
          </button>
        </div>
      )}

      {success && status === "pending" && (
        <div className="mt-4 rounded-xl px-4 py-3 text-sm text-center" style={{ backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)" }} data-testid="verify-success">
          {t("submission_success")}
        </div>
      )}
    </div>
  );
}
