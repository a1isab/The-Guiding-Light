import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarded")
    .eq("user_id", user.id)
    .single();

  // If already onboarded, redirect to dashboard
  if (profile?.onboarded) {
    redirect(`/${locale}/dashboard`);
  }

  const role = profile?.role ?? "student";

  return <OnboardingWizard locale={locale} role={role} />;
}
