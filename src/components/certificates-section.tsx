"use client";

import { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { CertificateCard } from "./certificate-card";

interface Certificate {
  id: string;
  course_name: string;
  teacher_name: string | null;
  class_name: string | null;
  custom_title: string | null;
  earned_at: string;
}

export function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/certificates")
      .then((r) => r.json())
      .then((data) => setCertificates(data.certificates ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || certificates.length === 0) return null;

  return (
    <div data-testid="certificates-section" className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-amber-400" />
        <h2 className="font-amiri text-xl font-bold text-zinc-100">Certificates</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}
