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
    <div data-testid="quiz-score-chart" className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
      <h4 className="text-sm font-medium text-zinc-300 mb-4">Quiz Score Distribution</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#71717a" }} />
          <YAxis tick={{ fontSize: 11, fill: "#71717a" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletionTimelineChart({ data }: { data: CompletionTimeline[] }) {
  return (
    <div data-testid="completion-timeline" className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
      <h4 className="text-sm font-medium text-zinc-300 mb-4">Completions (Last 30 Days)</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#71717a" }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis tick={{ fontSize: 11, fill: "#71717a" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
