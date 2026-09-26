"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Brand } from "./brand";
import { SidebarNav } from "./sidebar-nav";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-expanded={open} aria-label="Open navigation" className="grid size-11 place-items-center rounded-md border bg-card lg:hidden" onClick={() => setOpen(true)} type="button">
        <Menu aria-hidden="true" className="size-5" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation overlay" className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} type="button" />
          <aside className="absolute inset-y-0 left-0 w-[min(19rem,88vw)] overflow-y-auto border-r bg-sidebar p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <Brand />
              <button aria-label="Close navigation" className="grid size-11 place-items-center" onClick={() => setOpen(false)} type="button"><X aria-hidden="true" className="size-5" /></button>
            </div>
            <div className="mt-9"><SidebarNav onNavigate={() => setOpen(false)} /></div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
