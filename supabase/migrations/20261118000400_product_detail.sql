-- 관리자가 제품 사진과 상세 페이지 내용을 직접 등록할 수 있게 한다.
-- photos: 대표 사진(img) 다음에 보이는 추가 사진 주소들
-- body:   상세 설명 (빈 줄로 문단을 나눈다)
-- info:   상세 정보 표 [{"label":"크기","value":"높이 약 60cm"}, ...]

alter table public.products
  add column if not exists photos jsonb not null default '[]'::jsonb
    check (jsonb_typeof(photos) = 'array' and jsonb_array_length(photos) <= 12),
  add column if not exists body text not null default ''
    check (char_length(body) <= 4000),
  add column if not exists info jsonb not null default '[]'::jsonb
    check (jsonb_typeof(info) = 'array' and jsonb_array_length(info) <= 20);

-- 제품 사진 저장소: 누구나 주소로 보고, 관리자만 올리고 지운다
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "관리자 제품 사진 올리기" on storage.objects;
drop policy if exists "관리자 제품 사진 바꾸기" on storage.objects;
drop policy if exists "관리자 제품 사진 지우기" on storage.objects;
create policy "관리자 제품 사진 올리기" on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and (select public.is_admin()));
create policy "관리자 제품 사진 바꾸기" on storage.objects for update to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));
create policy "관리자 제품 사진 지우기" on storage.objects for delete to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));
