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
    <div data-testid="certificate-card" className="rounded-xl border p-5" style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", background: "color-mix(in srgb, var(--accent) 5%, transparent)" }}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
          <Award className="h-5 w-5" style={{ color: "var(--accent)" }} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{cert.custom_title ?? "Certificate of Completion"}</h4>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{cert.course_name}</p>
          {cert.class_name && <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{cert.class_name}</p>}
          {cert.teacher_name && <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Issued by {cert.teacher_name}</p>}
          <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>Earned {new Date(cert.earned_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
