import { getTranslations } from "next-intl/server";
import { CreateCourseForm } from "./course-form";

export default async function NewCoursePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("teacher");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{t("new_course")}</h1>
      <CreateCourseForm classId={id} locale={locale} />
    </div>
  );
}
