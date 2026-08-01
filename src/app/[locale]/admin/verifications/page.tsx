import { getTranslations } from "next-intl/server";
import { createAdminClient, createServiceClient } from "@/lib/supabase";
import { VerificationList } from "./verification-list";

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  const t = await getTranslations("admin");
  const supabase = createAdminClient() ?? createServiceClient();

  const { data: requests } = await supabase
    .from("teacher_verification_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const emailMap: Record<string, string> = {};
  if (authUsers?.users) {
    for (const u of authUsers.users) {
      emailMap[u.id] = u.email ?? "";
    }
  }

  const enriched = (requests ?? []).map((r) => ({
    ...r,
    email: emailMap[r.user_id] ?? "",
  }));

  return (
    <div>
      <h1 className="text-h2 mb-6" style={{ color: "var(--text-primary)" }}>
        {t("verifications")}
      </h1>
      <VerificationList requests={enriched} />
    </div>
  );
}
