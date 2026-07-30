"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { CheckCircle, ArrowRight } from "lucide-react";

interface Props {
  classId: string;
  inviteCode: string;
}

export function FeaturedJoinButton({ classId, inviteCode }: Props) {
  const locale = useLocale();
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setJoining(true);
    setError(null);
    try {
      const res = await fetch("/api/featured/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, inviteCode }),
      });
      const data = await res.json();
      if (data.success || data.alreadyMember) {
        setJoined(true);
        setTimeout(() => {
          window.location.href = `/${locale}/dashboard/classes/${classId}`;
        }, 800);
      } else {
        setError(data.error ?? "Failed to join");
      }
    } catch {
      setError("Failed to join");
    } finally {
      setJoining(false);
    }
  }

  if (joined) {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium" style={{ color: 'var(--success)', backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)' }}>
        <CheckCircle className="h-4 w-4" />
        Joined!
      </span>
    );
  }

  return (
    <div>
      <button
        onClick={handleJoin}
        disabled={joining}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all disabled:opacity-50"
        style={{
          backgroundColor: 'var(--success)',
          color: 'var(--text-primary)',
          boxShadow: '0 0 20px color-mix(in srgb, var(--success) 20%, transparent)',
        }}
      >
        {joining ? "Joining..." : "Join Class"}
        {!joining && <ArrowRight className="h-4 w-4" />}
      </button>
      {error && (
        <p className="mt-2 text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
}
