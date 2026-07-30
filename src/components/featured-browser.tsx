"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, BookOpen, GraduationCap, ArrowRight, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface FeaturedTeacher {
  user_id: string;
  display_name: string | null;
  email: string;
  class_count: number;
  lesson_count: number;
}

interface FeaturedClass {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  invite_code: string;
  teacher_id: string;
  teacher_display_name: string | null;
  course_count: number;
  lesson_count: number;
}

interface Props {
  teachers: FeaturedTeacher[];
  classes: FeaturedClass[];
}

type View = "teachers" | "classes";

export function FeaturedBrowser({ teachers, classes }: Props) {
  const t = useTranslations("featured");
  const locale = useLocale();
  const [view, setView] = useState<View>("classes");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [joining, setJoining] = useState<string | null>(null);
  const [joined, setJoined] = useState<string | null>(null);

  const filteredClasses = selectedTeacher
    ? classes.filter((c) => c.teacher_id === selectedTeacher)
    : classes;

  const selectedTeacherData = selectedTeacher
    ? teachers.find((t) => t.user_id === selectedTeacher)
    : null;

  async function handleJoin(cls: FeaturedClass) {
    setJoining(cls.id);
    try {
      const res = await fetch("/api/featured/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: cls.id, inviteCode: cls.invite_code }),
      });
      const data = await res.json();
      if (data.success || data.alreadyMember) {
        setJoined(cls.id);
        setTimeout(() => {
          window.location.href = `/${locale}/dashboard/classes/${cls.id}`;
        }, 800);
      }
    } catch {
    } finally {
      setJoining(null);
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-8 rounded-xl p-1 w-fit" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <Button
          variant={view === "teachers" ? "primary" : "ghost"}
          size="sm"
          testId="featured-tab-teachers"
          onClick={() => { setView("teachers"); setSelectedTeacher(null); }}
        >
          <GraduationCap className="h-4 w-4" />
          {t("verified_teachers")}
        </Button>
        <Button
          variant={view === "classes" ? "primary" : "ghost"}
          size="sm"
          testId="featured-tab-classes"
          onClick={() => { setView("classes"); setSelectedTeacher(null); }}
        >
          <BookOpen className="h-4 w-4" />
          {t("verified_classes")}
        </Button>
      </div>

      {view === "teachers" && (
        <div data-testid="featured-teachers-view">
          {teachers.length === 0 ? (
            <EmptyState
              icon={<GraduationCap className="h-8 w-8" />}
              title={t("no_teachers")}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teachers.map((teacher) => (
                <Card
                  key={teacher.user_id}
                  hoverable
                  testId={`featured-teacher-card-${teacher.user_id}`}
                  onClick={() => setSelectedTeacher(
                    selectedTeacher === teacher.user_id ? null : teacher.user_id
                  )}
                  style={{
                    borderColor: selectedTeacher === teacher.user_id
                      ? "var(--accent)"
                      : undefined,
                    backgroundColor: selectedTeacher === teacher.user_id
                      ? "color-mix(in srgb, var(--accent) 5%, transparent)"
                      : undefined,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)' }}
                    >
                      {(teacher.display_name ?? teacher.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {teacher.display_name ?? teacher.email}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {teacher.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {t("class_count", { count: teacher.class_count })}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {t("lesson_count", { count: teacher.lesson_count })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedTeacher && filteredClasses.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h4" style={{ color: 'var(--text-primary)' }}>
                  {t("classes_by", { name: selectedTeacherData?.display_name ?? selectedTeacherData?.email ?? "" })}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTeacher(null)}>
                  {t("clear_selection")}
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClasses.map((cls) => (
                  <Card
                    key={cls.id}
                    hoverable
                    testId={`featured-teacher-class-card-${cls.id}`}
                  >
                    {cls.cover_image ? (
                      <div className="aspect-video rounded-xl overflow-hidden mb-3">
                        <Image src={cls.cover_image} alt={cls.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <BookOpen className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                    <Link
                      href={`/${locale}/featured/classes/${cls.id}`}
                      className="text-sm font-semibold block mb-1 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {cls.name}
                    </Link>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                      {cls.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {cls.course_count} {t("courses").toLowerCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {cls.lesson_count} {t("lessons").toLowerCase()}
                      </span>
                    </div>
                    {joined === cls.id ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--success)' }}>
                        <CheckCircle className="h-3.5 w-3.5" />
                        {t("joined")}
                      </span>
                    ) : (
                      <button
                        data-testid={`featured-join-btn-${cls.id}`}
                        onClick={() => handleJoin(cls)}
                        disabled={joining === cls.id}
                        className="join-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all"
                        style={{
                          backgroundColor: 'var(--success)',
                          color: 'var(--text-primary)',
                          boxShadow: '0 0 15px color-mix(in srgb, var(--success) 15%, transparent)',
                        }}
                      >
                        {joining === cls.id ? t("joining") : t("join_class")}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {view === "classes" && (
        <div data-testid="featured-classes-view">
          {classes.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center" style={{ borderColor: 'var(--border)' }}>
              <BookOpen className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t("no_classes")}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <Card
                  key={cls.id}
                  hoverable
                  testId={`featured-class-card-${cls.id}`}
                >
                  {cls.cover_image ? (
                    <div className="aspect-video rounded-xl overflow-hidden mb-3">
                      <Image src={cls.cover_image} alt={cls.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                      <BookOpen className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
                    </div>
                  )}
                  <Link
                    href={`/${locale}/featured/classes/${cls.id}`}
                    className="text-sm font-semibold block mb-1 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {cls.name}
                  </Link>
                  {cls.teacher_display_name && (
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {cls.teacher_display_name}
                    </p>
                  )}
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                    {cls.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {cls.course_count} {t("courses").toLowerCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {cls.lesson_count} {t("lessons").toLowerCase()}
                    </span>
                  </div>
                  {joined === cls.id ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--success)' }}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      {t("joined")}
                    </span>
                  ) : (
                    <button
                      data-testid={`featured-join-btn-${cls.id}`}
                      onClick={() => handleJoin(cls)}
                      disabled={joining === cls.id}
                      className="join-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all"
                      style={{
                        backgroundColor: 'var(--success)',
                        color: 'var(--text-primary)',
                        boxShadow: '0 0 15px color-mix(in srgb, var(--success) 15%, transparent)',
                      }}
                    >
                      {joining === cls.id ? t("joining") : t("join_class")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
