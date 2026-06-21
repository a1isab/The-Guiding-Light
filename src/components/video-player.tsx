"use client";

import { useRef, useState } from "react";
import { Play, Film } from "lucide-react";

type Status = "idle" | "loading" | "playing" | "error";

export function VideoPlayer({ src, poster }: { src?: string | null; poster?: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  function handlePlay() {
    if (!src) return;
    setStatus("loading");
    videoRef.current?.play();
  }

  function handlePlaying() {
    setStatus("playing");
  }

  function handleError() {
    setStatus("error");
  }

  function handleEnded() {
    setStatus("idle");
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
      <div className="relative aspect-video">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster ?? undefined}
            className="h-full w-full object-contain bg-black"
            controls={status === "playing"}
            onPlaying={handlePlaying}
            onError={handleError}
            onEnded={handleEnded}
            preload="none"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-900">
            <div className="text-center">
              <Film className="mx-auto h-12 w-12 text-zinc-700" />
              <p className="mt-3 text-sm text-zinc-600">Video not yet available</p>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <p className="text-sm text-red-400">Failed to load video</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-800 px-5 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
          <Film className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-sm font-medium text-zinc-300">Video</span>
        <span className="text-xs text-zinc-600">—</span>
        {status !== "playing" ? (
          <button
            onClick={handlePlay}
            disabled={!src}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play className="h-3 w-3 fill-emerald-400" />
            {src ? "Watch Video" : "Unavailable"}
          </button>
        ) : (
          <span className="text-xs text-emerald-500">Playing</span>
        )}
      </div>

      {src && (
        <p className="border-t border-zinc-800 px-5 py-2 text-center text-xs text-zinc-600">
          Credits to Muslim Minds
        </p>
      )}
    </div>
  );
}
