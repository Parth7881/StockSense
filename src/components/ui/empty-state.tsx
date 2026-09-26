import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-56 flex-col items-start justify-center border-y bg-card/45 px-6 py-10 sm:px-8">
      <Icon aria-hidden="true" className="size-5 text-primary" strokeWidth={1.8} />
      <h3 className="mt-5 text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
