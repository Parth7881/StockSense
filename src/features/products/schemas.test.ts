import { describe, expect, it } from "vitest";

import { productSchema, warehouseSchema } from "./schemas";

describe("productSchema", () => {
  it("normalizes a valid product before persistence", () => {
    expect(productSchema.parse({
      name: "  Steel Rod  ",
      sku: " steel-100 ",
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      unitOfMeasure: " kg ",
      reorderLevel: "12.5",
    })).toEqual({
      name: "Steel Rod",
      sku: "STEEL-100",
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      unitOfMeasure: "kg",
      reorderLevel: 12.5,
    });
  });

  it("rejects unsafe SKU characters and negative reorder levels", () => {
    expect(productSchema.safeParse({
      name: "Steel Rod",
      sku: "steel rod!",
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      unitOfMeasure: "kg",
      reorderLevel: "-1",
    }).success).toBe(false);
  });
});

describe("warehouseSchema", () => {
  it("normalizes warehouse and default location codes", () => {
    expect(warehouseSchema.parse({
      name: " North Depot ",
      code: " north_1 ",
      address: " Ludhiana ",
      locationName: " Main Store ",
      locationCode: " store ",
    })).toEqual({
      name: "North Depot",
      code: "NORTH_1",
      address: "Ludhiana",
      locationName: "Main Store",
      locationCode: "STORE",
    });
  });
});
