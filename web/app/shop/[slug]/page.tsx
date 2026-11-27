import { notFound } from 'next/navigation';
import { ARR, ITEMS, isArr, isBojagi } from '@/lib/catalog';
import Link from 'next/link';
import ArrangeDetail from '@/components/ArrangeDetail';

export function generateStaticParams() {
  return [...Object.keys(ITEMS), ...Object.keys(ARR)].map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = isBojagi(slug) ? '설담화 패키지' : isArr(slug) ? ARR[slug].name : '제품';
  return { title: name };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (isBojagi(slug)) return <div className="page-hd"><h1>설담화 패키지</h1><p>복주머니 형태의 설담화 패키지입니다. 상품 구성과 판매 조건은 확인 중입니다.</p><Link className="pill" href="/about#package">패키지 시안 보기</Link></div>;
  if (isArr(slug)) return <div id="shop-view"><div id="arrange-view"><ArrangeDetail k={slug} /></div></div>;
  notFound();
}
