import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export default async function TeacherLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("teacher");

  const nav = [
    { href: `/${locale}/teacher`, label: t("dashboard"), icon: LayoutDashboard },
    { href: `/${locale}/teacher/classes`, label: t("classes"), icon: Users },
  ];

  return (
    <div className="flex flex-1">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-[#0d0d0d] p-4">
        <div className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-all"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <Link
            href={`/${locale}/auth/logout`}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-zinc-800 transition-all"
          >
            <LogOut className="h-4 w-4" />
            {t("sign_out")}
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
