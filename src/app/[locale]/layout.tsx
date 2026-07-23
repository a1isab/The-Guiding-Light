import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../i18n/routing";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HtmlAttributes } from "@/components/html-attributes";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "The Guiding Light — Islamic Learning Platform",
  description:
    "Free, structured Islamic courses. Learn Aqeedah, Arabic, and more at your own pace.",
  openGraph: {
    title: "The Guiding Light — Islamic Learning Platform",
    description:
      "Free, structured Islamic courses. Learn Aqeedah, Arabic, and more at your own pace.",
    type: "website",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <div
      className={`${inter.variable} ${amiri.variable} h-full antialiased min-h-full flex flex-col bg-[#0a0a0a]`}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <HtmlAttributes />
        <Navbar />
        <main className="flex-1 flex flex-col pt-16">{children}</main>
        <Footer locale={locale} />
      </NextIntlClientProvider>
    </div>
  );
}
