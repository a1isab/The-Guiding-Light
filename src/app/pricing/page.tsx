import Link from "next/link";
import { Check, Sparkles, Crown } from "lucide-react";

const freeFeatures = [
  "Access to all core courses",
  "AI-generated quizzes",
  "AI-generated quizzes",
  "Basic progress tracking",
  "Learning streak",
];

const premiumFeatures = [
  "Everything in Free",
  "Unlimited AI quiz attempts",
  "Advanced analytics & insights",
  "Priority support",
  "Downloadable lesson PDFs",
  "Community access",
  "Ad-free experience",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="font-amiri text-4xl font-bold text-zinc-100">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-3 text-zinc-400">
          All core courses are free. Upgrade for premium features.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">Free</h2>
              <p className="text-3xl font-bold text-zinc-100 mt-1">$0</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500">Perfect for getting started on your learning journey.</p>
          <ul className="mt-6 space-y-3">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signup"
            className="mt-8 block w-full text-center rounded-2xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            Get Started Free
          </Link>
        </div>

        {/* Premium */}
        <div className="relative rounded-2xl border border-amber-800 bg-[#111111] p-8 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-white">
            Recommended
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">Premium</h2>
              <p className="text-3xl font-bold text-zinc-100 mt-1">
                $9<span className="text-base font-normal text-zinc-500">/month</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500">Unlock the full potential of AI-powered Islamic learning.</p>
          <ul className="mt-6 space-y-3">
            {premiumFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signup"
            className="mt-8 block w-full text-center rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </div>
  );
}
