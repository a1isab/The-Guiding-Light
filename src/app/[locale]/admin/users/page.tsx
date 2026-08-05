import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import { UsersList } from "./users-list";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const t = await getTranslations("admin");
  const supabase = createServiceClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const emailMap: Record<string, string> = {};
  if (authUsers?.users) {
    for (const u of authUsers.users) {
      emailMap[u.id] = u.email ?? "";
    }
  }

  const users = (profiles ?? []).map((p) => ({
    ...p,
    email: emailMap[p.user_id] ?? "",
  }));

  return (
    <div>
      <h1 className="text-h2 mb-6" style={{ color: 'var(--text-primary)' }}>{t("users")}</h1>
      <UsersList users={users} />
    </div>
  );
}
