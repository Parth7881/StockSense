import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  waiting: { label: "Waiting", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  ready: { label: "Ready", className: "bg-blue-50 text-blue-800 ring-blue-200" },
  done: { label: "Done", className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  canceled: { label: "Canceled", className: "bg-stone-100 text-stone-600 ring-stone-200" },
  active: { label: "Active", className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  inactive: { label: "Inactive", className: "bg-stone-100 text-stone-600 ring-stone-200" },
} as const;

export type Status = keyof typeof statusConfig;

export function StatusBadge({ status, className, ...props }: { status: Status } & ComponentProps<"span">) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md px-2 text-xs font-semibold ring-1 ring-inset",
        config.className,
        className,
      )}
      data-status={status}
      {...props}
    >
      {config.label}
    </span>
  );
}
