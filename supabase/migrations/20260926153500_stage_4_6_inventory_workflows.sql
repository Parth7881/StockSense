create or replace function public.create_warehouse_with_location(
  p_name text,
  p_code text,
  p_address text,
  p_location_name text,
  p_location_code text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_warehouse_id uuid;
begin
  if not private.is_inventory_manager() then
    raise exception 'Only inventory managers can create warehouses';
  end if;

  insert into public.warehouses (name, code, address)
  values (p_name, p_code, nullif(p_address, ''))
  returning id into v_warehouse_id;

  insert into public.locations (warehouse_id, name, code, kind)
  values (v_warehouse_id, p_location_name, p_location_code, 'storage');

  return v_warehouse_id;
end;
$$;

create or replace function public.create_inventory_document(
  p_type public.inventory_document_type,
  p_product_id uuid,
  p_quantity numeric,
  p_source_location_id uuid,
  p_destination_location_id uuid,
  p_counterparty_name text,
  p_notes text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_document_id uuid;
  v_prefix text;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or not private.is_active_user() then
    raise exception 'Authentication required';
  end if;
  if p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  v_prefix := case p_type
    when 'receipt' then 'RC'
    when 'delivery' then 'DO'
    when 'internal_transfer' then 'TRF'
    when 'adjustment' then 'ADJ'
  end;

  insert into public.inventory_documents (
    document_number, type, status, counterparty_name,
    source_location_id, destination_location_id, notes, created_by
  ) values (
    v_prefix || '-' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS'),
    p_type, 'ready', nullif(p_counterparty_name, ''),
    p_source_location_id, p_destination_location_id, nullif(p_notes, ''), v_user_id
  ) returning id into v_document_id;

  insert into public.inventory_document_lines (document_id, product_id, quantity)
  values (v_document_id, p_product_id, p_quantity);

  return v_document_id;
end;
$$;

create or replace function public.post_inventory_document(p_document_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_document public.inventory_documents%rowtype;
  v_line public.inventory_document_lines%rowtype;
  v_current numeric;
  v_after numeric;
  v_delta numeric;
  v_user_id uuid := auth.uid();
  v_line_count integer := 0;
begin
  if v_user_id is null or not private.is_active_user() then
    raise exception 'Authentication required';
  end if;

  select * into v_document
  from public.inventory_documents
  where id = p_document_id
  for update;

  if not found then raise exception 'Document not found'; end if;
  if v_document.status <> 'ready' then raise exception 'Only ready documents can be posted'; end if;

  for v_line in
    select * from public.inventory_document_lines
    where document_id = p_document_id
    order by id
    for update
  loop
    v_line_count := v_line_count + 1;

    if v_document.type = 'receipt' then
      insert into public.inventory_balances (product_id, location_id, quantity)
      values (v_line.product_id, v_document.destination_location_id, v_line.quantity)
      on conflict (product_id, location_id) do update
      set quantity = public.inventory_balances.quantity + excluded.quantity
      returning quantity into v_after;

      insert into public.stock_movements (document_id, document_line_id, product_id, location_id, quantity_delta, balance_after, created_by)
      values (v_document.id, v_line.id, v_line.product_id, v_document.destination_location_id, v_line.quantity, v_after, v_user_id);

    elsif v_document.type = 'delivery' then
      select quantity into v_current from public.inventory_balances
      where product_id = v_line.product_id and location_id = v_document.source_location_id
      for update;
      if v_current is null or v_current < v_line.quantity then raise exception 'Insufficient stock'; end if;
      v_after := v_current - v_line.quantity;
      update public.inventory_balances set quantity = v_after
      where product_id = v_line.product_id and location_id = v_document.source_location_id;
      insert into public.stock_movements (document_id, document_line_id, product_id, location_id, quantity_delta, balance_after, created_by)
      values (v_document.id, v_line.id, v_line.product_id, v_document.source_location_id, -v_line.quantity, v_after, v_user_id);

    elsif v_document.type = 'internal_transfer' then
      select quantity into v_current from public.inventory_balances
      where product_id = v_line.product_id and location_id = v_document.source_location_id
      for update;
      if v_current is null or v_current < v_line.quantity then raise exception 'Insufficient stock'; end if;
      v_after := v_current - v_line.quantity;
      update public.inventory_balances set quantity = v_after
      where product_id = v_line.product_id and location_id = v_document.source_location_id;
      insert into public.stock_movements (document_id, document_line_id, product_id, location_id, quantity_delta, balance_after, created_by)
      values (v_document.id, v_line.id, v_line.product_id, v_document.source_location_id, -v_line.quantity, v_after, v_user_id);

      insert into public.inventory_balances (product_id, location_id, quantity)
      values (v_line.product_id, v_document.destination_location_id, v_line.quantity)
      on conflict (product_id, location_id) do update
      set quantity = public.inventory_balances.quantity + excluded.quantity
      returning quantity into v_after;
      insert into public.stock_movements (document_id, document_line_id, product_id, location_id, quantity_delta, balance_after, created_by)
      values (v_document.id, v_line.id, v_line.product_id, v_document.destination_location_id, v_line.quantity, v_after, v_user_id);

    else
      select quantity into v_current from public.inventory_balances
      where product_id = v_line.product_id and location_id = v_document.destination_location_id
      for update;
      v_current := coalesce(v_current, 0);
      v_delta := v_line.quantity - v_current;
      insert into public.inventory_balances (product_id, location_id, quantity)
      values (v_line.product_id, v_document.destination_location_id, v_line.quantity)
      on conflict (product_id, location_id) do update set quantity = excluded.quantity;
      if v_delta <> 0 then
        insert into public.stock_movements (document_id, document_line_id, product_id, location_id, quantity_delta, balance_after, created_by)
        values (v_document.id, v_line.id, v_line.product_id, v_document.destination_location_id, v_delta, v_line.quantity, v_user_id);
      end if;
    end if;

    update public.inventory_document_lines
    set processed_quantity = v_line.quantity
    where id = v_line.id;
  end loop;

  if v_line_count = 0 then raise exception 'Document has no lines'; end if;

  update public.inventory_documents
  set status = 'done', completed_by = v_user_id, completed_at = now()
  where id = v_document.id;
end;
$$;

revoke all on function public.create_warehouse_with_location(text, text, text, text, text) from public, anon;
revoke all on function public.create_inventory_document(public.inventory_document_type, uuid, numeric, uuid, uuid, text, text) from public, anon;
revoke all on function public.post_inventory_document(uuid) from public, anon;
grant execute on function public.create_warehouse_with_location(text, text, text, text, text) to authenticated;
grant execute on function public.create_inventory_document(public.inventory_document_type, uuid, numeric, uuid, uuid, text, text) to authenticated;
grant execute on function public.post_inventory_document(uuid) to authenticated;
