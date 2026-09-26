create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create type public.app_role as enum ('inventory_manager', 'warehouse_staff');
create type public.inventory_document_type as enum (
  'receipt',
  'delivery',
  'internal_transfer',
  'adjustment'
);
create type public.inventory_document_status as enum (
  'draft',
  'waiting',
  'ready',
  'done',
  'canceled'
);
create type public.location_kind as enum ('storage', 'production', 'transit');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'warehouse_staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) <= 120)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_length check (char_length(name) between 1 and 80),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint warehouses_name_length check (char_length(name) between 1 and 100),
  constraint warehouses_code_format check (code ~ '^[A-Z0-9][A-Z0-9_-]{1,19}$')
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid not null references public.warehouses (id) on delete restrict,
  name text not null,
  code text not null,
  kind public.location_kind not null default 'storage',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_name_length check (char_length(name) between 1 and 100),
  constraint locations_code_format check (code ~ '^[A-Z0-9][A-Z0-9_-]{1,19}$'),
  constraint locations_warehouse_code_unique unique (warehouse_id, code)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null unique,
  category_id uuid references public.categories (id) on delete restrict,
  unit_of_measure text not null,
  reorder_level numeric(18, 3) not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_name_length check (char_length(name) between 1 and 160),
  constraint products_sku_format check (sku ~ '^[A-Z0-9][A-Z0-9._-]{1,39}$'),
  constraint products_uom_length check (char_length(unit_of_measure) between 1 and 30),
  constraint products_reorder_level_nonnegative check (reorder_level >= 0)
);

create table public.inventory_balances (
  product_id uuid not null references public.products (id) on delete restrict,
  location_id uuid not null references public.locations (id) on delete restrict,
  quantity numeric(18, 3) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (product_id, location_id),
  constraint inventory_balances_quantity_nonnegative check (quantity >= 0)
);

create table public.inventory_documents (
  id uuid primary key default gen_random_uuid(),
  document_number text not null unique,
  type public.inventory_document_type not null,
  status public.inventory_document_status not null default 'draft',
  counterparty_name text,
  source_location_id uuid references public.locations (id) on delete restrict,
  destination_location_id uuid references public.locations (id) on delete restrict,
  scheduled_for timestamptz,
  notes text,
  created_by uuid not null references public.profiles (id) on delete restrict,
  completed_by uuid references public.profiles (id) on delete restrict,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_documents_number_format check (
    document_number ~ '^[A-Z]{2,4}-[0-9]{6,20}$'
  ),
  constraint inventory_documents_counterparty_length check (
    counterparty_name is null or char_length(counterparty_name) <= 160
  ),
  constraint inventory_documents_location_rules check (
    (type = 'receipt' and source_location_id is null and destination_location_id is not null)
    or (type = 'delivery' and source_location_id is not null and destination_location_id is null)
    or (
      type = 'internal_transfer'
      and source_location_id is not null
      and destination_location_id is not null
      and source_location_id <> destination_location_id
    )
    or (type = 'adjustment' and source_location_id is null and destination_location_id is not null)
  ),
  constraint inventory_documents_completion_state check (
    (status = 'done' and completed_by is not null and completed_at is not null)
    or (status <> 'done' and completed_by is null and completed_at is null)
  )
);

create table public.inventory_document_lines (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.inventory_documents (id) on delete restrict,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity numeric(18, 3) not null,
  processed_quantity numeric(18, 3) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_document_lines_quantity_positive check (quantity > 0),
  constraint inventory_document_lines_processed_nonnegative check (processed_quantity >= 0),
  constraint inventory_document_product_unique unique (document_id, product_id)
);

create table public.stock_movements (
  id bigint generated always as identity primary key,
  document_id uuid not null references public.inventory_documents (id) on delete restrict,
  document_line_id uuid not null references public.inventory_document_lines (id) on delete restrict,
  product_id uuid not null references public.products (id) on delete restrict,
  location_id uuid not null references public.locations (id) on delete restrict,
  quantity_delta numeric(18, 3) not null,
  balance_after numeric(18, 3) not null,
  created_by uuid not null references public.profiles (id) on delete restrict,
  occurred_at timestamptz not null default now(),
  constraint stock_movements_delta_nonzero check (quantity_delta <> 0),
  constraint stock_movements_balance_nonnegative check (balance_after >= 0)
);

