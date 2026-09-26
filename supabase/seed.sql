insert into public.categories (name, slug, description)
values
  ('Raw Materials', 'raw-materials', 'Inputs used in production.'),
  ('Finished Goods', 'finished-goods', 'Products ready for delivery.'),
  ('Consumables', 'consumables', 'Operational supplies and consumable stock.')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    is_active = true;

with main_warehouse as (
  insert into public.warehouses (name, code, address)
  values ('Main Warehouse', 'MAIN', 'Primary inventory facility')
  on conflict (code) do update
  set name = excluded.name,
      address = excluded.address,
      is_active = true
  returning id
)
insert into public.locations (warehouse_id, name, code, kind)
select main_warehouse.id, location.name, location.code, location.kind
from main_warehouse
cross join (
  values
    ('Receiving Bay', 'RECEIVING', 'transit'::public.location_kind),
    ('Main Store', 'STORE', 'storage'::public.location_kind),
    ('Production Floor', 'PRODUCTION', 'production'::public.location_kind)
) as location(name, code, kind)
on conflict (warehouse_id, code) do update
set name = excluded.name,
    kind = excluded.kind,
    is_active = true;

insert into public.products (name, sku, category_id, unit_of_measure, reorder_level)
values
  (
    'Cold Rolled Steel Sheet',
    'STEEL-001',
    (select id from public.categories where slug = 'raw-materials'),
    'kg',
    25
  ),
  (
    'Industrial Fastener Kit',
    'FAST-120',
    (select id from public.categories where slug = 'consumables'),
    'box',
    12
  ),
  (
    'Assembly Housing',
    'HOUSING-042',
    (select id from public.categories where slug = 'finished-goods'),
    'unit',
    8
  ),
  (
    'Protective Packaging Roll',
    'PACK-014',
    (select id from public.categories where slug = 'consumables'),
    'roll',
    10
  )
on conflict (sku) do update
set name = excluded.name,
    category_id = excluded.category_id,
    unit_of_measure = excluded.unit_of_measure,
    reorder_level = excluded.reorder_level,
    is_active = true;

insert into public.inventory_balances (product_id, location_id, quantity)
select product.id, location.id, 0
from public.products as product
cross join public.locations as location
where product.sku in ('STEEL-001', 'FAST-120', 'HOUSING-042', 'PACK-014')
  and location.code = 'STORE'
on conflict (product_id, location_id) do nothing;
