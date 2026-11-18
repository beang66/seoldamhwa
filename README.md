# 🌸 설담화 說談話

> **"말로 다 못 한 마음을 꽃으로 전합니다."**

한국 예술의 미학 검소하되 누추하지 않은, 화려하되 사치하지 않음을 현대적으로 재해석한 프리미엄 플로럴 스튜디오 설담화(說談花)의 풀스택 웹 플랫폼입니다.
고객을 위한 온라인 쇼핑몰과 1인 브랜드 대표를 위한 직관적인 관리자 센터로 구성되어 있습니다.

<div align="center">

[![배포 사이트](https://img.shields.io/badge/배포_사이트-beang66.github.io%2Fseoldamhwa-2F56A8?style=for-the-badge&logo=githubpages&logoColor=white)](https://beang66.github.io/seoldamhwa/)
[![발표 장표](https://img.shields.io/badge/발표_장표-18장-141413?style=for-the-badge&logo=googleslides&logoColor=white)](#slides)
[![데이터 구조](https://img.shields.io/badge/데이터_구조-ERD-4F4C48?style=for-the-badge&logo=postgresql&logoColor=white)](#erd)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=fff)
![Supabase](https://img.shields.io/badge/Supabase-Postgres·Auth·Storage-3FCF8E?style=flat-square&logo=supabase&logoColor=fff)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-정적_배포-222?style=flat-square&logo=githubpages)

<br>

<img src="docs/screenshots/home.png" alt="설담화 메인 화면" width="95%">

</div>

**🗓️ 작업 기간** 2026.10.29 – 2026.11.18 · **👤 역할** 브랜드 기획·BI/CI·디자인·검수 안정빈 / 구현 Claude Code

### 🏆 핵심 성과

| 화면 | 상품 | DB 테이블 | 관리자 탭 |
| :---: | :---: | :---: | :---: |
| **14종** (주소 19개) | **9개** | **6개** | **4개** |

| 🎨 브랜드 → 화면 | 🛒 쇼핑몰 | 🔐 데이터 보호 | 🛠️ 관리자 센터 |
| :---: | :---: | :---: | :---: |
| **C안을 디자인 규칙으로** | **옵션별 금액 바로 계산** | **서버 없이도 금액·권한 보호** | **코드 없이 운영** |
| 인터뷰 기준 → A·B·C 시안<br>한국화의 여백·필선·낙관<br>쪽빛은 한 화면에 한 점 | 화기·포장·받는 방법 옵션<br>장바구니·되돌리기<br>받는 날은 내일부터 | DB 함수가 금액 재계산<br>RLS로 읽기·쓰기 제한<br>탈퇴 시 주문 분리 보관 | 주문 상태·메모<br>상품·사진·상세 등록<br>모임·works 관리 |

---

## 📑 목차

1. [📋 서비스 기획서](#plan)
2. [🎯 기획 배경](#background)
3. [🖌️ 브랜드 컨셉과 디자인 시스템](#brand)
4. [🏗️ 시스템 아키텍처와 핵심 플로우](#architecture)
5. [✨ 주요 화면](#features)
6. [🧩 기능별 핵심 특징과 구현 상세](#details)
7. [💡 기술적 의사결정](#decisions)
8. [📂 주요 폴더 구조와 데이터 모델](#structure)
9. [🚀 실행 방법](#run)
10. [✅ 검증 결과](#verify)
11. [📈 회고](#retro)
12. [🗺️ 로드맵 — 데이터 리포트 · SEO · 판매 전략](#roadmap)
13. [🎞️ 발표 장표](#slides)
14. [📄 라이선스](#license)

---

<a id="plan"></a>
## 📋 1. 서비스 기획서

### 🏷️ 브랜드명

| 글자 | 뜻 |
| :---: | --- |
| **說** 설 | 대표 이름의 '설'이자 '말씀·이야기 설' — 이야기를 전하는 브랜드 |
| **談話** 담화 | 주고받는 이야기. 편지·손글씨처럼 마음을 건네는 말 |
| **담다 · 닮다** | 대표의 초기 메모 — 당신을 닮다, 꽃을 담다, 이야기를 담다 |

### 💬 슬로건

> **말로 다 못 한 마음을 꽃으로 전합니다.**
> 사이트 첫 화면의 한 줄: *꽃으로 건네는 말*

### 🧭 핵심 철학

> **儉而不陋 華而不侈** — 검소하되 누추하지 않고, 화려하되 사치하지 않게

| 미션 | 핵심 가치 |
| --- | --- |
| 한 번 쓰고 버려지는 선물의 순간을, 다시 쓰이는 이야기로 되살린다 | **♻️ 순환** 포장을 버리지 않고 다음 쓰임으로 · **🏮 헤리티지** 한국적 소재와 미감을 올드하지 않게, 위트 있게 · **🎁 맞춤** 받는 사람의 이야기를 담은 꽃 |

### 💡 핵심 컨셉

| 컨셉 | 서비스에서 |
| --- | --- |
| **절기의 꽃 한 줄기** | 계절이 바뀌면 메인 첫 장과 '이번 절기의 꽃'이 바뀜 (입동 · 立冬) |
| **다시 쓰는 보자기** | 꽃꽂이를 보자기로 싸는 옵션, 보자기 단품 판매 — 포장이 두 번째 선물이 됨 |
| **한 폭의 한국화처럼** | 꽃 한 줄기와 넓은 여백, 먹 한 계열의 글자, 쪽빛 한 점 |
| **혼자서도 운영** | 1인 대표가 코드 없이 상품·사진·모임·작업 기록을 바꾸는 관리자 센터 |

### 🎨 시각적 정체성

| 요소 | 규칙 |
| --- | --- |
| 색 | ![](https://img.shields.io/badge/바탕-%23F4F3EF-F4F3EF?style=flat-square) ![](https://img.shields.io/badge/아이보리-%23F4EFE4-F4EFE4?style=flat-square) ![](https://img.shields.io/badge/먹-%23141413-141413?style=flat-square) ![](https://img.shields.io/badge/쪽빛-%232F56A8-2F56A8?style=flat-square) — 쪽빛은 한 화면에 한 점만 |
| 글꼴 | 제목 Noto Serif KR · 본문 Noto Sans KR · 영문 EB Garamond · 목록의 이름·가격 Montserrat |
| 로고 방향 | 손글씨 형식의 한글 '설담화' (C안) |
| 그래픽 | 가는 선의 손그림(꽃병·보자기), 한지 결, 음각·양각 |
| 사진 | 어두운 벽 앞 작은 화기에 꽂은 꽃 한 줄기 |
| 레이아웃 | 본문 폭 1200px, 양옆 여백, 섹션마다 같은 바탕색 |

### 📌 프로젝트 정보

| 항목 | 내용 |
| --- | --- |
| 대상 | 꽃 선물을 고르는 손님, 혼자 운영하는 대표 |
| 기간 | 2026.10.29 대표 인터뷰 – 2026.11.18 |
| 역할 | 브랜드 기획·BI/CI·디자인 판단·클라이언트 협의·검수: 안정빈 / 구현: Claude Code / 브랜드 방향 결정: 설담화 대표 |
| 실행 환경 | 정적 사이트(GitHub Pages) + Supabase(서울 리전), 데스크톱·모바일 브라우저 |

<a id="background"></a>
## 🎯 2. 기획 배경

| 문제 | 왜 문제인가 | 해결 |
| --- | --- | --- |
| 꽃 선물의 포장은 한 번 쓰고 버려진다 | 대표 인터뷰(2026-10-29)에서 브랜드의 출발점으로 확인 | 꽃꽂이에 보자기 포장을 옵션으로 붙이고, 보자기만 따로 살 수 있게 함 |
| 꽃은 받는 날과 받는 방법이 중요하다 | 같은 상품도 화기·포장·퀵 여부에 따라 값이 달라짐 | 옵션별로 금액을 바로 계산하고, 받는 날은 내일부터 고르게 함 |
| 상품·가격·사진이 절기마다 바뀐다 | 혼자 운영하는 대표가 코드를 고칠 수 없음 | 관리자 페이지에서 상품·사진·상세 설명·모임·works를 등록·수정·삭제 |
| 정적 사이트에는 서버가 없다 | 브라우저가 계산한 금액은 손님이 바꿀 수 있음 | 주문 금액을 DB 함수가 다시 계산하고, 권한은 DB 정책(RLS)이 정함 |

<a id="brand"></a>
## 🖌️ 3. 브랜드 컨셉과 디자인 시스템

```mermaid
flowchart LR
    subgraph S1["1. 이야기"]
        A["버려지는 포장<br>잠든 전통 원단"] --> B["미션<br>다시 쓰이는 이야기로"]
    end
    subgraph S2["2. 기준"]
        C["킥오프 인터뷰<br>Natural · 사람 · 곡선"]
    end
    subgraph S3["3. 시안"]
        D["A 선과 여백"]
        E["B 먹 + 쪽빛"]
        F["C 소프트 톤온톤"]
    end
    subgraph S4["4. 결정 · 11.06"]
        G["C 중심<br>+ A의 여백 + B의 쪽빛"]
    end
    subgraph S5["5. 화면"]
        H["디자인 토큰"] --> I["웹사이트"]
    end
    B --> C --> D & E & F --> G --> H
```

### 🌾 컨셉 모티브

| 모티브 | 가져온 것 |
| --- | --- |
| 한지 결 | 닥섬유가 비치는 종이 질감 → 아이보리 바탕, 음각·양각 |
| 도라지 판화 | 우리 들꽃을 쪽빛 점묘로 → 손그림 키비주얼, 블루 포인트 |
| 보자기 장면 | 보자기 매듭·백자 화병·양각 한지 카드·복주머니 → 아이보리 × 쪽빛 조합 |
| 쪽빛 밤 회화 | 한 화면을 쪽빛으로 채우고 흰 달 한 점 → '쪽빛 한 점'의 절제 |

### 🖼️ 한국화에서 빌려온 규칙

| 한국화 | 뜻 | 설담화에서 |
| --- | --- | --- |
| 여백 餘白 | 그리지 않은 자리도 그림의 일부 | 꽃 한 줄기와 넓은 빈 바탕, 본문 폭 1200px과 양옆 여백 |
| 묵분오채 墨分五彩 | 먹 하나의 농담으로 다섯 빛 | 글자·선은 `#141413` `#4F4C48` `#66625C` `#D9D5CD` 한 계열 |
| 필선 筆線 | 붓으로 단번에 그은 가는 선 | 꽃병·보자기 손그림, 1.2–1.6px 선 |
| 한지와 안료 | 종이 결에 스며든 색 | 바탕 `#F4F3EF`, 아이보리 `#F4EFE4` |
| 낙관 落款 | 그림을 마무리하는 도장 하나 | 쪽빛 `#2F56A8`은 버튼의 점·현재 메뉴·선택 상태에만 |

### 🔗 브랜드 메시지 → 디자인 토큰 → 화면

| 브랜드의 말 | 디자인 규칙 | 화면 |
| --- | --- | --- |
| 儉而不陋 | 배경은 한 가지 색, 장식선 대신 여백 | 전 페이지 공통 배경, 섹션 구분선 폭 1200px 통일 |
| 절기와 계절 | 절기 이름을 라벨로 (입동 · 立冬) | 메인 히어로, '입동의 꽃' 섹션 |
| 이야기를 담다 | 상품마다 소재를 고른 이유 한 문단 | 상세페이지 본문, works 기록 |
| 한국적이되 킥이 있게 | 제목 Noto Serif KR · 본문 Noto Sans KR · 영문 EB Garamond · 목록 숫자 Montserrat | 전 페이지 |

색·글꼴·간격·컴포넌트 전체 규칙은 [`DESIGN.md`](DESIGN.md)에 있습니다.

<a id="architecture"></a>
## 🏗️ 4. 시스템 아키텍처와 핵심 플로우

### 🧱 기술 스택과 시스템 구조

| 계층 | 기술 | 이 프로젝트에서 맡은 일 |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router, 정적 내보내기), React 19, TypeScript | 페이지별 주소, 미리 만든 정적 페이지 |
| Styling | 순수 CSS + 디자인 토큰(CSS 변수), `next/font` | 3장의 색·글꼴·여백 규칙 |
| Backend·DB | Supabase (Postgres, Auth, Storage, Edge Function) | 회원·주문·상품·사진·새 주문 알림 |
| 배포 | GitHub Actions → GitHub Pages | `main`에 푸시하면 빌드·배포 |

```mermaid
flowchart TB
    subgraph Client["🖥️ 브라우저"]
        UI["정적 페이지 (GitHub Pages)"]
        LS[("localStorage<br>장바구니")]
        UI --- LS
    end
    subgraph SB["☁️ Supabase"]
        AUTH["Auth<br>이메일 가입·로그인·메일 인증"]
        subgraph PG["Postgres · RLS"]
            Q["quote_order<br>금액 미리 보기"]
            P["place_order<br>금액 재계산 후 접수"]
            T[("profiles · products · orders<br>gatherings · works · admins")]
        end
        ST[("Storage<br>products · works 사진")]
        EF["Edge Function<br>notify-new-order"]
    end
    UI -->|"공개 키"| AUTH
    UI --> Q & P
    P --> T
    UI -->|"관리자만 업로드"| ST
    T -.->|"새 주문 · 메일 키가 있을 때"| EF
```

| 주요 DB 함수 | 하는 일 |
| --- | --- |
| `quote_order` | 장바구니 내용을 지금 가격으로 다시 계산 |
| `place_order` | 금액을 다시 계산해 화면 합계와 같을 때만 주문 접수 |
| `cancel_my_order` | 손님이 '접수' 단계의 자기 주문을 취소 |
| `delete_my_account` | 탈퇴. 계정은 지우고 주문은 계정과 분리해 5년 보관 |
| `is_admin` | 등록된 이메일 중 메일 인증을 마친 계정만 관리자로 판단 |

<a id="erd"></a>
### 🗄️ ERD

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "가입 때 자동 생성"
    AUTH_USERS |o--o{ ORDERS : "주문 (탈퇴 시 연결만 끊김)"
    ADMINS |o..o| AUTH_USERS : "이메일 + 메일 인증 = 관리자"
    ORDERS }o..o{ PRODUCTS : "items[].key"

    AUTH_USERS {
        uuid id PK
        text email
    }
    PROFILES {
        uuid id PK,FK "auth.users"
        text name "이름"
        text phone "연락처"
        timestamptz created_at
    }
    ADMINS {
        text email PK "소문자"
    }
    PRODUCTS {
        text key PK "주소 이름"
        text cat "arrange·gift·bojagi·sub"
        text name
        int price "기본가"
        jsonb sizes "보자기 크기별 가격"
        int vessel_off "화기 제외 차감"
        text img
        jsonb photos "상세 사진 최대 12"
        text body "상세 설명"
        jsonb info "상세 정보 표"
        bool sold_out
        bool visible
        int sort
    }
    ORDERS {
        bigint id PK
        uuid user_id FK "null 허용"
        text status "접수·확인·준비 중·완료·취소"
        text name
        text phone
        date receive_date "받는 날"
        jsonb items "상품 줄"
        int items_total
        int quick_total
        int ship
        int total "서버 계산"
        text admin_note
    }
    GATHERINGS {
        bigint id PK
        text kind "꽃 모임·매듭 수업·찻자리"
        date date
        text place
        int capacity
        int seats_left
        int fee
        text status "모집 중·예정·마감"
    }
    WORKS {
        bigint id PK
        date ym "연월"
        text cat "space·project·sub·meet"
        text title
        text pic
        text body
    }
```

### 🔄 핵심 비즈니스 플로우

```mermaid
flowchart LR
    subgraph Customer["🛒 손님"]
        A["절기 상품 보기"] --> B["옵션 고르기<br>화기·포장·받는 방법"]
        B --> C["장바구니<br>localStorage"]
        C --> D["로그인"]
        D --> E["받는 분·받는 날 입력"]
    end
    subgraph Server["🔐 Supabase"]
        F{"place_order<br>서버 금액 = 화면 합계?"}
        G[("orders · 접수")]
    end
    subgraph Owner["🛠️ 대표"]
        H["새 주문 메일"]
        I["상태 변경<br>확인 → 준비 중 → 완료"]
        J["상품·사진·모임·works 등록"]
    end
    E --> F
    F -->|같음| G
    F -->|다름| C
    G -.-> H --> I
    J -->|products · works · gatherings| A
```

```mermaid
stateDiagram-v2
    state "준비 중" as prep
    [*] --> 접수 : place_order
    접수 --> 확인 : 대표
    확인 --> prep : 대표
    prep --> 완료 : 대표
    접수 --> 취소 : 손님 cancel_my_order
    확인 --> 취소 : 대표
    prep --> 취소 : 대표
    완료 --> [*]
    취소 --> [*]
```

### ⚙️ 주문 처리 시퀀스와 가격 규칙

```mermaid
sequenceDiagram
    autonumber
    actor C as 손님
    participant UI as 상세·장바구니
    participant DB as Supabase Postgres
    participant M as notify-new-order
    actor O as 대표

    C->>UI: 옵션 고르기 · 장바구니 담기
    UI->>UI: localStorage에 저장, 합계 표시
    UI->>DB: quote_order (지금 가격으로 재계산)
    DB-->>UI: 줄별 금액 · 합계
    C->>UI: 로그인 후 받는 분·연락처·받는 날 입력
    UI->>DB: place_order (화면 합계와 함께)
    alt 서버 합계와 같음
        DB-->>UI: 주문 번호
        DB-)M: 새 주문 알림 (메일 키가 있을 때)
        O->>DB: 관리자 화면에서 상태 변경 · 메모
    else 가격이 바뀜
        DB-->>UI: 거절 · 지금 가격으로 다시 보여 줌
    end
```

| 규칙 | 값 | 적용 |
| --- | --- | --- |
| 꽃꽂이 기본가 | 화기 포함 (예: 낙엽송과 연잎 68,000원) | 화기를 빼면 상품별 금액만큼 차감 (예: −18,000원) |
| 포장 | 감싸개 기본 포함 · 매듭 보자기 +18,000원 | 꽃꽂이 옵션 |
| 받는 방법 | 작업실 픽업 무료 · 서울 당일 퀵 +15,000원 | 꽃꽂이는 택배로 보내지 않음 |
| 보자기 택배비 | 3,000원, 50,000원 이상 무료 | 보자기 단품 |
| 받는 날 | 내일부터 선택 | 모든 주문 |
| 취소 | '접수' 단계에서만 손님이 직접 취소 | 마이페이지 |

<a id="features"></a>
## ✨ 5. 주요 화면

### 🏠 메인

<p align="center">
  <img src="docs/screenshots/home-full.jpg" alt="메인 페이지 전체 화면 — 섹션 번호 1–7" width="62%">
  &nbsp;
  <img src="docs/screenshots/mobile.png" alt="메인 모바일" width="24%">
</p>

| 번호 | 섹션 | 내용 |
| :---: | --- | --- |
| 1 | 헤더 | 로고 왼쪽, 메뉴·장바구니·내 정보 오른쪽. 히어로와 겹치지 않게 분리 |
| 2 | 히어로 | 절기 라벨(입동 · 立冬), "꽃으로 건네는 말", 쪽빛 점 버튼. 6초마다 넘어가고 위치 바를 누르면 그 장으로 이동 |
| 3 | 입동의 꽃 | 이번 절기 제품 4개를 정사각 사진으로, 제목 옆 손그림 꽃병, 모든 제품 보기 |
| 4 | 다시 쓰는 보자기 | 보자기 사진과 세로쓰기 문장 — 브랜드의 출발점인 '다시 쓰는 포장' |
| 5 | 계절마다 남긴 꽃 | works 대표 사진과 연월별 작업 기록 목록 |
| 6 | 꽃을 사이에 두고 나누는 이야기 | 꽃 모임 일정·장소·남은 자리 카드 |
| 7 | 푸터 | 로고와 손그림 꽃병 한 점, 연락처, 약관, 사업자 정보 |

### 🌿 제품 목록 · 상세

<p align="center">
  <img src="docs/screenshots/shop.png" alt="제품 목록" width="48%">
  <img src="docs/screenshots/detail-bojagi.png" alt="보자기 상세" width="48%">
</p>

- 꽃꽂이·선물·보자기·정기 구독 분류, 가격순 정렬. 한 줄 3개 정사각 사진, 분류는 주소(`/shop?cat=bojagi`)에 남음
- 보자기는 크기, 꽃꽂이는 화기·포장·받는 방법을 고르면 금액이 바로 바뀜
- 관리자가 등록한 상품은 사진·상세 설명·상세 정보 표로 상세 페이지가 만들어짐(`/shop/item?k=주소이름`)

<details>
<summary>꽃꽂이 상세 전체 화면</summary>

![꽃꽂이 상세](docs/screenshots/detail-arrangement.jpeg)
</details>

### 🛒 장바구니 · 🔑 로그인 · 마이페이지

<p align="center">
  <img src="docs/screenshots/cart.png" alt="장바구니" width="48%">
  <img src="docs/screenshots/login.png" alt="로그인" width="48%">
</p>

- 수량을 바꾸면 상품 금액·퀵·택배비·합계를 다시 계산. 뺀 상품은 알림에서 되돌리기
- 이메일 가입·로그인·비밀번호 찾기, 마이페이지에서 주문 내역·접수 단계 취소·정보 수정·탈퇴

### 📷 works

![works](docs/screenshots/works.png)

- 공간 연출·프로젝트·구독·모임 분류로 작업 기록을 모아 봄. 고른 분류는 주소에 남음

### 🛠️ 관리자

<p align="center">
  <img src="docs/screenshots/admin-orders.png" alt="관리자 주문" width="48%">
  <img src="docs/screenshots/admin-products.png" alt="관리자 제품 목록" width="48%">
</p>

<details>
<summary>제품 사진·상세 등록 화면</summary>

![제품 사진·상세 등록](docs/screenshots/admin-product-edit.png)
</details>

- 주문 상태 변경과 손님에게 보이는 메모
- 제품·모임·works 등록·수정·삭제, 대표·상세 사진 올리기, 상세 설명·상세 정보 입력
- 저장하지 않고 다른 탭으로 가면 확인을 받음

<details>
<summary>전체 주소 19개</summary>

| 주소 | 화면 |
| --- | --- |
| `/` | 메인 |
| `/shop` | 제품 목록 |
| `/shop/larch` `/shop/bamboo` `/shop/daffodil` `/shop/nasturtium` | 꽃꽂이 상세 |
| `/shop/wrap` `/shop/knot` | 보자기 상세 |
| `/shop/item?k=주소이름` | 관리자가 등록한 상품의 상세 |
| `/about` · `/works` · `/community` · `/cart` | 브랜드 소개 · 작업 기록 · 꽃 모임 · 장바구니 |
| `/login` · `/mypage` · `/admin` | 로그인·회원가입 · 마이페이지 · 관리자 |
| `/terms` · `/privacy` · `/refund` | 이용약관 · 개인정보처리방침 · 취소·환불 |
</details>

<a id="details"></a>
## 🧩 6. 기능별 핵심 특징과 구현 상세

| 기능 | 핵심 특징 | 구현 상세 |
| --- | --- | --- |
| 🎞️ 히어로 슬라이더 | 6초마다 넘어감, 위치 바를 누르면 그 장으로 이동 | `HeroSlider.tsx` · 위치 바는 44px 터치 영역과 'N번째 장으로 이동' 안내, 첫 장 사진 미리 불러오기 |
| 🌿 제품 목록 | 분류·가격순 정렬, 고른 분류가 주소에 남음 | `ShopList.tsx` · `?cat=` 주소, 크기별 가격 중 최저가로 정렬 |
| 🧮 옵션별 금액 | 화기·포장·받는 방법을 고르면 금액이 바로 바뀜 | `ArrangeDetail.tsx` `BojagiDetail.tsx` `PriceTag.tsx` · 옵션 값은 `lib/catalog.ts` |
| 🆕 등록 상품 상세 | 빌드 없이 새 상품 페이지가 생김 | `shop/item/page.tsx` + `ProductDetail.tsx` · `?k=` 주소, `useSearchParams`를 Suspense로 감쌈 |
| 🧺 장바구니 | 새로고침해도 남고, 뺀 상품을 되돌릴 수 있음 | `Providers.tsx` · `localStorage` 키 `seoldamhwa-cart`, 불러오기 전에는 저장하지 않음, 5초 되돌리기 알림 |
| 🔐 주문 | 화면 합계와 서버 합계가 같을 때만 접수 | `OrderForm.tsx` → `quote_order` · `place_order(p_expected_total)` · RLS |
| 👤 회원 | 가입·로그인·비밀번호 찾기, 주문 취소·탈퇴 | `LoginForm.tsx` `Auth.tsx` `MyPage.tsx` · `cancel_my_order` · `delete_my_account` |
| 🛠️ 관리자 센터 | 주문·제품·모임·works 4개 탭, 사진 업로드, 저장 안 한 변경 확인 | `admin/Admin.tsx` · Storage `products` `works` 버킷(관리자만 쓰기), `is_admin` |
| 📷 works | 분류별 작업 기록, 분류가 주소에 남음 | `WorksArchive.tsx` · `?cat=` |
| ✉️ 새 주문 알림 | 주문이 들어오면 대표에게 메일 | Edge Function `notify-new-order` · 메일 서비스 키를 넣으면 켜짐 |
| 📱 반응형 | 데스크톱·모바일 같은 여백과 색 | 본문 폭 `max(40px, (100vw − 1200px)/2)` 여백, 스크롤바 폭 보정, 모바일 안전 영역 |

<a id="decisions"></a>
## 💡 7. 기술적 의사결정

| 결정 항목 | 채택안 | 검토한 대안 | 이유 | 결정 |
| --- | --- | --- | --- | --- |
| 브랜드 방향 | C안: 아이보리 바탕, 블루 포인트, 손글씨 한글 로고, 미니멀 손그림, 음각·양각 | A안(선과 여백의 갤러리풍), B안(먹색·쪽빛 대비) | A는 고객층이 좁고 차가울 수 있고, B는 차갑고 각진 느낌. C가 따뜻하면서 차분함 | 설담화 대표, 2026-11-06 |
| 제작 방식 | 직접 개발(Next.js + Supabase) | 카페24 + 맞춤 스킨, 아임웹 | 플랫폼은 결제·배송·회원을 기본 제공하지만 손그림·세로 문장 같은 디자인 세부를 타협함 | 개발. 출시 플랫폼은 대표가 정함 |
| 주문 금액 | DB 함수가 다시 계산 | 브라우저 계산값을 그대로 저장 | 브라우저 값은 바꿀 수 있음. 화면 합계와 다르면 주문을 막고 지금 가격으로 고쳐 보여 줌 | 개발 |
| 탈퇴 처리 | 계정은 바로 지우고 주문은 분리해 5년 보관 | 주문까지 바로 삭제 | 전자상거래법의 거래 기록 보관 의무. 기간이 지나면 정리 함수로 삭제 | 개발 |
| 등록 상품 상세 | `?k=` 주소 하나로 | 상품마다 정적 페이지 생성 | 정적 사이트라 새 상품 페이지를 빌드 없이 만들 수 없음 | 개발 |
| 글꼴 | 제목은 명조 유지, 제품 목록만 Montserrat | 전체를 고딕(Noto Sans KR + Inter Tight)으로 교체 | 교체해 비교한 뒤 기존 명조의 인상이 브랜드에 더 맞음 | 안정빈, 2026-11-18 |
| 메인 이미지 | 손그림 선화를 사진으로, 배경은 한 가지 색으로 | 선화와 섹션별 배경색 유지 | 선화·세로쓰기·한자·배경색이 겹쳐 화면이 산만해 보임 | 안정빈, 2026-11-18 |

<a id="structure"></a>
## 📂 8. 주요 폴더 구조와 데이터 모델

```text
seoldamhwa/
├─ web/                          # Next.js 앱
│  ├─ app/                       # 주소 = 폴더
│  │  ├─ page.tsx                # 메인
│  │  ├─ shop/                   # 제품 목록 · [slug] 고정 상세 · item 등록 상품 상세
│  │  ├─ about/ works/ community/
│  │  ├─ cart/ login/ mypage/    # 장바구니 · 로그인 · 마이페이지
│  │  ├─ admin/                  # 관리자 센터
│  │  └─ terms/ privacy/ refund/ # 약관
│  ├─ components/
│  │  ├─ Header · Footer · HeroSlider
│  │  ├─ ShopList · ArrangeDetail · BojagiDetail · ProductDetail · PriceTag
│  │  ├─ Providers               # 장바구니 · 알림(되돌리기)
│  │  ├─ OrderForm · LoginForm · Auth · MyPage
│  │  ├─ WorksArchive · Gatherings
│  │  ├─ admin/Admin.tsx         # 관리자 4개 탭
│  │  └─ static/                 # 메인 섹션 · 브랜드 소개 · 손그림(Vase · Symbols)
│  ├─ lib/
│  │  ├─ catalog.ts              # 기본 상품·옵션·가격
│  │  ├─ data.ts                 # DB 읽기, DB가 없으면 기본 데이터
│  │  ├─ supabase.ts             # 공개 키 클라이언트
│  │  └─ business.ts             # 사업자 정보
│  └─ public/img/                # 사진
├─ supabase/
│  ├─ migrations/                # 테이블 · RLS · 함수 (5개)
│  ├─ functions/notify-new-order/
│  └─ seed.sql
├─ docs/
│  ├─ erd.md · screenshots/ · slides/
│  └─ seoldamhwa_brand_process.html   # 발표 장표
├─ PRODUCT.md                    # 사용자와 브랜드 원칙
└─ DESIGN.md                     # 색·글꼴·간격·컴포넌트 규칙
```

### 🧾 데이터 모델

| 테이블 | 내용 |
| --- | --- |
| `admins` | 관리자 이메일 |
| `profiles` | 회원 이름·연락처 (가입 때 자동 생성) |
| `products` | 상품 이름·분류·가격·크기별 가격·사진·상세 사진·상세 설명·상세 정보·품절·숨김·순서 |
| `orders` | 주문자·받는 날·상품 줄·금액·상태(접수·확인·준비 중·완료·취소)·관리자 메모 |
| `gatherings` | 꽃 모임 일정·장소·정원·참가비 |
| `works` | 작업 기록 연월·분류·제목·사진 |

```typescript
// web/lib/data.ts — 상품 한 줄
export type ProductRow = {
  key: string;                                   // 주소 이름 (/shop/item?k=key)
  cat: 'arrange' | 'gift' | 'bojagi' | 'sub';    // 꽃꽂이 · 선물 · 보자기 · 정기 구독
  name: string; meta: string;                    // 상품 이름 · 목록 설명
  price: number;                                 // 기본가 (꽃꽂이는 화기 포함)
  sizes: Size[] | null;                          // 보자기 크기별 가격
  vessel_off: number;                            // 화기를 뺄 때 차감액
  img: string;                                   // 대표 사진
  has_detail: boolean;                           // 따로 만든 상세 페이지가 있는지
  sold_out: boolean; visible: boolean; sort: number;
  photos?: string[];                             // 상세 사진 (최대 12장)
  body?: string;                                 // 상세 설명
  info?: { label: string; value: string }[];     // 상세 정보 표
};
```

주문 한 건의 상품 줄(`orders.items`)은 이렇게 저장됩니다.

```json
{ "key": "larch", "name": "낙엽송과 연잎", "opt": "화기 포함 · 감싸개 · 서울 당일 퀵", "unit": 68000, "qty": 1, "quick": 15000 }
```

관계도는 [`docs/erd.md`](docs/erd.md)에 있습니다.

<a id="run"></a>
## 🚀 9. 실행 방법

### 💻 방법 1. 내 컴퓨터에서 실행

Node.js 20 이상이 필요합니다.

```bash
git clone https://github.com/beang66/seoldamhwa.git
cd seoldamhwa/web
npm install
npm run dev        # http://localhost:3000
```

| 환경 변수 | 필수 | 설명 | 없을 때 동작 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 로그인·주문을 쓸 때 | Supabase 프로젝트 주소 | 코드 안의 기본 상품·works 데이터로 화면만 열림, 로그인·주문 불가 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 로그인·주문을 쓸 때 | 공개(publishable) 키. `web/.env.development`·`.env.production`에 있음 | 위와 같음 |
| `NEXT_PUBLIC_BASE_PATH` | 하위 경로에 배포할 때 | 예: `/seoldamhwa` | 도메인 루트(`/`) 기준으로 빌드 |

### ☁️ 방법 2. GitHub Pages로 배포

1. `npm run build` — 정적 파일이 `web/out/`에 만들어짐
2. `main`에 푸시하면 `.github/workflows/pages.yml`이 같은 빌드를 돌려 GitHub Pages에 올림
3. DB 만들기, 마이그레이션 순서, 관리자 등록, 다른 Supabase 계정으로 옮기기, 메일 알림 켜기는 [`supabase/README.md`](supabase/README.md)

<a id="verify"></a>
## ✅ 10. 검증 결과

| 항목 | 방법 | 결과 |
| --- | --- | --- |
| 타입 검사 | `npx tsc --noEmit` | 통과 |
| 린트 | `npx eslint .` | 오류 3건 (`react-hooks/set-state-in-effect`: 헤더, 히어로, 장바구니 저장) |
| 프로덕션 빌드 | 새로 받은 저장소에서 `npm ci` → `npm run build` (Node 24.20, `NEXT_PUBLIC_BASE_PATH=/seoldamhwa`) | 성공, 정적 페이지 22개 |
| 의존성 보안 | `npm audit --omit=dev` | 취약점 0건 |
| DB 권한·주문 함수 | 트랜잭션 안에서 손님·관리자·비로그인 역할로 SQL 실행 후 되돌림 | 비로그인은 주문을 못 읽음, 손님은 자기 주문만 봄, 서버 금액 재계산, 탈퇴 시 주문 분리 보관, 기간 지난 주문 정리 |
| Supabase 보안 점검 | Supabase 보안 어드바이저 | 주문·취소·탈퇴·관리자 확인 함수 공개(함수 안에서 본인·관리자 확인), `admins` 정책 없음(직접 접근 차단), 유출 비밀번호 차단 꺼짐 |
| 화면 흐름 | Playwright, Supabase 응답 모의, 1440px·390px | 옵션 선택 → 장바구니 → 로그인 이동 → 틀린 비밀번호 안내 → 주문 접수(바뀐 가격 반영) → 마이페이지 → 관리자 로그인 → 주문 상태 변경 → 제품 수정 통과 |
| 레이아웃 | 브라우저 1440·1680px, 모바일 375px | 가로 넘침 없음, 좌우 여백 대칭, 섹션 구분선 폭 1200px 통일, 위치 바 이동·가격순 정렬 동작 |
| 확인하지 않은 범위 | — | 실제 관리자 계정의 사진 업로드, 결제, 실제 메일 발송, GitHub Actions 배포 |

<a id="retro"></a>
## 📈 11. 회고

| Keep | Problem | Try |
| --- | --- | --- |
| 인터뷰로 판단 기준을 먼저 세워 시안 선택이 취향 싸움이 되지 않음 | 선화·세로쓰기·한자·섹션별 배경색을 한꺼번에 써서 화면이 산만해짐 | 바꿀 때는 전후를 나란히 두고 비교한 뒤 적용 |
| 서버 없는 정적 사이트에서도 금액 재계산과 RLS로 주문 데이터를 지킴 | 글꼴 전체 교체를 비교 없이 적용했다가 되돌림 | 대표가 플랫폼·결제 방식·상품·가격을 정하면 결제를 붙이거나 플랫폼으로 옮김 |
| 클라이언트가 정할 일을 기능 정의서 18개 항목으로 따로 모음 | 개발용 DB 하나에 시험 주문이 섞임, 린트 오류 3건 | 직접 촬영한 사진으로 교체, 운영용 DB 분리, 도메인·메일 서비스, 유출 비밀번호 차단 켜기, 린트 정리 |

<a id="roadmap"></a>
## 🗺️ 12. 로드맵 — 데이터 리포트 · SEO · 판매 전략

```mermaid
flowchart LR
    A["📥 1. 데이터 모으기"] --> B["📊 2. 고객 리포트"]
    A --> C["🔎 3. SEO 최적화"]
    B --> D["🎯 4. 데이터 기반 판매 전략"]
    C --> D
```

| 단계 | 할 일 | 필요한 데이터·작업 | 완료 기준 |
| --- | --- | --- | --- |
| 📥 1. 데이터 모으기 | 주문·모임 신청·상품 조회·장바구니 담기를 기록 | 운영용 DB 분리, 이벤트 테이블, 수집 동의와 개인정보처리방침 갱신 | 한 달치 이벤트가 쌓이고 관리자에서 조회됨 |
| 📊 2. 고객 리포트 | 관리자 센터에 리포트 탭 | 월별 매출, 인기 상품, 절기별 주문, 재구매율, 받는 날·퀵 비율, 보자기 옵션 선택률 | 대표가 월말에 리포트 한 장으로 다음 절기 상품을 정함 |
| 🔎 3. SEO 최적화 | 검색과 공유에서 잘 보이게 | 상품별 제목·설명 메타, OG 이미지, 상품·매장 구조화 데이터(JSON-LD), `sitemap.xml`·`robots.txt`, 등록 상품 상세를 `?k=`에서 경로형 주소로, 사진 용량·대체 텍스트 | 주요 상품이 브랜드명·상품명 검색에 노출, 공유 미리보기 정상 |
| 🎯 4. 데이터 기반 판매 전략 | 리포트로 상품·가격·구독을 조정 | 절기별 판매로 다음 절기 기획, 재구매 손님에게 절기 알림·구독 제안, 보자기 옵션 선택률로 패키징 확장 판단, 가격대별 전환 비교 | 기획·가격 결정마다 근거 데이터가 남음 |

<a id="slides"></a>
## 🎞️ 13. 발표 장표

브랜드 컨셉이 비주얼과 화면으로 이어진 과정을 18장으로 정리했습니다. 원본 HTML은 [`docs/seoldamhwa_brand_process.html`](docs/seoldamhwa_brand_process.html)을 내려받아 브라우저로 열면 방향키·목차(T)·발표자 노트(P)로 볼 수 있습니다.

<details open>
<summary><b>📂 장표 펼쳐보기 (18장)</b></summary>
<br>

<p align="center">
  <img src="docs/slides/01.jpg" alt="장표 01" width="95%"><br><br>
  <img src="docs/slides/02.jpg" alt="장표 02" width="95%"><br><br>
  <img src="docs/slides/03.jpg" alt="장표 03" width="95%"><br><br>
  <img src="docs/slides/04.jpg" alt="장표 04" width="95%"><br><br>
  <img src="docs/slides/05.jpg" alt="장표 05" width="95%"><br><br>
  <img src="docs/slides/06.jpg" alt="장표 06" width="95%"><br><br>
  <img src="docs/slides/07.jpg" alt="장표 07" width="95%"><br><br>
  <img src="docs/slides/08.jpg" alt="장표 08" width="95%"><br><br>
  <img src="docs/slides/09.jpg" alt="장표 09" width="95%"><br><br>
  <img src="docs/slides/10.jpg" alt="장표 10" width="95%"><br><br>
  <img src="docs/slides/11.jpg" alt="장표 11" width="95%"><br><br>
  <img src="docs/slides/12.jpg" alt="장표 12" width="95%"><br><br>
  <img src="docs/slides/13.jpg" alt="장표 13" width="95%"><br><br>
  <img src="docs/slides/14.jpg" alt="장표 14" width="95%"><br><br>
  <img src="docs/slides/15.jpg" alt="장표 15" width="95%"><br><br>
  <img src="docs/slides/16.jpg" alt="장표 16" width="95%"><br><br>
  <img src="docs/slides/17.jpg" alt="장표 17" width="95%"><br><br>
  <img src="docs/slides/18.jpg" alt="장표 18" width="95%"><br><br>
</p>

</details>

<a id="license"></a>
## 📄 14. 라이선스

설담화(說談話) 클라이언트 프로젝트입니다. 오픈소스 라이선스를 두지 않았으며, 브랜드명·로고·사진의 사용은 설담화의 허락이 필요합니다.

<div align="center">
<br>
<strong>🌸 설담화 說談話</strong> · 말로 다 못 한 마음을 꽃으로 전합니다<br>
기획·디자인 안정빈
</div>
