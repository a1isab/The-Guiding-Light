import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Sparkles, Star, TrendingUp } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function LandingPage() {
  const sb = await createServerSupabaseClient();
  const { data: { user } } = await sb.auth.getUser();
  const loggedIn = !!user;

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            AI-Powered Islamic Education
          </div>
          <h1 className="font-amiri text-5xl font-bold leading-tight text-zinc-100 sm:text-6xl lg:text-7xl">
            Your AI-Powered Guide to
            <span className="text-emerald-400"> Islamic Learning</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            The Guiding Light offers free, structured Islamic courses powered by AI.
            Learn at your own pace with personalized quizzes, smart search, and a supportive community.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={loggedIn ? "/courses" : "/auth/signup"}
              className="rounded-2xl bg-emerald-500 px-8 py-3 text-base font-medium text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all"
            >
              {loggedIn ? "Go to Courses" : "Start Learning Free"}
            </Link>
            {!loggedIn && (
              <Link
                href="/auth/login"
                className="rounded-2xl border border-zinc-700 bg-zinc-900/50 px-8 py-3 text-base font-medium text-zinc-300 hover:bg-zinc-800 transition-all"
              >
                I already have an account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-800/50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-amiri text-3xl font-bold text-zinc-100">
            Why The Guiding Light?
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 hover:border-emerald-800/50 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <BookOpen className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">Structured Courses</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Curated lessons from beginner to advanced, covering Aqeedah, Fiqh, Arabic, and more.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 hover:border-emerald-800/50 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Sparkles className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">AI-Powered Learning</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Smart search, AI-powered quizzes, and personalized recommendations.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 hover:border-emerald-800/50 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Star className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">Free for Everyone</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Core courses are completely free. Premium features are optional and affordable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-zinc-800/50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-amiri text-3xl font-bold text-zinc-100">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-4">
            {[
              { step: "01", title: "Sign Up", desc: "Create your free account in seconds." },
              { step: "02", title: "Choose a Course", desc: "Pick from beginner to advanced topics." },
              { step: "03", title: "Learn & Review", desc: "Watch lessons, take quizzes, track progress." },
              { step: "04", title: "Track Progress", desc: "Monitor your learning journey and streak." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-emerald-400 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-200">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="border-t border-zinc-800/50 px-4 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-amiri text-3xl font-bold text-zinc-100">
            Start Your Journey Today
          </h2>
          <p className="mt-3 text-zinc-400">
            Choose from our growing library of Islamic courses.
          </p>
          <Link
            href="/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3 text-base font-medium text-white hover:bg-emerald-400 transition-all"
          >
            Browse All Courses <TrendingUp className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-[#111111] p-12 text-center">
          <h2 className="font-amiri text-3xl font-bold text-zinc-100">
            Ready to Learn?
          </h2>
          <p className="mt-3 text-zinc-400">
            Join thousands of students on the path of knowledge.
          </p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-block rounded-2xl bg-emerald-500 px-8 py-3 text-base font-medium text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
