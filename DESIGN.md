---
name: 설담화 說談話
description: 꽃으로 건네는 말, 다시 쓰는 보자기에 싸서
colors:
  indigo-point: "#2F56A8"
  hanji: "#F1EEE8"
  white-sheet: "#FBFAF7"
  stone: "#E3DFD7"
  works-greige: "#DCD8CF"
  hairline: "#D9D5CD"
  mist: "#A9A59E"
  pencil: "#6E6B66"
  ink: "#141413"
  cotton-ivory: "#F4EFE4"
  raw-cotton: "#EFE8DA"
  raw-linen: "#E2D8C4"
  cloth-ink: "#2A2926"
typography:
  wordmark:
    fontFamily: "EB Garamond, serif"
    fontSize: "clamp(40px, 5.6vw, 72px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "40px"
    fontWeight: 300
    lineHeight: 1.3
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "28px"
    fontWeight: 300
    lineHeight: 1.45
    letterSpacing: "0.04em"
  title:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: 1.95
  label:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.3em"
  numeral:
    fontFamily: "EB Garamond, serif"
    fontSize: "14px"
    fontWeight: 400
    fontFeature: "tnum"
  hand:
    fontFamily: "Nanum Pen Script, cursive"
    fontSize: "30px"
    fontWeight: 400
rounded:
  hair: "2px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  plate: "28px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  section: "120px"
  section-mobile: "84px"
  gutter: "40px"
  gutter-mobile: "16px"
  blend: "200px"
components:
  button-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
  button-pill-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white-sheet}"
  button-pill-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white-sheet}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
  chip-filter:
    backgroundColor: "transparent"
    textColor: "{colors.pencil}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  chip-filter-active:
    textColor: "{colors.ink}"
  option-box:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 18px"
  product-card:
    backgroundColor: "#E4E1DA"
    shadow: "0 1px 2px rgba(60,52,40,.08), 0 14px 28px -18px rgba(60,52,40,.38)"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  summary-card:
    backgroundColor: "{colors.white-sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "30px 28px"
  nav-link:
    textColor: "{colors.pencil}"
    typography: "{typography.label}"
  nav-link-current:
    textColor: "{colors.ink}"
---

# Design System: 설담화 說談話

## Overview

**Creative North Star: "보자기 한 장의 여백"**

화면은 펼쳐 놓은 보자기 한 장이다. 한지와 무명 같은 넓고 따뜻한 바탕 위에 꽃 한 줄기와 글 몇 줄을 놓고, 나머지는 비워 둔다. 색을 내는 것은 꽃 사진과 손그림이고, 화면 장치가 쓰는 색은 먹과 쪽빛 한 점뿐이다. 검이불루 화이불치를 화면의 밀도로 옮긴 것으로, 덜어내되 초라하지 않고 고요하되 차갑지 않다.

밀도는 낮고 리듬은 느리다. 섹션 사이를 넓게 띄우고, 섹션의 바탕색은 그라데이션으로 다음 섹션에 스며들어 경계선 없이 이어진다. 글자는 바탕체 제목과 가벼운 고딕 본문으로 나누고, 영문과 숫자는 클래식 세리프로 따로 다룬다. 손글씨와 붓·연필 손그림이 1인 스튜디오의 손을 대신 보여 준다.

깊이는 종이처럼 다룬다. 면은 평평하게 두고, 카드와 사진 같은 '놓인 것'만 종이를 한 장 더 겹쳐 놓은 듯 아주 옅게 떠오른다. 누르고 올린 입체감(뉴모피즘)은 음각 태그 같은 작은 표식에만 쓴다. 첫 화면은 사진이 넘어가는 큰 슬라이더다.

거부한 것: 검은 바탕, 차갑고 각진 인상, 미술관·쇼룸처럼 좁은 취향의 고가 인상.

**Key Characteristics:**
- 따뜻한 미색 바탕의 단계(한지, 흰 종이, 돌, 회색 미색)와 먹색 글자
- 쪽빛은 한 화면에 한 점만
- 바탕체 제목 + 가벼운 고딕 본문 + 세리프 숫자, 작고 넓게 띄운 라벨
- 섹션 바탕이 그라데이션으로 이어짐
- 붓·연필·X-ray 계열의 손그림 벡터
- 카드는 종이처럼 살짝 떠 있고, 뉴모피즘은 예외적인 자리에만

## Colors

먹과 따뜻한 미색을 기본으로 하고, 쪽빛 한 점으로만 강조한다.

### Primary
- **쪽빛 (Indigo Point)**: 쪽물 들인 보자기의 테두리에서 온 색. 한 화면에 한 점만 쓴다. 지금 쓰는 자리는 히어로 첫 장의 버튼 앞 점, 보자기 섹션의 세로선 점과 선화 윗단 한 줄, works 필터의 현재 표시 점, 커뮤니티 모집 상태 점, 장바구니 합계 앞 점, 보자기 상품의 테두리와 매듭이다.

