import { TemplateManager } from "./template-manager";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  return (
    <div>
      <h1 className="text-h2 mb-6" style={{ color: 'var(--text-primary)' }}>Lesson Templates</h1>
      <TemplateManager />
    </div>
  );
}
