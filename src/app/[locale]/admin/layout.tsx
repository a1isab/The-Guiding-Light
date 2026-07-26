import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getUserRole } from "@/lib/supabase-api";
import { SidebarNav } from "@/components/sidebar-nav";
import { LogOut } from "lucide-react";

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

  const role = await getUserRole(supabase);
  if (!role?.includes("admin")) redirect(`/${locale}/dashboard`);

  const t = await getTranslations("admin");

  const nav = [
    { href: `/${locale}/admin`, label: t("overview"), icon: "LayoutDashboard", testId: "nav-admin-overview" },
    { href: `/${locale}/admin/users`, label: t("users"), icon: "Users", testId: "nav-admin-users" },
    { href: `/${locale}/admin/verifications`, label: t("verifications"), icon: "ShieldCheck", testId: "nav-admin-verifications" },
    { href: `/${locale}/admin/invites`, label: t("invites"), icon: "Key", testId: "nav-admin-invites" },
    { href: `/${locale}/admin/templates`, label: "Templates", icon: "FileText", testId: "nav-templates" },
  ];

  return (
    <div className="flex flex-1">
      <SidebarNav items={nav}>
        <Link
          href={`/${locale}/auth/logout`}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:bg-[var(--bg-elevated)]"
          style={{ color: 'var(--error)' }}
        >
          <LogOut className="h-4 w-4" />
          {t("sign_out")}
        </Link>
      </SidebarNav>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