create index locations_warehouse_id_idx on public.locations (warehouse_id);
create index products_category_id_idx on public.products (category_id);
create index products_created_by_idx on public.products (created_by);
create index inventory_balances_location_id_idx on public.inventory_balances (location_id);
create index inventory_documents_created_by_idx on public.inventory_documents (created_by);
create index inventory_documents_completed_by_idx on public.inventory_documents (completed_by);
create index inventory_documents_source_location_id_idx on public.inventory_documents (source_location_id);
create index inventory_documents_destination_location_id_idx on public.inventory_documents (destination_location_id);
create index inventory_documents_status_type_idx on public.inventory_documents (status, type);
create index inventory_document_lines_document_id_idx on public.inventory_document_lines (document_id);
create index inventory_document_lines_product_id_idx on public.inventory_document_lines (product_id);
create index stock_movements_document_id_idx on public.stock_movements (document_id);
create index stock_movements_document_line_id_idx on public.stock_movements (document_line_id);
create index stock_movements_product_id_idx on public.stock_movements (product_id);
create index stock_movements_location_id_idx on public.stock_movements (location_id);
create index stock_movements_created_by_idx on public.stock_movements (created_by);
create index stock_movements_product_location_time_idx
  on public.stock_movements (product_id, location_id, occurred_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
for each row execute function private.set_updated_at();
create trigger warehouses_set_updated_at before update on public.warehouses
for each row execute function private.set_updated_at();
create trigger locations_set_updated_at before update on public.locations
for each row execute function private.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute function private.set_updated_at();
create trigger inventory_balances_set_updated_at before update on public.inventory_balances
for each row execute function private.set_updated_at();
create trigger inventory_documents_set_updated_at before update on public.inventory_documents
for each row execute function private.set_updated_at();
create trigger inventory_document_lines_set_updated_at before update on public.inventory_document_lines
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120)
  );
  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function private.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and coalesce((
      select profile.is_active
      from public.profiles as profile
      where profile.id = (select auth.uid())
    ), false);
$$;

create or replace function private.is_inventory_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and coalesce((
      select profile.is_active and profile.role = 'inventory_manager'
      from public.profiles as profile
      where profile.id = (select auth.uid())
    ), false);
$$;

revoke execute on function private.is_active_user() from public, anon;
revoke execute on function private.is_inventory_manager() from public, anon;
grant execute on function private.is_active_user() to authenticated;
grant execute on function private.is_inventory_manager() to authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.warehouses enable row level security;
alter table public.locations enable row level security;
alter table public.products enable row level security;
alter table public.inventory_balances enable row level security;
alter table public.inventory_documents enable row level security;
alter table public.inventory_document_lines enable row level security;
alter table public.stock_movements enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.categories from anon, authenticated;
revoke all on table public.warehouses from anon, authenticated;
revoke all on table public.locations from anon, authenticated;
revoke all on table public.products from anon, authenticated;
revoke all on table public.inventory_balances from anon, authenticated;
revoke all on table public.inventory_documents from anon, authenticated;
revoke all on table public.inventory_document_lines from anon, authenticated;
revoke all on table public.stock_movements from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;
grant select, insert, update on table public.categories to authenticated;
grant select, insert, update on table public.warehouses to authenticated;
grant select, insert, update on table public.locations to authenticated;
grant select, insert, update on table public.products to authenticated;
grant select on table public.inventory_balances to authenticated;
grant select, insert, update on table public.inventory_documents to authenticated;
grant select, insert, update, delete on table public.inventory_document_lines to authenticated;
grant select on table public.stock_movements to authenticated;

create policy profiles_select
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.is_inventory_manager())
);

