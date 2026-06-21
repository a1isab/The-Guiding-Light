import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-[#0d0d0d] border-t border-zinc-900 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <span
              className="font-['Amiri'] text-emerald-400 text-xl"
              dir="rtl"
            >
              النور المبين
            </span>
            <p className="text-zinc-500 text-sm mt-2">{t("tagline")}</p>
          </div>
          <div>
            <h4 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              {t("links")}
            </h4>
            <div className="space-y-2">
              <Link
                href="/courses"
                className="block text-zinc-500 hover:text-zinc-300 text-sm"
              >
                {t("courses")}
              </Link>
              <Link
                href="/pricing"
                className="block text-zinc-500 hover:text-zinc-300 text-sm"
              >
                {t("pricing")}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              {t("about")}
            </h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {t("about_text")}
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-zinc-800 text-center text-zinc-600 text-sm">
          {t("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
