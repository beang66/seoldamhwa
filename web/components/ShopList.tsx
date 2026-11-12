'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SHOP, SHOP_CATS, priceText, type ShopCat, type ShopCard } from '@/lib/catalog';

function Card({ p, hidden }: { p: ShopCard; hidden: boolean }) {
  const inner = (
    <>
      {p.ill
        ? <div className="frame ill"><svg viewBox="0 0 300 330" aria-label={p.illLabel}><use href={`#${p.ill}`} /></svg></div>
        : <div className="frame"><span style={{ backgroundImage: `var(--img-${p.img})` }} /></div>}
      <h3>{p.name}</h3><p>{p.meta}<b>{priceText(p.price)}</b></p>
    </>
  );
  return p.href
    ? <Link className="prod" href={p.href} hidden={hidden}>{inner}</Link>
    : <a className="prod" href="#" data-soon="" hidden={hidden}>{inner}</a>;
}

export default function ShopList({ initial }: { initial: ShopCat }) {
  const [cat, setCat] = useState<ShopCat>(initial);
  const pick = (c: ShopCat) => { setCat(c); history.replaceState(null, '', c === 'all' ? '/shop' : `/shop?cat=${c}`); };
  return (
    <>
      <div className="page-hd">
        <span className="eyebrow">PRODUCTS · 제품</span>
        <h1>제품</h1>
        <p>계절마다 고른 꽃과, 꽃을 감싸 건네는 보자기를 함께 소개합니다.</p>
      </div>
      <div className="cats" role="group" aria-label="제품 카테고리">
        {SHOP_CATS.map(([k, n]) => (
          <button key={k} type="button" aria-pressed={cat === k} onClick={() => pick(k)}>
            {n}<small>{k === 'all' ? SHOP.length : SHOP.filter(p => p.cat === k).length}</small>
          </button>
        ))}
      </div>
      <div className="grid">
        {SHOP.map(p => <Card key={p.name} p={p} hidden={!(cat === 'all' || p.cat === cat)} />)}
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
