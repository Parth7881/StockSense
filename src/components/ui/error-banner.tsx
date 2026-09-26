import { AlertTriangle } from "lucide-react";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex gap-3 border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
      <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
