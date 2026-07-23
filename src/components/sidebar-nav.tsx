"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Key,
  FileText,
  BarChart3,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  BookOpen,
  Key,
  FileText,
  BarChart3,
};

interface NavItem {
  href: string;
  label: string;
  icon: string;
  testId?: string;
}

export function SidebarNav({
  items,
  children,
}: {
  items: NavItem[];
  children?: React.ReactNode;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    const pathWithoutLocale = pathname.replace(/^\/(en|ar|ur|fr)/, "");
    const hrefWithoutLocale = href.replace(/^\/(en|ar|ur|fr)/, "");
    if (hrefWithoutLocale === "/teacher" || hrefWithoutLocale === "/admin") {
      return pathWithoutLocale === hrefWithoutLocale;
    }
    return pathWithoutLocale.startsWith(hrefWithoutLocale);
  }

  return (
    <aside data-testid="sidebar-nav" className="hidden md:flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-[#0d0d0d] p-4">
      <div className="space-y-1">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.testId}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Link>
          );
        })}
      </div>
      {children && (
        <div className="mt-auto pt-4 border-t border-zinc-800">{children}</div>
      )}
    </aside>
  );
}
