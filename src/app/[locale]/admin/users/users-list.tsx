"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import type { Role } from "@/lib/types";

interface UserProfile {
  user_id: string;
  email: string;
  role: Role;
  streak: number;
  created_at: string;
}

export function UsersList({ users }: { users: UserProfile[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const supabase = createClient();
  const [updating, setUpdating] = useState<string | null>(null);

  async function changeRole(userId: string, role: Role) {
    setUpdating(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("user_id", userId);

    if (!error) {
      router.refresh();
    }
    setUpdating(null);
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <th className="px-5 py-3 font-medium">{t("user_email")}</th>
              <th className="px-5 py-3 font-medium">{t("user_role")}</th>
              <th className="px-5 py-3 font-medium">{t("user_joined")}</th>
              <th className="px-5 py-3 font-medium">{t("user_streak")}</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-[var(--border)]">
            {users.map((u) => (
              <tr key={u.user_id} data-testid={`user-row-${u.user_id}`} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <td className="px-5 py-4">{u.email || "—"}</td>
                <td className="px-5 py-4">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                    style={
                      u.role === "admin"
                        ? { background: 'color-mix(in srgb, var(--error) 10%, transparent)', color: 'var(--error)' }
                        : u.role === "teacher"
                        ? { background: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)' }
                        : { background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }
                    }
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4" style={{ color: 'var(--text-muted)' }}>
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4" style={{ color: 'var(--text-muted)' }}>{u.streak}</td>
                <td className="px-5 py-4">
                  <select
                    value={u.role}
                    data-testid={`role-select-${u.user_id}`}
                    onChange={(e) => changeRole(u.user_id, e.target.value as Role)}
                    disabled={updating === u.user_id}
                    className="rounded-lg border px-2 py-1 text-xs focus:border-[var(--accent)] focus:outline-none disabled:opacity-50"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                  >
                    <option value="student">student</option>
                    <option value="teacher">teacher</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
