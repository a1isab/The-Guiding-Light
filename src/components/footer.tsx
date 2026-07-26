import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("footer");

  return (
    <footer
      className="py-12"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <span
              className="font-arabic text-xl leading-none"
              dir="rtl"
              style={{ color: "var(--accent)" }}
            >
              النور المبين
            </span>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              {t("tagline")}
            </p>
          </div>
          <div>
            <h4
              className="text-xs uppercase tracking-widest font-semibold mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("links")}
            </h4>
            <div className="space-y-2">
              <Link
                href={`/${locale}/pricing`}
                className="block text-sm transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {t("pricing")}
              </Link>
            </div>
          </div>
          <div>
            <h4
              className="text-xs uppercase tracking-widest font-semibold mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("about")}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("about_text")}
            </p>
          </div>
        </div>
        <div
          className="mt-10 pt-6 text-center text-sm"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          {t("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
