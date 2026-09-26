begin;
select plan(5);

select has_function('public', 'create_inventory_document', array['inventory_document_type', 'uuid', 'numeric', 'uuid', 'uuid', 'text', 'text'], 'atomic document creation RPC exists');
select has_function('public', 'post_inventory_document', array['uuid'], 'atomic inventory posting RPC exists');
select has_function('public', 'create_warehouse_with_location', array['text', 'text', 'text', 'text', 'text'], 'atomic warehouse creation RPC exists');

select function_privs_are('public', 'post_inventory_document', array['uuid'], 'authenticated', array['EXECUTE'], 'authenticated users can post through the guarded RPC');
select function_privs_are('public', 'post_inventory_document', array['uuid'], 'anon', array[]::text[], 'anonymous users cannot post stock');

select * from finish();
rollback;
