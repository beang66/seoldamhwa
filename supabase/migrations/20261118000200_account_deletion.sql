-- 회원 탈퇴
-- 계정과 프로필은 바로 지운다. 주문 기록은 전자상거래법상 보관 의무가 있어 계정과의 연결만 끊고,
-- 정해진 기간(retain_until) 동안 관리자만 볼 수 있게 남긴 뒤 purge_expired_orders()로 개인정보를 지운다.
-- 정확한 보관 항목과 기간은 개인정보처리방침을 확정할 때 다시 확인한다.

alter table public.orders alter column user_id drop not null;
alter table public.orders drop constraint orders_user_id_fkey;
alter table public.orders add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

alter table public.orders add column account_deleted_at timestamptz;
alter table public.orders add column retain_until timestamptz;
alter table public.orders add column purged_at timestamptz;

create or replace function public.delete_my_account()
returns void
language plpgsql security definer set search_path = ''
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception '로그인이 필요해요.'; end if;
  -- 진행 중인 주문이 있으면 먼저 끝내야 한다
  if exists (select 1 from public.orders where user_id = uid and status in ('확인', '준비 중')) then
    raise exception '준비 중인 주문이 있어요. 주문이 끝난 뒤 탈퇴해 주세요.';
  end if;
  -- 아직 접수 상태인 주문은 취소한다
  update public.orders set status = '취소' where user_id = uid and status = '접수';
  update public.orders
     set account_deleted_at = now(),
         retain_until = created_at + interval '5 years',
         user_id = null
   where user_id = uid;
  delete from auth.users where id = uid; -- profiles는 cascade로 함께 지워진다
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- 보관 기간이 지난 탈퇴 회원 주문의 개인정보를 지운다. (주기 실행은 pg_cron 등으로 따로 건다)
create or replace function public.purge_expired_orders()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare n integer;
begin
  update public.orders
     set name = '(삭제됨)', phone = '000000', memo = '', admin_note = '', purged_at = now()
   where retain_until is not null and retain_until < now() and purged_at is null;
  get diagnostics n = row_count;
  return n;
end;
$$;
revoke all on function public.purge_expired_orders() from public, anon, authenticated;
