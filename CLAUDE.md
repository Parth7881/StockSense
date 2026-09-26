@AGENTS.md

# StockSense project contract

## Source of truth

- Implement the approved StockSense product blueprint stage by stage.
- Preserve the P0 scope and four-hour cut order. Do not add speculative features.
- Treat inventory correctness, authentication, authorization, and auditability as non-negotiable.

## Architecture

- Next.js App Router with strict TypeScript and React Server Components by default.
- Tailwind CSS v4 with semantic CSS variables and selected shadcn/ui Base Nova components.
- Supabase Auth and Postgres are introduced in Stage 2.
- Server Actions must authenticate, authorize, and validate all mutations.
- Inventory posting must use one atomic Postgres RPC transaction.
- Browser code must never update stock balances or ledger rows directly.
- Completed documents and stock movements are immutable.

## UI direction

- Use one restrained, consistent multipage application shell.
- Warm off-white canvas, white surfaces, forest-green primary actions, amber attention states, and dark ink text.
- Use Manrope for interface copy and JetBrains Mono for SKUs, references, and quantities when Stage 3 introduces the design system.
- Avoid purple gradients, glassmorphism, neon, oversized hero copy, excessive cards/pills, fake metrics, and decorative charts.
- Meet WCAG AA basics: visible focus, labels, semantic status text, keyboard access, and 44 px touch targets.

## Engineering rules

- Prefer small feature-local modules over generic repository/service/controller abstractions.
- Use Zod for server-side validation when mutations are introduced.
- Keep secrets out of browser bundles, logs, fixtures, and git.
- Use Row Level Security for every exposed business table.
- Add tests before product behavior and watch them fail for the expected reason.
- Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before reporting a stage complete.

## Commands

- `pnpm dev` - local development server
- `pnpm lint` - ESLint with zero warnings allowed
- `pnpm typecheck` - TypeScript validation
- `pnpm test` - Vitest suite
- `pnpm build` - production Next.js build
