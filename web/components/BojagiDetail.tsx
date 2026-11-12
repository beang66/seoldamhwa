'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ITEMS, won, type BojagiKey, type GalleryKind } from '@/lib/catalog';
import { useCart, useToast } from './Providers';

const Ill = ({ id }: { id: string }) => <svg viewBox="0 0 300 330" aria-hidden="true"><use href={`#${id}`} /></svg>;

// 상품 사진 대신 쓰는 그림 조각들
function Pic({ kind }: { kind: GalleryKind }) {
  switch (kind) {
    case 'ill-wrap': case 'ill-knot': return <Ill id={kind} />;
    case 'border': return <svg viewBox="0 0 120 120" aria-hidden="true"><rect x="10" y="10" width="100" height="100" fill="url(#weave2)" /><path d="M10 10 H110 V110" fill="none" stroke="#2F56A8" strokeWidth="7" /><path d="M10 17 H103 V110" fill="none" stroke="#2A2926" strokeWidth=".7" strokeDasharray="3 3" /></svg>;
    case 'label': return <span className="lbl" style={{ '--blue': '#2F56A8' } as React.CSSProperties}><span className="logo" style={{ fontFamily: 'var(--hand)' }}>설담화</span><small>SEOLDAMHWA</small></span>;
    case 'sprig': return <svg viewBox="0 0 120 120" aria-hidden="true"><rect x="10" y="10" width="100" height="100" fill="url(#weave2)" /><use href="#sprig" x="58" y="50" width="44" height="56" style={{ color: '#2A2926' }} /></svg>;
    case 'knot': return <svg viewBox="0 0 120 120" aria-hidden="true"><use href="#knot" x="38" y="12" width="44" height="96" style={{ color: '#2F56A8' }} /></svg>;
    case 'strap': return <svg viewBox="0 0 120 120" aria-hidden="true"><path d="M10 70 C30 70 40 40 60 40 C80 40 90 70 110 70" fill="none" stroke="#2A2926" strokeWidth="13" strokeLinecap="round" /><path d="M10 70 C30 70 40 40 60 40 C80 40 90 70 110 70" fill="none" stroke="#E2D8C4" strokeWidth="10.4" strokeLinecap="round" /><circle cx="22" cy="86" r="7" fill="none" stroke="#2A2926" strokeWidth="1.3" /><path d="M14 72 C12 80 16 86 22 86" fill="none" stroke="#2A2926" strokeWidth="1.3" /><circle cx="22" cy="86" r="3" fill="#2A2926" /></svg>;
    case 'photo': return <span className="photo" style={{ backgroundImage: 'var(--img-bojagi)' }} />;
  }
}

export default function BojagiDetail({ k }: { k: BojagiKey }) {
  const cur = ITEMS[k];
  const other = ITEMS[cur.other];
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [main, setMain] = useState(0);
  const [note, setNote] = useState('');
  const { add } = useCart(); const toast = useToast(); const router = useRouter();

  const act = (buy: boolean) => {
    const s = cur.sizes[size];
    add({ id: k + '|' + s.label, key: k, kind: 'bojagi', name: cur.name, opt: s.label, unit: s.price, qty, quick: 0 });
    if (buy) router.push('/cart'); else { setNote('장바구니에 담았어요.'); toast('장바구니에 담았어요 · ' + cur.name); }
  };

  return (
    <div className="pd">
      <p className="crumb"><Link href="/shop">제품</Link><span>/</span><Link href="/shop?cat=bojagi">보자기</Link><span>/</span><b>{cur.name}</b></p>
      <div className="gal">
        <div className="main" aria-live="polite"><Pic kind={cur.gallery[main][1]} /></div>
        <div className="thumbs" role="group" aria-label="상품 이미지">
          {cur.gallery.map(([label, kind], i) => <button key={label} type="button" aria-label={label} aria-pressed={i === main} onClick={() => setMain(i)}><Pic kind={kind} /></button>)}
        </div>
      </div>
      <div className="info">
        <span className="no">{cur.no}</span>
        <h1>{cur.name}<small>{cur.en}</small></h1>
        <p className="price">{won(cur.sizes[size].price * qty)}<small>원</small></p>
        <p className="desc">{cur.desc}</p>
        <div className="chips">{cur.modes.map(m => <span key={m}>{m}</span>)}</div>
        <div className="opt">
          <h2>크기</h2>
          <div className="sizes" role="radiogroup" aria-label="크기 선택">
            {cur.sizes.map((s, i) => <label key={s.label}><input type="radio" name="size" value={i} checked={i === size} onChange={() => setSize(i)} /><span>{s.label}<b>{won(s.price)}</b></span></label>)}
          </div>
          <div className="buy">
            <div className="qty"><button type="button" aria-label="수량 줄이기" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><output aria-live="polite">{qty}</output><button type="button" aria-label="수량 늘리기" onClick={() => setQty(q => Math.min(20, q + 1))}>+</button></div>
            <button type="button" className="btn p" onClick={() => act(false)}>장바구니 담기</button>
            <button type="button" className="btn s" onClick={() => act(true)}>바로 구매</button>
          </div>
          <p className="note" role="status">{note}</p>
        </div>
        <dl className="spec">{cur.spec.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
        <Link className="other" href={`/shop/${cur.other}`}><i><Ill id={cur.other === 'wrap' ? 'ill-wrap' : 'ill-knot'} /></i><span><small>함께 쓰면 좋은 보자기</small><b>{other.name}</b></span></Link>
      </div>
    </div>
  );
}
