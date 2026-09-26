import { AlertTriangle, Boxes, CircleDollarSign, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardKpi } from "@/features/dashboard/view-model";

export function KpiBlock({ label, value, tone }: DashboardKpi) {
  const Icon = label === "Active products" ? Boxes : label === "Total stock" ? CircleDollarSign : label === "Low stock" ? AlertTriangle : Warehouse;
  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-sm shadow-slate-200/40", tone === "attention" && "border-red-100 bg-red-50/55", tone === "success" && "border-emerald-100 bg-emerald-50/45")} data-tone={tone}>
      <div className="flex items-start gap-3">
        <span className={cn("grid size-9 place-items-center rounded-lg bg-blue-50 text-primary", tone === "attention" && "bg-red-100 text-red-600", tone === "success" && "bg-emerald-100 text-emerald-700")}><Icon aria-hidden="true" className="size-[18px]" /></span>
        <p className="pt-2 text-xs font-semibold text-muted-foreground">{label}</p>
      </div>
      <p className="quantity mt-4 text-2xl font-bold text-foreground">{value}</p>
      <p className={cn("mt-2 text-[11px] font-medium text-muted-foreground", tone === "attention" && "text-red-500", tone === "success" && "text-emerald-700")}>{tone === "attention" ? "Requires attention" : tone === "success" ? "Updated from live stock" : "All operational"}</p>
    </div>
  );
}
