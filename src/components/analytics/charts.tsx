"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

interface ScoreDistribution {
  range: string;
  count: number;
}

interface CompletionTimeline {
  date: string;
  count: number;
}

export function QuizScoreChart({ data }: { data: ScoreDistribution[] }) {
  return (
    <div data-testid="quiz-score-chart" className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-surface) 30%, transparent)" }}>
      <h4 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary)" }}>Quiz Score Distribution</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="range" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
          <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
            labelStyle={{ color: "var(--text-secondary)" }}
          />
          <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletionTimelineChart({ data }: { data: CompletionTimeline[] }) {
  return (
    <div data-testid="completion-timeline" className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-surface) 30%, transparent)" }}>
      <h4 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary)" }}>Completions (Last 30 Days)</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
            labelStyle={{ color: "var(--text-secondary)" }}
          />
          <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
