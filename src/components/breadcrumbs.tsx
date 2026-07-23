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
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
            {isLast || !item.href ? (
              <span className="text-zinc-300 font-medium max-w-[180px] truncate">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-zinc-500 hover:text-emerald-400 transition-colors max-w-[180px] truncate"
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