### Neutral
- **한지 (Hanji)**: 기본 페이지 바탕.
- **흰 종이 (White Sheet)**: 그 위에 놓이는 카드, 보자기 섹션, 요약 카드. 고정 헤더 아래 글자의 바탕색이기도 하다.
- **돌 (Stone)**: 커뮤니티처럼 한 단계 가라앉힌 섹션 바탕. 검은 바탕 대신 쓴다.
- **회색 미색 (Works Greige)**: works 섹션 바탕. 따뜻한 회색이라 위아래 미색과 어울린다.
- **가는 선 (Hairline)**: 구분선, 테두리, 비활성 윤곽.
- **안개 글자 (Mist)**: 라벨, 영문 보조 글, 부가 정보.
- **연필 (Pencil)**: 본문 보조 글, 메뉴 기본 상태.
- **먹 (Ink)**: 제목, 본문, 진한 버튼, 아이콘.

### 보자기 천 계열 (보자기 이야기 영역 전용)
- **무명 아이보리 (Cotton Ivory)**: 보자기 이야기 영역의 바탕.
- **생무명 (Raw Cotton)**: 보자기 천 자체와 라인업 카드.
- **생리넨 (Raw Linen)**: 가방 끈.
- **천 먹 (Cloth Ink)**: 이 영역의 글자와 선. 보자기 그림 속 먹선이다.

### Named Rules
**The One Indigo Rule.** 쪽빛은 한 화면(뷰포트)에 한 점만 쓴다. 버튼이나 링크의 기본색으로 쓰지 않는다. 두 번째 쪽빛이 보이면 그중 하나는 먹으로 바꾼다.

**The No Black Ground Rule.** 페이지나 섹션의 바탕에 검은색이나 그에 가까운 어두운 색을 쓰지 않는다. 가라앉힐 때는 돌이나 회색 미색을 쓴다. 먹은 글자와 선, 작은 진한 버튼에만 쓴다.

**The Photo Brings Color Rule.** 화면의 유채색은 꽃 사진과 손그림이 낸다. 화면 장치는 미색, 먹, 쪽빛 한 점 밖의 색을 쓰지 않는다.

## Typography

**Display Font:** Noto Serif KR (with serif)
**Body Font:** Noto Sans KR (with sans-serif)
**Latin & Numeral Font:** EB Garamond (with serif)
**Hand Font:** Nanum Pen Script. 확정된 손글씨 로고가 나오기 전까지 쓰는 임시 서체다.

**Character:** 가는 바탕체 제목이 시처럼 놓이고, 가벼운 고딕 본문이 조용히 받친다. 영문 브랜드명과 가격, 날짜는 클래식 세리프가 맡아 한글과 결을 달리한다.

### Hierarchy
- **Wordmark**: 영문 `seoldamhwa`, 푸터 이름. 소문자로 쓴다.
- **Display**: 화면 제목. 제품, 장바구니, 각 페이지의 h1.
- **Headline**: 섹션 제목. 화면 안 섹션은 24px까지 줄여 쓴다.
- **Title**: 카드의 상품명, 목록 항목, 카드 제목. 15–17px.
- **Body**: 설명과 안내. 한 줄은 대략 40자 안쪽으로 두고, 짧은 문단으로 끊는다.
- **Label**: `PRODUCTS · 제품`처럼 영문 대문자와 한글을 가운뎃점으로 잇는 섹션 라벨. 안개 글자색이다.
- **Numeral**: 가격, 날짜, 번호. 자릿수를 맞추는 숫자(tabular)를 쓰고, 가격 뒤에는 '원'을 붙인다.
- **Hand**: 손글씨 로고 '설담화', 천 라벨, 다시 쓰는 법 카드의 손글씨.

### Named Rules
**The 12px Floor Rule.** 어떤 글자도 12px(9pt)보다 작게 쓰지 않는다. 배지, 캡션, 도면 속 글자도 마찬가지다.

**The Bilingual Label Rule.** 섹션 라벨은 `영문 대문자 · 한글`로 쓰고, 0.26–0.3em 정도로 넓게 띄운다. 한글만 쓰는 라벨에도 넓은 자간을 유지한다.

**The Vertical Hanja Rule.** 說談話, 꽃모임 같은 짧은 한자·한글 표식은 세로쓰기로 카드 모서리에 둔다. 본문은 세로로 쓰지 않는다. 보자기 섹션의 세로 문단만 예외이고, 모바일에서는 가로로 바뀐다.

## Layout

