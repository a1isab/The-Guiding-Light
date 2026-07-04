"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";

export function JoinClassCard() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter an invite code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/student/invites/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();

      if (!data.valid) {
        setError(data.message ?? "Invalid invite code");
        return;
      }

      router.push(`/${locale}/join/${trimmed}`);
    } catch {
      setError("Failed to validate invite code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6">
      <h2 className="font-amiri text-xl font-bold text-zinc-100 mb-4">
        {t("join_class")}
      </h2>
      <div className="flex gap-2">
        <input
          type="text"
          data-testid="invite-code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          placeholder={t("invite_code_placeholder")}
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
        />
        <button
          onClick={handleJoin}
          data-testid="join-button"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {t("join")}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
