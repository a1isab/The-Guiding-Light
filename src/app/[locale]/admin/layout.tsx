import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LayoutDashboard, BookOpen, Users, Key, FileText, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: role } = await supabase.rpc("get_user_role");
  if (role !== "admin") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("admin");

  const nav = [
    { href: `/${locale}/admin`, label: t("overview"), icon: LayoutDashboard },
    { href: `/${locale}/admin/courses`, label: t("courses"), icon: BookOpen },
    { href: `/${locale}/admin/users`, label: t("users"), icon: Users },
    { href: `/${locale}/admin/invites`, label: t("invites"), icon: Key },
    { href: `/${locale}/admin/templates`, label: "Templates", icon: FileText },
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
        <div className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
