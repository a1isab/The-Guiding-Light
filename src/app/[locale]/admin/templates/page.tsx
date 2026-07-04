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
      <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-6">Lesson Templates</h1>
      <TemplateManager />
    </div>
  );
}
