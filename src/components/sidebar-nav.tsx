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
    <aside
      data-testid="sidebar-nav"
      className="hidden md:flex w-64 shrink-0 flex-col p-4"
      style={{
        borderRight: "1px solid var(--border)",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <div className="space-y-1">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.testId}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Link>
          );
        })}
      </div>
      {children && (
        <div className="mt-auto pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          {children}
        </div>
      )}
    </aside>
  );
}
