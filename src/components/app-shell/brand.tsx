import { Boxes } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="flex min-h-11 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/dashboard">
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <Boxes aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </span>
      <span>
        <span className="block text-sm font-extrabold tracking-[-0.02em]">StockSense</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Operations</span>
      </span>
    </Link>
  );
}
