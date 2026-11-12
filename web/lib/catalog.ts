// 상품·작업 데이터. 시안(mockups/src)의 ITEMS·ARR·WORKS를 그대로 옮겼다.
// shortcut: 상품과 가격이 코드에 들어 있다. 결제를 붙일 때 DB로 옮기고, 금액은 서버에서 다시 계산한다.

export const won = (n: number) => n.toLocaleString('ko-KR');

export type Size = { label: string; price: number };
export type BojagiKey = 'wrap' | 'knot';
export type GalleryKind = 'ill-wrap' | 'ill-knot' | 'border' | 'label' | 'sprig' | 'knot' | 'strap' | 'photo';

export type BojagiItem = {
  no: string; name: string; en: string; desc: string;
  modes: string[]; sizes: Size[];
  gallery: [string, GalleryKind][];
  spec: [string, string][];
  other: BojagiKey;
};

export const ITEMS: Record<BojagiKey, BojagiItem> = {
  wrap: {
    no: 'No.1 · 꽃다발', name: '감싸개', en: 'WRAP',
    desc: '꽃다발을 원뿔로 감싸고, 천에 꿰매 단 끈 세 쌍으로 묶는 보자기입니다. 꽃이 시든 뒤에는 정사각 천 한 장으로 남아 스카프나 손수건으로 씁니다.',
    modes: ['감싸기', '스카프', '손수건'],
    sizes: [{ label: '70 × 70 cm', price: 28000 }],
    gallery: [['사용 모습', 'ill-wrap'], ['쪽빛 테두리', 'border'], ['천 라벨', 'label'], ['귀퉁이 손그림', 'sprig']],
    spec: [['소재', '아이보리 무명 100%, 테두리 쪽빛 바이어스(천연 쪽염)'], ['구성', '감싸개 1, 다시 쓰는 법 카드 1'], ['관리', '찬물 손세탁. 쪽빛 테두리는 처음 몇 번은 따로 빨아 주세요.'], ['배송', '꽃과 함께 주문하면 꽃을 감싸서 보내드려요. 단품은 2~3일 안에 출고해요.']],
    other: 'knot',
  },
  knot: {
    no: 'No.2 · 화기 · 상자 · 큰 다발', name: '매듭 보자기', en: 'TIE & CARRY',
    desc: '전통 방식으로 싸서 매듭을 짓는 두 겹 보자기입니다. 두 귀퉁이의 고리에 가방 끈을 걸면 그대로 들고 다니는 주머니가 되고, 끈은 떼었다 붙일 수 있어요.',
    modes: ['보자기', '주머니', '어깨 가방', '식탁보'],
    sizes: [{ label: '소 45 cm', price: 38000 }, { label: '중 70 cm', price: 46000 }, { label: '대 90 cm', price: 56000 }],
    gallery: [['사용 모습', 'ill-knot'], ['연출 사진', 'photo'], ['가방 끈과 매듭 단추', 'strap'], ['쪽빛 매듭', 'knot']],
    spec: [['소재', '무명 두 겹, 생리넨 가방 끈, 쪽빛 매듭 장식(천연 쪽염)'], ['구성', '매듭 보자기 1, 가방 끈 1(110 cm, 탈착), 다시 쓰는 법 카드 1'], ['관리', '찬물 손세탁. 매듭 장식과 가방 끈은 떼어서 빨아 주세요.'], ['배송', '꽃이나 화기와 함께 주문하면 싸서 보내드려요. 단품은 2~3일 안에 출고해요.']],
    other: 'wrap',
  },
};

export type ArrKey = 'larch' | 'bamboo' | 'daffodil' | 'nasturtium';
export type Arrangement = {
  img: string; no: string; name: string; en: string; base: number; vesselOff: number;
  desc: string; chips: string[]; flowers: [string, string, string][];
  memo: [string, string]; memoText: string;
  h: number; w: number; v: number; life: string;
  focus: { flower: string; vessel: string };
  season: [string, string, string, string];
};

