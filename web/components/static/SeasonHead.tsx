import Vase from './Vase';
import Link from 'next/link';

export default function SeasonHead() {
  return (
    <>
<div className="sec-hd rv"><div className="ttl"><div><span className="eyebrow">PRODUCTS · 제품</span><h2 className="with-ill">입동의 꽃<Vase className="sec-ill" /></h2></div></div><Link href="/shop">모든 제품 보기</Link></div>
    
    </>
  );
}
