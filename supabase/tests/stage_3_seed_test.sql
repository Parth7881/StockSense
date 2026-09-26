begin;
select plan(3);

select is(
  (select count(*)::integer from public.products where is_active and sku in ('STEEL-001', 'FAST-120', 'HOUSING-042', 'PACK-014')),
  4,
  'seed provides four active products for the truthful dashboard'
);

select is(
  (select count(*)::integer from public.inventory_balances as balance join public.products as product on product.id = balance.product_id join public.locations as location on location.id = balance.location_id where product.sku in ('STEEL-001', 'FAST-120', 'HOUSING-042', 'PACK-014') and location.code = 'STORE'),
  4,
  'seed provides one zero balance per product without inventing stock'
);

select is(
  (select coalesce(sum(balance.quantity), 0)::numeric from public.inventory_balances as balance join public.products as product on product.id = balance.product_id where product.sku in ('STEEL-001', 'FAST-120', 'HOUSING-042', 'PACK-014')),
  0::numeric,
  'seed balances preserve the ledger invariant at zero'
);

select * from finish();
rollback;
