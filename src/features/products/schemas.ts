import { z } from "zod";

const code = z.string().trim().toUpperCase().regex(/^[A-Z0-9][A-Z0-9._-]{1,39}$/, "Use 2-40 letters, numbers, dots, dashes or underscores.");

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required.").max(160),
  sku: code,
  categoryId: z.string().uuid("Choose a category."),
  unitOfMeasure: z.string().trim().min(1, "Unit is required.").max(30),
  reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative."),
});

export const warehouseSchema = z.object({
  name: z.string().trim().min(1, "Warehouse name is required.").max(100),
  code: code.pipe(z.string().max(20)),
  address: z.string().trim().max(240),
  locationName: z.string().trim().min(1, "Default location name is required.").max(100),
  locationCode: code.pipe(z.string().max(20)),
});

export type ProductInput = z.infer<typeof productSchema>;
export type WarehouseInput = z.infer<typeof warehouseSchema>;
