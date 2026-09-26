import { cn } from "@/lib/utils";
import type { DashboardKpi } from "@/features/dashboard/view-model";

export function KpiBlock({ label, value, tone }: DashboardKpi) {
  return (
    <div className="border-t-2 border-border py-5" data-tone={tone}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          aria-hidden="true"
          className={cn(
            "size-2 rounded-full",
            tone === "attention" && "bg-amber-500",
            tone === "success" && "bg-emerald-600",
            tone === "neutral" && "bg-stone-300",
          )}
        />
      </div>
      <p className="quantity mt-3 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
