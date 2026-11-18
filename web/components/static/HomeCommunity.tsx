import Link from 'next/link';
import { HomeGather } from '@/components/Gatherings';

export default function HomeCommunity() {
  return (
    <>
<section className="community paper" id="home-community">
    <div className="sec-hd rv"><div><span className="eyebrow">COMMUNITY · 커뮤니티</span><h2>꽃을 사이에 두고 나누는 이야기</h2></div><Link href="/community">모임 둘러보기</Link></div>
    <div className="cards">
      <article className="card tall rv">
        <div className="body">
          <div className="ph" role="img" aria-label="들꽃이 핀 정원 사진" style={{ backgroundImage: 'var(--img-field)' }} />
        </div>
        <div className="foot">꽃 모임 · 매월 둘째 토요일<br />서울 · 열 명 남짓</div>
      </article>
      <div className="card wide rv ph" role="img" aria-label="말린 꽃 상자 사진" style={{ backgroundImage: 'var(--img-dried-box)' }} />
      <article className="card info rv">
        <span className="vword">꽃모임</span>
        <HomeGather fallback={
        <dl>
          <dt>이번 달 모임</dt><dd>입동의 수반 꽃꽂이</dd>
          <dt>일시</dt><dd>11월 14일 토요일 오후 2시</dd>
          <dt>함께 나누는 것</dt><dd>꽃 한 단, 차 한 잔, 보자기 한 장</dd>
        </dl>
        } />
        <Link href="/community">이번 달 모임 보기</Link>
      </article>
    </div>
  </section>

    </>
  );
}
