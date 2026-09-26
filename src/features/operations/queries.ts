import { createClient } from "@/lib/supabase/server";

export type OperationType = "receipt" | "delivery" | "internal_transfer" | "adjustment";

export async function loadOperationPage(type: OperationType) {
  const supabase = await createClient();
  const [documents, products, locations] = await Promise.all([
    supabase.from("inventory_documents").select("id,document_number,status,counterparty_name,created_at,source:locations!inventory_documents_source_location_id_fkey(name),destination:locations!inventory_documents_destination_location_id_fkey(name),inventory_document_lines(quantity,processed_quantity,products(name,sku,unit_of_measure))").eq("type", type).order("created_at", { ascending: false }).limit(25),
    supabase.from("products").select("id,name,sku,unit_of_measure").eq("is_active", true).order("name"),
    supabase.from("locations").select("id,name,code,warehouses(name,code)").eq("is_active", true).order("name"),
  ]);
  return { documents: documents.data ?? [], products: products.data ?? [], locations: locations.data ?? [], error: documents.error ?? products.error ?? locations.error ? "Operation data could not be loaded." : null };
}

export async function loadMoveHistory() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("stock_movements").select("id,quantity_delta,balance_after,occurred_at,products(name,sku,unit_of_measure),locations(name,warehouses(name)),inventory_documents(document_number,type)").order("occurred_at", { ascending: false }).limit(100);
  return { movements: data ?? [], error: error ? "Move history could not be loaded." : null };
}
