"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const arabic = "النور المبين";

export function Logo() {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem("logo-animated");
    if (hasAnimated) {
      setDisplayed(arabic);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(arabic.slice(0, i + 1));
      i++;
      if (i === arabic.length) {
        clearInterval(interval);
        sessionStorage.setItem("logo-animated", "true");
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/" className="flex flex-col items-start">
      <span
        className="font-['Amiri'] text-emerald-400 text-xl leading-none"
        dir="rtl"
      >
        {displayed}
      </span>
      <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] hidden sm:block">
        The Guiding Light
      </span>
    </Link>
  );
}
