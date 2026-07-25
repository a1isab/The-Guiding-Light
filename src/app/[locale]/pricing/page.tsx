import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Check, Sparkles, Crown } from "lucide-react";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("pricing");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
          {t("title")}
        </h1>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-2xl p-8" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
            >
              <Sparkles className="h-5 w-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{t("free_title")}</h2>
              <p className="text-3xl font-bold mt-1" style={{ color: "var(--text-primary)" }}>{t("free_price")}</p>
            </div>
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>{t("free_desc")}</p>
          <ul className="mt-6 space-y-3">
            {["free_feature1", "free_feature2", "free_feature3", "free_feature4"].map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                {t(key)}
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/onboarding`}
            className="mt-8 block w-full text-center rounded-2xl px-4 py-2.5 text-sm font-medium transition-all"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            {t("free_cta")}
          </Link>
        </div>

        {/* Premium Plan */}
        <div
          className="relative rounded-2xl p-8"
          style={{
            border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
            backgroundColor: "var(--bg-surface)",
            boxShadow: "0 0 40px var(--glow-subtle)",
          }}
        >
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {t("recommended")}
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
            >
              <Crown className="h-5 w-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{t("premium_title")}</h2>
              <p className="text-3xl font-bold mt-1" style={{ color: "var(--text-primary)" }}>
                {t("premium_price")}<span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>{t("premium_month")}</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>{t("premium_desc")}</p>
          <ul className="mt-6 space-y-3">
            {["premium_feature1", "premium_feature2", "premium_feature3", "premium_feature4", "premium_feature5", "premium_feature6", "premium_feature7"].map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                {t(key)}
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/onboarding`}
            className="mt-8 block w-full text-center rounded-2xl px-4 py-2.5 text-sm font-medium text-white transition-all"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "0 0 20px var(--glow-hover)",
            }}
          >
            {t("premium_cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
