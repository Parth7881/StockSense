import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-svh items-center bg-background px-6 py-16 text-foreground">
      <section className="mx-auto w-full max-w-5xl border-l-2 border-primary pl-6 sm:pl-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">StockSense</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          Inventory work, without the guesswork.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
          Receive, move, count and dispatch stock from one calm operational workspace—with every quantity traceable to its ledger.
        </p>
        <Link
          className="mt-8 inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          href="/dashboard"
        >
          Open workspace
        </Link>
      </section>
    </main>
  );
}
