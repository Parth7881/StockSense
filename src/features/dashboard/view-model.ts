export type DashboardCounts = {
  productCount: number;
  lowStockCount: number;
  pendingDocumentCount: number;
  movementCount: number;
};

export type KpiTone = "neutral" | "success" | "attention";

export type DashboardKpi = {
  label: string;
  value: string;
  tone: KpiTone;
};

const numberFormatter = new Intl.NumberFormat("en-IN");

export function buildDashboardView(counts: DashboardCounts): DashboardKpi[] {
  return [
    {
      label: "Active products",
      value: numberFormatter.format(counts.productCount),
      tone: "neutral",
    },
    {
      label: "Low stock",
      value: numberFormatter.format(counts.lowStockCount),
      tone: counts.lowStockCount > 0 ? "attention" : "success",
    },
    {
      label: "Pending operations",
      value: numberFormatter.format(counts.pendingDocumentCount),
      tone: counts.pendingDocumentCount > 0 ? "attention" : "neutral",
    },
    {
      label: "Movements today",
      value: numberFormatter.format(counts.movementCount),
      tone: "neutral",
    },
  ];
}