export const ARR: Record<ArrKey, Arrangement> = {
  larch: {
    img: 'ikebana-larch', no: 'No.01 · 꽃꽂이 · 중품', name: '낙엽송과 연잎', en: 'LARCH & LOTUS LEAF', base: 68000, vesselOff: 18000,
    desc: '잎을 떨구기 직전 낙엽송의 마지막 초록을 S자로 세우고, 발치에 둥근 연잎 한 장을 눕혔습니다. 굽 높은 회색 수반 위에 선 하나로 서는 꽃이에요.',
    chips: ['낙엽송', '연잎', '이끼', '굽 수반'],
    flowers: [['낙엽송 가지', 'S자로 굽은 한 가지. 가는 잎이 바람에 흔들려요.', '주재'], ['연잎', '둥글게 펼친 잎 한 장. 선의 끝을 받쳐 줍니다.', '받침'], ['이끼', '침봉을 덮어 수반 안을 정리해요.', '마감'], ['굽 높은 회색 수반', '지름 14cm 도기 수반과 침봉.', '화기']],
    memo: ['입동의 꽃,', '낙엽송 한 가지'], memoText: '선이 주인공인 꽃이라 넓은 벽 앞이나 낮은 장 위에 두면 가장 잘 보여요.',
    h: 60, w: 45, v: 14, life: '7~10일',
    focus: { flower: '48% 28%', vessel: '50% 80%' },
    season: ['立冬', '입동, 겨울이 들어서는 날', '낙엽송은 바늘잎이 노랗게 물들기 직전에 가장 곱습니다. 초록이 남아 있는 마지막 한 주의 가지를 골라, 떠나는 가을과 오는 겨울 사이를 한 선으로 그렸어요.', 'the last green before winter'],
  },
  bamboo: {
    img: 'ikebana-bamboo', no: 'No.02 · 꽃꽂이 · 중품', name: '대나무와 부채 잎', en: 'BAMBOO & FAN LEAF', base: 72000, vesselOff: 18000,
    desc: '곧게 선 대나무 마디 옆으로 잎을 흩뜨리고, 아래에는 부채처럼 접은 잎을 펼쳤습니다. 흰 들꽃 몇 송이가 선과 면 사이를 이어 줘요.',
    chips: ['대나무', '부채 잎', '흰 들꽃', '굽 수반'],
    flowers: [['대나무 줄기', '곧은 마디 하나가 중심을 잡아요.', '주재'], ['대나무 잎 가지', '위로 흩어지는 가는 잎.', '곁가지'], ['부채 잎', '손으로 주름 잡아 부채처럼 펼친 잎.', '면'], ['흰 들꽃', '작은 꽃 서너 송이.', '점'], ['굽 높은 회색 수반', '지름 14cm 도기 수반과 침봉.', '화기']],
    memo: ['곧은 선과', '접은 잎 한 장'], memoText: '대나무는 물을 많이 마셔요. 처음 사흘은 하루 두 번 물을 채워 주세요.',
    h: 65, w: 40, v: 14, life: '10~14일',
    focus: { flower: '55% 62%', vessel: '50% 82%' },
    season: ['立冬', '입동, 바람이 차지는 때', '잎이 지는 계절에도 대나무는 푸른빛을 지킵니다. 사철 변하지 않는 선 하나에 접은 잎을 더해, 겨울 채비를 하는 집에 곧은 기운을 들였어요.', 'evergreen lines for a cold wind'],
  },
  daffodil: {
    img: 'ikebana-daffodil', no: 'No.03 · 꽃꽂이 · 소품', name: '수선 한 줄기', en: 'A SINGLE DAFFODIL', base: 48000, vesselOff: 12000,
    desc: '수선 한 송이와 잎 두 장만 깔때기 모양 화기에 세웠습니다. 한 잎은 곧게, 한 잎은 휘어지게 두어 작은 꽃에 움직임을 줬어요.',
    chips: ['수선', '수선 잎', '깔때기 화기'],
    flowers: [['수선 한 송이', '노란 꽃 한 송이가 위를 봐요.', '주재'], ['수선 잎 두 장', '하나는 곧게, 하나는 휘게.', '선'], ['깔때기 모양 화기', '청자빛 유약을 입힌 작은 화기와 침봉.', '화기']],
    memo: ['한 송이면', '충분한 날'], memoText: '작아서 책상이나 창가, 찻상 위에도 놓기 좋아요.',
    h: 40, w: 20, v: 9, life: '5~7일',
    focus: { flower: '50% 28%', vessel: '50% 82%' },
    season: ['小雪', '소설을 앞두고 기다리는 봄', '수선은 한겨울에 피어 봄을 먼저 알리는 꽃입니다. 첫눈을 앞둔 때에 노란 한 송이를 두고, 가장 추운 날들 너머의 봄을 미리 건넵니다.', 'an early word of spring'],
  },
  nasturtium: {
    img: 'ikebana-nasturtium', no: 'No.04 · 꽃꽂이 · 소품', name: '한련 한 줄기', en: 'A SINGLE NASTURTIUM', base: 48000, vesselOff: 12000,
    desc: '둥근 한련잎 하나를 높이 띄우고, 그 아래 주홍 꽃 한 송이를 걸었습니다. 휘어진 줄기 하나가 잎과 꽃을 이어요.',
    chips: ['한련', '한련잎', '깔때기 화기'],
    flowers: [['한련잎', '연잎을 닮은 둥근 잎 하나.', '면'], ['한련꽃 한 송이', '주홍빛 꽃 한 송이.', '점'], ['깔때기 모양 화기', '청자빛 유약을 입힌 작은 화기와 침봉.', '화기']],
    memo: ['둥근 잎 아래', '주홍 한 점'], memoText: '잎이 무거워 줄기가 기울 수 있어요. 기울면 침봉에 다시 깊게 꽂아 주세요.',
    h: 38, w: 18, v: 9, life: '5~7일',
    focus: { flower: '56% 58%', vessel: '50% 84%' },
    season: ['立冬', '입동의 마지막 주홍', '서리가 내리기 전 마지막으로 피는 한련을 골랐습니다. 늦가을의 주홍 한 점이 겨울 초입의 방을 따뜻하게 밝혀요.', 'the last warm color before frost'],
  },
};

