'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ARR, A_DELIV, A_WRAP, won, type ArrKey, type Arrangement, type Choice } from '@/lib/catalog';
import { useCart, useToast } from './Providers';
import ArrangeCare from './static/ArrangeCare';
import ArrangeDelivery from './static/ArrangeDelivery';

const Photo = ({ img, pos, size }: { img: string; pos: string; size: string }) =>
  <span className="photo" style={{ backgroundImage: `var(--img-${img})`, backgroundPosition: pos, backgroundSize: size }} />;

function Radios({ name, label, list, sel, set }: { name: string; label: string; list: Choice[] | { label: string; note: string }[]; sel: number; set: (i: number) => void }) {
  return (
    <div className="sizes" role="radiogroup" aria-label={label}>
      {list.map((o, i) => <label key={o.label}><input type="radio" name={name} value={i} checked={i === sel} onChange={() => set(i)} /><span>{o.label}<em>{o.note}</em></span></label>)}
    </div>
  );
}

function SizeSvg({ c }: { c: Arrangement }) {
  const s = 230 / 65, H = c.h * s, W = c.w * s, V = c.v * s, cx = 150, base = 270;
  return (
    <svg viewBox="0 0 300 300" aria-label={`높이 ${c.h}cm, 폭 ${c.w}cm`}>
      <g fill="none" stroke="#141413" strokeWidth="1.2" strokeLinecap="round">
        <rect x={cx - W / 2} y={base - H} width={W} height={H} strokeDasharray="4 4" stroke="#A9A59E" />
        <path d={`M${cx - V / 2} ${base - 14} L${cx + V / 2} ${base - 14} L${cx + V / 2 - 4} ${base} L${cx - V / 2 + 4} ${base} Z`} fill="#E4E1DA" />
        <path d={`M${cx} ${base - 14} C${cx - W * 0.18} ${base - H * 0.45} ${cx + W * 0.22} ${base - H * 0.7} ${cx + W * 0.05} ${base - H + 6}`} />
        <path d={`M${cx + W / 2 + 14} ${base - H} V${base} M${cx + W / 2 + 9} ${base - H} h10 M${cx + W / 2 + 9} ${base} h10`} />
        <path d={`M${cx - W / 2} ${base + 14} H${cx + W / 2} M${cx - W / 2} ${base + 9} v10 M${cx + W / 2} ${base + 9} v10`} />
      </g>
      <g style={{ fontFamily: 'var(--sans)' }} fontSize="12" fill="#6E6B66" letterSpacing=".5">
        <text x={cx + W / 2 + 22} y={base - H / 2} dominantBaseline="middle">{c.h} cm</text>
        <text x={cx} y={base + 30} textAnchor="middle">{c.w} cm</text>
      </g>
    </svg>
  );
}

