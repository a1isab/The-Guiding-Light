"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      data-testid="breadcrumbs"
      className="mb-6 flex items-center gap-1.5 text-sm overflow-hidden"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />}
            {isLast || !item.href ? (
              <span className="font-medium max-w-[180px] truncate" style={{ color: "var(--text-primary)" }}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors max-w-[180px] truncate"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--success)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
