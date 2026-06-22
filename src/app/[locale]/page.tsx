"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, Sparkles, Star, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import type { Locale } from "@/lib/types";

const steps = [
  { key: "step1" },
  { key: "step2" },
  { key: "step3" },
  { key: "step4" },
];

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
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            {t("badge")}
          </div>
          <h1 className="font-amiri text-5xl font-bold leading-tight text-zinc-100 sm:text-6xl lg:text-7xl">
            {t("hero_title")}
            <span className="text-emerald-400"> {t("hero_highlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            {t("hero_subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={loggedIn ? `/${locale}/courses` : `/${locale}/auth/signup`}
              className="rounded-2xl bg-emerald-500 px-8 py-3 text-base font-medium text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all"
            >
              {loggedIn ? t("go_to_courses") : t("start_learning")}
            </Link>
            {!loggedIn && (
              <Link
                href={`/${locale}/auth/login`}
                className="rounded-2xl border border-zinc-700 bg-zinc-900/50 px-8 py-3 text-base font-medium text-zinc-300 hover:bg-zinc-800 transition-all"
              >
                {t("have_account")}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-amiri text-3xl font-bold text-zinc-100">
            {t("why_title")}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 hover:border-emerald-800/50 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <BookOpen className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">{t("feature_structured_title")}</h3>
              <p className="mt-2 text-sm text-zinc-500">{t("feature_structured_desc")}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 hover:border-emerald-800/50 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Sparkles className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">{t("feature_ai_title")}</h3>
              <p className="mt-2 text-sm text-zinc-500">{t("feature_ai_desc")}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 hover:border-emerald-800/50 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Star className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">{t("feature_free_title")}</h3>
              <p className="mt-2 text-sm text-zinc-500">{t("feature_free_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-amiri text-3xl font-bold text-zinc-100">
            {t("how_title")}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-4">
            {steps.map((item, i) => (
              <div key={item.key} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-emerald-400 font-bold text-lg">
                  {`0${i + 1}`}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-200">{t(`${item.key}_title`)}</h3>
                <p className="mt-1 text-sm text-zinc-500">{t(`${item.key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/50 px-4 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-amiri text-3xl font-bold text-zinc-100">
            {t("journey_title")}
          </h2>
          <p className="mt-3 text-zinc-400">
            {t("journey_desc")}
          </p>
          <Link
            href={`/${locale}/courses`}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3 text-base font-medium text-white hover:bg-emerald-400 transition-all"
          >
            {t("browse_courses")} <TrendingUp className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-800/50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-[#111111] p-12 text-center">
          <h2 className="font-amiri text-3xl font-bold text-zinc-100">
            {t("cta_title")}
          </h2>
          <p className="mt-3 text-zinc-400">
            {t("cta_desc")}
          </p>
          <Link
            href={`/${locale}/auth/signup`}
            className="mt-6 inline-block rounded-2xl bg-emerald-500 px-8 py-3 text-base font-medium text-white shadow-[0_0_25px rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all"
          >
            {t("get_started_free")}
          </Link>
        </div>
      </section>
    </div>
  );
}
