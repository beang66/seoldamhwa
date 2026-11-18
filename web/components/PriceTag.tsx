'use client';
import { productPrice, useProduct } from '@/lib/data';
import { priceText } from '@/lib/catalog';

// 메인 화면처럼 서버에서 그린 카드 안의 가격. DB 가격과 품절을 반영한다
export default function PriceTag({ k }: { k: string }) {
  const p = useProduct(k);
  if (!p) return <b>{priceText(k)}</b>;
  return <b>{p.sold_out ? <span className="so">품절 · </span> : null}{productPrice(p)}</b>;
}
