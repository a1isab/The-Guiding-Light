import { getTranslations } from "next-intl/server";
import { Check, Sparkles, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <h1 className="text-h1" style={{ color: "var(--text-primary)" }}>
          {t("title")}
        </h1>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {/* Free Plan */}
        <Card padding="lg" className="flex flex-col">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--glow-subtle)" }}
            >
              <Sparkles className="h-5 w-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-h4" style={{ color: "var(--text-primary)" }}>{t("free_title")}</h2>
              <p className="mt-1 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{t("free_price")}</p>
            </div>
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>{t("free_desc")}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {["free_feature1", "free_feature2", "free_feature3", "free_feature4"].map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
                {t(key)}
              </li>
            ))}
          </ul>
          <Button variant="secondary" href={`/${locale}/onboarding`} className="mt-8 w-full" testId="pricing-free-cta">
            {t("free_cta")}
          </Button>
        </Card>

        {/* Premium Plan */}
        <Card
          padding="lg"
          className="relative flex flex-col"
          style={{
            borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
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
              style={{ backgroundColor: "var(--glow-subtle)" }}
            >
              <Crown className="h-5 w-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-h4" style={{ color: "var(--text-primary)" }}>{t("premium_title")}</h2>
              <p className="mt-1 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                {t("premium_price")}<span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>{t("premium_month")}</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>{t("premium_desc")}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {["premium_feature1", "premium_feature2", "premium_feature3", "premium_feature4", "premium_feature5", "premium_feature6", "premium_feature7"].map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
                {t(key)}
              </li>
            ))}
          </ul>
          <Button href={`/${locale}/onboarding`} className="mt-8 w-full" testId="pricing-premium-cta">
            {t("premium_cta")}
          </Button>
        </Card>
      </div>
    </div>
  );
}
