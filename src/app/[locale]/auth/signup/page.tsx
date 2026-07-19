"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { UserPlus, Sparkles, CheckCircle2, GraduationCap, User, KeyRound } from "lucide-react";

export default function SignUpPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [inviteCode, setInviteCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });
  }, []);

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

    const codeRes = await fetch("/api/auth/generate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!codeRes.ok) {
      setError(t("signup_confirm_failed"));
      setLoading(false);
      return;
    }

    const { token } = await codeRes.json();

    const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");

    sessionStorage.setItem("sv_email", email);
    sessionStorage.setItem("sv_code", code);
    sessionStorage.setItem("sv_password", password);
    sessionStorage.setItem("sv_token", token);
    router.push(`/${locale}/auth/verify`);
  }

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-b from-emerald-500/20 to-transparent blur-xl" />
          <div className="relative rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="font-amiri text-xl font-bold text-zinc-100">{t("check_email")}</h1>
            <p className="mt-2 text-sm text-zinc-400">
              {t("check_email_msg", { email })}
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
                data-testid="signup-email"
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
                data-testid="signup-password"
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
                  data-testid="signup-role-student"
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
                  data-testid="signup-role-teacher"
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
                    data-testid="signup-invite-code"
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
              <p data-testid="signup-error" className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              data-testid="signup-submit"
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
