import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, BookOpen, Copy, ArrowLeft } from "lucide-react";
import { InviteCodeDisplay } from "./invite-code";
import { StudentTable } from "./students/student-table";

export const dynamic = "force-dynamic";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("teacher");
  const supabase = createServiceClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cls) notFound();

  const { data: members } = await supabase
    .from("class_members")
    .select("student_id, joined_at")
    .eq("class_id", id);

  const studentIds = members?.map((m) => m.student_id) ?? [];

  const { data: profiles } = studentIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, role")
        .in("user_id", studentIds)
    : { data: [] };

  const studentProfiles = profiles ?? [];
  const enrichedMembers = (members ?? []).map((m) => ({
    ...m,
    profile: studentProfiles.find((p) => p.user_id === m.student_id),
  }));

  const { data: courses } = await supabase
    .from("teacher_courses")
    .select("id, title, order_index, created_at")
    .eq("class_id", id)
    .order("order_index", { ascending: true });

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://theguidinglight.app"}/${locale}/join/${cls.invite_code}`;

  return (
    <div>
      <Link
        href={`/${locale}/teacher/classes`}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back_to_classes")}
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-amiri text-2xl font-bold text-zinc-100">{cls.name}</h1>
          {cls.description && (
            <p className="text-sm text-zinc-500 mt-1">{cls.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {members?.length ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {courses?.length ?? 0}
          </span>
        </div>
      </div>

      {/* Invite Code */}
      <InviteCodeDisplay code={cls.invite_code} url={inviteUrl} locale={locale} classId={id} />

      {/* Students */}
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">{t("students")}</h2>
          <span className="text-xs text-zinc-500">{members?.length ?? 0}</span>
        </div>
        <StudentTable members={enrichedMembers} locale={locale} classId={id} />
      </div>

      {/* Courses */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-300">{t("courses")}</h2>
          <Link
            href={`/${locale}/teacher/classes/${id}/courses/new`}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 transition-all"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t("new_course")}
          </Link>
        </div>

        {courses?.length ? (
          <div className="space-y-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/${locale}/teacher/classes/${id}/courses/${course.id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#111111] px-4 py-3 hover:bg-zinc-900/30 transition-colors"
              >
                <span className="text-sm text-zinc-300">{course.title}</span>
                <span className="text-xs text-zinc-600">
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-8 rounded-2xl border border-dashed border-zinc-800">
            {t("no_courses")}
          </p>
        )}
      </div>
    </div>
  );
}
