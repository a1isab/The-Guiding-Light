"use client";

import { Film } from "lucide-react";

export function VideoPlayer({ src }: { src?: string | null }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
      <div className="relative aspect-video">
        {src ? (
          <iframe
            src={src}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-900">
            <div className="text-center">
              <Film className="mx-auto h-12 w-12 text-zinc-700" />
              <p className="mt-3 text-sm text-zinc-600">Video not yet available</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-800 px-5 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
          <Film className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-sm font-medium text-zinc-300">Video</span>
        <span className="text-xs text-zinc-600">—</span>
        <span className="text-xs text-zinc-500">{src ? "YouTube" : "Unavailable"}</span>
      </div>

      {src && (
        <p className="border-t border-zinc-800 px-5 py-2 text-center text-xs text-zinc-600">
          Credits to Muslim Minds
        </p>
      )}
    </div>
  );
}
