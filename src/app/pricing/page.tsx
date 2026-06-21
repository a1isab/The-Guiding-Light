import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Check, Sparkles, Crown } from "lucide-react";

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="font-amiri text-4xl font-bold text-zinc-100">
          {t("title")}
        </h1>
        <p className="mt-3 text-zinc-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">{t("free_title")}</h2>
              <p className="text-3xl font-bold text-zinc-100 mt-1">{t("free_price")}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500">{t("free_desc")}</p>
          <ul className="mt-6 space-y-3">
            {["free_feature1", "free_feature2", "free_feature3", "free_feature4"].map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                {t(key)}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signup"
            className="mt-8 block w-full text-center rounded-2xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            {t("free_cta")}
          </Link>
        </div>

        <div className="relative rounded-2xl border border-amber-800 bg-[#111111] p-8 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-white">
            {t("recommended")}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">{t("premium_title")}</h2>
              <p className="text-3xl font-bold text-zinc-100 mt-1">
                {t("premium_price")}<span className="text-base font-normal text-zinc-500">{t("premium_month")}</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500">{t("premium_desc")}</p>
          <ul className="mt-6 space-y-3">
            {["premium_feature1", "premium_feature2", "premium_feature3", "premium_feature4", "premium_feature5", "premium_feature6", "premium_feature7"].map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                {t(key)}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signup"
            className="mt-8 block w-full text-center rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
          >
            {t("premium_cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
