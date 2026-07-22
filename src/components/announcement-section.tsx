"use client";

import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { AnnouncementForm } from "./announcement-form";

export function AnnouncementSection({ classId }: { classId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <h2 className="text-sm font-semibold text-zinc-300 mb-4">Announcements</h2>
      <AnnouncementForm classId={classId} onPosted={() => setRefreshKey((k) => k + 1)} />
    </div>
  );
}
