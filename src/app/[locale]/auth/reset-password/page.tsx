"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { KeyRound, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const locale = useLocale();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("reset_password_too_short"));
      return;
    }

    if (password !== confirm) {
      setError(t("reset_password_mismatch"));
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push(`/${locale}/auth/login`);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -inset-1 rounded-3xl blur-xl" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--accent) 20%, transparent), transparent)" }} />
        <div className="relative rounded-2xl border p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--glow-subtle)" }}>
              <Sparkles className="h-6 w-6" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="text-h3" style={{ color: "var(--text-primary)" }}>{t("reset_password_title")}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("reset_password_subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="password"
              data-testid="reset-password"
              type="password"
              required
              minLength={6}
              label={t("reset_password_new")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              id="confirm"
              data-testid="reset-confirm"
              type="password"
              required
              minLength={6}
              label={t("reset_password_confirm")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && (
              <p data-testid="reset-error" className="text-sm" style={{ color: "var(--error)" }}>{error}</p>
            )}

            <Button
              type="submit"
              testId="reset-password-submit"
              disabled={loading}
              loading={loading}
              className="w-full justify-center"
            >
              <KeyRound className="h-4 w-4" />
              {loading ? t("reset_password_loading") : t("reset_password_button")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
