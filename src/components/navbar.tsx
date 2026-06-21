"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import { Logo } from "./logo";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isAuthPage = pathname.startsWith("/auth/");
  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-900">
      <div className="mx-auto h-full max-w-6xl flex items-center justify-between px-4">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <Link
                href="/courses"
                className={`text-sm font-medium ${
                  pathname.startsWith("/courses")
                    ? "text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Courses
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${
                  pathname === "/dashboard"
                    ? "text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
                >
                  <span className="h-6 w-6 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 text-xs font-semibold">
                    {user.email?.[0].toUpperCase()}
                  </span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-zinc-800 rounded-xl shadow-2xl py-1">
                    <p className="px-4 py-2 text-xs text-zinc-500 truncate border-b border-zinc-800">
                      {user.email}
                    </p>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                    >
                      Dashboard
                    </Link>
                    <a
                      href="/auth/logout"
                      className="block px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-zinc-400 hover:text-zinc-200"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-4 py-2 text-sm font-medium"
              >
                Start Free &rarr;
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-400"
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#111111] border-l border-zinc-800 p-6">
            <div className="flex flex-col gap-4 mt-12">
              <Link
                href="/courses"
                className="text-zinc-300 hover:text-emerald-400 text-lg font-medium"
              >
                Courses
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-zinc-300 hover:text-emerald-400 text-lg font-medium"
                >
                  Dashboard
                </Link>
              )}
              {user ? (
                <a
                  href="/auth/logout"
                  className="text-red-400 text-lg font-medium mt-4"
                >
                  Sign out
                </a>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-zinc-300 hover:text-emerald-400 text-lg font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-emerald-500 text-white rounded-xl px-4 py-3 text-center font-medium mt-2"
                  >
                    Start Free &rarr;
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
