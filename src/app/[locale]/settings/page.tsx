"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Sun, Moon, Globe, ArrowLeft } from "lucide-react";
import type { Locale } from "@/lib/types";
import { routing } from "../../../../i18n/routing";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale() as Locale;
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme") as "dark" | "light") ?? "dark";
  });

  const toggleTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.dataset.theme = newTheme;
  };

  return (
    <div className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          href={`/${locale}/dashboard`}
          className="mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_dashboard")}
        </Link>

        {/* Header */}
        <h1 className="text-h1" style={{ color: "var(--text-primary)" }}>
          {t("title")}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          {t("subtitle")}
        </p>

        {/* Theme Section */}
        <Card className="mt-8" padding="sm">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--glow-subtle)" }}
            >
              <Globe className="h-5 w-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {t("appearance")}
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {t("appearance_desc")}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* Dark option */}
            <button
              onClick={() => toggleTheme("dark")}
              className="relative rounded-xl p-4 text-left transition-all"
              style={{
                border: `2px solid ${theme === "dark" ? "var(--accent)" : "var(--border)"}`,
                backgroundColor: theme === "dark" ? "var(--bg-elevated)" : "var(--bg-primary)",
              }}
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5" style={{ color: theme === "dark" ? "var(--accent)" : "var(--text-muted)" }} />
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {t("dark_mode")}
                </span>
              </div>
              {theme === "dark" && (
                <div
                  className="absolute top-2 right-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              )}
            </button>

            {/* Light option */}
            <button
              onClick={() => toggleTheme("light")}
              className="relative rounded-xl p-4 text-left transition-all"
              style={{
                border: `2px solid ${theme === "light" ? "var(--accent)" : "var(--border)"}`,
                backgroundColor: theme === "light" ? "var(--bg-elevated)" : "var(--bg-primary)",
              }}
            >
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5" style={{ color: theme === "light" ? "var(--accent)" : "var(--text-muted)" }} />
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {t("light_mode")}
                </span>
              </div>
              {theme === "light" && (
                <div
                  className="absolute top-2 right-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              )}
            </button>
          </div>
        </Card>

        {/* Language Section */}
        <Card className="mt-6" padding="sm">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--glow-subtle)" }}
            >
              <Globe className="h-5 w-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {t("language")}
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {t("language_desc")}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {routing.locales.map((loc) => (
              <Link
                key={loc}
                href={`/${loc}/settings`}
                className="rounded-xl px-4 py-3 text-center text-sm font-medium transition-all"
                style={{
                  border: `2px solid ${locale === loc ? "var(--accent)" : "var(--border)"}`,
                  backgroundColor: locale === loc ? "var(--bg-elevated)" : "transparent",
                  color: locale === loc ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {loc === "en" ? "English" : loc === "ar" ? "العربية" : loc === "ur" ? "اردو" : "Français"}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
