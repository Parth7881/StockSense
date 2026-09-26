import { describe, expect, it } from "vitest";

import { buildDashboardView } from "./view-model";

describe("buildDashboardView", () => {
  it("keeps zero database counts truthful instead of inventing sample metrics", () => {
    expect(
      buildDashboardView({
        productCount: 0,
        totalStock: 0,
        lowStockCount: 0,
        warehouseCount: 0,
      }),
    ).toEqual([
      { label: "Active products", value: "0", tone: "neutral" },
      { label: "Total stock", value: "0", tone: "success" },
      { label: "Low stock", value: "0", tone: "success" },
      { label: "Active warehouses", value: "0", tone: "neutral" },
    ]);
  });

  it("marks low stock and pending work as attention states", () => {
    const view = buildDashboardView({
      productCount: 1284,
      totalStock: 284320,
      lowStockCount: 7,
      warehouseCount: 4,
    });

    expect(view).toEqual([
      { label: "Active products", value: "1,284", tone: "neutral" },
      { label: "Total stock", value: "2,84,320", tone: "success" },
      { label: "Low stock", value: "7", tone: "attention" },
      { label: "Active warehouses", value: "4", tone: "neutral" },
    ]);
  });
});
