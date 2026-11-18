import Link from 'next/link';

export default function HomeBojagi() {
  return (
    <>
<section className="bojagi paper">
    <div className="draw rv">
      <div className="ph" role="img" aria-label="보자기로 싼 꽃 선물 사진" style={{ backgroundImage: 'var(--img-bojagi)' }} />
    </div>
    <div className="cols rv">
      <h2 className="title">다시 쓰는 보자기</h2>
      <span className="roman">dasi sseuneun bojagi</span>
      <p className="col" style={{'--dot': '22%'} as React.CSSProperties}><strong>꽃을 감싼 천은 버려지지 않습니다.</strong></p>
      <p className="col" style={{'--dot': '58%'} as React.CSSProperties}>쪽물과 감물로 들인 무명과 모시.<br />매듭을 풀면 손수건이 되고<br />식탁보가 되고, 다음 선물의 포장이 됩니다.</p>
      <p className="col sm" style={{'--dot': '34%'} as React.CSSProperties}>비닐과 플라스틱 리본 없이<br />천 한 장과 매듭 하나로 전합니다.</p>
      <p className="col sm" style={{'--dot': '70%'} as React.CSSProperties}>가방 끈을 걸면 주머니가 됩니다.<br />보자기만 따로 구매할 수 있습니다.</p>
      <Link className="cta" href="/shop?cat=bojagi">보자기 보기</Link>
    </div>
  </section>

  
    </>
  );
}