export type Choice = { label: string; note: string; add: number };
export const A_WRAP: Choice[] = [{ label: '감싸개', note: '기본 포함', add: 0 }, { label: '매듭 보자기', note: '+18,000 · 화기째 싸기', add: 18000 }];
export const A_DELIV: Choice[] = [{ label: '작업실 픽업', note: '무료', add: 0 }, { label: '서울 당일 퀵', note: '+15,000', add: 15000 }];

export const OTHER_PRICES = { baekja: 96000, driedbox: 42000, 'season-sub': 89000 } as const;

export const isBojagi = (k: string): k is BojagiKey => k in ITEMS;
export const isArr = (k: string): k is ArrKey => k in ARR;

export function priceText(k: string): string {
  if (isArr(k)) return won(ARR[k].base) + '원';
  if (isBojagi(k)) { const s = ITEMS[k].sizes; return won(s[0].price) + '원' + (s.length > 1 ? '부터' : ''); }
  return (k === 'season-sub' ? '월 ' : '') + won(OTHER_PRICES[k as keyof typeof OTHER_PRICES]) + '원';
}

export type ShopCat = 'all' | 'arrange' | 'gift' | 'bojagi' | 'sub';
export type ShopCard = { cat: Exclude<ShopCat, 'all'>; href: string | null; name: string; meta: string; price: string; img?: string; ill?: 'ill-wrap' | 'ill-knot'; illLabel?: string };

export const SHOP: ShopCard[] = [
  { cat: 'arrange', href: '/shop/larch', name: '낙엽송과 연잎', meta: '꽃꽂이 · 중품', price: 'larch', img: 'ikebana-larch' },
  { cat: 'arrange', href: '/shop/bamboo', name: '대나무와 부채 잎', meta: '꽃꽂이 · 중품', price: 'bamboo', img: 'ikebana-bamboo' },
  { cat: 'arrange', href: '/shop/daffodil', name: '수선 한 줄기', meta: '꽃꽂이 · 소품', price: 'daffodil', img: 'ikebana-daffodil' },
  { cat: 'arrange', href: '/shop/nasturtium', name: '한련 한 줄기', meta: '꽃꽂이 · 소품', price: 'nasturtium', img: 'ikebana-nasturtium' },
  { cat: 'gift', href: null, name: '백자와 보자기 선물', meta: '선물 · 매듭 보자기 포함', price: 'baekja', img: 'bojagi' },
  { cat: 'gift', href: null, name: '말린 꽃 상자', meta: '선물 · 감싸개 포함', price: 'driedbox', img: 'dried-box' },
  { cat: 'bojagi', href: '/shop/wrap', name: '감싸개', meta: '보자기 · 70 × 70 cm', price: 'wrap', ill: 'ill-wrap', illLabel: '감싸개 그림' },
  { cat: 'bojagi', href: '/shop/knot', name: '매듭 보자기', meta: '보자기 · 가방 끈 포함', price: 'knot', ill: 'ill-knot', illLabel: '가방 끈을 단 매듭 보자기 그림' },
  { cat: 'sub', href: null, name: '절기 꽃 구독', meta: '정기 구독 · 월 2회', price: 'season-sub', img: 'field' },
];
export const SHOP_CATS: [ShopCat, string][] = [['all', '전체'], ['arrange', '꽃꽂이'], ['gift', '선물'], ['bojagi', '보자기'], ['sub', '정기 구독']];

