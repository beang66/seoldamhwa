import { Suspense } from 'react';
import { ProductFromQuery } from '@/components/ProductDetail';

export const metadata = { title: '제품' };

// 관리자가 등록한 제품의 상세 페이지. 정적 사이트라 주소는 /shop/item?k=주소이름 꼴이다
export default function Page() {
  return <div id="shop-view"><div id="arrange-view"><Suspense fallback={null}><ProductFromQuery /></Suspense></div></div>;
}
