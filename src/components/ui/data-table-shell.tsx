import type { ReactNode } from "react";

export function DataTableShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section aria-label={title}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      <div className="overflow-x-auto border-y bg-card">{children}</div>
    </section>
  );
}
