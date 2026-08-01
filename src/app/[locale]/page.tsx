"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import type { Locale } from "@/lib/types";

export default function LandingPage() {
  const t = useTranslations("landing");
  const locale = useLocale() as Locale;
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });
  }, []);

  return (
    <div className="flex-1">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        {/* Lamplight glow — THE signature element */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-60"
            style={{
              background: "radial-gradient(ellipse, var(--glow-subtle) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center z-10">
          <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl animate-fade-in-up" style={{ color: "var(--text-primary)" }}>
            {t("hero_title")}{" "}
            <span style={{ color: "var(--accent)" }}>{t("hero_highlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg animate-fade-in-up animate-delay-100" style={{ color: "var(--text-secondary)" }}>
            {t("hero_subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
            <Link
              href={loggedIn ? `/${locale}/dashboard` : `/${locale}/onboarding`}
              className="rounded-2xl px-8 py-3 text-base font-medium text-white transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--accent)",
                boxShadow: "0 0 30px var(--glow-hover)",
              }}
            >
              {loggedIn ? t("go_to_dashboard", { defaultMessage: "Go to Dashboard" }) : t("start_learning")}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="px-4 py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("why_title")}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div
              className="card-glow rounded-2xl p-6 transition-all"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--glow-subtle)" }}
              >
                <BookOpen className="h-6 w-6" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {t("feature_structured_title")}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {t("feature_structured_desc")}
              </p>
            </div>
            <div
              className="card-glow rounded-2xl p-6 transition-all"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--glow-subtle)" }}
              >
                <GraduationCap className="h-6 w-6" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {t("feature_free_title")}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {t("feature_free_desc")}
              </p>
            </div>
            <div
              className="card-glow rounded-2xl p-6 transition-all"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--glow-subtle)" }}
              >
                <TrendingUp className="h-6 w-6" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {t("journey_title")}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {t("journey_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="px-4 py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-3xl rounded-3xl p-12 text-center" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("cta_title")}
          </h2>
          <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
            {t("cta_desc")}
          </p>
          <Link
            href={`/${locale}/onboarding`}
            className="mt-6 inline-block rounded-2xl px-8 py-3 text-base font-medium text-white transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "0 0 30px var(--glow-hover)",
            }}
          >
            {t("get_started_free")}
          </Link>
        </div>
      </section>
    </div>
  );
}
