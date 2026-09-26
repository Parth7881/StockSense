"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/features/auth/actions";

import { MobileNavigation } from "./mobile-navigation";
import { navigationGroups } from "./navigation";

export type ShellUser = { fullName: string; email: string; role: "inventory_manager" | "warehouse_staff" };

function currentLabel(pathname: string) {
  return navigationGroups.flatMap((group) => group.items).find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Workspace";
}

export function AppHeader({ user }: { user: ShellUser }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNavigation />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">StockSense / Inventory</p>
          <p className="mt-0.5 text-sm font-bold">{currentLabel(pathname)}</p>
        </div>
      </div>
      <details className="relative">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-md px-2 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">{user.fullName.slice(0, 1).toUpperCase() || "S"}</span>
          <span className="hidden sm:block">
            <span className="block max-w-40 truncate text-xs font-bold">{user.fullName || user.email}</span>
            <span className="block text-[10px] capitalize text-muted-foreground">{user.role.replace("_", " ")}</span>
          </span>
          <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
        </summary>
        <div className="absolute right-0 mt-2 w-56 border bg-card p-2 shadow-lg">
          <p className="truncate px-2 py-2 text-xs text-muted-foreground">{user.email}</p>
          <form action={logoutAction}>
            <button className="min-h-11 w-full rounded-sm px-2 text-left text-sm font-semibold hover:bg-muted" type="submit">Sign out</button>
          </form>
        </div>
      </details>
    </header>
  );
}
