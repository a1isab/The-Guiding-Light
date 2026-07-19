"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export function SignOutButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("teacher");

  async function handleSignOut() {
    await fetch(`/${locale}/auth/logout`, { method: "POST" });
    router.refresh();
    router.push(`/${locale}/auth/login`);
  }

  return (
    <button onClick={handleSignOut} className={className} type="button">
      {children ?? t("sign_out")}
    </button>
  );
}
