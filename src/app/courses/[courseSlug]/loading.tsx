export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 bg-zinc-800 rounded-lg" />
        <div className="h-10 w-72 bg-zinc-800 rounded-lg mt-4" />
        <div className="h-4 w-full bg-zinc-800 rounded-lg" />
        <div className="mt-12 space-y-6">
          {[1, 2].map((s) => (
            <div key={s} className="space-y-3">
              <div className="h-6 w-48 bg-zinc-800 rounded-lg" />
              <div className="space-y-2">
                {[1, 2, 3].map((l) => (
                  <div key={l} className="h-14 bg-zinc-800 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
