begin;
select plan(3);

select is(
  (select count(*)::integer from public.products where is_active),
  4,
  'seed provides four active products for the truthful dashboard'
);

select is(
  (select count(*)::integer from public.inventory_balances),
  4,
  'seed provides one zero balance per product without inventing stock'
);

select is(
  (select coalesce(sum(quantity), 0)::numeric from public.inventory_balances),
  0::numeric,
  'seed balances preserve the ledger invariant at zero'
);

select * from finish();
rollback;
