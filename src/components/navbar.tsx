"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient, getUserRoleClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import { Logo } from "./logo";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "ur", label: "اردو" },
  { code: "fr", label: "Français" },
];

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments.length > 0 && LOCALES.some((l) => l.code === segments[0])
    ? segments[0]
    : "en";

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        getUserRoleClient(supabase).then(setUserRole);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getUserRoleClient(supabase).then(setUserRole);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setLangOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAuthPage = pathname.split("/").filter(Boolean).some((s) => s === "auth");
  if (isAuthPage) return null;

  function switchLocale(code: string) {
    setPendingLocale(code);
    setShowWarning(true);
  }

  function confirmLocale() {
    if (!pendingLocale) return;
    const rest = segments.slice(1).join("/");
    window.location.href = "/" + pendingLocale + (rest ? "/" + rest : "");
    setShowWarning(false);
    setPendingLocale(null);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-900">
      <div className="mx-auto h-full max-w-6xl flex items-center justify-between px-4">
        <Logo />

        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="rounded-xl border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all"
            >
              {LOCALES.find((l) => l.code === currentLocale)?.label || "English"}
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#111111] border border-zinc-800 rounded-xl shadow-2xl py-1">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => switchLocale(loc.code)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      loc.code === currentLocale
                        ? "text-emerald-400"
                        : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? null : user ? (
            <>
              {!userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/courses"}
                  className={`text-sm font-medium ${
                    pathname.includes("/courses")
                      ? "text-emerald-400"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {t("courses")}
                </Link>
              )}
              {!userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/dashboard"}
                  className={`text-sm font-medium ${
                    pathname.includes("/dashboard")
                      ? "text-emerald-400"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {t("dashboard")}
                </Link>
              )}
              {(userRole?.includes("teacher") || userRole?.includes("admin")) && (
                <Link
                  href={"/" + currentLocale + "/teacher"}
                  className={`text-sm font-medium ${
                    pathname.includes("/teacher")
                      ? "text-emerald-400"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Teacher
                </Link>
              )}
              {userRole?.includes("admin") && (
                <Link
                  href={"/" + currentLocale + "/admin"}
                  className={`text-sm font-medium ${
                    pathname.includes("/admin")
                      ? "text-emerald-400"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Admin
                </Link>
              )}
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
                    {!userRole?.includes("teacher") && (
                      <Link
                        href={"/" + currentLocale + "/dashboard"}
                        className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                      >
                        {t("dashboard")}
                      </Link>
                    )}
              {(userRole?.includes("teacher") || userRole?.includes("admin")) && (
                <Link
                  href={"/" + currentLocale + "/teacher"}
                  className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  Teacher
                </Link>
              )}
              {userRole?.includes("admin") && (
                <Link
                  href={"/" + currentLocale + "/admin"}
                  className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  Admin
                </Link>
              )}
                    <a
                      href={"/" + currentLocale + "/auth/logout"}
                      className="block px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                    >
                      {t("sign_out")}
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href={"/" + currentLocale + "/auth/login"}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-200"
              >
                {t("sign_in")}
              </Link>
              <Link
                href={"/" + currentLocale + "/auth/signup"}
                className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-4 py-2 text-sm font-medium"
              >
                {t("start_free")}
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-400"
          aria-label={t("menu")}
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
              {/* Language switcher in mobile */}
              <div className="flex flex-wrap gap-2 mb-4">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => switchLocale(loc.code)}
                    className={`text-sm px-3 py-1 rounded-lg border transition-colors ${
                      loc.code === currentLocale
                        ? "border-emerald-500 text-emerald-400"
                        : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>

              {!userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/courses"}
                  className="text-zinc-300 hover:text-emerald-400 text-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("courses")}
                </Link>
              )}
              {user && !userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/dashboard"}
                  className="text-zinc-300 hover:text-emerald-400 text-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("dashboard")}
                </Link>
              )}
              {(userRole?.includes("teacher") || userRole?.includes("admin")) && (
                <Link
                  href={"/" + currentLocale + "/teacher"}
                  className="text-zinc-300 hover:text-emerald-400 text-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Teacher
                </Link>
              )}
              {userRole?.includes("admin") && (
                <Link
                  href={"/" + currentLocale + "/admin"}
                  className="text-zinc-300 hover:text-emerald-400 text-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user ? (
                <a
                  href={"/" + currentLocale + "/auth/logout"}
                  className="text-red-400 text-lg font-medium mt-4"
                >
                  {t("sign_out")}
                </a>
              ) : (
                <>
                  <Link
                    href={"/" + currentLocale + "/auth/login"}
                    className="text-zinc-300 hover:text-emerald-400 text-lg font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("sign_in")}
                  </Link>
                  <Link
                    href={"/" + currentLocale + "/auth/signup"}
                    className="bg-emerald-500 text-white rounded-xl px-4 py-3 text-center font-medium mt-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("start_free")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Translation warning modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowWarning(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-[#1a1a1a] p-6 text-center shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100">Translation Notice</h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Lesson content and quiz questions may use automated translations.
              Some nuances may not be fully accurate.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={() => setShowWarning(false)}
                className="rounded-xl border border-zinc-700 px-5 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLocale}
                className="rounded-xl bg-emerald-500 px-5 py-2 text-sm text-white hover:bg-emerald-400 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
