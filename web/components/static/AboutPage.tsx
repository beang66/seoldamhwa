import Vase from './Vase';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
{" "}<div className="statement ab-hero">
    <div>
      <Vase label="복주머니에 꽂은 한 줄기" />
      <p className="spaced" translate="no">SEOLDAMHWA</p>
      <p className="it">a quiet word<em>in the form of flowers</em></p>
      <h1 className="ko">검소하되 누추하지 않고<br />화려하되 사치하지 않게<small>儉而不陋 華而不侈</small></h1>
    </div>
  </div>

  <div className="pg">
    <section className="pg-sec">
      <div className="sh"><div><span>NAME · 이름</span><h2>說談花, 말로 다 못 한 마음을 꽃으로</h2></div><em>the name</em></div>
      <div className="ab-name">
        <div><b lang="zh-Hant">說</b><span>말씀 설</span><p><strong>마음을 풀어 말하다.</strong> 꽃을 고르는 일은 건넬 사람의 마음을 먼저 듣는 데서 시작합니다.</p></div>
        <div><b lang="zh-Hant">談</b><span>이야기 담</span><p><strong>마주 앉아 나누다.</strong> 작업실에서, 모임에서 꽃을 사이에 두고 이야기를 나눕니다.</p></div>
        <div><b lang="zh-Hant">花</b><span>꽃 화</span><p><strong>말을 꽃으로 건네다.</strong> 말로 다 하지 못한 마음을 꽃 한 줄기로 건넵니다.<i className="pt" aria-hidden="true"></i></p></div>
      </div>
    </section>

    <section className="pg-sec">
      <div className="sh"><div><span>PHILOSOPHY · 생각</span><h2>儉而不陋 華而不侈</h2></div><em>frugal, never shabby · graceful, never lavish</em></div>
      <div className="ab-phil">
        <div>
          <h3><b lang="zh-Hant">儉而不陋</b>검이불루</h3>
          <p className="lead">검소하되 누추하지 않게</p>
          <ul><li>꽃은 한 줄기, 많아야 한 다발만 꽂습니다.</li><li>복주머니 형태의 설담화 패키지에 담아 전합니다.</li><li>비닐과 플라스틱 리본은 쓰지 않습니다.</li></ul>
        </div>
        <div>
          <h3><b lang="zh-Hant">華而不侈</b>화이불치</h3>
          <p className="lead">화려하되 사치하지 않게</p>
          <ul><li>절기마다 가장 고운 꽃 한 가지를 고릅니다.</li><li>색은 꽃이 내고, 천에는 쪽빛 한 줄만 남깁니다.</li><li>오래 두고 쓰는 화기와 천을 함께 건넵니다.</li></ul>
        </div>
      </div>
      <p className="ab-note">『삼국사기』 백제본기 온조왕 15년, 새로 지은 궁궐을 두고 남긴 기록에서 온 말입니다.</p>
    </section>

    <section className="pg-sec">
      <div className="sh"><div><span>HOW WE WORK · 일하는 방식</span><h2>한 사람의 손으로, 계절에 맞춰</h2></div><em>slowly, by hand</em></div>
      <div className="ab-way">
        <div><svg viewBox="0 0 40 40" aria-hidden="true"><use href="#blossom" /></svg><h3>절기마다 꽃 한 가지</h3><p>24절기에 맞춰 그때 가장 고운 꽃을 고르고, 그 계절의 이야기와 함께 보냅니다.</p></div>
        <div><svg viewBox="0 0 40 50" aria-hidden="true"><use href="#sprig" /></svg><h3>한 사람의 손</h3><p>설담화는 1인 꽃 스튜디오입니다. 상담부터 꽂기, 포장, 배송까지 한 사람이 맡습니다.</p></div>
        <div id="package"><img className="package-preview" src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/img/seoldamhwa-package.svg`} alt="설담화 복주머니형 꽃다발 패키지 도식" width={56} height={56} /><h3>설담화 패키지</h3><p>입구에 주름을 잡아 여미는 복주머니 형태의 패키지입니다.</p></div>
      </div>
    </section>

    <section className="pg-sec">
      <div className="sh"><div><span>STUDIO · 작업실</span><h2>작업실에 들르실 때</h2></div><em>by appointment</em></div>
      <div className="ab-visit">
        <dl>
          <div><dt>위치</dt><dd>서울 · 예약하시면 자세한 주소를 알려드려요</dd></div>
          <div><dt>운영</dt><dd>화–토 오후 1시–6시 · 예약제</dd></div>
          <div><dt>문의</dt><dd>문의 메일 준비 중</dd></div>
        </dl>
        <div className="ab-links"><Link className="pill" href="/shop">제품 보기</Link><Link className="pill" href="/works">작업 기록 보기</Link></div>
      </div>
    </section>
  </div>

    </>
  );
}
