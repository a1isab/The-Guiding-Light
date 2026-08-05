"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

const arabic = "النور المبين";

export function Logo() {
  const t = useTranslations("logo");
  const locale = useLocale();
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem("logo-animated");
    let i = hasAnimated ? arabic.length : 0;
    const interval = setInterval(() => {
      setDisplayed(arabic.slice(0, i + 1));
      i++;
      if (i === arabic.length) {
        clearInterval(interval);
        sessionStorage.setItem("logo-animated", "true");
      }
    }, hasAnimated ? 0 : 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href={`/${locale}`} className="flex flex-col items-start">
      <span
        className="font-arabic text-xl leading-none"
        dir="rtl"
        style={{ color: "var(--accent)" }}
      >
        {displayed}
      </span>
      <span
        className="text-[10px] uppercase tracking-[0.2em] hidden sm:block"
        style={{ color: "var(--text-muted)" }}
      >
        {t("subtitle")}
      </span>
    </Link>
  );
}
