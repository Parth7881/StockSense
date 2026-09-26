import type { ReactNode } from "react";

import { ToastProvider } from "@/components/ui/toast";

import { AppHeader, type ShellUser } from "./app-header";
import { Brand } from "./brand";
import { SidebarNav } from "./sidebar-nav";

export function AppShell({ user, children }: { user: ShellUser; children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-svh bg-background text-foreground lg:grid lg:grid-cols-[15rem_1fr]">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 overflow-y-auto border-r bg-sidebar px-4 py-5 lg:block">
          <Brand />
          <div className="mt-10"><SidebarNav /></div>
          <div className="mt-10 border-t px-3 pt-5 text-xs leading-5 text-muted-foreground">Main Warehouse<br /><span className="font-mono text-[11px]">LOCAL / MAIN</span></div>
        </aside>
        <div className="min-w-0 lg:col-start-2">
          <AppHeader user={user} />
          <main className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
