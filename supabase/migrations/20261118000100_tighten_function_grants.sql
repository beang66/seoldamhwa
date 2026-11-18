-- Supabase는 새 함수에 anon·authenticated 실행 권한을 기본으로 준다. 필요한 것만 남긴다
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.place_order(jsonb, text, text, date, text) from anon, public;
revoke execute on function public.cancel_my_order(bigint) from anon, public;
-- admins는 API로 읽거나 쓰지 않는다. 정책이 없는 것이 의도다
comment on table public.admins is '관리자 이메일. API 접근 없음(정책 없음이 의도). is_admin()만 읽는다.';
