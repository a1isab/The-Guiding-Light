"use client";

import { AnnouncementForm } from "./announcement-form";

export function AnnouncementSection({ classId }: { classId: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Announcements</h2>
      <AnnouncementForm classId={classId} onPosted={() => {}} />
    </div>
  );
}
