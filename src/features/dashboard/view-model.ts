export type DashboardCounts = {
  productCount: number;
  totalStock: number;
  lowStockCount: number;
  warehouseCount: number;
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
      label: "Total stock",
      value: numberFormatter.format(counts.totalStock),
      tone: "success",
    },
    {
      label: "Low stock",
      value: numberFormatter.format(counts.lowStockCount),
      tone: counts.lowStockCount > 0 ? "attention" : "success",
    },
    {
      label: "Active warehouses",
      value: numberFormatter.format(counts.warehouseCount),
      tone: "neutral",
    },
  ];
}
