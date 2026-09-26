"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { isNavigationItemActive, navigationGroups } from "./navigation";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="space-y-7">
      {navigationGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">{group.label}</p>
          <ul className="mt-2 space-y-1">
            {group.items.map((item) => {
              const active = isNavigationItemActive(pathname, item.href);
              const Icon = item.icon;
              if (item.stage > 6) {
                return (
                  <li key={item.href}>
                    <div aria-disabled="true" className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-sm px-3 text-sm font-semibold text-muted-foreground/60" title={`Available in Stage ${item.stage}`}>
                      <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                      <span>{item.label}</span>
                      <span className="ml-auto text-[9px] font-bold uppercase tracking-wider">Next</span>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-primary",
                      active && "bg-sidebar-accent text-primary",
                    )}
                    href={item.href}
                    onClick={onNavigate}
                  >
                    <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