export type WorkCat = 'space' | 'project' | 'sub' | 'meet';
export type Work = { date: string; iso: string; cat: WorkCat; title: string; where: string; what: string; pic: string; text: string };
export const WORKS: Work[] = [
  { date: '2026.11', iso: '2026-11', cat: 'space', title: '입동, 찻자리의 꽃', where: '개인 다회 · 서울', what: '낙엽송과 마른 연밥', pic: 'ikebana-larch', text: '겨울로 들어서는 날의 다회. 낮은 굽 수반에 잎을 떨구기 직전의 낙엽송 한 가지를 세우고, 찻상 끝에는 마른 연밥 하나만 두었습니다.' },
  { date: '2026.10', iso: '2026-10', cat: 'project', title: '갤러리 개관 꽃', where: '성수동 갤러리', what: '억새와 감나무 가지', pic: 'ill', text: '흰 벽의 전시장 입구에 억새 다발과 감이 달린 가지를 세웠습니다. 전시가 끝난 뒤 가지는 말려 갤러리에 남겼어요.' },
  { date: '2026.09', iso: '2026-09', cat: 'sub', title: '백로의 한 줄기', where: '정기 구독 · 아홉 번째 꽃', what: '대나무와 부채 잎', pic: 'ikebana-bamboo', text: '이슬이 맺히기 시작하는 때, 곧은 대나무와 접은 잎으로 서늘한 선을 보냈습니다.' },
  { date: '2026.08', iso: '2026-08', cat: 'meet', title: '보자기 워크숍 기록', where: '설담화 작업실', what: '쪽물 들이기와 매듭 짓기', pic: 'bojagi', text: '여덟 분과 함께 무명 천에 쪽물을 들이고, 각자 꽂은 꽃을 그 천으로 싸서 가져갔습니다.' },
  { date: '2026.07', iso: '2026-07', cat: 'sub', title: '소서, 한련 한 줄기', where: '정기 구독 · 일곱 번째 꽃', what: '한련과 한련잎', pic: 'ikebana-nasturtium', text: '더위가 시작되는 때, 둥근 잎 아래 주홍 한 점을 걸어 작은 화기에 담았습니다.' },
  { date: '2026.06', iso: '2026-06', cat: 'space', title: '들꽃 정원의 오후', where: '가평 정원 촬영', what: '코스모스와 들풀', pic: 'field', text: '정원 브랜드의 사진 촬영을 위해 들풀 사이에 꽃을 꽂아 두었습니다. 꽃은 촬영 뒤 정원에 그대로 돌려보냈어요.' },
  { date: '2026.04', iso: '2026-04', cat: 'project', title: '말린 꽃 상자', where: '출판사 행사 답례품', what: '말린 꽃과 감싸개', pic: 'dried-box', text: '책 출간 행사의 답례로 말린 꽃 한 줄기를 상자에 담고, 감싸개로 한 번 더 쌌습니다.' },
  { date: '2026.03', iso: '2026-03', cat: 'sub', title: '경칩의 수선', where: '정기 구독 · 세 번째 꽃', what: '수선 한 송이', pic: 'ikebana-daffodil', text: '개구리가 깨어나는 때, 노란 수선 한 송이로 봄을 먼저 알렸습니다.' },
];
export const WK_CATS: ['all' | WorkCat, string][] = [['all', '전체'], ['space', '공간 연출'], ['project', '프로젝트'], ['sub', '구독'], ['meet', '모임']];

export const img = (name: string) => `var(--img-${name})`;
