-- 코드 감사 반영
-- 1) 관리자는 '메일 인증을 마친 계정'의 이메일이 admins에 있을 때만 인정한다.
--    (가입 확인 메일을 끄거나 소셜 로그인을 붙여도, 남이 관리자 이메일로 가입해 관리자가 되지 못하게)
-- 2) 주문 금액 계산을 price_lines 하나로 모으고, 주문 전에 금액을 미리 볼 수 있게 quote_order를 둔다.
-- 3) place_order는 받는 날이 내일 이후인지, 손님이 본 합계와 지금 합계가 같은지 확인한다.

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join public.admins a on a.email = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null
  );
$$;

-- 주문 줄을 제품 가격으로 계산한다. 꽃꽂이 포장(wrap)·받는 방법(deliv) 금액은 web/lib/catalog.ts의 A_WRAP, A_DELIV와 같아야 한다
-- p_lines: [{"key":"larch","qty":1,"vessel":false,"wrap":0,"deliv":1} | {"key":"knot","qty":1,"size":"중 70 cm"}]
create or replace function public.price_lines(p_lines jsonb)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  wrap_add constant integer[] := array[0, 18000];
  deliv_add constant integer[] := array[0, 15000];
  ship_fee constant integer := 3000;
  ship_free_from constant integer := 50000;
  l jsonb; p public.products; qty integer; unit integer; quick integer; w integer; d integer; size_price integer;
  opt text; items jsonb := '[]'::jsonb;
  items_total integer := 0; quick_total integer := 0; bojagi_total integer := 0; ship integer;
begin
  if jsonb_typeof(p_lines) is distinct from 'array' or jsonb_array_length(p_lines) = 0 or jsonb_array_length(p_lines) > 30 then
    raise exception '주문할 상품이 없어요.';
  end if;

  for l in select * from jsonb_array_elements(p_lines) loop
    select * into p from public.products where key = l ->> 'key';
    if not found or not p.visible then raise exception '판매하지 않는 상품이 있어요.'; end if;
    if p.sold_out then raise exception '품절된 상품이 있어요: %', p.name; end if;
    qty := coalesce((l ->> 'qty')::integer, 0);
    if qty < 1 or qty > 20 then raise exception '수량이 올바르지 않아요.'; end if;
    quick := 0;

    if p.cat = 'arrange' then
      w := coalesce((l ->> 'wrap')::integer, 0); d := coalesce((l ->> 'deliv')::integer, 0);
      if w not in (0, 1) or d not in (0, 1) then raise exception '선택한 옵션이 올바르지 않아요.'; end if;
      unit := p.price - (case when coalesce((l ->> 'vessel')::boolean, false) then p.vessel_off else 0 end) + wrap_add[w + 1];
      quick := deliv_add[d + 1];
      opt := concat_ws(' · ',
        case when coalesce((l ->> 'vessel')::boolean, false) then '꽃과 침봉만' else '화기 포함' end,
        case when w = 1 then '매듭 보자기' else '감싸개' end,
        case when d = 1 then '서울 당일 퀵' else '작업실 픽업' end);
    elsif p.cat = 'bojagi' then
      select (s ->> 'price')::integer into size_price
      from jsonb_array_elements(coalesce(p.sizes, '[]'::jsonb)) s where s ->> 'label' = l ->> 'size';
      if size_price is null then raise exception '선택한 크기가 올바르지 않아요.'; end if;
      unit := size_price; opt := l ->> 'size';
      bojagi_total := bojagi_total + unit * qty;
    else
      raise exception '아직 온라인으로 주문할 수 없는 상품이에요: %', p.name;
    end if;

    items_total := items_total + unit * qty;
    quick_total := quick_total + quick;
    items := items || jsonb_build_object('key', p.key, 'name', p.name, 'opt', opt, 'unit', unit, 'qty', qty, 'quick', quick);
  end loop;

  ship := case when bojagi_total > 0 and bojagi_total < ship_free_from then ship_fee else 0 end;
  return jsonb_build_object('items', items, 'items_total', items_total, 'quick_total', quick_total,
                            'ship', ship, 'total', items_total + quick_total + ship);
end;
$$;
revoke all on function public.price_lines(jsonb) from public, anon, authenticated;

-- 주문 전에 지금 가격으로 합계를 미리 본다
create or replace function public.quote_order(p_lines jsonb)
returns jsonb
language sql stable security definer set search_path = ''
as $$ select public.price_lines(p_lines); $$;
revoke all on function public.quote_order(jsonb) from public, anon;
grant execute on function public.quote_order(jsonb) to authenticated;

drop function public.place_order(jsonb, text, text, date, text);
create function public.place_order(
  p_lines jsonb, p_name text, p_phone text, p_receive_date date, p_memo text, p_expected_total integer default null
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare q jsonb; total integer; new_id bigint;
begin
  if auth.uid() is null then raise exception '로그인이 필요해요.'; end if;
  if p_receive_date is not null and p_receive_date <= (now() at time zone 'Asia/Seoul')::date then
    raise exception '받는 날은 내일 이후로 골라 주세요.';
  end if;
  q := public.price_lines(p_lines);
  total := (q ->> 'total')::integer;
  if p_expected_total is not null and p_expected_total <> total then
    raise exception '가격이 바뀌어 합계가 %원이 되었어요. 확인 후 다시 주문해 주세요.', to_char(total, 'FM999,999,999');
  end if;

  insert into public.orders (user_id, name, phone, receive_date, memo, items, items_total, quick_total, ship, total)
  values (auth.uid(), trim(p_name), trim(p_phone), p_receive_date, coalesce(trim(p_memo), ''), q -> 'items',
          (q ->> 'items_total')::integer, (q ->> 'quick_total')::integer, (q ->> 'ship')::integer, total)
  returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.place_order(jsonb, text, text, date, text, integer) from public, anon;
grant execute on function public.place_order(jsonb, text, text, date, text, integer) to authenticated;
