begin;
select plan(21);

select has_type('public', 'app_role', 'app_role enum exists');
select has_type('public', 'inventory_document_type', 'document type enum exists');
select has_type('public', 'inventory_document_status', 'document status enum exists');

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'categories', 'categories table exists');
select has_table('public', 'warehouses', 'warehouses table exists');
select has_table('public', 'locations', 'locations table exists');
select has_table('public', 'products', 'products table exists');
select has_table('public', 'inventory_balances', 'inventory balances table exists');
select has_table('public', 'inventory_documents', 'inventory documents table exists');
select has_table('public', 'inventory_document_lines', 'inventory document lines table exists');
select has_table('public', 'stock_movements', 'stock movements table exists');

select col_is_pk('public', 'profiles', 'id', 'profile id is the primary key');
select col_is_pk('public', 'products', 'id', 'product id is the primary key');
select col_is_pk('public', 'inventory_documents', 'id', 'document id is the primary key');

select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.products'::regclass), 'products has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.inventory_balances'::regclass), 'inventory balances has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.inventory_documents'::regclass), 'inventory documents has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.inventory_document_lines'::regclass), 'inventory document lines has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.stock_movements'::regclass), 'stock movements has RLS enabled');

select * from finish();
rollback;
