-- 설담화 기본 스키마: 회원·관리자, 제품, 주문, 모임, works
-- 원칙
--  · 공개 데이터(제품·모임·works)는 누구나 읽고, 관리자만 쓴다.
--  · 주문은 place_order() 함수로만 만든다. 가격은 클라이언트 값을 믿지 않고 DB에서 다시 계산한다.
--  · 관리자는 admins 테이블에 등록된 이메일이다. 이 테이블은 API로 읽거나 쓸 수 없다(정책 없음).

-- ===== 관리자 =====
create table public.admins (
  email text primary key check (email = lower(email))
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ===== 회원 프로필 =====
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '' check (char_length(name) <= 40),
  phone text not null default '' check (char_length(phone) <= 20),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "본인 프로필 읽기" on public.profiles for select to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));
create policy "본인 프로필 고치기" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- 가입하면 프로필을 만든다
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'name', ''), 40));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== 제품 =====
-- cat: arrange 꽃꽂이 / gift 선물 / bojagi 보자기 / sub 정기 구독
-- price: 기본 가격. 보자기는 sizes[0].price와 같게 둔다
-- sizes: 보자기 크기별 가격 [{"label":"소 45 cm","price":38000}, ...]
-- vessel_off: 꽃꽂이에서 '꽃과 침봉만'을 고르면 빼는 금액
-- has_detail: 상세 페이지가 있는 제품(코드에 상세 내용이 있는 key). 관리자가 새로 만든 제품은 false
create table public.products (
  key text primary key check (key ~ '^[a-z0-9-]{2,40}$'),
  cat text not null check (cat in ('arrange', 'gift', 'bojagi', 'sub')),
  name text not null check (char_length(name) between 1 and 40),
  meta text not null default '' check (char_length(meta) <= 60),
  price integer not null check (price >= 0),
  sizes jsonb,
  vessel_off integer not null default 0 check (vessel_off >= 0),
  img text not null default '',
  has_detail boolean not null default false,
  sold_out boolean not null default false,
  visible boolean not null default true,
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "제품 공개 읽기" on public.products for select to anon, authenticated
  using (visible or (select public.is_admin()));
create policy "관리자 제품 추가" on public.products for insert to authenticated with check ((select public.is_admin()));
create policy "관리자 제품 수정" on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "관리자 제품 삭제" on public.products for delete to authenticated using ((select public.is_admin()));

-- ===== 주문 =====
create table public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default '접수' check (status in ('접수', '확인', '준비 중', '완료', '취소')),
  name text not null check (char_length(name) between 1 and 40),
  phone text not null check (char_length(phone) between 6 and 20),
  receive_date date,
  memo text not null default '' check (char_length(memo) <= 500),
  items jsonb not null,
  items_total integer not null,
  quick_total integer not null,
  ship integer not null,
  total integer not null,
  admin_note text not null default '' check (char_length(admin_note) <= 500),
  created_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders (user_id);
alter table public.orders enable row level security;
create policy "본인 주문 읽기" on public.orders for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));
create policy "관리자 주문 수정" on public.orders for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- 회원은 상태와 메모만이 아니라 아무 칸도 직접 고치지 못한다. 접수 상태의 주문 취소만 함수로 허용한다
create or replace function public.cancel_my_order(p_id bigint)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  update public.orders set status = '취소'
  where id = p_id and user_id = auth.uid() and status = '접수';
  if not found then raise exception '취소할 수 없는 주문이에요.'; end if;
end;
$$;
revoke all on function public.cancel_my_order(bigint) from public;
grant execute on function public.cancel_my_order(bigint) to authenticated;

