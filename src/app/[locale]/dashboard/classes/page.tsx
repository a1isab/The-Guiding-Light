import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { Users } from "lucide-react";
import { JoinClassCard } from "@/components/join-class-card";

export const dynamic = "force-dynamic";

export default async function MyClassesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");

  const headersList = await headers();
  let userId = headersList.get("x-user-id");

  if (!userId) {
    const { createServerSupabaseClient } = await import("@/lib/supabase");
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);
    userId = user.id;
  }

  const service = createAdminClient();
  if (!service) redirect(`/${locale}/dashboard`);

  const { data: memberships } = await service
    .from("class_members")
    .select("class_id, joined_at")
    .eq("student_id", userId)
    .order("joined_at", { ascending: false });

  const classIds = memberships?.map((m) => m.class_id) ?? [];

  const { data: classes } = classIds.length
    ? await service
        .from("classes")
        .select("id, name, description")
        .in("id", classIds)
    : { data: [] };

  const { data: courseCounts } = classIds.length
    ? await service
        .from("teacher_courses")
        .select("class_id")
        .in("class_id", classIds)
    : { data: [] };

  const counts: Record<string, number> = {};
  for (const c of courseCounts ?? []) {
    counts[c.class_id] = (counts[c.class_id] ?? 0) + 1;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>
        {t("my_classes")}
      </h1>

      {classes && classes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              data-testid={`class-card-${cls.id}`}
              href={`/${locale}/dashboard/classes/${cls.id}`}
              className="card-hover rounded-2xl border p-6 transition-all"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)" }}
                >
                  <Users className="h-6 w-6" style={{ color: "var(--success)" }} />
                </div>
                <div>
                  <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    {cls.name}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {counts[cls.id] ?? 0} {"courses"}
                  </p>
                  {cls.description && (
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {cls.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <Users className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
          <p className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
            {t("no_classes_yet", { defaultMessage: "You haven't joined any classes yet" })}
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {t("join_class_prompt", { defaultMessage: "Enter an invite code below to join a class" })}
          </p>
        </div>
      )}

      <JoinClassCard />
    </div>
  );
}
