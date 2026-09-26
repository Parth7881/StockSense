begin;
select plan(12);

select ok(not has_table_privilege('anon', 'public.products', 'select'), 'anonymous users cannot read products');
select ok(has_table_privilege('authenticated', 'public.products', 'select'), 'authenticated users can read products');
select ok(has_table_privilege('authenticated', 'public.products', 'insert'), 'authenticated product inserts reach RLS');
select ok(not has_table_privilege('authenticated', 'public.products', 'delete'), 'products cannot be deleted through the Data API');

select ok(has_table_privilege('authenticated', 'public.inventory_balances', 'select'), 'authenticated users can read balances');
select ok(not has_table_privilege('authenticated', 'public.inventory_balances', 'insert'), 'clients cannot insert balances');
select ok(not has_table_privilege('authenticated', 'public.inventory_balances', 'update'), 'clients cannot update balances');
select ok(not has_table_privilege('authenticated', 'public.inventory_balances', 'delete'), 'clients cannot delete balances');

select ok(has_table_privilege('authenticated', 'public.stock_movements', 'select'), 'authenticated users can read movements');
select ok(not has_table_privilege('authenticated', 'public.stock_movements', 'insert'), 'clients cannot insert movements');
select ok(not has_table_privilege('authenticated', 'public.stock_movements', 'update'), 'clients cannot update movements');
select ok(not has_table_privilege('authenticated', 'public.stock_movements', 'delete'), 'clients cannot delete movements');

select * from finish();
rollback;