-- 주문 접수. p_lines: [{"key":"larch","qty":1,"vessel":false,"wrap":0,"deliv":1} | {"key":"knot","qty":1,"size":"중 70 cm"}]
-- 꽃꽂이 포장(wrap)·받는 방법(deliv) 금액은 web/lib/catalog.ts의 A_WRAP, A_DELIV와 같아야 한다
create or replace function public.place_order(
  p_lines jsonb, p_name text, p_phone text, p_receive_date date, p_memo text
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  wrap_add constant integer[] := array[0, 18000];
  deliv_add constant integer[] := array[0, 15000];
  ship_fee constant integer := 3000;
  ship_free_from constant integer := 50000;
  l jsonb; p public.products; qty integer; unit integer; quick integer; w integer; d integer; size_price integer;
  opt text; items jsonb := '[]'::jsonb;
  items_total integer := 0; quick_total integer := 0; bojagi_total integer := 0; ship integer; new_id bigint;
begin
  if auth.uid() is null then raise exception '로그인이 필요해요.'; end if;
  if jsonb_typeof(p_lines) <> 'array' or jsonb_array_length(p_lines) = 0 or jsonb_array_length(p_lines) > 30 then
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

  insert into public.orders (user_id, name, phone, receive_date, memo, items, items_total, quick_total, ship, total)
  values (auth.uid(), trim(p_name), trim(p_phone), p_receive_date, coalesce(trim(p_memo), ''), items,
          items_total, quick_total, ship, items_total + quick_total + ship)
  returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.place_order(jsonb, text, text, date, text) from public;
grant execute on function public.place_order(jsonb, text, text, date, text) to authenticated;

-- ===== 모임 =====
-- kind: 꽃 모임 / 보자기 매듭 수업 / 계절 찻자리
-- note: 지난 모임 기록 문구. 있으면 '지난 모임에서'에 보인다
create table public.gatherings (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('꽃 모임', '보자기 매듭 수업', '계절 찻자리')),
  title text not null check (char_length(title) between 1 and 60),
  date date not null,
  time_text text not null default '' check (char_length(time_text) <= 40),
  place text not null default '' check (char_length(place) <= 60),
  capacity integer not null default 10 check (capacity between 1 and 100),
  seats_left integer not null default 10 check (seats_left >= 0),
  fee integer not null default 0 check (fee >= 0),
  fee_note text not null default '' check (char_length(fee_note) <= 80),
  description text not null default '' check (char_length(description) <= 600),
  status text not null default '모집 예정' check (status in ('모집 중', '모집 예정', '마감')),
  note text not null default '' check (char_length(note) <= 400),
  visible boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.gatherings enable row level security;
create policy "모임 공개 읽기" on public.gatherings for select to anon, authenticated
  using (visible or (select public.is_admin()));
create policy "관리자 모임 추가" on public.gatherings for insert to authenticated with check ((select public.is_admin()));
create policy "관리자 모임 수정" on public.gatherings for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "관리자 모임 삭제" on public.gatherings for delete to authenticated using ((select public.is_admin()));

-- ===== works =====
-- pic: 기본 사진 이름(ikebana-larch 등), 'ill'(선화), 또는 업로드한 사진의 https 주소
create table public.works (
  id bigint generated always as identity primary key,
  ym date not null,
  cat text not null check (cat in ('space', 'project', 'sub', 'meet')),
  title text not null check (char_length(title) between 1 and 60),
  where_text text not null default '' check (char_length(where_text) <= 60),
  what text not null default '' check (char_length(what) <= 60),
  pic text not null default 'ill' check (char_length(pic) <= 500),
  body text not null default '' check (char_length(body) <= 1000),
  visible boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.works enable row level security;
create policy "works 공개 읽기" on public.works for select to anon, authenticated
  using (visible or (select public.is_admin()));
create policy "관리자 works 추가" on public.works for insert to authenticated with check ((select public.is_admin()));
create policy "관리자 works 수정" on public.works for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "관리자 works 삭제" on public.works for delete to authenticated using ((select public.is_admin()));

-- works 사진 저장소: 누구나 주소로 보고, 관리자만 올리고 지운다
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('works', 'works', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);
create policy "관리자 works 사진 올리기" on storage.objects for insert to authenticated
  with check (bucket_id = 'works' and (select public.is_admin()));
create policy "관리자 works 사진 바꾸기" on storage.objects for update to authenticated
  using (bucket_id = 'works' and (select public.is_admin()));
create policy "관리자 works 사진 지우기" on storage.objects for delete to authenticated
  using (bucket_id = 'works' and (select public.is_admin()));
