import { Activity, CalendarDays, ClipboardList, PackageCheck, TrendingUp } from "lucide-react";

import { DataTableShell } from "@/components/ui/data-table-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { KpiBlock } from "@/components/ui/kpi-block";
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
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Overview</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em]">Dashboard</h1>
        </div>
        <div className="inline-flex min-h-10 items-center gap-2 self-start rounded-lg border bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm">
          <CalendarDays className="size-4 text-primary" /> Live inventory snapshot
        </div>
      </header>
      {data.error ? <ErrorBanner message={data.error} /> : null}
      <section aria-label="Inventory key figures" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => <KpiBlock key={kpi.label} {...kpi} />)}
      </section>
      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
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
        <section aria-labelledby="recent-activity-title" className="rounded-xl border bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-start justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight" id="recent-activity-title">Recent activity</h2>
              <p className="mt-1 text-xs text-muted-foreground">Latest warehouse signals and stock work.</p>
            </div>
            <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-primary"><Activity className="size-[18px]" /></span>
          </div>
          {data.pendingDocuments.length ? (
            <ul className="divide-y">
              {data.pendingDocuments.slice(0, 4).map((document) => (
                <li className="flex items-center gap-3 py-4" key={document.id}>
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><PackageCheck className="size-[18px]" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{typeLabels[document.type] ?? document.type}</p><p className="truncate text-xs text-muted-foreground">{document.documentNumber}</p></div>
                  <StatusBadge status={document.status} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="pt-4"><EmptyState icon={TrendingUp} title="No movement posted yet" description="Validated receipts, deliveries, transfers and adjustments will appear here." /></div>
          )}
        </section>
      </div>
    </div>
  );
}
