"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { LogIn, Sparkles } from "lucide-react";

function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    const supabase = createClient();
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError) {
      console.error("=== LOGIN DIAGNOSIS ===", {
        hasSession: !!data?.session,
        hasAccessToken: !!data?.session?.access_token,
        sessionUser: data?.session?.user?.email,
        cookiesAfterSignIn: document.cookie,
        cookieCount: document.cookie.split(";").filter(c => c.trim()).length,
      });
    }

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    // Redirect to dashboard — server-side role check will route
    // admins to /admin and teachers to /teacher
    window.location.href = `/${locale}/dashboard`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {t("email")}
        </label>
        <input
          id="email"
          data-testid="login-email"
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
          data-testid="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)] placeholder:text-[var(--text-muted)]"
          style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-primary)" }}
        />
        <div className="mt-1 flex justify-end">
          <Link
            href={`/${locale}/auth/forgot-password`}
            className="text-xs transition-colors hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            {t("forgot_password")}
          </Link>
        </div>
      </div>

      {error && (
        <p data-testid="login-error" className="text-sm" style={{ color: "var(--error)" }}>{error}</p>
      )}

      <button
        type="submit"
        data-testid="login-submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:opacity-80 disabled:opacity-50 transition-all"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <LogIn className="h-4 w-4" />
        {loading ? t("signing_in") : t("sign_in")}
      </button>
    </form>
  );
}

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -inset-1 rounded-3xl blur-xl" style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--accent) 20%, transparent), transparent)" }} />
        <div className="relative rounded-2xl border p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
              <Sparkles className="h-6 w-6" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{t("welcome_back")}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("login_subtitle")}</p>
          </div>

          <Suspense fallback={<div className="text-center text-sm" style={{ color: "var(--text-muted)" }}>{t("loading")}</div>}>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            {t("dont_have_account")}{" "}
            <Link href={`/${locale}/auth/signup`} className="font-medium transition-colors hover:opacity-80" style={{ color: "var(--accent)" }}>
              {t("create_one")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
