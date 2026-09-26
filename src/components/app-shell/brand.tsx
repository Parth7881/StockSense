import { PackageOpen } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="flex min-h-11 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="/dashboard">
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25">
        <PackageOpen aria-hidden="true" className="size-5" strokeWidth={2.2} />
      </span>
      <span>
        <span className="block text-base font-extrabold tracking-[-0.035em]">StockSense</span>
      </span>
    </Link>
  );
}