본문 폭은 1240px 안쪽이고 가운데 정렬한다. 좌우 여백(gutter)은 40px이고, 720px 이하에서는 16px이다. 섹션 위아래 여백은 120px이고 모바일에서는 84px이다. 카드 격자의 간격은 24–28px이다.

**반응형 구간:**
- 1100px: 상품 격자 4칸 → 3칸
- 900–980px: 두 칸 구성(사진 + 정보, 목록 + 요약)이 한 칸으로
- 860px: 상품 격자 2칸
- 720px: 모바일. 헤더 메뉴가 '메뉴' 버튼으로 접히고, 세로쓰기 문단이 가로로 바뀐다.

메인페이지는 섹션이 위아래로 이어지는 한 장의 긴 두루마리다. 제품·브랜드 소개·works·커뮤니티·장바구니·상세는 같은 파일 안의 화면으로 바뀌고, 헤더는 늘 위에 고정된다.

### Named Rules
**The Seamless Ground Rule.** 섹션 바탕이 바뀔 때는 앞 섹션 아래쪽 200px(모바일 120px)을 다음 섹션 색으로 그라데이션해 경계선이 보이지 않게 한다.

**The Wide Margin Rule.** 섹션 사이 여백을 줄여 정보를 채우지 않는다. 넓은 여백이 기본이다.

## Elevation & Depth

종이를 겹쳐 놓은 깊이를 쓴다. 바탕 면은 평평하고, 위에 '놓인' 것(카드, 포스터, 사진)만 아주 옅고 넓게 퍼지는 따뜻한 그림자로 살짝 떠오른다. 그림자의 색은 검정이 아니라 갈색 기가 도는 먹이고, 위쪽으로는 거의 퍼지지 않아 바닥에 놓인 종이처럼 보인다.

누르고 올린 입체감(뉴모피즘)은 따로 다룬다. 음각 태그처럼 브랜드를 드러내는 작은 자리에서만 쓴다. 상품 카드는 사진 칸 테두리에 Card Edge 그림자를 둔다.

### Shadow Vocabulary
- **Paper Lift** (`box-shadow: 0 24px 50px -38px rgba(60,52,40,.35)`): 카드와 포스터처럼 바탕 위에 놓인 종이.
- **Card Edge** (`box-shadow: 0 1px 2px rgba(60,52,40,.08), 0 14px 28px -18px rgba(60,52,40,.38)`): 상품 카드의 사진 칸 테두리.
- **Paper Lift Deep** (`box-shadow: 0 30px 60px -40px rgba(0,0,0,.35)`): 큰 포스터 한 장.
- **Inset** (`box-shadow: inset 6px 6px 14px #CBC6BC, inset -6px -6px 14px #FBFAF7`): 음각 태그.

### Named Rules
**The Paper Not Plastic Rule.** 그림자는 아래로만, 옅고 넓게, 따뜻한 색으로 드리운다. 사방으로 퍼지는 회색 그림자나 진한 테두리 그림자는 쓰지 않는다.

**The Neumorph Is A Guest Rule.** 뉴모피즘은 음각 태그 같은 표식에만 쓴다. 히어로, 목록, 카드 격자, 스크롤 표시에는 쓰지 않는다.

## Shapes

부드럽게 깎인 모서리를 쓴다. 사진과 카드는 10px, 작은 카드와 표식은 6–8px, 버튼·필터·수량 조절은 완전히 둥근 알약 모양이고, 히어로 슬라이더는 화면 가득 모서리 없이 깐다. 테두리는 1px의 가는 선 하나로 끝내고, 두꺼운 테두리는 쓰지 않는다. 손그림은 직선 도형 대신 붓과 연필의 곡선으로 그린다.

## Components

### Buttons
단정하고 부드럽게. 알약 모양에 작은 글자, 넓은 자간.
- **Shape:** 완전히 둥근 알약 (999px), 높이 44px.
- **Pill (기본):** 투명 바탕에 먹색 1px 테두리, 먹색 글자 13px, 자간 0.12em.
- **Pill Dark (주요 행동):** 먹 바탕에 흰 종이색 글자. 장바구니 담기, 주문하기, 참여 신청하기.
- **Hover / Focus:** 기본 버튼은 먹 바탕으로 채워지고 글자가 흰 종이색이 된다. 진한 버튼은 한 단계 밝은 먹(`#2e2d2a`)이 된다. 키보드 포커스는 바깥 1px 먹색 윤곽으로 보인다. 색 전환은 0.25초다.
- **Text Link:** 섹션 머리의 `모든 제품 보기` 같은 링크는 연필색 글자에 가는 밑줄이고, 마우스를 올리면 먹색이 된다.

### Chips (분류 필터)
- **Style:** 테두리 없는 알약 버튼, 연필색 글자 13px, 옆에 작은 세리프 숫자.
- **State:** 선택되면 먹색 글자와 먹색 테두리. works 필터는 선택 표시로 쪽빛 점을 붙인다. 필터 줄은 스크롤해도 헤더 아래에 붙어 있다.

