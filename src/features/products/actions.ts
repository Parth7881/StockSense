"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { productSchema, warehouseSchema } from "./schemas";

function value(formData: FormData, name: string) {
  const entry = formData.get(name);
  return typeof entry === "string" ? entry : "";
}

function withMessage(path: string, key: "error" | "success", message: string) {
  return `${path}?${key}=${encodeURIComponent(message)}`;
}

async function managerClient(path: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  if (!userId) redirect(`/login?next=${encodeURIComponent(path)}`);
  const { data: profile } = await supabase.from("profiles").select("role, is_active").eq("id", userId).maybeSingle();
  if (!profile?.is_active || profile.role !== "inventory_manager") redirect(withMessage(path, "error", "Only inventory managers can make this change."));
  return { supabase, userId };
}

export async function createProductAction(formData: FormData) {
  const path = "/products";
  const parsed = productSchema.safeParse({
    name: value(formData, "name"), sku: value(formData, "sku"), categoryId: value(formData, "categoryId"),
    unitOfMeasure: value(formData, "unitOfMeasure"), reorderLevel: value(formData, "reorderLevel"),
  });
  if (!parsed.success) redirect(withMessage(path, "error", parsed.error.issues[0]?.message ?? "Check the product details."));
  const { supabase, userId } = await managerClient(path);
  const { error } = await supabase.from("products").insert({
    name: parsed.data.name, sku: parsed.data.sku, category_id: parsed.data.categoryId,
    unit_of_measure: parsed.data.unitOfMeasure, reorder_level: parsed.data.reorderLevel, created_by: userId,
  });
  if (error) redirect(withMessage(path, "error", error.code === "23505" ? "That SKU already exists." : "Product could not be created."));
  revalidatePath(path); revalidatePath("/dashboard");
  redirect(withMessage(path, "success", "Product created successfully."));
}

export async function updateProductAction(productId: string, formData: FormData) {
  const path = `/products/${productId}/edit`;
  if (!/^[0-9a-f-]{36}$/i.test(productId)) redirect(withMessage("/products", "error", "Invalid product."));
  const parsed = productSchema.safeParse({
    name: value(formData, "name"), sku: value(formData, "sku"), categoryId: value(formData, "categoryId"),
    unitOfMeasure: value(formData, "unitOfMeasure"), reorderLevel: value(formData, "reorderLevel"),
  });
  if (!parsed.success) redirect(withMessage(path, "error", parsed.error.issues[0]?.message ?? "Check the product details."));
  const { supabase } = await managerClient(path);
  const { error } = await supabase.from("products").update({
    name: parsed.data.name, sku: parsed.data.sku, category_id: parsed.data.categoryId,
    unit_of_measure: parsed.data.unitOfMeasure, reorder_level: parsed.data.reorderLevel,
  }).eq("id", productId);
  if (error) redirect(withMessage(path, "error", error.code === "23505" ? "That SKU already exists." : "Product could not be updated."));
  revalidatePath("/products"); revalidatePath("/dashboard"); revalidatePath(path);
  redirect(withMessage(path, "success", "Product updated successfully."));
}

export async function createWarehouseAction(formData: FormData) {
  const path = "/settings/warehouses";
  const parsed = warehouseSchema.safeParse({
    name: value(formData, "name"), code: value(formData, "code"), address: value(formData, "address"),
    locationName: value(formData, "locationName"), locationCode: value(formData, "locationCode"),
  });
  if (!parsed.success) redirect(withMessage(path, "error", parsed.error.issues[0]?.message ?? "Check the warehouse details."));
  const { supabase } = await managerClient(path);
  const { error } = await supabase.rpc("create_warehouse_with_location", {
    p_name: parsed.data.name, p_code: parsed.data.code, p_address: parsed.data.address,
    p_location_name: parsed.data.locationName, p_location_code: parsed.data.locationCode,
  });
  if (error) redirect(withMessage(path, "error", error.code === "23505" ? "Warehouse or location code already exists." : "Warehouse could not be created."));
  revalidatePath(path); revalidatePath("/dashboard");
  redirect(withMessage(path, "success", "Warehouse and default location created."));
}
