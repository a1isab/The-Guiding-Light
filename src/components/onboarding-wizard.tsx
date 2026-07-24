"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { UserPlus, GraduationCap, User, KeyRound, Loader2 } from "lucide-react";

interface OnboardingWizardProps {
  locale: string;
  role: string;
}

export function OnboardingWizard({ locale, role: initialRole }: OnboardingWizardProps) {
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
        emailRedirectTo: `${siteUrl}/${locale}/auth/callback?next=/${locale}/dashboard`,
      },
    });

    if (signUpError) {
      setSignupError(signUpError.message);
      setSubmitting(false);
      return;
    }

    const codeRes = await fetch("/api/auth/generate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!codeRes.ok) {
      setSignupError("Failed to generate verification code");
      setSubmitting(false);
      return;
    }

    const { token } = await codeRes.json();

    const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");

    sessionStorage.setItem("sv_email", email);
    sessionStorage.setItem("sv_code", code);
    sessionStorage.setItem("sv_password", password);
    sessionStorage.setItem("sv_token", token);
    sessionStorage.setItem("wiz_role", signupRole);
    router.push(`/${locale}/auth/verify`);
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div data-testid="onboarding-wizard" className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-lg">
        <div data-testid={`onboarding-step-${step}`} className="mb-8 text-center">
          <p className="text-sm text-zinc-500 mb-2">
            {step + 1} / {totalSteps}
          </p>
          <div className="flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-8 bg-emerald-500" : i < step ? "w-4 bg-emerald-500/50" : "w-4 bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8">
          {step === 0 && (
            <div>
              <h2 className="font-amiri text-2xl font-bold text-zinc-100 mb-1 text-center">
                {authenticated ? "Welcome to The Guiding Light" : "Create your account"}
              </h2>
              <p className="text-zinc-500 text-center text-sm mb-6">
                {authenticated ? "Let's personalize your learning experience" : "Start your journey of Islamic learning"}
              </p>

              {!authenticated && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label htmlFor="wiz-email" className="block text-sm font-medium text-zinc-400">
                      Email
                    </label>
                    <input
                      id="wiz-email"
                      data-testid="wiz-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="wiz-password" className="block text-sm font-medium text-zinc-400">
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
                      className="mt-1 block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Min 6 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      I want to
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        data-testid="wiz-role-student"
                        onClick={() => setSignupRole("student")}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          signupRole === "student"
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"
                        }`}
                      >
                        <User className="h-4 w-4" />
                        Learn
                      </button>
                      <button
                        type="button"
                        data-testid="wiz-role-teacher"
                        onClick={() => setSignupRole("teacher")}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          signupRole === "teacher"
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"
                        }`}
                      >
                        <GraduationCap className="h-4 w-4" />
                        Teach
                      </button>
                    </div>
                  </div>

                  {signupRole === "teacher" && (
                    <div>
                      <label htmlFor="wiz-invite" className="block text-sm font-medium text-zinc-400">
                        Teacher Invite Code
                      </label>
                      <div className="relative mt-1">
                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                          id="wiz-invite"
                          data-testid="wiz-invite-code"
                          type="text"
                          required
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          className="block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 pl-10 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Enter your invite code"
                        />
                      </div>
                    </div>
                  )}

                  {signupError && (
                    <p data-testid="wiz-signup-error" className="text-sm text-red-400">{signupError}</p>
                  )}
                </form>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">What should we call you?</h2>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {step === 2 && isStudent && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">What's your knowledge level?</h2>
              <div className="space-y-2">
                {(["beginner", "intermediate", "advanced"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      level === l
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && !isStudent && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">What subjects do you teach?</h2>
              <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="e.g., Quran, Fiqh, Arabic"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {step === 3 && isStudent && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">What topics interest you?</h2>
              <div className="flex flex-wrap gap-2">
                {["Quran", "Hadith", "Fiqh", "Aqeedah", "Seerah", "Arabic"].map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                      interests.includes(interest)
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && !isStudent && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Experience level</h2>
              <div className="space-y-2">
                {(["beginner", "intermediate", "advanced"] as const).map((e) => (
                  <button
                    key={e}
                    onClick={() => setExperience(e)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      experience === e
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {e === "beginner" ? "New Teacher" : e === "intermediate" ? "Experienced" : "Veteran Educator"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && isStudent && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">What are your learning goals?</h2>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="What do you hope to achieve?"
                rows={4}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {(step > 0 || authenticated) && step < totalSteps - 1 ? (
            <button
              onClick={handleSkip}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
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
                className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 transition-all"
              >
                Previous
              </button>
            )}

            {step === 0 && !authenticated ? (
              <button
                onClick={handleSignup}
                disabled={submitting || !email || !password}
                data-testid="wiz-signup-submit"
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all inline-flex items-center gap-2"
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
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={submitting || !displayName}
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
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
