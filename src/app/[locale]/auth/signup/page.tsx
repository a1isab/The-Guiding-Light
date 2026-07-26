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
        emailRedirectTo: `${siteUrl}/${locale}/auth/callback?next=/${locale}/onboarding`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -inset-1 rounded-3xl blur-xl" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--accent) 20%, transparent), transparent)" }} />
          <div className="relative rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
              <CheckCircle2 className="h-7 w-7" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>{t("check_email")}</h1>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
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
        <div className="pointer-events-none absolute -inset-1 rounded-3xl blur-xl" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--accent) 20%, transparent), transparent)" }} />
        <div className="relative rounded-2xl border p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
              <Sparkles className="h-6 w-6" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{t("signup_title")}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("signup_subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {t("email")}
              </label>
              <input
                id="email"
                data-testid="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)] placeholder:text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-primary)" }}
                placeholder={t("email_placeholder")}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
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
                className="mt-1 block w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)] placeholder:text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-primary)" }}
                placeholder={t("password_placeholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                {t("signup_role_label")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  data-testid="signup-role-student"
                  onClick={() => setRole("student")}
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all"
                  style={role === "student"
                    ? { borderColor: "color-mix(in srgb, var(--accent) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }
                    : { borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-secondary)" }
                  }
                >
                  <User className="h-4 w-4" />
                  {t("signup_as_student")}
                </button>
                <button
                  type="button"
                  data-testid="signup-role-teacher"
                  onClick={() => setRole("teacher")}
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all"
                  style={role === "teacher"
                    ? { borderColor: "color-mix(in srgb, var(--accent) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }
                    : { borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-secondary)" }
                  }
                >
                  <GraduationCap className="h-4 w-4" />
                  {t("signup_as_teacher")}
                </button>
              </div>
            </div>

            {role === "teacher" && (
              <div>
                <label htmlFor="inviteCode" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {t("invite_code")}
                </label>
                <div className="relative mt-1">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
                  <input
                    id="inviteCode"
                    data-testid="signup-invite-code"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="block w-full rounded-xl border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)] placeholder:text-[var(--text-muted)]"
                    style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-primary)" }}
                    placeholder={t("invite_code_placeholder")}
                  />
                </div>
              </div>
            )}

            {error && (
              <p data-testid="signup-error" className="text-sm" style={{ color: "var(--error)" }}>{error}</p>
            )}

            <button
              type="submit"
              data-testid="signup-submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:opacity-80 disabled:opacity-50 transition-all"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <UserPlus className="h-4 w-4" />
              {loading ? t("creating_account") : t("create_account")}
            </button>
          </form>

          {!loggedIn && (
            <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              {t("already_have_account")}{" "}
              <Link href={`/${locale}/auth/login`} className="font-medium transition-colors hover:opacity-80" style={{ color: "var(--accent)" }}>
                {t("sign_in_link")}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
