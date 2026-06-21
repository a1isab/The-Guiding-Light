export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-64 bg-zinc-800 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-zinc-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-28 bg-zinc-800 rounded-2xl" />
      </div>
    </div>
  );
}
