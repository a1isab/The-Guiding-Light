"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { Mail, ArrowLeft, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/${locale}/auth/callback?type=recovery`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="relative rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
              <Mail className="h-6 w-6" style={{ color: "var(--accent)" }} />
            </div>
            <h1 data-testid="forgot-sent" className="font-display text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>{t("forgot_password_sent_title")}</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t("forgot_password_sent_msg", { email })}
            </p>
            <Link
              href={`/${locale}/auth/login`}
              className="mt-6 inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("forgot_password_back")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -inset-1 rounded-3xl blur-xl" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--accent) 20%, transparent), transparent)" }} />
        <div className="relative rounded-2xl border p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
              <Sparkles className="h-6 w-6" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{t("forgot_password_title")}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("forgot_password_subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {t("email_label")}
              </label>
              <input
                id="email"
                data-testid="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)] placeholder:text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-primary)" }}
                placeholder={t("email_placeholder")}
              />
            </div>

            {error && (
              <p data-testid="forgot-error" className="text-sm" style={{ color: "var(--error)" }}>{error}</p>
            )}

            <button
              type="submit"
              data-testid="forgot-submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:opacity-80 disabled:opacity-50 transition-all"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <Mail className="h-4 w-4" />
              {loading ? t("forgot_password_sending") : t("forgot_password_send")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            <Link href={`/${locale}/auth/login`} className="inline-flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: "var(--accent)" }}>
              <ArrowLeft className="h-3 w-3" />
              {t("forgot_password_back")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
