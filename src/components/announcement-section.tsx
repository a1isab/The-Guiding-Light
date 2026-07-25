"use client";

import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { AnnouncementForm } from "./announcement-form";

export function AnnouncementSection({ classId }: { classId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Announcements</h2>
      <AnnouncementForm classId={classId} onPosted={() => setRefreshKey((k) => k + 1)} />
    </div>
  );
}
