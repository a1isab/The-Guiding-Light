import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
  title: "The Guiding Light — AI-Powered Islamic Learning",
  description:
    "Free, structured Islamic courses powered by AI. Learn Aqeedah, Arabic, and more at your own pace.",
  openGraph: {
    title: "The Guiding Light — AI-Powered Islamic Learning",
    description:
      "Free, structured Islamic courses powered by AI. Learn Aqeedah, Arabic, and more at your own pace.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        <Navbar />
        <main className="flex-1 flex flex-col pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
