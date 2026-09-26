import { redirect } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: claimData } = await supabase.auth.getClaims();
  const userId = typeof claimData?.claims?.sub === "string" ? claimData.claims.sub : null;
  if (!userId) redirect("/login");
  const [{ data: profile }, { data: userData }] = await Promise.all([
    supabase.from("profiles").select("full_name, role, is_active").eq("id", userId).single(),
    supabase.auth.getUser(),
  ]);
  return <div className="space-y-9"><PageHeader eyebrow="Account" title="Profile" description="Your identity and permissions used across inventory operations." /><dl className="grid max-w-3xl gap-0 border-y bg-card sm:grid-cols-2"><div className="border-b p-5 sm:border-r"><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</dt><dd className="mt-2 font-semibold">{profile?.full_name || "Not provided"}</dd></div><div className="border-b p-5"><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</dt><dd className="mt-2 text-sm">{userData.user?.email}</dd></div><div className="p-5 sm:border-r"><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</dt><dd className="mt-2 text-sm capitalize">{profile?.role?.replace("_", " ")}</dd></div><div className="p-5"><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account</dt><dd className="mt-2"><StatusBadge status={profile?.is_active ? "active" : "inactive"} /></dd></div></dl></div>;
}
