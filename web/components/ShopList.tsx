'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SHOP_CATS, isLegacyPackaging, type ShopCat } from '@/lib/catalog';
import { picBg, productPrice, useProducts, type ProductRow } from '@/lib/data';

const ILL_LABEL: Record<string, string> = { 'ill-wrap': '감싸개 그림', 'ill-knot': '가방 끈을 단 매듭 보자기 그림' };

const minPrice = (p: ProductRow) => p.cat === 'bojagi' && p.sizes?.length ? Math.min(...p.sizes.map(s => s.price)) : p.price;

function Card({ p, hidden }: { p: ProductRow; hidden: boolean }) {
  // 사진이 없는 보자기는 선화로 보여 준다
  const ill = !p.img && p.cat === 'bojagi' ? (p.key === 'knot' ? 'ill-knot' : 'ill-wrap') : null;
  const inner = (
    <>
      {ill
        ? <div className="frame ill"><svg viewBox="0 0 300 330" aria-label={ILL_LABEL[ill]}><use href={`#${ill}`} /></svg></div>
        : <div className="frame">{p.img ? <span style={{ backgroundImage: picBg(p.img) }} /> : <span className="blank" />}</div>}
      <h3>{p.name}</h3><p>{p.meta}<b>{p.sold_out ? <span className="so">품절 · </span> : null}{productPrice(p)}</b></p>
    </>
  );
  // 코드로 만든 기본 상세 페이지가 있으면 그쪽, 아니면 관리자가 등록한 내용으로 그리는 상세 페이지
  return <Link className="prod" href={p.has_detail ? `/shop/${p.key}` : `/shop/item?k=${p.key}`} hidden={hidden}>{inner}</Link>;
}

export default function ShopList({ initial }: { initial: ShopCat }) {
  const [selected, setCat] = useState<ShopCat>(initial);
  const list = useProducts().filter(p => !isLegacyPackaging(p.key));
  const cat = selected === 'bojagi' && !list.some(p => p.cat === selected) ? 'all' : selected;
  const [sort, setSort] = useState<'base' | 'low' | 'high'>('base');
  const shown = sort === 'base' ? list : [...list].sort((a, b) => (sort === 'low' ? 1 : -1) * (minPrice(a) - minPrice(b)));
  const pick = (c: ShopCat) => { setCat(c); history.replaceState(null, '', (process.env.NEXT_PUBLIC_BASE_PATH ?? '') + (c === 'all' ? '/shop/' : `/shop/?cat=${c}`)); };
  return (
    <>
      <div className="page-hd">
        <span className="eyebrow">PRODUCTS · 제품</span>
        <h1>제품</h1>
        <p>계절마다 고른 꽃을 소개합니다. 꽃 포장은 <Link href="/about#package">설담화 패키지</Link>에서 확인하세요.</p>
      </div>
      <div className="shop-bar">
        <div className="cats" role="group" aria-label="제품 카테고리">
          {SHOP_CATS.filter(([k]) => k !== 'bojagi' || list.some(p => p.cat === k)).map(([k, n]) => (
            <button key={k} type="button" aria-pressed={cat === k} onClick={() => pick(k)}>
              {n}<small>{k === 'all' ? list.length : list.filter(p => p.cat === k).length}</small>
            </button>
          ))}
        </div>
        <label className="sort"><span className="sr-only">정렬</span>
          <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
            <option value="base">기본 순서</option>
            <option value="low">낮은 가격순</option>
            <option value="high">높은 가격순</option>
          </select>
        </label>
      </div>
      <div className="grid">
        {shown.map(p => <Card key={p.key} p={p} hidden={!(cat === 'all' || p.cat === cat)} />)}
      </div>
    </>
  );
}

export function ShopFromQuery() {
  const q = useSearchParams().get('cat');
  const initial = (SHOP_CATS.some(([k]) => k === q) ? q : 'all') as ShopCat;
  // 카테고리 링크로 들어오면 목록 상태를 새로 시작한다
  return <ShopList key={initial} initial={initial} />;
}
