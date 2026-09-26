import { AlertTriangle, Bell, Boxes, CircleDollarSign, PackageOpen, Search, Truck, Warehouse } from "lucide-react";

const previewNavigation = ["Dashboard", "Products", "Receipts", "Delivery orders", "Transfers", "Adjustments", "Warehouses"];

export function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-2 shadow-[0_24px_60px_rgba(30,116,234,0.16)]" aria-label="StockSense dashboard preview">
      <div className="grid min-h-[27rem] grid-cols-[7.5rem_1fr] overflow-hidden rounded-xl border bg-[#f8fbff]">
        <aside className="flex flex-col border-r bg-white p-3">
          <div className="flex items-center gap-2 text-xs font-extrabold"><span className="grid size-7 place-items-center rounded-md bg-primary text-white"><PackageOpen className="size-4" /></span>StockSense</div>
          <nav className="mt-5 space-y-1 text-[10px]">
            {previewNavigation.map((item, index) => <div className={`rounded-md px-2 py-2 ${index === 0 ? "bg-blue-50 font-bold text-primary" : "text-slate-600"}`} key={item}>{item}</div>)}
          </nav>
          <div className="mt-auto px-2 text-[10px] text-slate-500">Settings</div>
        </aside>
        <div className="min-w-0">
          <header className="flex h-12 items-center gap-3 border-b bg-white px-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-slate-50 px-2 py-2 text-[9px] text-slate-400"><Search className="size-3" />Search products, orders, or references…</div>
            <Bell className="size-4 text-slate-500" />
            <div className="size-7 rounded-full bg-slate-700 text-center text-[9px] leading-7 text-white">DM</div>
          </header>
          <div className="p-3">
            <div className="flex items-center justify-between"><h3 className="text-sm font-extrabold">Dashboard</h3><span className="rounded-md border bg-white px-2 py-1 text-[8px] text-slate-500">This month</span></div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[[Boxes,"Total products","4","bg-blue-50 text-blue-600"],[CircleDollarSign,"Total stock","0","bg-emerald-50 text-emerald-600"],[AlertTriangle,"Low stock","4","bg-red-50 text-red-600"],[Warehouse,"Warehouses","1","bg-amber-50 text-amber-600"]].map(([Icon,label,value,tone]) => { const PreviewIcon=Icon as typeof Boxes; return <div className="rounded-lg border bg-white p-2" key={String(label)}><span className={`grid size-6 place-items-center rounded-md ${tone}`}><PreviewIcon className="size-3.5" /></span><p className="mt-2 text-[8px] text-slate-500">{String(label)}</p><p className="mt-1 text-sm font-extrabold">{String(value)}</p></div>; })}
            </div>
            <div className="mt-3 grid grid-cols-[1.35fr_0.9fr] gap-2">
              <div className="rounded-lg border bg-white p-3"><p className="text-[10px] font-bold">Stock movement</p><p className="mt-1 text-[8px] text-slate-400">Inwards vs outwards</p><div className="mt-5 flex h-32 items-end justify-around border-b border-l px-2">{[42,62,50,72,58,78].map((height,index) => <div className="flex items-end gap-1" key={height}><span className="w-2 rounded-t-sm bg-blue-500" style={{height:`${Math.max(12,height-18)}%`}} /><span className="w-2 rounded-t-sm bg-emerald-500" style={{height:`${height}%`}} /><span className="sr-only">Month {index+1}</span></div>)}</div></div>
              <div className="rounded-lg border bg-white p-3"><p className="text-[10px] font-bold">Recent activity</p><div className="mt-3 space-y-3">{[[PackageOpen,"Receipt created","2 min"],[Truck,"Delivery completed","18 min"],[AlertTriangle,"Stock adjustment","1 hour"]].map(([Icon,label,time]) => { const ActivityIcon=Icon as typeof Boxes; return <div className="flex items-center gap-2" key={String(label)}><span className="grid size-7 place-items-center rounded-md bg-blue-50 text-primary"><ActivityIcon className="size-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold">{String(label)}</p><p className="text-[7px] text-slate-400">{String(time)} ago</p></div></div>; })}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
