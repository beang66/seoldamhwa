'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './Providers';

const NAV = [
  { href: '/shop', key: 'shop', label: '제품' },
  { href: '/about', key: 'about', label: '브랜드 소개' },
  { href: '/works', key: 'works', label: 'works' },
  { href: '/community', key: 'community', label: '커뮤니티' },
];

export default function Header() {
  const path = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const cnt = useRef<HTMLSpanElement>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    const f = () => setSolid(scrollY > 40); f();
    addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); btn.current?.focus(); } };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [open]);
  // 담으면 숫자가 한 번 튄다
  useEffect(() => {
    if (last.current !== null && count > last.current && !matchMedia('(prefers-reduced-motion: reduce)').matches)
      cnt.current?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 200, easing: 'cubic-bezier(.23,1,.32,1)' });
    last.current = count;
  }, [count]);

  const view = path === '/' ? 'home' : path.split('/')[1];
  return (
    <header className={'hd' + (solid ? ' solid' : '') + (open ? ' open' : '') + (view === 'home' ? ' on-hero' : '')}>
      <nav aria-label="주 메뉴" id="gnb">
        <ul>
          {NAV.map(n => <li key={n.key}><Link href={n.href} aria-current={view === n.key ? 'page' : undefined}>{n.label}</Link></li>)}
        </ul>
      </nav>
      <button ref={btn} className="menu-btn" type="button" aria-expanded={open} aria-controls="gnb" onClick={() => setOpen(o => !o)}>메뉴</button>
      <Link className="brand" href="/" aria-label="설담화 메인페이지" translate="no"><svg aria-hidden="true"><use href="#blossom" /></svg>설담화</Link>
      <div className="util">
        <Link className="ico" href="/cart" aria-label={`장바구니, 담긴 상품 ${count}개`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l-1.2 11a1.5 1.5 0 0 1-1.5 1.3H8.2a1.5 1.5 0 0 1-1.5-1.3z" /><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" /></svg>
          <span className="cnt" ref={cnt}>{count}</span>
        </Link>
        <a className="ico" href="#" data-soon="" aria-label="마이페이지 (준비 중)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.2" r="3.7" /><path d="M4.8 20.5c.9-3.9 3.7-6 7.2-6s6.3 2.1 7.2 6" /></svg>
        </a>
      </div>
    </header>
  );
}
