import { Suspense } from 'react';
import ShopList, { ShopFromQuery } from '@/components/ShopList';

export const metadata = { title: '제품' };

// 페이지는 미리 만들어 두고, ?cat= 값은 브라우저에서 읽는다
export default function Page() {
  return <div id="shop-view"><Suspense fallback={<ShopList initial="all" />}><ShopFromQuery /></Suspense></div>;
}
