import { getTranslations } from "next-intl/server";
import { ClassForm } from "@/components/teacher/class-form";

export default async function NewClassPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("teacher");

  return (
    <div>
      <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">{t("new_class")}</h1>
      <ClassForm locale={locale} />
    </div>
  );
}
