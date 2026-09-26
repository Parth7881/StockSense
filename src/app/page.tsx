import Link from "next/link";

import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function Home() {
  const configured = isSupabaseConfigured();

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-16 text-foreground">
      <section className="w-full max-w-2xl border-l-4 border-primary pl-6 sm:pl-10">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          StockSense
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Stage 2 data and authentication foundation is ready.
        </p>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Secure database migrations, Row Level Security, session refresh,
          sign-in, sign-up, and password recovery are now wired for Supabase.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {configured
            ? "Supabase environment values are configured."
            : "Add your Supabase project values to .env.local to connect authentication."}
        </p>
        <Link
          className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          href="/login"
        >
          Open authentication
        </Link>
      </section>
    </main>
  );
}
