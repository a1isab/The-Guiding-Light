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
    <div className="rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3 font-medium">{t("user_email")}</th>
              <th className="px-5 py-3 font-medium">{t("user_role")}</th>
              <th className="px-5 py-3 font-medium">{t("user_joined")}</th>
              <th className="px-5 py-3 font-medium">{t("user_streak")}</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {users.map((u) => (
              <tr key={u.user_id} data-testid={`user-row-${u.user_id}`} className="text-sm text-zinc-300">
                <td className="px-5 py-4">{u.email || "—"}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      u.role === "admin"
                        ? "bg-red-500/10 text-red-400"
                        : u.role === "teacher"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-zinc-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-zinc-500">{u.streak}</td>
                <td className="px-5 py-4">
                  <select
                    value={u.role}
                    data-testid={`role-select-${u.user_id}`}
                    onChange={(e) => changeRole(u.user_id, e.target.value as Role)}
                    disabled={updating === u.user_id}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
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
