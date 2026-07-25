import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminCourseList } from "./course-list";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");
  const supabase = createServiceClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t("courses")}</h1>
        <Link
          data-testid="create-course"
          href={`/${locale}/admin/courses/new`}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition-all"
          style={{ background: 'var(--accent)' }}
        >
          <Plus className="h-4 w-4" />
          {t("create_course")}
        </Link>
      </div>

      <AdminCourseList courses={courses ?? []} locale={locale} />
    </div>
  );
}
