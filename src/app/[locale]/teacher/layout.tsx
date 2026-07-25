import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getUserRole } from "@/lib/supabase-api";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { SidebarNav } from "@/components/sidebar-nav";
import { LogOut } from "lucide-react";

export default async function TeacherLayout({
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
  if (!role?.includes("teacher") && !role?.includes("admin")) {
    redirect(`/${locale}/dashboard`);
  }

  // Check onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("user_id", user.id)
    .single();

  if (profile && !profile.onboarded) {
    redirect(`/${locale}/onboarding`);
  }

  const t = await getTranslations("teacher");

  const nav = [
    { href: `/${locale}/teacher`, label: t("dashboard"), icon: "LayoutDashboard", testId: "nav-teacher-dashboard" },
    { href: `/${locale}/teacher/classes`, label: t("classes"), icon: "Users", testId: "nav-classes" },
  ];

  return (
    <div className="flex flex-1">
      <SidebarNav items={nav}>
        <SignOutButton className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:bg-[var(--bg-subtle)]" style={{ color: 'var(--error)' }}>
          <LogOut className="h-4 w-4" />
          {t("sign_out")}
        </SignOutButton>
      </SidebarNav>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
