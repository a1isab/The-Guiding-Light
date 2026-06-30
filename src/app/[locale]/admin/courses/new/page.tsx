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
      <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">{t("create_course")}</h1>
      <CourseForm />
    </div>
  );
}
