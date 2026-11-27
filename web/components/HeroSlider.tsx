'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const SLIDES = [
  { img: 'ikebana-larch', pos: 'center 35%', eyebrow: '입동 · 立冬', title: '꽃으로 건네는 말', text: '절기마다 고른 꽃 한 줄기를, 복주머니 형태의 설담화 패키지에 담아 건넵니다.', href: '/#season', cta: '이번 계절의 꽃', dot: true },
  { img: 'package-preview', pos: 'center 55%', eyebrow: 'PACKAGE · 패키지 시안', title: '포장도 두 번째 선물', text: '입구에 주름을 잡아 여미는 복주머니 형태의 설담화 패키지입니다.', href: '/about#package', cta: '패키지 보기' },
  { img: 'ikebana-bamboo', pos: 'center 30%', eyebrow: 'STUDIO · 설담화', title: '한 사람의 손으로', text: '상담부터 꽂기, 포장까지 한 사람이 맡는 1인 꽃 스튜디오입니다.', href: '/about', cta: '브랜드 소개' },
  { img: 'field', pos: 'center 60%', eyebrow: 'COMMUNITY · 꽃 모임', title: '꽃을 사이에 두고', text: '한 달에 한 번, 열 명 남짓 둘러앉아 꽃을 꽂고 차를 마십니다.', href: '/community', cta: '모임 둘러보기' },
  { img: 'ikebana-daffodil', pos: 'center 30%', eyebrow: 'WORKS · 작업', title: '계절마다 남긴 꽃', text: '공간과 모임과 구독에서 남긴 꽃의 기록.', href: '/works', cta: '작업 기록 보기' },
];
const DELAY = 6000;

export default function HeroSlider() {
  const box = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);
  const [manual, setManual] = useState(false);
  // 움직임 줄이기를 켠 사람에게는 자동으로 넘기지 않는다 (마우스·포커스가 올라가면 잠시 멈춤)
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [live, setLive] = useState('');
  const [run, setRun] = useState(0); // 진행 막대를 처음부터 다시 그리기 위한 값
  // 넘어가는 방향: fwd = 다음 장이 오른쪽에서 들어오고 지금 장이 왼쪽으로 밀려남, back = 반대
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<'fwd' | 'back' | null>(null);

  useEffect(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false); }, []);
  const show = useCallback((i: number, byHand: boolean, d: 'fwd' | 'back') => {
    const n = (i + SLIDES.length) % SLIDES.length;
    if (n === cur) return;
    setPrev(cur); setDir(d); setCur(n); setManual(byHand); setRun(r => r + 1);
    if (byHand) setLive(`${n + 1} / ${SLIDES.length} · ${SLIDES[n].title}`);
  }, [cur]);
  const active = playing && !held;
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => show(cur + 1, false, 'fwd'), DELAY);
    return () => clearTimeout(t);
  }, [active, cur, run, show]);
  useEffect(() => {
    const v = () => setHeld(document.hidden);
    document.addEventListener('visibilitychange', v); return () => document.removeEventListener('visibilitychange', v);
  }, []);

  return (
    <section ref={box} className={'hs' + (active ? ' playing' : '') + (manual ? ' manual' : '')} id="hero" aria-roledescription="carousel" aria-label="설담화 소개"
      style={{ '--hs-delay': DELAY + 'ms' } as React.CSSProperties}
      onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={e => { if (!box.current?.contains(e.relatedTarget as Node)) setHeld(false); }}
      onKeyDown={e => { if (e.key === 'ArrowLeft') show(cur - 1, true, 'back'); else if (e.key === 'ArrowRight') show(cur + 1, true, 'fwd'); }}>
      <h1 className="sr-only">설담화 · 꽃으로 건네는 말</h1>
      {SLIDES.map((s, k) => (
        <div key={s.img} className={'hs-slide' + (k === cur ? ' on' : k === prev ? ' leave' : '') + (dir && (k === cur || k === prev) ? ' ' + dir : '')} role="group" aria-roledescription="slide" aria-label={`${k + 1} / ${SLIDES.length}`}
          aria-hidden={k === cur ? undefined : true} inert={k !== cur}>
          <div className="bg" style={{ backgroundImage: `var(--img-${s.img})`, backgroundPosition: s.pos }} role="img" aria-label={`${s.title} 사진`} />
          <div className="hs-copy"><span className="eyebrow">{s.eyebrow}</span><h2>{s.title}</h2><p>{s.text}</p>
            <Link className="hs-cta" href={s.href}>{s.dot && <i aria-hidden="true" />}{s.cta}</Link></div>
        </div>
      ))}
      <div className="hs-ui">
        <div className="hs-dots" role="group" aria-label="장 위치 · 눌러서 이동">
          {SLIDES.map((_, k) => <button key={k === cur ? `on-${run}` : k} type="button" aria-label={`${k + 1}번째 장으로 이동 · ${SLIDES[k].title}`} aria-current={k === cur ? 'true' : undefined} onClick={() => show(k, true, k > cur ? 'fwd' : 'back')} />)}
        </div>
        <span className="hs-count" aria-hidden="true"><b>{String(cur + 1).padStart(2, '0')}</b> / 05</span>
      </div>
      {/* 좌우 가장자리의 테두리 없는 화살표 */}
      <button type="button" className="hs-arrow prev" aria-label="이전 장" onClick={() => show(cur - 1, true, 'back')}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20 5L9 16l11 11" /></svg></button>
      <button type="button" className="hs-arrow next" aria-label="다음 장" onClick={() => show(cur + 1, true, 'fwd')}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 5l11 11-11 11" /></svg></button>
      <p className="sr-only" aria-live="polite">{live}</p>
    </section>
  );
}
