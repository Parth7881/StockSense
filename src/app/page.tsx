import { ArrowRight, BellRing, Boxes, Check, ChevronDown, CirclePlay, FileSpreadsheet, Filter, LockKeyhole, PackageOpen, ScrollText, ShieldCheck, Truck, Warehouse, X, Zap } from "lucide-react";
import Link from "next/link";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";

const features = [
  [Boxes, "Product management", "Organize products with SKUs, categories, and detailed information."],
  [FileSpreadsheet, "Receipts", "Record incoming stock with clear references and supplier details."],
  [Truck, "Delivery orders", "Manage outgoing stock and track fulfilment in real time."],
  [PackageOpen, "Internal transfers", "Move stock between warehouse locations with full visibility."],
  [Warehouse, "Multi-warehouse support", "Manage multiple locations under one operational system."],
  [Filter, "Smart filters", "Find products and operations quickly with focused search."],
  [BellRing, "Low stock alerts", "Identify stock that needs attention before it runs out."],
  [ScrollText, "Audit-ready ledger", "Trace every stock movement, adjustment and transaction."],
] as const;

export default function Home() {
  return (
    <main className="min-h-svh bg-white text-foreground">
      <section className="border-b bg-[#f7fbff]" id="product">
        <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 lg:px-8" aria-label="Marketing navigation">
          <Link className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.04em]" href="/"><span className="grid size-9 place-items-center rounded-lg bg-primary text-white shadow-md shadow-blue-200"><PackageOpen className="size-5" /></span>StockSense</Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex"><a href="#product">Product</a><a href="#features">Features</a><a href="#security">Security</a><a className="flex items-center gap-1" href="#features">Resources <ChevronDown className="size-4" /></a></div>
          <div className="flex items-center gap-4"><Link className="hidden text-sm font-semibold sm:inline" href="/login">Sign in</Link><Link className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700" href="/signup">Get Started <ArrowRight className="size-4" /></Link></div>
        </nav>
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-16 pt-10 lg:grid-cols-[0.92fr_1.18fr] lg:px-8 lg:pb-20 lg:pt-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-slate-600"><Zap className="size-3.5 text-primary" />Modern inventory management for growing businesses</div>
            <h1 className="mt-6 max-w-xl text-5xl font-extrabold leading-[1.06] tracking-[-0.055em] text-[#080f2b] sm:text-[3.25rem]">Real-time inventory control for modern warehouses</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Manage stock, track movements, and keep every warehouse in sync from one centralized system.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-primary px-7 text-sm font-bold text-white shadow-xl shadow-blue-200 hover:bg-blue-700" href="/signup">Get started <ArrowRight className="size-4" /></Link><Link className="inline-flex min-h-12 items-center gap-3 rounded-lg border bg-white px-6 text-sm font-bold shadow-sm hover:bg-slate-50" href="/dashboard"><CirclePlay className="size-5 text-primary" />View dashboard demo</Link></div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">{["No credit card required", "Set up in minutes", "Built for warehouse teams"].map((item) => <span className="flex items-center gap-2" key={item}><span className="grid size-4 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-3" /></span>{item}</span>)}</div>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section className="border-b bg-white px-5 py-8 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] items-center gap-6 lg:grid-cols-[1fr_0.85fr_3rem_1.1fr]">
          <div><h2 className="text-2xl font-extrabold leading-tight tracking-[-0.035em]">A modern alternative<br />to spreadsheets</h2><p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">Everything you need to manage inventory without disconnected files or manual tracking.</p></div>
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-5"><div className="flex gap-4"><FileSpreadsheet className="size-12 text-emerald-700" /><ul className="space-y-2 text-sm text-slate-600">{["Prone to human error", "No real-time updates", "Difficult to collaborate", "Limited visibility"].map((item) => <li className="flex items-center gap-2" key={item}><X className="size-3.5 text-red-500" />{item}</li>)}</ul></div></div>
          <ArrowRight className="mx-auto hidden size-7 text-slate-400 lg:block" />
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5"><div className="flex gap-4"><PackageOpen className="size-12 text-primary" /><div><p className="font-bold">StockSense</p><ul className="mt-2 space-y-2 text-sm text-slate-600">{["Real-time inventory data", "Centralized and secure", "Built for teams and warehouses", "Full audit trail"].map((item) => <li className="flex gap-2" key={item}><span className="grid size-4 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-3" /></span>{item}</li>)}</ul></div></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-12 lg:px-8" id="features">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-wider text-primary">Features</p><h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.04em]">Everything you need for<br />complete inventory control</h2></div><p className="max-w-lg text-sm leading-6 text-slate-500">From receiving stock to fulfilling orders, StockSense gives warehouse teams one clear system for daily inventory operations.</p></div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{features.map(([Icon,title,description], index) => <article className="group flex min-h-32 gap-4 rounded-xl border bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60" key={title}><span className={`grid size-11 shrink-0 place-items-center rounded-lg ${index%4===0?"bg-blue-50 text-blue-600":index%4===1?"bg-emerald-50 text-emerald-600":index%4===2?"bg-amber-50 text-amber-600":"bg-violet-50 text-violet-600"}`}><Icon className="size-5" /></span><div><h3 className="text-sm font-bold capitalize">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></article>)}</div>
      </section>

      <section className="border-t bg-[#f7fbff] px-5 py-8 lg:px-8" id="security"><div className="mx-auto grid max-w-[1320px] gap-6 lg:grid-cols-[1.2fr_repeat(3,1fr)]"><div><p className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">Trust & security</p><h2 className="mt-2 text-xl font-extrabold">Built for security, designed for teams</h2><p className="mt-2 text-xs leading-5 text-slate-500">Inventory records stay protected, attributable and accessible to the right people.</p></div>{[[LockKeyhole,"Role-based access control","Managers and warehouse staff get the right level of access."],[ShieldCheck,"Secure authentication","Cookie-based sessions and protected application routes."],[ScrollText,"Comprehensive audit logs","Every completed inventory movement remains traceable."]].map(([Icon,title,copy]) => { const SecurityIcon=Icon as typeof LockKeyhole; return <div className="flex gap-3" key={String(title)}><span className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-100 text-primary"><SecurityIcon className="size-5" /></span><div><h3 className="text-sm font-bold">{String(title)}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{String(copy)}</p></div></div>; })}</div></section>
    </main>
  );
}