export default function ArrangeDetail({ k }: { k: ArrKey }) {
  const c = ARR[k];
  const [vessel, setVessel] = useState(0), [wrap, setWrap] = useState(0), [deliv, setDeliv] = useState(0);
  const [qty, setQty] = useState(1), [main, setMain] = useState(0), [note, setNote] = useState('');
  const { add } = useCart(); const toast = useToast(); const router = useRouter();

  const unit = c.base - (vessel ? c.vesselOff : 0) + A_WRAP[wrap].add;
  const gallery: [string, React.ReactNode][] = [
    ['전체 모습', <Photo key="a" img={c.img} pos="center" size="cover" />],
    ['꽃 가까이', <Photo key="b" img={c.img} pos={c.focus.flower} size="240%" />],
    ['화기 가까이', <Photo key="c" img={c.img} pos={c.focus.vessel} size="240%" />],
    ['감싸개 포장', <svg key="d" viewBox="0 0 300 330" aria-hidden="true"><use href="#ill-wrap" /></svg>],
  ];
  const last = c.name.charCodeAt(c.name.length - 1);
  const josa = (last >= 0xAC00 && last <= 0xD7A3 && (last - 0xAC00) % 28) ? '을' : '를';

  const act = (buy: boolean) => {
    // 퀵은 장바구니에서 따로 한 줄로 보여준다
    const opt = [vessel ? '꽃과 침봉만' : '화기 포함', A_WRAP[wrap].label].concat(deliv ? [] : [A_DELIV[0].label]).join(' · ');
    add({ id: k + '|' + opt, key: k, kind: 'arr', name: c.name, opt, unit, qty, quick: A_DELIV[deliv].add, img: c.img });
    if (buy) router.push('/cart'); else { setNote('장바구니에 담았어요.'); toast('장바구니에 담았어요 · ' + c.name); }
  };

  return (
    <>
      <div className="pd">
        <p className="crumb"><Link href="/shop">제품</Link><span>/</span><Link href="/shop?cat=arrange">꽃꽂이</Link><span>/</span><b>{c.name}</b></p>
        <div className="gal">
          <div className="main" aria-live="polite">{gallery[main][1]}</div>
          <div className="thumbs" role="group" aria-label="상품 이미지">
            {gallery.map(([label, node], i) => <button key={label} type="button" aria-label={label} aria-pressed={i === main} onClick={() => setMain(i)}>{node}</button>)}
          </div>
        </div>
        <div className="info">
          <span className="no">{c.no}</span>
          <h1>{c.name}<small>{c.en}</small></h1>
          <p className="price">{won(unit * qty + A_DELIV[deliv].add)}<small>원</small></p>
          <p className="desc">{c.desc}</p>
          <div className="chips">{c.chips.map(x => <span key={x}>{x}</span>)}</div>
          <div className="opt">
            <div className="opt-group"><h2>화기</h2><Radios name="a-vessel" label="화기 선택" list={[{ label: '화기 포함', note: '수반 · 침봉' }, { label: '꽃과 침봉만', note: '−' + won(c.vesselOff) }]} sel={vessel} set={setVessel} /></div>
            <div className="opt-group"><h2>포장</h2><Radios name="a-wrap" label="포장 선택" list={A_WRAP} sel={wrap} set={setWrap} /></div>
            <div className="opt-group"><h2>받는 방법</h2><Radios name="a-deliv" label="받는 방법 선택" list={A_DELIV} sel={deliv} set={setDeliv} /></div>
            <div className="buy">
              <div className="qty"><button type="button" aria-label="수량 줄이기" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><output aria-live="polite">{qty}</output><button type="button" aria-label="수량 늘리기" onClick={() => setQty(q => Math.min(20, q + 1))}>+</button></div>
              <button type="button" className="btn p" onClick={() => act(false)}>장바구니 담기</button>
              <button type="button" className="btn s" onClick={() => act(true)}>바로 구매</button>
            </div>
            <p className="note" role="status">{note}</p>
          </div>
          <dl className="spec">
            {[['구성', c.chips.join(', ')], ['크기', `높이 약 ${c.h}cm · 폭 약 ${c.w}cm`], ['기간', c.life], ['포장', '감싸개 기본 포함']].map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
          </dl>
          <div className="others"><h2>함께 보면 좋은 꽃꽂이</h2><div>
            {(Object.keys(ARR) as ArrKey[]).filter(x => x !== k).map(x => <Link key={x} href={`/shop/${x}`}><i style={{ backgroundImage: `var(--img-${ARR[x].img})` }} /><b>{ARR[x].name}</b>{won(ARR[x].base)}</Link>)}
          </div></div>
        </div>
      </div>

      <div className="ar">
        <div className="wrap">
          <div className="ar-hd"><span>ABOUT THIS ARRANGEMENT · 꽃꽂이 이야기</span><h2>{c.name + josa} 들이는 방법</h2></div>
          <section>
            <div className="sh"><div><span>01 · FLOWERS</span><h3>꽃과 화기</h3></div><em>what is in it</em></div>
            <div className="mat2">
              <ul className="flist">{c.flowers.map(([n, d, t], i) => <li key={n}><i>{String(i + 1).padStart(2, '0')}</i><div><b>{n}</b><small>{d}</small></div><span>{t}</span></li>)}</ul>
              <div className="memo"><p className="hand">{c.memo[0]}<br />{c.memo[1]}</p><p>{c.memoText}</p><span className="vt">{c.season[0]}</span></div>
            </div>
          </section>
          <section>
            <div className="sh"><div><span>02 · SIZE</span><h3>크기</h3></div><em>height &amp; width</em></div>
            <div className="size">
              <div><SizeSvg c={c} /></div>
              <div>
                <dl><div><dt>높이</dt><dd>{c.h}<small>cm</small></dd></div><div><dt>폭</dt><dd>{c.w}<small>cm</small></dd></div><div><dt>화기 지름</dt><dd>{c.v}<small>cm</small></dd></div></dl>
                <p>손으로 꽂는 꽃이라 실제 크기는 ±5cm 정도 달라질 수 있어요. 둘 자리의 높이와 폭을 한 번 재 보시면 좋아요.</p>
              </div>
            </div>
          </section>
          <section>
            <div className="sh"><div><span>03 · CARE</span><h3>오래 보는 법</h3></div><em>a little every day</em></div>
            <ArrangeCare />
            <p className="care-note">이 꽃꽂이는 보통 <b>{c.life}</b> 동안 볼 수 있어요. 화기와 침봉은 계속 쓰실 수 있습니다.</p>
          </section>
          <section>
            <div className="sh"><div><span>04 · WRAP &amp; DELIVERY</span><h3>포장과 받는 법</h3></div><em>wrapped in bojagi</em></div>
            <ArrangeDelivery />
          </section>
          <section>
            <div className="sh"><div><span>05 · SEASON</span><h3>절기 이야기</h3></div><em>why this flower, now</em></div>
            <div className="season">
              <span className="big">{c.season[0]}</span>
              <div><h4>{c.season[1]}</h4><p>{c.season[2]}</p><small>{c.season[3]}</small></div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
