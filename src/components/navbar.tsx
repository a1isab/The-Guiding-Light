"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient, getUserRoleClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "./logo";
import { Settings, Sparkles, Map, BadgeCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const SiteTour = dynamic(() => import("@/components/site-tour").then((m) => m.SiteTour), { ssr: false });

function triggerTour() {
  (window as unknown as { __siteTourStart?: () => void }).__siteTourStart?.();
}

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
  const [prevPathname, setPrevPathname] = useState(pathname);
  const langRef = useRef<HTMLDivElement>(null);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setDropdownOpen(false);
    setLangOpen(false);
  }

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
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-primary) 80%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto h-full max-w-6xl flex items-center justify-between px-4">
        <Logo />

        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="rounded-xl px-3 py-1.5 text-xs transition-all"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              {LOCALES.find((l) => l.code === currentLocale)?.label || "English"}
            </button>
            {langOpen && (
              <div
                className="absolute right-0 mt-2 w-36 rounded-xl shadow-2xl py-1"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
              >
                {LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => switchLocale(loc.code)}
                    className="w-full text-left px-4 py-2 text-sm transition-colors"
                    style={{
                      color: loc.code === currentLocale ? "var(--accent)" : "var(--text-secondary)",
                    }}
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
                  href={"/" + currentLocale + "/featured"}
                  data-nav="featured"
                  className="text-sm font-medium transition-colors flex items-center gap-1.5"
                  style={{
                    color: pathname.includes("/featured") ? "var(--accent)" : "var(--text-secondary)",
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("featured", { defaultMessage: "Featured" })}
                </Link>
              )}
              {!userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/dashboard"}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: pathname.includes("/dashboard") && !pathname.includes("/classes") ? "var(--accent)" : "var(--text-secondary)",
                  }}
                >
                  {t("dashboard")}
                </Link>
              )}
              {user && !userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/dashboard/classes"}
                  data-testid="nav-my-classes"
                  data-section="my-classes"
                  className="text-sm font-medium transition-colors flex items-center gap-1.5"
                  style={{
                    color: pathname.includes("/dashboard/classes") ? "var(--accent)" : "var(--text-secondary)",
                  }}
                >
                  <Users className="h-3.5 w-3.5" />
                  {t("my_classes")}
                </Link>
              )}
              {(userRole?.includes("teacher") || userRole?.includes("admin")) && (
                <Link
                  href={"/" + currentLocale + "/teacher"}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: pathname.includes("/teacher") ? "var(--accent)" : "var(--text-secondary)",
                  }}
                >
                  Teacher
                </Link>
              )}
              {userRole?.includes("admin") && (
                <Link
                  href={"/" + currentLocale + "/admin"}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: pathname.includes("/admin") ? "var(--accent)" : "var(--text-secondary)",
                  }}
                >
                  Admin
                </Link>
              )}
              <div className="relative">
                <button
                  data-testid="user-menu-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition-all"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-primary)",
                  }}
                >
                  <span
                    className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--glow-subtle)",
                      color: "var(--accent)",
                    }}
                  >
                    {user.email?.[0].toUpperCase()}
                  </span>
                  {userRole?.includes("verified_teacher") && (
                    <BadgeCheck className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  )}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl py-1"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p
                      className="px-4 py-2 text-xs truncate"
                      style={{
                        color: "var(--text-muted)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {user.email}
                    </p>
                    {!userRole?.includes("teacher") && (
                      <Link
                        href={"/" + currentLocale + "/dashboard"}
                        className="block px-4 py-2 text-sm transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {t("dashboard")}
                      </Link>
                    )}
                    {(userRole?.includes("teacher") || userRole?.includes("admin")) && (
                      <Link
                        href={"/" + currentLocale + "/teacher"}
                        className="block px-4 py-2 text-sm transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Teacher
                      </Link>
                    )}
                    {userRole?.includes("admin") && (
                      <Link
                        href={"/" + currentLocale + "/admin"}
                        className="block px-4 py-2 text-sm transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      href={"/" + currentLocale + "/settings"}
                      className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Settings className="h-4 w-4" />
                      {t("settings")}
                    </Link>
                    <button
                      onClick={triggerTour}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Map className="h-4 w-4" />
                      Tour
                    </button>
                    <SignOutButton className="block w-full px-4 py-2 text-sm text-left transition-colors" style={{ color: "var(--error)" }} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" href={"/" + currentLocale + "/auth/login"}>
                {t("sign_in")}
              </Button>
              <Button href={"/" + currentLocale + "/onboarding"}>
                {t("start_free")}
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          style={{ color: "var(--text-secondary)" }}
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
          <div
            className="absolute right-0 top-0 h-full w-72 p-6"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderLeft: "1px solid var(--border)",
            }}
          >
            <div className="flex flex-col gap-4 mt-12">
              {/* Language switcher in mobile */}
              <div className="flex flex-wrap gap-2 mb-4">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => switchLocale(loc.code)}
                    className="text-sm px-3 py-1 rounded-lg transition-colors"
                    style={{
                      border: `1px solid ${loc.code === currentLocale ? "var(--accent)" : "var(--border)"}`,
                      color: loc.code === currentLocale ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>

              {!userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/featured"}
                  className="text-lg font-medium transition-colors flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Sparkles className="h-4 w-4" />
                  {t("featured", { defaultMessage: "Featured" })}
                </Link>
              )}
              {user && !userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/dashboard"}
                  className="text-lg font-medium transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("dashboard")}
                </Link>
              )}
              {user && !userRole?.includes("teacher") && (
                <Link
                  href={"/" + currentLocale + "/dashboard/classes"}
                  className="text-lg font-medium transition-colors flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Users className="h-4 w-4" />
                  {t("my_classes")}
                </Link>
              )}
              {(userRole?.includes("teacher") || userRole?.includes("admin")) && (
                <Link
                  href={"/" + currentLocale + "/teacher"}
                  className="text-lg font-medium transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Teacher
                </Link>
              )}
              {user && userRole?.includes("teacher") && !userRole?.includes("verified_teacher") && (
                <Link
                  href={"/" + currentLocale + "/teacher/verify"}
                  className="text-lg font-medium transition-colors"
                  style={{ color: "var(--accent)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Verify
                </Link>
              )}
              {userRole?.includes("admin") && (
                <Link
                  href={"/" + currentLocale + "/admin"}
                  className="text-lg font-medium transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user ? (
                <SignOutButton className="text-lg font-medium mt-4" style={{ color: "var(--error)" }} />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    href={"/" + currentLocale + "/auth/login"}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("sign_in")}
                  </Button>
                  <Button
                    href={"/" + currentLocale + "/onboarding"}
                    className="w-full justify-center mt-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("start_free")}
                  </Button>
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
          <div
            className="relative w-full max-w-md rounded-2xl p-6 text-center shadow-2xl"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-elevated)",
            }}
          >
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Translation Notice
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Lesson content and quiz questions may use automated translations.
              Some nuances may not be fully accurate.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setShowWarning(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmLocale}>
                  Continue
                </Button>
            </div>
          </div>
        </div>
      )}

      <SiteTour role={userRole} />
    </nav>
  );
}
