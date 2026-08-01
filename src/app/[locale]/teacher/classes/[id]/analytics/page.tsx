"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Users, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { QuizScoreChart, CompletionTimelineChart } from "@/components/analytics/charts";
import { Card } from "@/components/ui/card";

interface AnalyticsData {
  totalStudents: number;
  avgQuizScore: number;
  completionRate: number;
  atRiskCount: number;
  scoreDistribution: { range: string; count: number }[];
  completionTimeline: { date: string; count: number }[];
  atRisk: { student_id: string; display_name: string | null; last_active: string | null }[];
  lessonBreakdown: { lesson_id: string; title: string; completed: number; total: number; rate: number }[];
}

export default function AnalyticsPage() {
  const params = useParams();
  const classId = params.id as string;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/teacher/analytics?classId=${classId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return <div className="p-8" style={{ color: 'var(--text-muted)' }}>Loading analytics...</div>;
  if (!data) return <div className="p-8" style={{ color: 'var(--text-muted)' }}>Failed to load analytics</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-h2 mb-8" style={{ color: 'var(--text-primary)' }}>Class Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <Card testId="stat-total-students">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--glow-subtle)' }}>
              <Users className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-caption" style={{ color: 'var(--text-muted)' }}>Students</p>
              <p className="text-h3" style={{ color: 'var(--text-primary)' }}>{data.totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card testId="stat-avg-score">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--glow-subtle)' }}>
              <BarChart3 className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-caption" style={{ color: 'var(--text-muted)' }}>Avg Quiz Score</p>
              <p className="text-h3" style={{ color: 'var(--text-primary)' }}>{data.avgQuizScore}%</p>
            </div>
          </div>
        </Card>

        <Card testId="stat-completion">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--glow-subtle)' }}>
              <TrendingUp className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-caption" style={{ color: 'var(--text-muted)' }}>Completion</p>
              <p className="text-h3" style={{ color: 'var(--text-primary)' }}>{data.completionRate}%</p>
            </div>
          </div>
        </Card>

        <Card
          testId="stat-at-risk"
          style={{
            borderColor: data.atRiskCount > 0 ? 'color-mix(in srgb, var(--accent) 30%, transparent)' : undefined,
            backgroundColor: data.atRiskCount > 0 ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : undefined,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: data.atRiskCount > 0 ? 'var(--glow-subtle)' : 'var(--bg-subtle)' }}
            >
              <AlertTriangle className="h-5 w-5" style={{ color: data.atRiskCount > 0 ? 'var(--accent)' : 'var(--text-muted)' }} />
            </div>
            <div>
              <p className="text-caption" style={{ color: 'var(--text-muted)' }}>At Risk</p>
              <p className="text-h3" style={{ color: data.atRiskCount > 0 ? 'var(--accent)' : 'var(--text-primary)' }}>{data.atRiskCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <QuizScoreChart data={data.scoreDistribution} />
        <CompletionTimelineChart data={data.completionTimeline} />
      </div>

      {data.atRisk.length > 0 && (
        <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)', backgroundColor: 'color-mix(in srgb, var(--accent) 5%, transparent)' }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>At-Risk Students</h3>
          <div className="space-y-2">
            {data.atRisk.map((s) => (
              <div key={s.student_id} className="flex items-center justify-between py-1.5">
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{s.display_name || "Student"}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Last active: {s.last_active ? new Date(s.last_active).toLocaleDateString() : "Never"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.lessonBreakdown.length > 0 && (
        <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Lesson Completion</h3>
          <div className="space-y-3">
            {data.lessonBreakdown.map((l) => (
              <div key={l.lesson_id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{l.title}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{l.completed}/{l.total} ({l.rate}%)</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${l.rate}%`, backgroundColor: 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