### Hero Slider
- 화면 높이 가득 찬 사진 5장이 6초마다 넘어간다. 사진 위에 아래쪽 어두운 막을 깔고 흰 종이색 글자로 한 줄 제목과 링크를 올린다. 아래에 점 진행 표시, 장 번호, 이전·멈춤·다음 버튼을 둔다. 마우스를 올리거나 포커스하면 멈추고, 동작 줄이기 설정에서는 자동으로 넘기지 않는다. 헤더는 슬라이더 위에서 흰 글자로 바뀐다.

### Cards / Containers
- **Product Card:** 3:4 사진 칸, 6px 모서리, 사진은 채도를 살짝 낮췄다가 마우스를 올리거나 포커스하면 원래 색으로 돌아오며 1.035배 커진다. 사진 칸 테두리에 Card Edge 그림자가 옅게 깔리고, 번호는 붙이지 않는다. 아래에 바탕체 상품명과 분류·가격 줄이 온다.
- **Summary Card:** 흰 종이 바탕, 10px 모서리, 안쪽 여백 30px 28px. 장바구니 주문 금액처럼 오른쪽에 붙어 따라오는 카드.
- **Paper Card:** 커뮤니티 카드와 포스터. 흰 종이 바탕에 종이 그림자를 쓴다.
- **Shadow Strategy:** Elevation & Depth의 Paper Lift를 따른다.

### Inputs / Options
- **Option Box (크기·화기·포장·받는 방법):** 가는 선 1px 테두리, 10px 모서리, 위에 이름, 아래에 세리프 가격이나 작은 안내. 선택되면 먹색 테두리. 실제 라디오 버튼을 감춰 키보드로 고를 수 있다.
- **Quantity Stepper:** 가는 선 알약 안에 − 숫자 +. 숫자는 세리프다.

### Navigation
- **Header:** 화면 위에 고정. 왼쪽에 제품 / 브랜드 소개 / works / 커뮤니티, 가운데에 매화 표식 + 한글 로고 '설담화', 오른쪽에 장바구니(숫자 배지)와 마이페이지 아이콘. 스크롤하면 반투명 한지 바탕과 가는 아래 선이 생긴다.
- **States:** 메뉴는 연필색 12px에 자간 0.08em. 마우스를 올리면 먹색이 된다. 현재 화면은 먹색 글자 아래에 작은 먹 점을 찍는다.
- **Mobile:** 720px 이하에서 메뉴가 '메뉴' 버튼으로 접히고, 열리면 헤더 아래로 세로 목록이 펼쳐진다.

### Section Header (Signature)
위에 먹색 1px 선, 그 아래 `영문 · 한글` 라벨, 바탕체 제목, 오른쪽 끝에 세리프 이탤릭 영문 한 줄이나 텍스트 링크. 보자기·꽃꽂이 상세와 브랜드·커뮤니티 화면의 모든 섹션이 이 머리로 시작한다.

### Hand-drawn Vector (Signature)
달항아리 한 줄기, 붓으로 그린 잎, 연필 선화의 보자기. 붓 효과를 크게 렌더링한 뒤 벡터로 추적해 어느 크기에서도 선이 깨지지 않게 한다. 선 끝은 붓처럼 가늘어지게 마무리한다.

## Do's and Don'ts

### Do:
- **Do** 쪽빛(#2F56A8)은 한 화면에 한 점만 쓴다 (The One Indigo Rule).
- **Do** 섹션 바탕을 바꿀 때 200px 그라데이션으로 이어 붙인다.
- **Do** 가격과 날짜는 EB Garamond의 자릿수 맞춤 숫자로 쓰고, 가격 뒤에 '원'을 붙인다.
- **Do** 섹션 라벨은 `영문 대문자 · 한글` 형식에 0.26–0.3em 자간으로 쓴다.
- **Do** 카드와 포스터처럼 놓인 것에는 Paper Lift 그림자를 쓴다.
- **Do** 손그림은 벡터로 쓰고, 선 끝은 붓처럼 가늘어지게 마무리한다.

### Don't:
- **Don't** 페이지나 섹션 바탕에 검은색이나 어두운 색을 쓴다.
- **Don't** 쪽빛을 버튼, 링크, 넓은 면의 기본색으로 쓴다.
- **Don't** 목록, 카드 격자, 스크롤 표시에 뉴모피즘을 쓴다.
- **Don't** 사방으로 퍼지는 회색 그림자나 두꺼운 테두리를 쓴다.
- **Don't** 섹션 경계를 색이 뚝 바뀌는 직선으로 둔다.
- **Don't** 꽃꽂이를 '이케바나'라고 표기한다.
