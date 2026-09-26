import { createClient } from "@/lib/supabase/server";

import type { DashboardCounts } from "./view-model";

export type PendingDocument = {
  id: string;
  documentNumber: string;
  type: string;
  status: "draft" | "waiting" | "ready";
  scheduledFor: string | null;
};

export type DashboardData = {
  counts: DashboardCounts;
  pendingDocuments: PendingDocument[];
  error: string | null;
};

type BalanceRow = {
  quantity: number | string;
  products: { reorder_level: number | string; is_active: boolean } | null;
};

export async function loadDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [products, balances, pending, movements] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("inventory_balances").select("quantity, products!inner(reorder_level, is_active)"),
    supabase
      .from("inventory_documents")
      .select("id, document_number, type, status, scheduled_for")
      .in("status", ["draft", "waiting", "ready"])
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("stock_movements")
      .select("id", { count: "exact", head: true })
      .gte("occurred_at", today.toISOString()),
  ]);

  const firstError = products.error ?? balances.error ?? pending.error ?? movements.error;
  const balanceRows = (balances.data ?? []) as unknown as BalanceRow[];
  const lowStockCount = balanceRows.filter((row) => {
    if (!row.products?.is_active) return false;
    return Number(row.quantity) <= Number(row.products.reorder_level);
  }).length;

  return {
    counts: {
      productCount: products.count ?? 0,
      lowStockCount,
      pendingDocumentCount: pending.data?.length ?? 0,
      movementCount: movements.count ?? 0,
    },
    pendingDocuments: (pending.data ?? []).map((document) => ({
      id: document.id,
      documentNumber: document.document_number,
      type: document.type,
      status: document.status as PendingDocument["status"],
      scheduledFor: document.scheduled_for,
    })),
    error: firstError ? "Dashboard data could not be refreshed. Your inventory records are unchanged." : null,
  };
}
