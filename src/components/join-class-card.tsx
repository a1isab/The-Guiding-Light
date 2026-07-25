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
    <div data-testid="join-class-card" className="mt-8 rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
      <h2 className="font-display text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
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
          className="flex-1 rounded-xl border px-3 py-2.5 text-sm uppercase"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg-surface) 50%, transparent)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--accent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <button
          onClick={handleJoin}
          data-testid="join-button"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {t("join")}
        </button>
      </div>
      {error && <p className="mt-2 text-xs" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}
