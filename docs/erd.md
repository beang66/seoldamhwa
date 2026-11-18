# 설담화 데이터 구조 (ERD)

2026-11-18 기준. 현재 구조는 `supabase/migrations/`에 있는 그대로이고, 목표 구조는 [기능 정의서](https://app.notion.com/p/41c95143816a818ebd0cebf22d140943)의 추천안을 따랐을 때의 모습이다.
플랫폼(카페24·아임웹)을 고르면 회원·주문·결제 쪽은 플랫폼이 대신하므로 목표 구조 중 works·모임 정도만 남는다.

## 현재 구조

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : "가입하면 자동 생성"
  AUTH_USERS |o--o{ ORDERS : "user_id, 탈퇴하면 연결만 끊음"
  ADMINS |o..o| AUTH_USERS : "같은 이메일이면 관리자"
  ORDERS }o..o{ PRODUCTS : "items JSON 안의 key"

  AUTH_USERS {
    uuid id PK
    text email
  }
  PROFILES {
    uuid id PK "auth.users.id"
    text name
    text phone
    timestamptz created_at
  }
  ADMINS {
    text email PK "소문자"
  }
  PRODUCTS {
    text key PK "주소 이름 (larch, knot)"
    text cat "arrange gift bojagi sub"
    text name
    text meta "목록 카드 한 줄"
    int price "기본 가격"
    jsonb sizes "보자기 크기별 가격"
    int vessel_off "꽃꽂이 화기 뺄 때 할인"
    text img "기본 사진 이름"
    bool has_detail "코드에 상세 페이지가 있는가"
    bool sold_out
    bool visible
    int sort
  }
  ORDERS {
    bigint id PK
    uuid user_id FK "탈퇴하면 null"
    text status "접수 확인 준비중 완료 취소"
    text name
    text phone
    date receive_date
    text memo
    jsonb items "상품 이름 옵션 단가 수량 묶음"
    int items_total
    int quick_total
    int ship
    int total
    text admin_note "고객에게 보이는 메모"
    timestamptz created_at
    timestamptz account_deleted_at "탈퇴 시각"
    timestamptz retain_until "법정 보관 끝"
    timestamptz purged_at "개인정보 지운 시각"
  }
  GATHERINGS {
    bigint id PK
    text kind "꽃 모임 보자기 수업 찻자리"
    text title
    date date
    text time_text
    text place
    int capacity
    int seats_left
    int fee
    text fee_note
    text description
    text status "모집 예정 모집 중 마감"
    text note "지난 모임 기록"
    bool visible
  }
  WORKS {
    bigint id PK
    date ym "월"
    text cat "space project sub meet"
    text title
    text where_text
    text what
    text pic "기본 사진 이름 또는 업로드 주소"
    text body
    bool visible
  }
```

DB 함수: `place_order`(가격을 DB에서 다시 계산해 주문 접수), `cancel_my_order`(접수 상태만 본인 취소), `delete_my_account`(탈퇴), `purge_expired_orders`(보관 기간 지난 주문 개인정보 지우기), `is_admin`.
사진 저장소: `works` 버킷(누구나 보기, 관리자만 올리기).

현재 구조의 한계:

- 주문 상품이 `orders.items` JSON에 묶여 있어 상품별 판매량을 세거나 부분 환불을 하기 어렵다.
- 옵션(화기·포장·받는 방법) 금액이 DB 함수와 코드에 박혀 있어, 관리자가 바꿀 수 없다.
- 상세 설명·사진·사양이 코드에 있어 새 상품은 상세 페이지 없이 목록에만 보인다.
- 결제·모임 신청·알림 기록이 없다.

## 목표 구조

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : ""
  AUTH_USERS |o--o{ ORDERS : "회원 주문 (비회원은 null)"
  AUTH_USERS ||--o{ GATHERING_SIGNUPS : "모임 신청은 회원만"
  STAFF |o..o| AUTH_USERS : "이메일로 판별, 역할 있음"
  PRODUCTS ||--o{ PRODUCT_OPTIONS : ""
  PRODUCTS ||--o{ PRODUCT_IMAGES : ""
  ORDERS ||--|{ ORDER_ITEMS : ""
  PRODUCTS ||--o{ ORDER_ITEMS : "주문 당시 이름 가격은 따로 저장"
  ORDERS ||--o{ PAYMENTS : "재결제 부분환불 대비 1대다"
  ORDERS ||--o{ ORDER_EVENTS : "상태 바뀐 기록"
  GATHERINGS ||--o{ GATHERING_SIGNUPS : ""
  GATHERING_SIGNUPS |o--o| PAYMENTS : "참가비"
  ORDERS |o--o{ NOTIFICATIONS : ""
  GATHERING_SIGNUPS |o--o{ NOTIFICATIONS : ""

  PROFILES {
    uuid id PK
    text name
    text phone
    bool marketing_opt_in "마케팅 수신 동의"
    timestamptz marketing_opt_in_at
  }
  STAFF {
    text email PK
    text role "owner staff"
  }
  PRODUCTS {
    text key PK
    text cat
    text name
    text summary "목록 한 줄"
    text description "상세 설명"
    int base_price
    jsonb specs "사양표"
    text detail_template "공통 틀 또는 전용 페이지"
    bool sold_out
    bool visible
    int sort
  }
  PRODUCT_OPTIONS {
    bigint id PK
    text product_key FK
    text group_name "크기 화기 포장 받는방법"
    text label
    int price_delta
    int sort
    bool active
  }
  PRODUCT_IMAGES {
    bigint id PK
    text product_key FK
    text path "사진 저장소 경로"
    text alt
    int sort
  }
  DAILY_CAPACITY {
    date day PK
    text cat PK
    int max_orders
  }
  ORDERS {
    bigint id PK
    uuid user_id FK "비회원이면 null"
    text guest_email "비회원 주문 조회"
    text guest_code "비회원 주문 조회"
    text status "결제대기 결제완료 제작중 보냈어요 완료 취소환불"
    text receive_method "픽업 퀵 택배"
    date receive_date
    text receiver_name
    text receiver_phone
    text address
    int items_total
    int delivery_fee
    int total
    text memo
    text admin_note
    text tracking_no
    timestamptz created_at
    timestamptz retain_until
    timestamptz purged_at
  }
  ORDER_ITEMS {
    bigint id PK
    bigint order_id FK
    text product_key FK
    text name_snapshot
    jsonb options_snapshot
    int unit_price
    int qty
  }
  PAYMENTS {
    bigint id PK
    bigint order_id FK
    bigint signup_id FK
    text provider "PG사 또는 무통장"
    text method "카드 네이버페이 등"
    int amount
    text status "대기 승인 취소 부분환불"
    text pg_tx_id
    int refunded_amount
    timestamptz approved_at
  }
  ORDER_EVENTS {
    bigint id PK
    bigint order_id FK
    text from_status
    text to_status
    uuid actor_id "손님 관리자 시스템"
    text note
    timestamptz at
  }
  GATHERINGS {
    bigint id PK
    text title
    date date
    int capacity
    int fee
    text status
  }
  GATHERING_SIGNUPS {
    bigint id PK
    bigint gathering_id FK
    uuid user_id FK
    text status "신청 확정 취소"
    timestamptz created_at
  }
  WORKS {
    bigint id PK
    date ym
    text title
    text pic
  }
  NOTIFICATIONS {
    bigint id PK
    text kind "새주문 결제완료 보냈어요 모임전날"
    text channel "이메일 알림톡"
    text to_addr
    text status
    timestamptz sent_at
  }
  AUDIT_LOG {
    bigint id PK
    uuid actor_id
    text table_name
    text row_key
    jsonb change "가격 변경 환불 등"
    timestamptz at
  }
```

## 바뀌는 점과 기다리는 결정

| 바뀌는 점 | 이유 | 기다리는 결정 (기능 정의서) |
| --- | --- | --- |
| 주문 상품을 `order_items`로 분리 | 상품별 집계, 부분 환불 | 없음 (직접 개발이면 진행) |
| `product_options`, `product_images`, 상세 설명을 DB로 | 관리자가 새 상품을 상세 페이지까지 만들 수 있게 | 4장 관리자가 고칠 범위 |
| 주문 상태를 6단계로 | 결제·알림·마이페이지의 기준 | 1장 주문 흐름 |
| `payments` 추가 | PG 승인·환불 기록 | 1장 돈 받는 방식, 6장 연동 방식 |
| 비회원 주문 칸 | 가입 없이 주문 | 3장 비회원 주문 |
| `daily_capacity` 추가 | 날짜별 제작 한도 | 2장 하루 한도 |
| `gathering_signups` 추가 | 모임 신청과 자리 관리 | 2장 모임 신청 방식 |
| `admins` → `staff`(역할) | 대표·스태프 권한 구분 | 5장 역할 구분 |
| `order_events`, `audit_log` | 누가 언제 무엇을 바꿨는지 | 5장 기록 남기기 |
| `notifications` | 보낸 알림 기록, 다시 보내기 | 6장 알림 채널 |
| 마케팅 수신 동의 칸 | 정보통신망법상 별도 동의 | 3장 모으는 정보 |
