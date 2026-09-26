import { describe, expect, it } from "vitest";

import { inventoryDocumentSchema } from "./schemas";

const base = {
  productId: "550e8400-e29b-41d4-a716-446655440000",
  quantity: "10",
  counterpartyName: "Acme Industries",
  notes: "Priority movement",
};

describe("inventoryDocumentSchema", () => {
  it("requires a destination for a receipt", () => {
    const result = inventoryDocumentSchema.safeParse({
      ...base,
      type: "receipt",
      sourceLocationId: "",
      destinationLocationId: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires different source and destination locations for a transfer", () => {
    const locationId = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    const result = inventoryDocumentSchema.safeParse({
      ...base,
      type: "internal_transfer",
      sourceLocationId: locationId,
      destinationLocationId: locationId,
    });
    expect(result.success).toBe(false);
  });

  it("normalizes a valid delivery payload", () => {
    expect(inventoryDocumentSchema.parse({
      ...base,
      type: "delivery",
      sourceLocationId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      destinationLocationId: "",
      quantity: "3.5",
    })).toMatchObject({
      type: "delivery",
      quantity: 3.5,
      destinationLocationId: null,
    });
  });
});
