# Supabase (회원 · 관리자 · 주문 DB)

사이트는 정적 사이트(GitHub Pages)이고, 로그인·주문·관리 데이터는 Supabase에 둔다.
브라우저는 공개(publishable) 키로 접속하고, 누가 무엇을 읽고 쓸 수 있는지는 DB의 RLS 정책이 정한다.

## 들어 있는 것

| 파일 | 내용 |
|---|---|
| `migrations/20261118000000_init.sql` | 테이블(관리자·프로필·제품·주문·모임·works), RLS 정책, 주문 함수 `place_order`, 취소 함수 `cancel_my_order`, works 사진 저장소 |
| `migrations/20261118000100_tighten_function_grants.sql` | 함수 실행 권한 좁히기 |
| `seed.sql` | 지금 사이트의 제품·works·모임 내용과 관리자 이메일 |

## 관리자

`public.admins`에 있는 이메일로 가입한 계정이 관리자다. 추가·삭제는 SQL 편집기에서 한다.

```sql
insert into public.admins (email) values ('new-admin@example.com');
delete from public.admins where email = 'old-admin@example.com';
```

## 새 프로젝트(예: 클라이언트 계정)로 옮기기

1. 새 Supabase 프로젝트를 만든다.
2. SQL 편집기에서 `migrations/` 파일을 이름 순서대로 실행하고, `seed.sql`을 실행한다. 관리자 이메일은 바꿔 넣는다.
3. Authentication → URL Configuration의 Site URL을 사이트 주소로 바꾸고, Redirect URLs에 `https://<사이트 주소>/login/`을 넣는다. (가입 확인·비밀번호 재설정 메일의 링크가 여기로 돌아온다)
4. GitHub 저장소 Settings → Secrets and variables → Actions → Variables에 `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`를 넣는다. 값이 없으면 개발용 프로젝트로 빌드된다.
5. 기존 회원·주문까지 옮겨야 하면 `supabase db dump`로 데이터를 내보내 새 프로젝트에 넣거나, Supabase의 프로젝트 이전(Transfer project) 기능으로 프로젝트를 통째로 클라이언트 조직에 넘긴다.

## 알아둘 점

- 주문 금액은 `place_order`가 `products`의 가격으로 다시 계산한다. 꽃꽂이 포장·퀵 금액은 함수 안의 상수와 `web/lib/catalog.ts`의 `A_WRAP`, `A_DELIV`가 같아야 한다.
- 결제는 아직 없다. 주문은 '접수'로 들어오고, 관리자가 연락해 입금·받는 날을 정한다.
- 선물·정기 구독처럼 상세 페이지가 없는 제품은 아직 온라인 주문을 받지 않는다.
