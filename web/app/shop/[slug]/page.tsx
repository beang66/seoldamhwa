import { notFound } from 'next/navigation';
import { ARR, ITEMS, isArr, isBojagi } from '@/lib/catalog';
import BojagiDetail from '@/components/BojagiDetail';
import ArrangeDetail from '@/components/ArrangeDetail';
import BojagiStory from '@/components/static/BojagiStory';

export function generateStaticParams() {
  return [...Object.keys(ITEMS), ...Object.keys(ARR)].map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = isBojagi(slug) ? ITEMS[slug].name : isArr(slug) ? ARR[slug].name : '제품';
  return { title: name };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (isBojagi(slug)) return <div id="shop-view"><div id="detail-view"><BojagiDetail k={slug} /><BojagiStory /></div></div>;
  if (isArr(slug)) return <div id="shop-view"><div id="arrange-view"><ArrangeDetail k={slug} /></div></div>;
  notFound();
}
