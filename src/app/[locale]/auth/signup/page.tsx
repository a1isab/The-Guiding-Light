"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { UserPlus, Sparkles, CheckCircle2, GraduationCap, User, KeyRound, ShieldCheck, Loader2, RefreshCw } from "lucide-react";

export default function SignUpPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [stage, setStage] = useState<"form" | "otp" | "done">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [inviteCode, setInviteCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSent, setResendSent] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (role === "teacher") {
      if (!inviteCode.trim()) {
        setError(t("invite_code_required"));
        setLoading(false);
        return;
      }

      const res = await fetch("/api/teacher/invites/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });

      const result = await res.json();

      if (!result.valid) {
        setError(result.message || t("invalid_invite_code"));
        setLoading(false);
        return;
      }
    }

    const supabase = createClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, inviteCode: role === "teacher" ? inviteCode.trim() : "" },
        emailRedirectTo: `${siteUrl}/${locale}/auth/callback?next=/${locale}/dashboard`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setStage("otp");
    inputRefs.current[0]?.focus();
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
      handleOtpVerify(newOtp.join(""));
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (data.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < data.length; i++) {
      newOtp[i] = data[i];
    }
    setOtp(newOtp);
    if (data.length === 6) {
      handleOtpVerify(data);
    } else {
      inputRefs.current[Math.min(data.length, 5)]?.focus();
    }
  }

  async function handleOtpVerify(token: string) {
    setOtpVerifying(true);
    setOtpError("");

    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (verifyError) {
      setOtpError(t("otp_error"));
      setOtpVerifying(false);
      setShakeKey((k) => k + 1);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    const res = await fetch("/api/auth/confirm-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setOtpVerifying(false);

    if (!res.ok) {
      setOtpError(t("otp_error"));
      setShakeKey((k) => k + 1);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    setStage("done");
    setTimeout(() => {
      router.push(`/${locale}/dashboard`);
    }, 1500);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setResendCooldown(30);
    setResendSent(true);
    setTimeout(() => setResendSent(false), 3000);
  }

  if (stage === "done") {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-b from-emerald-500/20 to-transparent blur-xl" />
          <div className="relative rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="font-amiri text-xl font-bold text-zinc-100">{t("otp_title")}</h1>
            <p className="mt-2 text-sm text-zinc-400">{t("otp_verify")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "otp") {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-b from-emerald-500/20 to-transparent blur-xl" />
          <div className="relative rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="font-amiri text-xl font-bold text-zinc-100">{t("otp_title")}</h1>
            <p className="mt-2 text-sm text-zinc-400">
              {t("otp_subtitle", { email })}
            </p>

            <div
              key={shakeKey}
              className="mt-6 flex items-center justify-center gap-3"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`h-12 w-12 rounded-xl border text-center text-lg font-bold text-zinc-100 bg-zinc-900/50 transition-all focus:outline-none focus:ring-1 ${
                    otpError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500 animate-[shake_0.3s_ease-in-out]"
                      : "border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500"
                  }`}
                  disabled={otpVerifying}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {otpError && (
              <p className="mt-4 text-sm text-red-400">{otpError}</p>
            )}

            <div className="mt-6 flex items-center justify-center gap-2">
              {otpVerifying ? (
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("otp_verify")}
                </span>
              ) : (
                <>
                  {resendCooldown > 0 ? (
                    <span className="text-sm text-zinc-500">
                      {t("otp_resend_in", { seconds: resendCooldown })}
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${resendSent ? "animate-spin" : ""}`} />
                      {resendSent ? t("otp_resend_sent") : t("otp_resend")}
                    </button>
                  )}
                </>
              )}
            </div>

            <p className="mt-6 text-xs text-zinc-600">
              {t("otp_fallback")}
            </p>
          </div>
        </div>
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
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            <h1 className="font-amiri text-2xl font-bold text-zinc-100">{t("signup_title")}</h1>
            <p className="mt-1 text-sm text-zinc-500">{t("signup_subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder={t("email_placeholder")}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                {t("password")}
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder={t("password_placeholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                {t("signup_role_label")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    role === "student"
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <User className="h-4 w-4" />
                  {t("signup_as_student")}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    role === "teacher"
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  {t("signup_as_teacher")}
                </button>
              </div>
            </div>

            {role === "teacher" && (
              <div>
                <label htmlFor="inviteCode" className="block text-sm font-medium text-zinc-400">
                  {t("invite_code")}
                </label>
                <div className="relative mt-1">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    id="inviteCode"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 pl-10 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder={t("invite_code_placeholder")}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? t("creating_account") : t("create_account")}
            </button>
          </form>

          {!loggedIn && (
            <p className="mt-6 text-center text-sm text-zinc-500">
              {t("already_have_account")}{" "}
              <Link href={`/${locale}/auth/login`} className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                {t("sign_in_link")}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
