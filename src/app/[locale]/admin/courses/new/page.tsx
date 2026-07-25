import { getTranslations } from "next-intl/server";
import { CourseForm } from "../course-form";

export default async function NewCoursePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{t("create_course")}</h1>
      <CourseForm />
    </div>
  );
}
