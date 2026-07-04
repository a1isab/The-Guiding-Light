import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase";
import { UsersList } from "./users-list";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
      <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">{t("users")}</h1>
      <UsersList users={users} />
    </div>
  );
}
