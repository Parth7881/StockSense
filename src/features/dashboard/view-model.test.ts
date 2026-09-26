import { describe, expect, it } from "vitest";

import { buildDashboardView } from "./view-model";

describe("buildDashboardView", () => {
  it("keeps zero database counts truthful instead of inventing sample metrics", () => {
    expect(
      buildDashboardView({
        productCount: 0,
        lowStockCount: 0,
        pendingDocumentCount: 0,
        movementCount: 0,
      }),
    ).toEqual([
      { label: "Active products", value: "0", tone: "neutral" },
      { label: "Low stock", value: "0", tone: "success" },
      { label: "Pending operations", value: "0", tone: "neutral" },
      { label: "Movements today", value: "0", tone: "neutral" },
    ]);
  });

  it("marks low stock and pending work as attention states", () => {
    const view = buildDashboardView({
      productCount: 1284,
      lowStockCount: 7,
      pendingDocumentCount: 12,
      movementCount: 42,
    });

    expect(view).toEqual([
      { label: "Active products", value: "1,284", tone: "neutral" },
      { label: "Low stock", value: "7", tone: "attention" },
      { label: "Pending operations", value: "12", tone: "attention" },
      { label: "Movements today", value: "42", tone: "neutral" },
    ]);
  });
});
