export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-64 rounded-lg" style={{ backgroundColor: 'var(--bg-subtle)' }} />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl" style={{ backgroundColor: 'var(--bg-subtle)' }} />
          ))}
        </div>
        <div className="h-28 rounded-2xl" style={{ backgroundColor: 'var(--bg-subtle)' }} />
      </div>
    </div>
  );
}
