import { getTranslations } from "next-intl/server";
import { ClassForm } from "@/components/teacher/class-form";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function NewClassPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("teacher");

  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div>
      <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">{t("new_class")}</h1>
      <ClassForm locale={locale} accessToken={session?.access_token ?? null} />
    </div>
  );
}
