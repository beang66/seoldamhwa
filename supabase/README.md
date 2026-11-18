# Supabase (회원 · 관리자 · 주문 DB)

사이트는 정적 사이트(GitHub Pages)이고, 로그인·주문·관리 데이터는 Supabase에 둔다.
브라우저는 공개(publishable) 키로 접속하고, 누가 무엇을 읽고 쓸 수 있는지는 DB의 RLS 정책이 정한다.

## 들어 있는 것

| 파일 | 내용 |
|---|---|
| `migrations/20261118000000_init.sql` | 테이블(관리자·프로필·제품·주문·모임·works), RLS 정책, 주문 함수 `place_order`, 취소 함수 `cancel_my_order`, works 사진 저장소 |
| `migrations/20261118000100_tighten_function_grants.sql` | 함수 실행 권한 좁히기 |
| `migrations/20261118000200_account_deletion.sql` | 회원 탈퇴 `delete_my_account`(주문은 계정과 분리해 5년 보관), 보관 기간 지난 주문 정리 `purge_expired_orders` |
| `migrations/20261118000300_review_fixes.sql` | 관리자는 메일 인증을 마친 계정만, 금액 계산을 `price_lines`로 모음, 주문 전 금액 보기 `quote_order`, 주문 때 받는 날·합계 확인 |
| `seed.sql` | 지금 사이트의 제품·works·모임 내용 (관리자 이메일은 넣지 않음) |
| `functions/notify-new-order/` | 새 주문을 관리자에게 메일로 알리는 Edge Function (메일 서비스 키를 넣어야 켜짐) |

개발용 프로젝트(qpixniiuyyrhafzjzcwk)에는 위 마이그레이션이 모두 적용되어 있다. 단 `20261118000300`은 SQL 편집기에서 직접 실행해서 Supabase의 마이그레이션 기록에는 없다. `supabase db push`를 쓸 때는 먼저 `supabase migration repair --status applied 20261118000300`으로 기록을 맞춘다.

데이터 구조 그림은 [`docs/erd.md`](../docs/erd.md)에 있다.

## 관리자

`public.admins`에 있는 이메일로 가입하고 메일 인증을 마친 계정이 관리자다. 추가·삭제는 SQL 편집기에서 한다.
공개 저장소이므로 실제 관리자 이메일은 저장소 파일에 적지 않는다.

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

## 새 주문 메일 알림 켜기

1. [Resend](https://resend.com) 같은 메일 서비스에 가입하고, 보내는 도메인을 인증한 뒤 API 키를 받는다.
2. 비밀값을 넣는다: `supabase secrets set RESEND_API_KEY=... MAIL_FROM="설담화 <order@도메인>" WEBHOOK_SECRET=<임의의 긴 문자열>`
3. 함수를 배포한다: `supabase functions deploy notify-new-order --no-verify-jwt`
4. 대시보드 Database → Webhooks에서 `public.orders`의 INSERT를 이 함수 주소로 보내고, 헤더 `x-webhook-secret`에 2번의 값을 넣는다.

같은 메일 서비스를 Authentication → SMTP Settings에 넣으면 가입 확인·비밀번호 재설정 메일도 일반 손님에게 간다.

## 보관 기간 지난 주문 정리

`purge_expired_orders()`는 탈퇴한 회원의 주문 중 보관 기간이 끝난 것의 이름·연락처·요청을 지운다. Database → Cron(pg_cron)에서 하루 한 번 실행하도록 건다.

```sql
select cron.schedule('purge-expired-orders', '0 4 * * *', $$select public.purge_expired_orders()$$);
```

## 알아둘 점

- 주문 금액은 `place_order`가 `products`의 가격으로 다시 계산한다. 꽃꽂이 포장·퀵 금액은 함수 안의 상수와 `web/lib/catalog.ts`의 `A_WRAP`, `A_DELIV`가 같아야 한다.
- 사업자 정보는 `web/lib/business.ts` 한 곳에서 채운다. 푸터와 약관·개인정보처리방침·환불 정책이 이 값을 쓴다.
- 결제는 아직 없다. 주문은 '접수'로 들어오고, 관리자가 연락해 입금·받는 날을 정한다.
- 선물·정기 구독처럼 상세 페이지가 없는 제품은 아직 온라인 주문을 받지 않는다.
