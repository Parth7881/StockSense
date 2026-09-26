import { createClient } from "@/lib/supabase/server";

export type ProductListItem = { id: string; name: string; sku: string; category: string; unit: string; reorderLevel: number; quantity: number; active: boolean };
export type CategoryOption = { id: string; name: string };

export async function loadProducts(query = "", categoryId = "") {
  const supabase = await createClient();
  let request = supabase.from("products").select("id,name,sku,unit_of_measure,reorder_level,is_active,category_id,categories(name),inventory_balances(quantity)").order("name");
  const safeQuery = query.trim().replace(/[%_,()]/g, "");
  if (safeQuery) request = request.or(`name.ilike.%${safeQuery}%,sku.ilike.%${safeQuery}%`);
  if (categoryId) request = request.eq("category_id", categoryId);
  const [{ data, error }, { data: categories }, { data: claims }] = await Promise.all([
    request,
    supabase.from("categories").select("id,name").eq("is_active", true).order("name"),
    supabase.auth.getClaims(),
  ]);
  const userId = typeof claims?.claims?.sub === "string" ? claims.claims.sub : "";
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  const rows = (data ?? []) as unknown as Array<{id:string;name:string;sku:string;unit_of_measure:string;reorder_level:number|string;is_active:boolean;categories:{name:string}|null;inventory_balances:Array<{quantity:number|string}>}>;
  return {
    products: rows.map((row): ProductListItem => ({ id: row.id, name: row.name, sku: row.sku, category: row.categories?.name ?? "Uncategorized", unit: row.unit_of_measure, reorderLevel: Number(row.reorder_level), quantity: row.inventory_balances.reduce((sum, balance) => sum + Number(balance.quantity), 0), active: row.is_active })),
    categories: (categories ?? []) as CategoryOption[], canManage: profile?.role === "inventory_manager", error: error ? "Products could not be loaded." : null,
  };
}

export async function loadWarehouses() {
  const supabase = await createClient();
  const [{ data, error }, { data: claims }] = await Promise.all([
    supabase.from("warehouses").select("id,name,code,address,is_active,locations(id,name,code,kind,is_active)").order("name"),
    supabase.auth.getClaims(),
  ]);
  const userId = typeof claims?.claims?.sub === "string" ? claims.claims.sub : "";
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return { warehouses: data ?? [], canManage: profile?.role === "inventory_manager", error: error ? "Warehouses could not be loaded." : null };
}

export async function loadProduct(productId: string) {
  const supabase = await createClient();
  const [{ data: product, error }, { data: categories }, { data: claims }] = await Promise.all([
    supabase.from("products").select("id,name,sku,category_id,unit_of_measure,reorder_level,is_active").eq("id", productId).maybeSingle(),
    supabase.from("categories").select("id,name").eq("is_active", true).order("name"),
    supabase.auth.getClaims(),
  ]);
  const userId = typeof claims?.claims?.sub === "string" ? claims.claims.sub : "";
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return { product, categories: (categories ?? []) as CategoryOption[], canManage: profile?.role === "inventory_manager", error };
}
