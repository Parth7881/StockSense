import { z } from "zod";

const optionalUuid = z.string().trim().transform((value) => value || null).pipe(z.string().uuid().nullable());

export const inventoryDocumentSchema = z.object({
  type: z.enum(["receipt", "delivery", "internal_transfer", "adjustment"]),
  productId: z.string().uuid("Choose a product."),
  quantity: z.coerce.number().positive("Quantity must be greater than zero."),
  sourceLocationId: optionalUuid,
  destinationLocationId: optionalUuid,
  counterpartyName: z.string().trim().max(160).transform((value) => value || null),
  notes: z.string().trim().max(500).transform((value) => value || null),
}).superRefine((value, context) => {
  if ((value.type === "delivery" || value.type === "internal_transfer") && !value.sourceLocationId) {
    context.addIssue({ code: "custom", path: ["sourceLocationId"], message: "Choose a source location." });
  }
  if ((value.type === "receipt" || value.type === "internal_transfer" || value.type === "adjustment") && !value.destinationLocationId) {
    context.addIssue({ code: "custom", path: ["destinationLocationId"], message: "Choose a destination location." });
  }
  if (value.type === "internal_transfer" && value.sourceLocationId === value.destinationLocationId) {
    context.addIssue({ code: "custom", path: ["destinationLocationId"], message: "Destination must differ from source." });
  }
});

export type InventoryDocumentInput = z.infer<typeof inventoryDocumentSchema>;
