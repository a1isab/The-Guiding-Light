import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MinusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClassProgressPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("teacher");
  const supabase = await createServerSupabaseClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cls) notFound();

  // Get students enrolled
  const { data: members } = await supabase
    .from("class_members")
    .select("student_id, joined_at")
    .eq("class_id", id);

  const studentIds = members?.map((m) => m.student_id) ?? [];

  const { data: students } = studentIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, role")
        .in("user_id", studentIds)
    : { data: [] };

  // Get emails for students
  const { data: authStudents } = studentIds.length
    ? await supabase.auth.admin.listUsers()
    : { data: { users: [] as { id: string; email?: string }[] } };

  const emailMap = new Map<string, string>();
  for (const u of authStudents?.users ?? []) {
    if (studentIds.includes(u.id)) {
      emailMap.set(u.id, u.email ?? "");
    }
  }

  // Get all courses, sections, lessons for this class
  const { data: courses } = await supabase
    .from("teacher_courses")
    .select("id, title, order_index")
    .eq("class_id", id)
    .order("order_index", { ascending: true });

  const courseIds = courses?.map((c) => c.id) ?? [];

  const { data: sections } = courseIds.length
    ? await supabase
        .from("teacher_sections")
        .select("id, title, order_index, course_id")
        .in("course_id", courseIds)
        .order("order_index", { ascending: true })
    : { data: [] };

  const sectionIds = sections?.map((s) => s.id) ?? [];

  const { data: lessons } = sectionIds.length
    ? await supabase
        .from("teacher_lessons")
        .select("id, title, order_index, section_id")
        .in("section_id", sectionIds)
        .order("order_index", { ascending: true })
    : { data: [] };

  // Get all progress records for these students and lessons
  const lessonIds = lessons?.map((l) => l.id) ?? [];
  const { data: progressRecords } = studentIds.length && lessonIds.length
    ? await supabase
        .from("teacher_progress")
        .select("student_id, lesson_id, completed_at")
        .in("student_id", studentIds)
        .in("lesson_id", lessonIds)
    : { data: [] };

  // Build completion set: Set<"studentId:lessonId">
  const completedSet = new Set<string>();
  for (const p of progressRecords ?? []) {
    completedSet.add(`${p.student_id}:${p.lesson_id}`);
  }

  // Get quiz attempts for best scores
  const { data: quizAttempts } = studentIds.length && lessonIds.length
    ? await supabase
        .from("teacher_quiz_attempts")
        .select("student_id, lesson_id, score, total")
        .in("student_id", studentIds)
        .in("lesson_id", lessonIds)
    : { data: [] };

  // Build best score map: "userId:lessonId" -> "score/total"
  const bestScoreMap = new Map<string, string>();
  for (const a of quizAttempts ?? []) {
    const key = `${a.student_id}:${a.lesson_id}`;
    const existing = bestScoreMap.get(key);
    const currentPct = a.score / a.total;
    const existingPct = existing ? parseFloat(existing.split("/")[0]) / parseFloat(existing.split("/")[1]) : 0;
    if (!existing || currentPct > existingPct) {
      bestScoreMap.set(key, `${a.score}/${a.total}`);
    }
  }

  // Build the display structure
  const courseSectionLessonMap = (courses ?? []).map((course) => ({
    ...course,
    sections: (sections ?? [])
      .filter((s) => s.course_id === course.id)
      .map((section) => ({
        ...section,
        lessons: (lessons ?? []).filter((l) => l.section_id === section.id),
      })),
  }));

  const totalLessons = lessonIds.length;

  const totalCompleted = (studentId: string) => {
    return lessonIds.filter((lid) => completedSet.has(`${studentId}:${lid}`)).length;
  };

  return (
    <div>
      <Link
        href={`/${locale}/teacher/classes/${id}`}
        className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[var(--text-primary)]"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back_to_class")}
      </Link>

      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{cls.name}</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{t("student_progress")}</p>

      {!totalLessons ? (
        <p className="text-sm text-center py-8 rounded-2xl border border-dashed" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
          {t("no_lessons_in_class")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table data-testid="progress-matrix" className="w-full text-left text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                <th className="px-3 py-2 font-medium min-w-[200px]" style={{ color: 'var(--text-secondary)' }}>{t("student")}</th>
                {courseSectionLessonMap.map((course) =>
                  course.sections.map((section) =>
                    section.lessons.map((lesson) => (
                      <th
                        key={lesson.id}
                        className="px-2 py-2 font-normal text-xs max-w-[120px] truncate"
                        style={{ color: 'var(--text-muted)' }}
                        title={lesson.title}
                      >
                        {course.title}/{lesson.title}
                      </th>
                    ))
                  )
                )}
                <th className="px-3 py-2 font-medium text-right" style={{ color: 'var(--text-secondary)' }}>{t("completion")}</th>
              </tr>
            </thead>
            <tbody>
              {(students ?? []).map((student) => {
                const completed = totalCompleted(student.user_id);
                const pct = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
                return (
                  <tr key={student.user_id} data-testid={`progress-row-${student.user_id}`} className="border-b hover:bg-[var(--bg-elevated)]" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-2.5 max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }}>
                      {emailMap.get(student.user_id) ?? student.user_id}
                    </td>
                    {courseSectionLessonMap.map((course) =>
                      course.sections.map((section) =>
                        section.lessons.map((lesson) => {
                          const done = completedSet.has(`${student.user_id}:${lesson.id}`);
                          const scoreKey = `${student.user_id}:${lesson.id}`;
                          const quizScore = bestScoreMap.get(scoreKey);
                          return (
                            <td key={lesson.id} data-testid={`completion-${student.user_id}-${lesson.id}`} className="px-2 py-2.5 text-center">
                              {quizScore ? (
                                <span className="text-xs font-medium" style={{ color: done ? 'var(--accent)' : 'var(--accent)' }}>
                                  {quizScore}
                                </span>
                              ) : done ? (
                                <CheckCircle className="h-4 w-4 inline-block" style={{ color: 'var(--accent)' }} />
                              ) : (
                                <MinusCircle className="h-4 w-4 inline-block" style={{ color: 'var(--text-muted)' }} />
                              )}
                            </td>
                          );
                        })
                      )
                    )}
                    <td className="px-3 py-2.5 text-right">
                      <span className="text-xs font-medium" style={{ color: pct === 100 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {completed}/{totalLessons} ({pct}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
