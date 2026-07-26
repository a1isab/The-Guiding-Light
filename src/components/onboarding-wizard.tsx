"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { UserPlus, GraduationCap, User, KeyRound, Loader2, CheckCircle2 } from "lucide-react";

interface OnboardingWizardProps {
  locale: string;
  role: string;
}

export function OnboardingWizard({ locale, role: initialRole }: OnboardingWizardProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupRole, setSignupRole] = useState<"student" | "teacher">(
    initialRole === "teacher" ? "teacher" : "student"
  );
  const [inviteCode, setInviteCode] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState("");
  const [subjects, setSubjects] = useState("");
  const [experience, setExperience] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const activeRole = authenticated ? initialRole : signupRole;
  const isStudent = activeRole === "student";

  const profileSteps = isStudent
    ? ["welcome", "name", "level", "interests", "goals"]
    : ["welcome", "name", "subjects", "experience"];

  const signupSteps = isStudent
    ? ["name", "level", "interests", "goals"]
    : ["name", "subjects", "experience"];

  const steps = authenticated ? profileSteps : ["account", ...signupSteps];
  const totalSteps = steps.length;

  useEffect(() => {
    const stored = sessionStorage.getItem("wiz_role");
    if (stored === "student" || stored === "teacher") {
      setSignupRole(stored);
    }

    createClient().auth.getUser().then(({ data }) => {
      setAuthenticated(!!data.user);
      setCheckingAuth(false);
    });
  }, []);

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");
    setSubmitting(true);

    if (signupRole === "teacher") {
      if (!inviteCode.trim()) {
        setSignupError("Teacher invite code is required");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/teacher/invites/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });

      const result = await res.json();

      if (!result.valid) {
        setSignupError(result.message || "Invalid invite code");
        setSubmitting(false);
        return;
      }
    }

    const supabase = createClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: signupRole, inviteCode: signupRole === "teacher" ? inviteCode.trim() : "" },
        emailRedirectTo: `${siteUrl}/${locale}/auth/callback?next=/${locale}/onboarding`,
      },
    });

    if (signUpError) {
      setSignupError(signUpError.message);
      setSubmitting(false);
      return;
    }

    setSignupEmail(email);
    setSignupSuccess(true);
    setSubmitting(false);
  }

  async function handleComplete() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          level,
          interests,
          goals,
          subjects,
          experience,
        }),
      });
      if (res.ok) {
        sessionStorage.removeItem("wiz_role");
        router.push(`/${locale}/dashboard`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    sessionStorage.removeItem("wiz_role");
    router.push(`/${locale}/dashboard`);
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--text-muted)" }} />
      </div>
    );
  }

  return (
    <div data-testid="onboarding-wizard" className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full max-w-lg">
        <div data-testid={`onboarding-step-${step}`} className="mb-8 text-center">
          <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
            {step + 1} / {totalSteps}
          </p>
          <div className="flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? "2rem" : "1rem",
                  backgroundColor: i === step
                    ? "var(--accent)"
                    : i < step
                      ? "color-mix(in srgb, var(--accent) 50%, transparent)"
                      : "var(--bg-elevated)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          {signupSuccess ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
                <CheckCircle2 className="h-7 w-7" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>{t("check_email")}</h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {t("check_email_msg", { email: signupEmail })}
              </p>
            </div>
          ) : step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1 text-center" style={{ color: "var(--text-primary)" }}>
                {authenticated ? "Welcome to The Guiding Light" : "Create your account"}
              </h2>
              <p className="text-center text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                {authenticated ? "Let's personalize your learning experience" : "Start your journey of Islamic learning"}
              </p>

              {!authenticated && (
                <>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label htmlFor="wiz-email" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      Email
                    </label>
                    <input
                      id="wiz-email"
                      data-testid="wiz-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)] placeholder:text-[var(--text-muted)]"
                      style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-primary)" }}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="wiz-password" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      Password
                    </label>
                    <input
                      id="wiz-password"
                      data-testid="wiz-password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)] placeholder:text-[var(--text-muted)]"
                      style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-primary)" }}
                      placeholder="Min 6 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                      I want to
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        data-testid="wiz-role-student"
                        onClick={() => setSignupRole("student")}
                        className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all"
                        style={signupRole === "student"
                          ? { borderColor: "color-mix(in srgb, var(--accent) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }
                          : { borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-secondary)" }
                        }
                      >
                        <User className="h-4 w-4" />
                        Learn
                      </button>
                      <button
                        type="button"
                        data-testid="wiz-role-teacher"
                        onClick={() => setSignupRole("teacher")}
                        className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all"
                        style={signupRole === "teacher"
                          ? { borderColor: "color-mix(in srgb, var(--accent) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }
                          : { borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-secondary)" }
                        }
                      >
                        <GraduationCap className="h-4 w-4" />
                        Teach
                      </button>
                    </div>
                  </div>

                  {signupRole === "teacher" && (
                    <div>
                      <label htmlFor="wiz-invite" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                        Teacher Invite Code
                      </label>
                      <div className="relative mt-1">
                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
                        <input
                          id="wiz-invite"
                          data-testid="wiz-invite-code"
                          type="text"
                          required
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          className="block w-full rounded-xl border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[var(--accent)] focus:ring-[var(--accent)] placeholder:text-[var(--text-muted)]"
                          style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-primary)" }}
                          placeholder="Enter your invite code"
                        />
                      </div>
                    </div>
                  )}

                  {signupError && (
                    <p data-testid="wiz-signup-error" className="text-sm" style={{ color: "var(--error)" }}>{signupError}</p>
                  )}
                </form>

                <p className="mt-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  {t("already_have_account")}{" "}
                  <Link href={`/${locale}/auth/login`} className="font-medium transition-colors hover:opacity-80" style={{ color: "var(--accent)" }}>
                    {t("sign_in_link")}
                  </Link>
                </p>
                </>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>What should we call you?</h2>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full rounded-xl border px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none placeholder:text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>
          )}

          {step === 2 && isStudent && (
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>What's your knowledge level?</h2>
              <div className="space-y-2">
                {(["beginner", "intermediate", "advanced"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className="w-full rounded-xl border px-4 py-3 text-left text-sm transition-all"
                    style={level === l
                      ? { borderColor: "var(--accent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }
                      : { borderColor: "var(--bg-elevated)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-secondary)" }
                    }
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && !isStudent && (
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>What subjects do you teach?</h2>
              <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="e.g., Quran, Fiqh, Arabic"
                className="w-full rounded-xl border px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none placeholder:text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>
          )}

          {step === 3 && isStudent && (
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>What topics interest you?</h2>
              <div className="flex flex-wrap gap-2">
                {["Quran", "Hadith", "Fiqh", "Aqeedah", "Seerah", "Arabic"].map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className="rounded-xl border px-4 py-2 text-sm transition-all"
                    style={interests.includes(interest)
                      ? { borderColor: "var(--accent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }
                      : { borderColor: "var(--bg-elevated)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-secondary)" }
                    }
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && !isStudent && (
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Experience level</h2>
              <div className="space-y-2">
                {(["beginner", "intermediate", "advanced"] as const).map((e) => (
                  <button
                    key={e}
                    onClick={() => setExperience(e)}
                    className="w-full rounded-xl border px-4 py-3 text-left text-sm transition-all"
                    style={experience === e
                      ? { borderColor: "var(--accent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }
                      : { borderColor: "var(--bg-elevated)", backgroundColor: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)", color: "var(--text-secondary)" }
                    }
                  >
                    {e === "beginner" ? "New Teacher" : e === "intermediate" ? "Experienced" : "Veteran Educator"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && isStudent && (
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>What are your learning goals?</h2>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="What do you hope to achieve?"
                rows={4}
                className="w-full rounded-xl border px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none resize-none placeholder:text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {(step > 0 || authenticated) && step < totalSteps - 1 ? (
            <button
              onClick={handleSkip}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              Skip for now
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="rounded-xl border px-4 py-2.5 text-sm transition-all hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                Previous
              </button>
            )}

            {step === 0 && !authenticated ? (
              <button
                onClick={handleSignup}
                disabled={submitting || !email || !password}
                data-testid="wiz-signup-submit"
                className="rounded-xl px-6 py-2.5 text-sm font-medium text-white hover:opacity-80 disabled:opacity-50 transition-all inline-flex items-center gap-2"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {submitting ? "Creating account..." : "Create account"}
              </button>
            ) : step < totalSteps - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="rounded-xl px-6 py-2.5 text-sm font-medium text-white hover:opacity-80 transition-all"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={submitting || !displayName}
                className="rounded-xl px-6 py-2.5 text-sm font-medium text-white hover:opacity-80 disabled:opacity-50 transition-all"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {submitting ? "Saving..." : "Complete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
