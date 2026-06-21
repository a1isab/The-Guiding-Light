import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-zinc-900 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <span
              className="font-['Amiri'] text-emerald-400 text-xl"
              dir="rtl"
            >
              النور المبين
            </span>
            <p className="text-zinc-500 text-sm mt-2">
              AI-Powered Islamic Learning for Everyone
            </p>
          </div>
          <div>
            <h4 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              Links
            </h4>
            <div className="space-y-2">
              <Link
                href="/courses"
                className="block text-zinc-500 hover:text-zinc-300 text-sm"
              >
                Courses
              </Link>
              <Link
                href="/pricing"
                className="block text-zinc-500 hover:text-zinc-300 text-sm"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              About
            </h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Free, structured Islamic education powered by AI. Built for every
              Muslim, everywhere.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-zinc-800 text-center text-zinc-600 text-sm">
          &copy; {new Date().getFullYear()} The Guiding Light. Made with &hearts;
          for the sake of Allah.
        </div>
      </div>
    </footer>
  );
}
