import Link from 'next/link';
import HomeWorksList from '@/components/HomeWorksList';

export default function HomeWorks() {
  return (
    <>
<section className="works paper" id="home-works">
    <div className="poster rv">
      <div>
        <div className="ph" role="img" aria-label="한련 꽃꽂이 사진" style={{ backgroundImage: 'var(--img-ikebana-nasturtium)' }} />
        <p className="hand">꽃과, 계절과,<br />그날의 마음을<br />한 줄기에 <span className="nowrap">남겨 둡니다.</span></p>
      </div>
      <p className="cap"><em>Through the Seasons</em>Seoldamhwa works<span>2026 — Seoul</span></p>
    </div>
    <div>
      <div className="sec-hd rv"><div><span className="eyebrow">WORKS · 작업</span><h2>계절마다 남긴 꽃</h2></div><Link href="/works">전체 아카이브</Link></div>
      <HomeWorksList />
    </div>
  </section>

  
    </>
  );
}
