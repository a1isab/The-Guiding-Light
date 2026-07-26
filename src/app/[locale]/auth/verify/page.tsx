"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("sv_email");

    if (!storedEmail) {
      router.replace(`/${locale}/onboarding`);
      return;
    }

    setEmail(storedEmail);
  }, [locale, router]);

  useEffect(() => {
    if (verifying) return;
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      handleSubmit();
    }
  }, [code, verifying]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit() {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError(t("verify_code_incomplete"));
      return;
    }

    setVerifying(true);
    setError("");

    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: fullCode }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("signup_confirm_failed"));
      setVerifying(false);
      return;
    }

    sessionStorage.removeItem("sv_email");
    sessionStorage.removeItem("sv_password");
    sessionStorage.removeItem("sv_token");

    router.push(`/${locale}/onboarding`);
  }

  if (!email) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--text-muted)" }} />
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
              <ShieldCheck className="h-6 w-6" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{t("verify_title")}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("verify_subtitle")}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{email}</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-center" style={{ color: "var(--text-secondary)" }}>
              {t("verify_enter_code")}
            </label>
            <div className="flex justify-center gap-2">
              {code.map((digit, i) => (
                <input
                  key={i}
                  data-testid={`verify-code-input-${i}`}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-12 w-11 rounded-xl border text-center text-lg font-mono focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                />
              ))}
            </div>

            {error && (
              <p data-testid="verify-error" className="text-sm text-center" style={{ color: "var(--error)" }}>{error}</p>
            )}

            <button
              data-testid="verify-submit"
              onClick={handleSubmit}
              disabled={verifying}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:opacity-80 disabled:opacity-50 transition-all"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {verifying ? t("verifying") : t("verify_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
