import { Activity, ClipboardList } from "lucide-react";

import { DataTableShell } from "@/components/ui/data-table-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { KpiBlock } from "@/components/ui/kpi-block";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { loadDashboardData } from "@/features/dashboard/queries";
import { buildDashboardView } from "@/features/dashboard/view-model";

export const metadata = { title: "Dashboard" };

const typeLabels: Record<string, string> = {
  receipt: "Receipt",
  delivery: "Delivery",
  internal_transfer: "Transfer",
  adjustment: "Adjustment",
};

export default async function DashboardPage() {
  const data = await loadDashboardData();
  const kpis = buildDashboardView(data.counts);
  return (
    <div className="space-y-9">
      <PageHeader eyebrow="Overview" title="Good inventory starts with clear signals." description="Review stock attention points and pending warehouse work. Every value below comes directly from the local database." />
      {data.error ? <ErrorBanner message={data.error} /> : null}
      <section aria-label="Inventory key figures" className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => <KpiBlock key={kpi.label} {...kpi} />)}
      </section>
      <div className="grid gap-9 xl:grid-cols-[1.45fr_1fr]">
        <DataTableShell title="Pending operations" description="Draft, waiting and ready documents needing warehouse attention.">
          {data.pendingDocuments.length ? (
            <table className="w-full min-w-[38rem] text-left text-sm">
              <thead className="border-b bg-muted/45 text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 font-bold">Reference</th><th className="px-4 py-3 font-bold">Type</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Scheduled</th></tr>
              </thead>
              <tbody>
                {data.pendingDocuments.map((document) => (
                  <tr className="border-b last:border-0" key={document.id}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{document.documentNumber}</td>
                    <td className="px-4 py-3">{typeLabels[document.type] ?? document.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={document.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{document.scheduledFor ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(document.scheduledFor)) : "Not scheduled"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState icon={ClipboardList} title="No pending operations" description="Draft, waiting and ready inventory documents will appear here as work enters the queue." />
          )}
        </DataTableShell>
        <section aria-labelledby="recent-activity-title">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight" id="recent-activity-title">Recent movement</h2>
            <p className="mt-1 text-sm text-muted-foreground">Today’s posted ledger activity.</p>
          </div>
          <EmptyState icon={Activity} title="No movement posted today" description="Validated receipts, deliveries, transfers and adjustments will build this immutable activity trail." />
        </section>
      </div>
    </div>
  );
}
