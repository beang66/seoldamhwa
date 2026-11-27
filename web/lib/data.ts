'use client';
// DB(Supabase)의 제품·works·모임을 읽는다.
// DB가 없거나 읽기에 실패하면 코드 안의 시안 데이터(catalog.ts)를 그대로 쓴다. 그래서 정적 화면은 항상 보인다.
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { ARR, ITEMS, OTHER_PRICES, SHOP, WORKS, won, type Size, type WorkCat } from './catalog';

export type ProductRow = {
  key: string; cat: 'arrange' | 'gift' | 'bojagi' | 'sub'; name: string; meta: string; price: number;
  sizes: Size[] | null; vessel_off: number; img: string; has_detail: boolean; sold_out: boolean; visible: boolean; sort: number;
  // 관리자가 쓰는 상세 페이지 내용 (DB에 열이 없던 예전 행은 비어 있을 수 있다)
  photos?: string[]; body?: string; info?: { label: string; value: string }[];
};
export type WorkRow = { id: number; ym: string; cat: WorkCat; title: string; where_text: string; what: string; pic: string; body: string; visible: boolean };
export type GatheringRow = {
  id: number; kind: string; title: string; date: string; time_text: string; place: string; capacity: number; seats_left: number;
  fee: number; fee_note: string; description: string; status: '모집 중' | '모집 예정' | '마감'; note: string; visible: boolean;
};

// ----- 코드 안의 시안 데이터를 DB 행 모양으로 -----
export const STATIC_PRODUCTS: ProductRow[] = SHOP.map((p, i) => {
  const k = p.price;
  const arr = (ARR as Record<string, { base: number; vesselOff: number }>)[k];
  const bj = (ITEMS as Record<string, { sizes: Size[] }>)[k];
  return {
    key: k, cat: p.cat, name: p.name, meta: p.meta,
    price: arr ? arr.base : bj ? bj.sizes[0].price : OTHER_PRICES[k as keyof typeof OTHER_PRICES],
    sizes: bj ? bj.sizes : null, vessel_off: arr ? arr.vesselOff : 0, img: p.img ?? '', has_detail: !!p.href,
    sold_out: false, visible: true, sort: (i + 1) * 10,
  };
});
export const STATIC_WORKS: WorkRow[] = WORKS.map((w, i) => ({
  id: -(i + 1), ym: w.iso + '-01', cat: w.cat, title: w.title, where_text: w.where, what: w.what, pic: w.pic, body: w.text, visible: true,
}));

// ----- 한 번 읽고 페이지 사이에서 함께 쓴다 -----
type Store<T> = { data: T; src: 'static' | 'db'; p?: Promise<void>; subs: Set<() => void> };
function makeStore<T>(initial: T, load: () => PromiseLike<{ data: unknown; error: unknown }>): { use: () => { data: T; src: 'static' | 'db' }; refresh: () => Promise<void> } {
  const s: Store<T> = { data: initial, src: 'static', subs: new Set() };
  const refresh = async () => {
    if (!supabase) return;
    const { data, error } = await load();
    if (!error && Array.isArray(data)) { s.data = data as T; s.src = 'db'; s.subs.forEach(f => f()); }
  };
  const use = () => {
    const [, tick] = useState(0);
    useEffect(() => {
      const f = () => tick(n => n + 1); s.subs.add(f);
      if (!s.p) s.p = refresh();
      return () => { s.subs.delete(f); };
    }, []);
    return { data: s.data, src: s.src };
  };
  return { use, refresh };
}

const products = makeStore<ProductRow[]>(STATIC_PRODUCTS, () => supabase!.from('products').select('*').order('sort'));
const works = makeStore<WorkRow[]>(STATIC_WORKS, () => supabase!.from('works').select('*').order('ym', { ascending: false }).order('id', { ascending: false }));
const gatherings = makeStore<GatheringRow[] | null>(null, () => supabase!.from('gatherings').select('*').order('date'));

const updatePackagingCopy = (p: ProductRow) => p.key === 'driedbox' && p.meta.includes('감싸개 포함')
  ? { ...p, meta: p.meta.replace('감싸개 포함', '설담화 패키지 구성 확인 중') }
  : p;

export const useProducts = () => products.use().data.filter(p => p.visible).map(updatePackagingCopy);
export const useProduct = (key: string) => {
  const all = products.use().data;
  const p = all.find(p => p.key === key) ?? STATIC_PRODUCTS.find(p => p.key === key);
  return p && updatePackagingCopy(p);
};
export const useWorks = () => works.use().data.filter(w => w.visible);
/** null이면 DB가 없어 코드 안의 모임 안내를 그대로 쓴다 */
export const useGatherings = () => gatherings.use().data?.filter(g => g.visible) ?? null;
export const refreshPublic = () => Promise.all([products.refresh(), works.refresh(), gatherings.refresh()]);

// ----- 표시 도우미 -----
export function productPrice(p: ProductRow): string {
  const sizes = p.cat === 'bojagi' && p.sizes?.length ? p.sizes : null;
  const min = sizes ? Math.min(...sizes.map(s => s.price)) : p.price;
  return (p.cat === 'sub' ? '월 ' : '') + won(min) + '원' + (sizes && sizes.length > 1 ? '부터' : '');
}
// 날짜는 Intl로 읽고, 화면의 점 표기(2026.11.22)는 그 조각을 이어 붙여 만든다
const day = (d: string) => new Date(d.slice(0, 10) + 'T00:00:00');
const parts = (d: string, o: Intl.DateTimeFormatOptions) =>
  Object.fromEntries(new Intl.DateTimeFormat('ko-KR', o).formatToParts(day(d)).map(p => [p.type, p.value])) as Record<string, string>;
/** 2026-11-01 → 2026.11 */
export const ymText = (ym: string) => { const p = parts(ym, { year: 'numeric', month: '2-digit' }); return `${p.year}.${p.month}`; };
/** 2026-11-22 → 2026.11.22 */
export const dotDate = (d: string) => { const p = parts(d, { year: 'numeric', month: '2-digit', day: '2-digit' }); return `${p.year}.${p.month}.${p.day}`; };
/** 짧게 11.22 토 / 길게 11월 22일 토요일 */
export function dateText(d: string, long = false) {
  if (long) return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }).format(day(d));
  const p = parts(d, { month: 'numeric', day: '2-digit', weekday: 'short' });
  return `${p.month}.${p.day} ${p.weekday}`;
}
export const todayIso = () => { const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); return t.toISOString().slice(0, 10); };
/** works 사진: 기본 사진 이름이면 CSS 변수, 업로드한 사진이면 주소 */
export const picBg = (pic: string) => /^https:\/\//.test(pic) ? `url("${pic.replace(/"/g, '%22')}")` : `var(--img-${pic})`;
