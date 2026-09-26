import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return <div className="space-y-8" aria-label="Loading dashboard"><Skeleton className="h-28 w-full" /><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton className="h-28" key={index} />)}</div><Skeleton className="h-72 w-full" /></div>;
}
