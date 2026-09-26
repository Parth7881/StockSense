import { AlertCircle, CheckCircle2 } from "lucide-react";

export function FeedbackBanner({ error, success }: { error?: string; success?: string }) {
  const message = error || success;
  if (!message) return null;
  const Icon = error ? AlertCircle : CheckCircle2;
  return <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role={error ? "alert" : "status"}><Icon className="size-5" />{message}</div>;
}
