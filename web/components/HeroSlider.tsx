'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const SLIDES = [
  { img: 'ikebana-larch', pos: 'center 35%', eyebrow: '입동 · 立冬', title: '꽃으로 건네는 말', text: '절기마다 고른 꽃 한 줄기를, 다시 쓰는 보자기에 싸서 건넵니다.', href: '/#season', cta: '이번 계절의 꽃', dot: true },
  { img: 'bojagi', pos: 'center 45%', eyebrow: 'BOJAGI · 보자기', title: '포장도 두 번째 선물', text: '풀고 나면 스카프가 되고, 주머니가 되고, 다음 선물의 포장이 되는 천.', href: '/shop?cat=bojagi', cta: '보자기 보기' },
  { img: 'ikebana-bamboo', pos: 'center 30%', eyebrow: 'STUDIO · 설담화', title: '한 사람의 손으로', text: '상담부터 꽂기, 포장까지 한 사람이 맡는 1인 꽃 스튜디오입니다.', href: '/about', cta: '브랜드 소개' },
  { img: 'field', pos: 'center 60%', eyebrow: 'COMMUNITY · 꽃 모임', title: '꽃을 사이에 두고', text: '한 달에 한 번, 열 명 남짓 둘러앉아 꽃을 꽂고 차를 마십니다.', href: '/community', cta: '모임 둘러보기' },
  { img: 'ikebana-daffodil', pos: 'center 30%', eyebrow: 'WORKS · 작업', title: '계절마다 남긴 꽃', text: '공간과 모임과 구독에서 남긴 꽃의 기록.', href: '/works', cta: '작업 기록 보기' },
];
const DELAY = 6000;

export default function HeroSlider() {
  const box = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);
  const [manual, setManual] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [live, setLive] = useState('');
  const [run, setRun] = useState(0); // 진행 막대를 처음부터 다시 그리기 위한 값

  useEffect(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false); }, []);
  const show = useCallback((i: number, byHand: boolean) => {
    const n = (i + SLIDES.length) % SLIDES.length;
    setCur(n); setManual(byHand); setRun(r => r + 1);
    if (byHand) setLive(`${n + 1} / ${SLIDES.length} · ${SLIDES[n].title}`);
  }, []);
  const active = playing && !held;
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => show(cur + 1, false), DELAY);
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
      onKeyDown={e => { if (e.key === 'ArrowLeft') show(cur - 1, true); else if (e.key === 'ArrowRight') show(cur + 1, true); }}>
      <h1 className="sr-only">설담화 · 꽃으로 건네는 말</h1>
      {SLIDES.map((s, k) => (
        <div key={s.img} className={'hs-slide' + (k === cur ? ' on' : '')} role="group" aria-roledescription="slide" aria-label={`${k + 1} / ${SLIDES.length}`}
          aria-hidden={k === cur ? undefined : true} inert={k !== cur}>
          <div className="bg" style={{ backgroundImage: `var(--img-${s.img})`, backgroundPosition: s.pos }} role="img" aria-label={`${s.title} 사진`} />
          <div className="hs-copy"><span className="eyebrow">{s.eyebrow}</span><h2>{s.title}</h2><p>{s.text}</p>
            <Link className="hs-cta" href={s.href}>{s.dot && <i aria-hidden="true" />}{s.cta}</Link></div>
        </div>
      ))}
      <div className="hs-ui">
        <div className="hs-dots" role="group" aria-label="슬라이드 선택">
          {SLIDES.map((_, k) => <button key={k === cur ? `on-${run}` : k} type="button" aria-label={`${k + 1}번째 장 보기`} aria-current={k === cur ? 'true' : undefined} onClick={() => show(k, true)} />)}
        </div>
        <span className="hs-count" aria-hidden="true"><b>{String(cur + 1).padStart(2, '0')}</b> / 05</span>
        <button type="button" className="hs-btn" aria-label="이전 장" onClick={() => show(cur - 1, true)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
        <button type="button" className="hs-btn" aria-label={playing ? '자동 넘김 멈추기' : '자동 넘김 시작'} onClick={() => { setPlaying(p => !p); setRun(r => r + 1); }}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{playing ? <path d="M9 6v12M15 6v12" /> : <path d="M8 5l11 7-11 7z" />}</svg>
        </button>
        <button type="button" className="hs-btn" aria-label="다음 장" onClick={() => show(cur + 1, true)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
      </div>
      <p className="sr-only" aria-live="polite">{live}</p>
    </section>
  );
}
