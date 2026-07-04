import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { CourseForm } from "../../course-form";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("admin");
  const supabase = createServiceClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  return (
    <div>
      <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">
        {t("edit_course")}: {course.title}
      </h1>
      <CourseForm
        courseId={course.id}
        defaultValues={{
          title: course.title,
          title_ar: course.title_ar ?? "",
          description: course.description,
          description_ar: course.description_ar ?? "",
          level: course.level,
          slug: course.slug,
          order_index: course.order_index,
          is_published: course.is_published,
        }}
      />
    </div>
  );
}
