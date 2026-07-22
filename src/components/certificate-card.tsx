"use client";

import { Award } from "lucide-react";

interface CertificateProps {
  id: string;
  course_name: string;
  teacher_name: string | null;
  class_name: string | null;
  custom_title: string | null;
  earned_at: string;
}

export function CertificateCard({ cert }: { cert: CertificateProps }) {
  return (
    <div data-testid="certificate-card" className="rounded-xl border border-amber-800/30 bg-amber-900/5 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Award className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-zinc-100">{cert.custom_title ?? "Certificate of Completion"}</h4>
          <p className="text-xs text-zinc-400 mt-0.5">{cert.course_name}</p>
          {cert.class_name && <p className="text-xs text-zinc-500">{cert.class_name}</p>}
          {cert.teacher_name && <p className="text-xs text-zinc-500">Issued by {cert.teacher_name}</p>}
          <p className="text-[10px] text-zinc-600 mt-2">Earned {new Date(cert.earned_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
