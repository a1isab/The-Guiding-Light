import { getTranslations } from "next-intl/server";
import { TemplateManager } from "./template-manager";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Lesson Templates</h1>
      <TemplateManager />
    </div>
  );
}
