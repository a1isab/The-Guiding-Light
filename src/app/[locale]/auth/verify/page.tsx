"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [expectedCode, setExpectedCode] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("sv_email");
    const storedCode = sessionStorage.getItem("sv_code");
    const storedPassword = sessionStorage.getItem("sv_password");

    if (!storedEmail || !storedCode || !storedPassword) {
      router.replace(`/${locale}/onboarding`);
      return;
    }

    setEmail(storedEmail);
    setExpectedCode(storedCode);
    setSavedPassword(storedPassword);
  }, [locale, router]);

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

    if (fullCode !== expectedCode) {
      setError(t("verify_failed"));
      return;
    }

    setVerifying(true);
    setError("");

    const token = sessionStorage.getItem("sv_token");

    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("signup_confirm_failed"));
      setVerifying(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: savedPassword,
    });

    if (signInError) {
      setError(t("signup_sign_in_prompt"));
      setVerifying(false);
      return;
    }

    sessionStorage.removeItem("sv_email");
    sessionStorage.removeItem("sv_code");
    sessionStorage.removeItem("sv_password");
    sessionStorage.removeItem("sv_token");

    router.push(`/${locale}/onboarding`);
  }

  if (!email) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-b from-emerald-500/20 to-transparent blur-xl" />
        <div className="relative rounded-2xl border border-zinc-800 bg-[#111111] p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <h1 className="font-amiri text-2xl font-bold text-zinc-100">{t("verify_title")}</h1>
            <p className="mt-1 text-sm text-zinc-500">{t("verify_subtitle")}</p>
            <p className="mt-1 text-sm text-zinc-400">{email}</p>
          </div>

          <div className="mb-4 rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 text-center">
            <p className="text-xs text-zinc-500 mb-1">{t("verify_code_label")}</p>
            <p data-testid="verify-displayed-code" className="text-3xl font-bold tracking-[0.3em] text-emerald-400 font-mono">
              {expectedCode}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-400 text-center">
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
                  className="h-12 w-11 rounded-xl border border-zinc-700 bg-zinc-900 text-center text-lg font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              ))}
            </div>

            {error && (
              <p data-testid="verify-error" className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              data-testid="verify-submit"
              onClick={handleSubmit}
              disabled={verifying}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
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
