import Link from 'next/link';

export default function HomeBojagi() {
  return (
    <>
<section className="bojagi paper">
    <div className="draw rv">
      <div className="ph" role="img" aria-label="복주머니 형태 설담화 패키지 시안" style={{ backgroundImage: 'var(--img-package-preview)' }} />
    </div>
    <div className="cols rv">
      <h2 className="title">설담화 패키지</h2>
      <span className="roman">package preview</span>
      <p className="col" style={{'--dot': '22%'} as React.CSSProperties}><strong>복주머니에 꽃의 이야기를 담습니다.</strong></p>
      <p className="col" style={{'--dot': '58%'} as React.CSSProperties}>입구에 주름을 잡아 여미는<br />복주머니 형태의 패키지입니다.</p>
      <p className="col sm" style={{'--dot': '34%'} as React.CSSProperties}>설담화 패키지 시안</p>
      <Link className="cta" href="/about#package">패키지 보기</Link>
    </div>
  </section>

  
    </>
  );
}
