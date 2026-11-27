import Link from 'next/link';
import { preload } from 'react-dom';
import HeroSlider from '@/components/HeroSlider';
import SeasonHead from '@/components/static/SeasonHead';
import HomeBojagi from '@/components/static/HomeBojagi';
import HomeWorks from '@/components/static/HomeWorks';
import HomeCommunity from '@/components/static/HomeCommunity';
import PriceTag from '@/components/PriceTag';

// 첫 화면 첫 장 사진은 CSS 배경이라 늦게 발견된다. 먼저 받아 둔다
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const SEASON = [
  { href: '/shop/larch', img: 'ikebana-larch', alt: '굽 높은 회색 수반에 S자로 선 낙엽송 가지와 연잎 한 장', name: '낙엽송과 연잎', meta: '꽃꽂이 · 중품', price: 'larch' },
  { href: '/shop/bamboo', img: 'ikebana-bamboo', alt: '대나무 줄기 옆에 부채처럼 접은 잎과 흰 들꽃을 꽂은 꽃꽂이', name: '대나무와 부채 잎', meta: '꽃꽂이 · 중품', price: 'bamboo' },
  { href: '/shop/daffodil', img: 'ikebana-daffodil', alt: '깔때기 모양 화기에 꽂은 노란 수선 한 송이', name: '수선 한 줄기', meta: '꽃꽂이 · 소품', price: 'daffodil' },
];

export default function Home() {
  preload(`${BASE}/img/ikebana-larch.jpg`, { as: 'image', fetchPriority: 'high' });
  return (
    <>
      <HeroSlider />
      <section className="sec paper" id="season">
        <SeasonHead />
        <div className="products">
          {SEASON.map(p => (
            <Link key={p.href} className="prod rv" href={p.href}>
              <div className="frame"><span className="ph" role="img" aria-label={p.alt} style={{ backgroundImage: `var(--img-${p.img})` }} /></div>
              <h3>{p.name}</h3><p>{p.meta}<PriceTag k={p.price} /></p>
            </Link>
          ))}
        </div>
      </section>
      <HomeBojagi />
      <HomeWorks />
      <HomeCommunity />
    </>
  );
}
