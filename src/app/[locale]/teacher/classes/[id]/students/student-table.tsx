"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

interface Member {
  student_id: string;
  joined_at: string;
  profile?: { user_id: string; role: string; display_name?: string | null } | null;
}

export function StudentTable({
  members,
  locale,
  classId,
}: {
  members: Member[];
  locale: string;
  classId: string;
}) {
  const t = useTranslations("teacher");
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);

  async function handleRemove(studentId: string) {
    if (!confirm(t("remove_student_confirm"))) return;
    setRemoving(studentId);
    const res = await fetch("/api/teacher/classes/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ classId, studentId }),
    });
    if (res.ok) {
      router.refresh();
    }
    setRemoving(null);
  }

  if (members.length === 0) {
    return <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>{t("no_students")}</p>;
  }

  return (
    <div className="divide-y divide-[var(--border)]">
      {members.map((m) => (
        <div key={m.student_id} data-testid={`student-row-${m.student_id}`} className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{m.profile?.display_name || "Student"}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {t("joined")} {new Date(m.joined_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => handleRemove(m.student_id)}
            data-testid={`remove-student-${m.student_id}`}
            disabled={removing === m.student_id}
            className="rounded-lg p-1.5 transition-all disabled:opacity-50 hover:bg-[color-mix(in_srgb,var(--error)_20%,transparent)]"
            style={{ color: 'var(--error)' }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
