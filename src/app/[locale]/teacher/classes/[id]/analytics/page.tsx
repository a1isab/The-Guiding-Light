"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Users, BarChart3, TrendingUp, AlertTriangle, BookOpen } from "lucide-react";
import { QuizScoreChart, CompletionTimelineChart } from "@/components/analytics/charts";

interface AnalyticsData {
  totalStudents: number;
  avgQuizScore: number;
  completionRate: number;
  atRiskCount: number;
  scoreDistribution: { range: string; count: number }[];
  completionTimeline: { date: string; count: number }[];
  atRisk: { student_id: string; last_active: string | null }[];
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

  if (loading) return <div className="p-8 text-zinc-500">Loading analytics...</div>;
  if (!data) return <div className="p-8 text-zinc-500">Failed to load analytics</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-8">Class Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div data-testid="stat-total-students" className="rounded-xl border border-zinc-800 bg-[#111111] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Students</p>
              <p className="text-2xl font-bold text-zinc-100">{data.totalStudents}</p>
            </div>
          </div>
        </div>

        <div data-testid="stat-avg-score" className="rounded-xl border border-zinc-800 bg-[#111111] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Avg Quiz Score</p>
              <p className="text-2xl font-bold text-zinc-100">{data.avgQuizScore}%</p>
            </div>
          </div>
        </div>

        <div data-testid="stat-completion" className="rounded-xl border border-zinc-800 bg-[#111111] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Completion</p>
              <p className="text-2xl font-bold text-zinc-100">{data.completionRate}%</p>
            </div>
          </div>
        </div>

        <div data-testid="stat-at-risk" className={`rounded-xl border p-5 ${data.atRiskCount > 0 ? "border-amber-800/30 bg-amber-900/5" : "border-zinc-800 bg-[#111111]"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${data.atRiskCount > 0 ? "bg-amber-500/10" : "bg-zinc-800"}`}>
              <AlertTriangle className={`h-5 w-5 ${data.atRiskCount > 0 ? "text-amber-400" : "text-zinc-500"}`} />
            </div>
            <div>
              <p className="text-xs text-zinc-500">At Risk</p>
              <p className={`text-2xl font-bold ${data.atRiskCount > 0 ? "text-amber-400" : "text-zinc-100"}`}>{data.atRiskCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <QuizScoreChart data={data.scoreDistribution} />
        <CompletionTimelineChart data={data.completionTimeline} />
      </div>

      {data.atRisk.length > 0 && (
        <div className="rounded-xl border border-amber-800/30 bg-amber-900/5 p-5 mb-8">
          <h3 className="text-sm font-medium text-amber-400 mb-3">At-Risk Students</h3>
          <div className="space-y-2">
            {data.atRisk.map((s) => (
              <div key={s.student_id} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-zinc-300">{s.student_id.slice(0, 8)}...</span>
                <span className="text-xs text-zinc-500">
                  Last active: {s.last_active ? new Date(s.last_active).toLocaleDateString() : "Never"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.lessonBreakdown.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">Lesson Completion</h3>
          <div className="space-y-3">
            {data.lessonBreakdown.map((l) => (
              <div key={l.lesson_id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-200">{l.title}</span>
                  <span className="text-xs text-zinc-500">{l.completed}/{l.total} ({l.rate}%)</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${l.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
