"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { inventoryDocumentSchema } from "./schemas";

const routes = { receipt: "receipts", delivery: "deliveries", internal_transfer: "transfers", adjustment: "adjustments" } as const;
function value(formData: FormData, name: string) { const entry = formData.get(name); return typeof entry === "string" ? entry : ""; }
function routeFor(type: keyof typeof routes) { return `/operations/${routes[type]}`; }

export async function createInventoryDocumentAction(formData: FormData) {
  const parsed = inventoryDocumentSchema.safeParse({
    type: value(formData, "type"), productId: value(formData, "productId"), quantity: value(formData, "quantity"),
    sourceLocationId: value(formData, "sourceLocationId"), destinationLocationId: value(formData, "destinationLocationId"),
    counterpartyName: value(formData, "counterpartyName"), notes: value(formData, "notes"),
  });
  const rawType = value(formData, "type") as keyof typeof routes;
  const path = rawType in routes ? routeFor(rawType) : "/dashboard";
  if (!parsed.success) redirect(`${path}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Check the operation details.")}`);
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect(`/login?next=${encodeURIComponent(path)}`);
  const { error } = await supabase.rpc("create_inventory_document", {
    p_type: parsed.data.type, p_product_id: parsed.data.productId, p_quantity: parsed.data.quantity,
    p_source_location_id: parsed.data.sourceLocationId, p_destination_location_id: parsed.data.destinationLocationId,
    p_counterparty_name: parsed.data.counterpartyName, p_notes: parsed.data.notes,
  });
  if (error) redirect(`${path}?error=${encodeURIComponent("Operation could not be created.")}`);
  revalidatePath(path); revalidatePath("/dashboard");
  redirect(`${path}?success=${encodeURIComponent("Ready operation created. Validate it to update stock.")}`);
}

export async function postInventoryDocumentAction(formData: FormData) {
  const documentId = value(formData, "documentId");
  const type = value(formData, "type") as keyof typeof routes;
  const path = type in routes ? routeFor(type) : "/dashboard";
  if (!/^[0-9a-f-]{36}$/i.test(documentId)) redirect(`${path}?error=${encodeURIComponent("Invalid document.")}`);
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect(`/login?next=${encodeURIComponent(path)}`);
  const { error } = await supabase.rpc("post_inventory_document", { p_document_id: documentId });
  if (error) redirect(`${path}?error=${encodeURIComponent(error.message.includes("Insufficient") ? "Insufficient stock at the selected source." : "Operation could not be validated.")}`);
  revalidatePath(path); revalidatePath("/dashboard"); revalidatePath("/products"); revalidatePath("/moves");
  redirect(`${path}?success=${encodeURIComponent("Operation validated and stock updated atomically.")}`);
}
