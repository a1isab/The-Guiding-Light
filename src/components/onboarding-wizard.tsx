"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OnboardingWizardProps {
  locale: string;
  role: string;
}

export function OnboardingWizard({ locale, role }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState("");
  const [subjects, setSubjects] = useState("");
  const [experience, setExperience] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const isStudent = role === "student";
  const steps = isStudent
    ? ["welcome", "name", "level", "interests", "goals"]
    : ["welcome", "name", "subjects", "experience"];

  const totalSteps = steps.length;

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
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
        router.push(`/${locale}/dashboard`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    router.push(`/${locale}/dashboard`);
  }

  return (
    <div data-testid="onboarding-wizard" className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-lg">
        {/* Step Indicator */}
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

        {/* Step Content */}
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8">
          {step === 0 && (
            <div className="text-center">
              <h1 className="font-amiri text-2xl font-bold text-zinc-100 mb-2">
                Welcome to The Guiding Light
              </h1>
              <p className="text-zinc-500">Let's personalize your learning experience</p>
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

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip for now
          </button>

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 transition-all"
              >
                Previous
              </button>
            )}

            {step < totalSteps - 1 ? (
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
