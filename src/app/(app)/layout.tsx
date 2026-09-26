import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const { data: claimData, error: claimError } = await supabase.auth.getClaims();
  const userId = typeof claimData?.claims?.sub === "string" ? claimData.claims.sub : null;
  if (claimError || !userId) redirect("/login?next=/dashboard");

  const [{ data: profile }, { data: userData }] = await Promise.all([
    supabase.from("profiles").select("full_name, role").eq("id", userId).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  return (
    <AppShell
      user={{
        fullName: profile?.full_name || "StockSense user",
        email: userData.user?.email ?? "",
        role: profile?.role === "inventory_manager" ? "inventory_manager" : "warehouse_staff",
      }}
    >
      {children}
    </AppShell>
  );
}
