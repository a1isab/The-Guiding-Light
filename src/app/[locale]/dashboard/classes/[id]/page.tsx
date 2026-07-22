import { getTranslations } from "next-intl/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { AnnouncementBanner } from "@/components/announcement-banner";

export const dynamic = "force-dynamic";

export default async function StudentClassPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("dashboard");
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) redirect(`/${locale}/auth/login`);

  const dataClient = createAdminClient() ?? supabase;

  const { data: membership } = await dataClient
    .from("class_members")
    .select("id")
    .eq("class_id", id)
    .eq("student_id", userId)
    .single();

  if (!membership) {
    const { data: profile } = await dataClient
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .single<{ role: string }>();
    if (profile?.role !== "admin") notFound();
  }

  const { data: cls } = await dataClient
    .from("classes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cls) notFound();

  const { data: courses } = await dataClient
    .from("teacher_courses")
    .select("id, title, description")
    .eq("class_id", id)
    .order("order_index", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link
        href={`/${locale}/dashboard`}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <div className="mb-8">
        <h1 className="font-amiri text-3xl font-bold text-zinc-100">{cls.name}</h1>
        {cls.description && (
          <p className="mt-1 text-zinc-500">{cls.description}</p>
        )}
      </div>

      <AnnouncementBanner classId={id} />

      {courses && courses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course, idx) => (
            <Link
              key={course.id}
              data-testid={`class-course-card-${course.id}`}
              href={`/${locale}/dashboard/classes/${id}/courses/${course.id}`}
              className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-lg font-bold text-emerald-400">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{course.title}</p>
                  {course.description && (
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{course.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
          <BookOpen className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">{(await getTranslations("teacher"))("no_courses")}</p>
        </div>
      )}
    </div>
  );
}
