"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Film } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

function parseEmbedUrl(url: string) {
  const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  const videoId = match?.[1] ?? null;
  const startParam = url.match(/[?&]start=(\d+)/);
  const endParam = url.match(/[?&]end=(\d+)/);
  return {
    videoId,
    start: startParam ? parseInt(startParam[1]) : 0,
    end: endParam ? parseInt(endParam[1]) : null,
  };
}

export function VideoPlayer({ src }: { src?: string | null }) {
  const t = useTranslations("video");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);

  const parsed = src ? parseEmbedUrl(src) : null;
  const videoId = parsed?.videoId ?? null;
  const startSec = parsed?.start ?? 0;
  const endSec = parsed?.end ?? null;

  const ytLang: Record<string, string> = {
    en: "en",
    ar: "ar",
    ur: "ur",
    fr: "fr",
  };

  useEffect(() => {
    if (!videoId) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const first = document.getElementsByTagName("script")[0];
      first.parentNode?.insertBefore(tag, first);
    }

    function createPlayer() {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: { start: startSec, rel: 0, cc_load_policy: 1, cc_lang_pref: ytLang[locale] ?? "en" },
        events: { onStateChange: onStateChange },
      });
      setReady(true);
    }

    window.onYouTubeIframeAPIReady = createPlayer;

    if (window.YT?.ready) {
      createPlayer();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
    };
  }, [videoId, startSec]);

  function onStateChange(event: { data: number }) {
    if (event.data === 1) {
      if (endSec !== null) {
        intervalRef.current = setInterval(() => {
          const current = playerRef.current?.getCurrentTime();
          if (current != null && current >= endSec) {
            playerRef.current?.stopVideo();
            setEnded(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }, 200);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }

  if (!videoId) {
    return (
      <div data-testid="lesson-video" className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
        <div className="flex aspect-video items-center justify-center bg-zinc-900">
          <div className="text-center">
            <Film className="mx-auto h-12 w-12 text-zinc-700" />
            <p className="mt-3 text-sm text-zinc-600">{t("not_available")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-zinc-800 px-5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Film className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-zinc-300">{t("label")}</span>
          <span className="text-xs text-zinc-600">—</span>
          <span className="text-xs text-zinc-500">{t("unavailable")}</span>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="lesson-video" className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
      <div className="relative aspect-video">
        <div ref={containerRef} className={`h-full w-full ${ended ? "invisible" : ""}`} />
        {!ready && !ended && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        )}
        {ended && (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-800 px-5 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
          <Film className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-sm font-medium text-zinc-300">{t("label")}</span>
        <span className="text-xs text-zinc-600">—</span>
        <span className="text-xs text-zinc-500">{t("youtube")}</span>
      </div>

    </div>
  );
}