create policy profiles_update_own_name
on public.profiles for update
to authenticated
using (id = (select auth.uid()) and is_active)
with check (id = (select auth.uid()) and is_active);

create policy categories_select
on public.categories for select
to authenticated
using ((select private.is_active_user()));
create policy categories_insert_manager
on public.categories for insert
to authenticated
with check ((select private.is_inventory_manager()));
create policy categories_update_manager
on public.categories for update
to authenticated
using ((select private.is_inventory_manager()))
with check ((select private.is_inventory_manager()));

create policy warehouses_select
on public.warehouses for select
to authenticated
using ((select private.is_active_user()));
create policy warehouses_insert_manager
on public.warehouses for insert
to authenticated
with check ((select private.is_inventory_manager()));
create policy warehouses_update_manager
on public.warehouses for update
to authenticated
using ((select private.is_inventory_manager()))
with check ((select private.is_inventory_manager()));

create policy locations_select
on public.locations for select
to authenticated
using ((select private.is_active_user()));
create policy locations_insert_manager
on public.locations for insert
to authenticated
with check ((select private.is_inventory_manager()));
create policy locations_update_manager
on public.locations for update
to authenticated
using ((select private.is_inventory_manager()))
with check ((select private.is_inventory_manager()));

create policy products_select
on public.products for select
to authenticated
using ((select private.is_active_user()));
create policy products_insert_manager
on public.products for insert
to authenticated
with check (
  (select private.is_inventory_manager())
  and (created_by is null or created_by = (select auth.uid()))
);
create policy products_update_manager
on public.products for update
to authenticated
using ((select private.is_inventory_manager()))
with check ((select private.is_inventory_manager()));

create policy inventory_balances_select
on public.inventory_balances for select
to authenticated
using ((select private.is_active_user()));

create policy inventory_documents_select
on public.inventory_documents for select
to authenticated
using ((select private.is_active_user()));
create policy inventory_documents_insert
on public.inventory_documents for insert
to authenticated
with check (
  (select private.is_active_user())
  and created_by = (select auth.uid())
  and status in ('draft', 'waiting', 'ready')
);
create policy inventory_documents_update_mutable
on public.inventory_documents for update
to authenticated
using (
  status in ('draft', 'waiting', 'ready')
  and (
    created_by = (select auth.uid())
    or (select private.is_inventory_manager())
  )
)
with check (
  status in ('draft', 'waiting', 'ready')
  and (
    created_by = (select auth.uid())
    or (select private.is_inventory_manager())
  )
);

create policy inventory_document_lines_select
on public.inventory_document_lines for select
to authenticated
using ((select private.is_active_user()));
create policy inventory_document_lines_insert_mutable
on public.inventory_document_lines for insert
to authenticated
with check (
  exists (
    select 1
    from public.inventory_documents as document
    where document.id = document_id
      and document.status in ('draft', 'waiting', 'ready')
      and (
        document.created_by = (select auth.uid())
        or (select private.is_inventory_manager())
      )
  )
);
create policy inventory_document_lines_update_mutable
on public.inventory_document_lines for update
to authenticated
using (
  exists (
    select 1
    from public.inventory_documents as document
    where document.id = document_id
      and document.status in ('draft', 'waiting', 'ready')
      and (
        document.created_by = (select auth.uid())
        or (select private.is_inventory_manager())
      )
  )
)
with check (
  exists (
    select 1
    from public.inventory_documents as document
    where document.id = document_id
      and document.status in ('draft', 'waiting', 'ready')
      and (
        document.created_by = (select auth.uid())
        or (select private.is_inventory_manager())
      )
  )
);
create policy inventory_document_lines_delete_mutable
on public.inventory_document_lines for delete
to authenticated
using (
  exists (
    select 1
    from public.inventory_documents as document
    where document.id = document_id
      and document.status in ('draft', 'waiting', 'ready')
      and (
        document.created_by = (select auth.uid())
        or (select private.is_inventory_manager())
      )
  )
);

create policy stock_movements_select
on public.stock_movements for select
to authenticated
using ((select private.is_active_user()));
