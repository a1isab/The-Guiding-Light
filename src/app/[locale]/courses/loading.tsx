export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded-lg mx-auto" style={{ background: "var(--bg-surface)" }} />
        <div className="h-4 w-64 rounded-lg mx-auto" style={{ background: "var(--bg-surface)" }} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border p-6 h-36" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
