"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <div className="space-y-4"><ErrorBanner message="The dashboard could not load. No inventory data was changed." /><Button onClick={reset} type="button">Try again</Button></div>;
}
