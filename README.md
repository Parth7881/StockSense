# StockSense

StockSense is a staged inventory-management web application for product stock, receipts, deliveries, internal transfers, physical-count adjustments, and an immutable movement ledger.

## Stage 2 status

This repository contains the verified application foundation plus the Stage 2 data and authentication layer:

- Next.js App Router with strict TypeScript
- Tailwind CSS v4
- shadcn/ui Base Nova configuration and minimal Button/Input/Field primitives
- Vitest and Testing Library
- pinned Supabase browser/server clients with cookie-based SSR sessions
- Next.js 16 Proxy token refresh using verified claims
- email/password sign-in and sign-up
- six-digit OTP password recovery and password update flow
- versioned Postgres schema for profiles, catalog, warehouses, locations, balances, documents, lines, and movement ledger
- explicit grants and Row Level Security on every exposed business table
- immutable completed documents, balances, and movement-ledger client boundaries
- repeatable seed data and pgTAP schema/security tests
- feature-oriented folder boundaries
- project rules in `CLAUDE.md`

Product screens, inventory posting RPCs, the authenticated application shell, and dashboard are intentionally reserved for later stages.

## Requirements

- Node.js 22.13 or newer (Node.js 24 LTS recommended)
- pnpm 11 or newer
- Docker Desktop for the local Supabase stack

## Setup

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm db:start
pnpm db:reset
pnpm db:test
pnpm dev
```

Open `http://localhost:3000`.

Copy the local API URL and publishable key printed by `pnpm db:start` into `.env.local`. For a hosted project, use the Project URL and publishable key from Supabase's Connect dialog. Never place a secret key or service-role key in a `NEXT_PUBLIC_` variable.

After the first account is created, promote it from the Supabase SQL editor:

```sql
update public.profiles
set role = 'inventory_manager'
where id = (select id from auth.users where email = 'manager@example.com');
```

Every other new account starts with the least-privileged `warehouse_staff` role.

## Verification

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm db:test
pnpm build
```

## Planned module boundaries

- `src/features/auth` - authentication schemas, actions, and view models
- `src/features/products` - product queries, schemas, actions, and mappers
- `src/features/operations` - inventory document domain rules and actions
- `src/features/dashboard` - KPI queries and presentation models
- `src/components/app-shell` - authenticated navigation shell
- `src/components/data-table` - shared operational tables and filters
- `src/components/inventory` - stock and document UI patterns
- `supabase/migrations` - versioned schema, RLS, views, and inventory RPCs
- `tests/unit` and `tests/e2e` - domain and workflow verification
