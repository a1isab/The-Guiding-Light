"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { CheckCircle } from "lucide-react";

export function CompleteButton({
  lessonId,
  classId,
  courseId,
  initialCompleted,
}: {
  lessonId: string;
  classId: string;
  courseId: string;
  initialCompleted: boolean;
}) {
  const t = useTranslations("quiz");
  const router = useRouter();
  const supabase = createClient();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (completed) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (completed) {
      await supabase.from("progress").delete().eq("user_id", user.id).eq("lesson_id", lessonId);
      setCompleted(false);
    } else {
      await supabase.from("progress").insert({ user_id: user.id, lesson_id: lessonId });
      setCompleted(true);
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all"
      style={{
        backgroundColor: completed ? "color-mix(in srgb, var(--success) 20%, transparent)" : "var(--accent)",
        color: completed ? "var(--success)" : "white",
        border: completed ? "1px solid color-mix(in srgb, var(--success) 40%, transparent)" : "none",
      }}
    >
      <CheckCircle
        className="h-5 w-5"
        style={completed ? { color: "var(--success)" } : {}}
      />
      {completed ? t("pass_title") : "Mark as Complete"}
    </button>
  );
}
