'use client';
// 관리자가 등록한 사진·설명·상세 정보로 그리는 제품 상세 페이지 (/shop/item?k=주소이름)
// 코드로 만든 기본 상세 페이지(has_detail)가 없는 제품은 모두 이 화면을 쓴다.
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { A_DELIV, A_WRAP, SHOP_CATS, won, type Choice } from '@/lib/catalog';
import { picBg, useProduct } from '@/lib/data';
import { useCart, useToast } from './Providers';

function Radios({ name, label, list, sel, set }: { name: string; label: string; list: Pick<Choice, 'label' | 'note'>[]; sel: number; set: (i: number) => void }) {
  return (
    <div className="sizes" role="radiogroup" aria-label={label}>
      {list.map((o, i) => <label key={o.label}><input type="radio" name={name} value={i} checked={i === sel} onChange={() => set(i)} /><span>{o.label}<em>{o.note}</em></span></label>)}
    </div>
  );
}

export function ProductFromQuery() {
  const k = useSearchParams().get('k') ?? '';
  return <ProductDetail key={k} k={k} />;
}

export default function ProductDetail({ k }: { k: string }) {
  const p = useProduct(k);
  const [vessel, setVessel] = useState(0), [wrap, setWrap] = useState(0), [deliv, setDeliv] = useState(0), [size, setSize] = useState(0);
  const [qty, setQty] = useState(1), [main, setMain] = useState(0), [note, setNote] = useState('');
  const { add } = useCart(); const toast = useToast(); const router = useRouter();

  if (!p || !p.visible) return (
    <div className="pd pd-missing"><p>찾을 수 없는 제품이에요.</p><Link className="pill" href="/shop">제품 목록으로</Link></div>
  );

  const catName = (Object.fromEntries(SHOP_CATS) as Record<string, string>)[p.cat] ?? '제품';
  const pics = [p.img, ...(p.photos ?? [])].filter(Boolean);
  const sizes = p.cat === 'bojagi' && p.sizes?.length ? p.sizes : null;
  const isArr = p.cat === 'arrange';
  const unit = sizes ? sizes[size].price : p.price - (isArr && vessel ? p.vessel_off : 0) + (isArr ? A_WRAP[wrap].add : 0);
  const quick = isArr ? A_DELIV[deliv].add : 0;
  const paras = (p.body ?? '').split(/\n\s*\n/).map(t => t.trim()).filter(Boolean);

  const act = (buy: boolean) => {
    const opt = sizes ? sizes[size].label
      : isArr ? [vessel ? '꽃과 침봉만' : '화기 포함', A_WRAP[wrap].label].concat(deliv ? [] : [A_DELIV[0].label]).join(' · ')
      : p.meta || catName;
    add({
      id: k + '|' + opt, key: k, kind: sizes ? 'bojagi' : 'arr', name: p.name, opt, unit, qty, quick,
      img: /^https:\/\//.test(p.img) ? undefined : p.img || undefined,
      sel: sizes ? { size: sizes[size].label } : isArr ? { vessel: !!vessel, wrap, deliv } : {},
    });
    if (buy) router.push('/cart'); else { setNote('장바구니에 담았어요.'); toast('장바구니에 담았어요 · ' + p.name); }
  };

  return (
    <div className="pd">
      <p className="crumb"><Link href="/shop">제품</Link><span>/</span><Link href={`/shop?cat=${p.cat}`}>{catName}</Link><span>/</span><b>{p.name}</b></p>
      <div className="gal">
        <div className="main" aria-live="polite">
          {pics.length ? <span className="photo" role="img" aria-label={`${p.name} 사진 ${main + 1}`} style={{ backgroundImage: picBg(pics[main]) }} /> : <span className="photo blank" aria-hidden="true" />}
        </div>
        {pics.length > 1 && (
          <div className="thumbs" role="group" aria-label="상품 사진">
            {pics.map((x, i) => <button key={x + i} type="button" aria-label={`사진 ${i + 1}`} aria-pressed={i === main} onClick={() => setMain(i)}><span className="photo" style={{ backgroundImage: picBg(x) }} /></button>)}
          </div>
        )}
      </div>
      <div className="info">
        <span className="no">{catName}</span>
        <h1>{p.name}</h1>
        <p className="price">{p.cat === 'sub' ? '월 ' : ''}{won(unit * qty + quick)}<small>원</small></p>
        {p.meta && <p className="desc">{p.meta}</p>}
        <div className="opt">
          {sizes && <div className="opt-group"><h2>크기</h2><Radios name="p-size" label="크기 선택" list={sizes.map(s => ({ label: s.label, note: won(s.price) + '원' }))} sel={size} set={setSize} /></div>}
          {isArr && p.vessel_off > 0 && <div className="opt-group"><h2>화기</h2><Radios name="p-vessel" label="화기 선택" list={[{ label: '화기 포함', note: '수반 · 침봉' }, { label: '꽃과 침봉만', note: '−' + won(p.vessel_off) }]} sel={vessel} set={setVessel} /></div>}
          {isArr && <div className="opt-group"><h2>포장</h2><Radios name="p-wrap" label="포장 선택" list={A_WRAP} sel={wrap} set={setWrap} /></div>}
          {isArr && <div className="opt-group"><h2>받는 방법</h2><Radios name="p-deliv" label="받는 방법 선택" list={A_DELIV} sel={deliv} set={setDeliv} /></div>}
          <div className="buy">
            <div className="qty"><button type="button" aria-label="수량 줄이기" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><output aria-live="polite">{qty}</output><button type="button" aria-label="수량 늘리기" onClick={() => setQty(q => Math.min(20, q + 1))}>+</button></div>
            <button type="button" className="btn p" disabled={p.sold_out} onClick={() => act(false)}>{p.sold_out ? '품절' : '장바구니 담기'}</button>
            <button type="button" className="btn s" disabled={p.sold_out} onClick={() => act(true)}>바로 구매</button>
          </div>
          <p className="note" role="status">{p.sold_out ? '지금은 품절이에요.' : note}</p>
        </div>
        {!!p.info?.length && (
          <dl className="spec">{p.info.map(r => <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>)}</dl>
        )}
      </div>
      {paras.length > 0 && (
        <section className="pd-body" aria-label="상세 설명">
          {paras.map((t, i) => <p key={i}>{t}</p>)}
        </section>
      )}
    </div>
  );
}
