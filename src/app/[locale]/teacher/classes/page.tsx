import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ClassList } from "@/components/teacher/class-list";

export const dynamic = "force-dynamic";

export default async function TeacherClassesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("teacher");
  const supabase = await createServerSupabaseClient();

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, description, invite_code, created_at")
    .order("created_at", { ascending: false });

  const classIds = classes?.map((c) => c.id) ?? [];

  const { data: memberCounts } = await supabase
    .from("class_members")
    .select("class_id")
    .in("class_id", classIds);

  const counts: Record<string, number> = {};
  for (const m of memberCounts ?? []) {
    counts[m.class_id] = (counts[m.class_id] ?? 0) + 1;
  }

  const enriched = (classes ?? []).map((c) => ({
    ...c,
    student_count: counts[c.id] ?? 0,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-amiri text-2xl font-bold text-zinc-100">{t("classes")}</h1>
        <Link
          href={`/${locale}/teacher/classes/new`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-all"
        >
          <Plus className="h-4 w-4" />
          {t("new_class")}
        </Link>
      </div>

      <ClassList classes={enriched} />
    </div>
  );
}
