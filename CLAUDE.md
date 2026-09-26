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
- Use the approved white and pale-blue canvas, vivid blue primary actions, navy text, and semantic emerald/amber/red states.
- Keep interface typography clean and compact; use monospace treatment for SKUs, references, and quantities.
- Avoid purple gradients, glassmorphism, neon, excessive cards/pills, fake metrics, and decorative charts.
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
