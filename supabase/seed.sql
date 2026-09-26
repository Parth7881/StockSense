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
