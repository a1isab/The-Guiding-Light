"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

export function HtmlAttributes() {
  const locale = useLocale();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" || locale === "ur" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
