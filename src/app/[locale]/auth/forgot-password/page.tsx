"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { Mail, ArrowLeft, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
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
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/auth/callback?type=recovery`,
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
          <div className="relative rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Mail className="h-6 w-6 text-emerald-400" />
            </div>
            <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-2">Check your email</h1>
            <p className="text-sm text-zinc-500">
              We sent a password reset link to <strong className="text-zinc-300">{email}</strong>
            </p>
            <Link
              href={`/${locale}/auth/login`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
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
            <h1 className="font-amiri text-2xl font-bold text-zinc-100">Reset password</h1>
            <p className="mt-1 text-sm text-zinc-500">Enter your email and we'll send you a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
            >
              <Mail className="h-4 w-4" />
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <Link href={`/${locale}/auth/login`} className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors">
              <ArrowLeft className="h-3 w-3" />
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
