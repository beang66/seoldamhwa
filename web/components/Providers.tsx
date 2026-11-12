'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// ===== 장바구니 =====
// shortcut: 이 브라우저(localStorage)에만 저장한다. 회원·주문을 붙일 때 서버 장바구니로 옮긴다.
export type CartLine = { id: string; key: string; kind: 'bojagi' | 'arr'; name: string; opt: string; unit: number; qty: number; quick: number; img?: string };
const CART_KEY = 'seoldamhwa-cart';
export const SHIP_FEE = 3000, SHIP_FREE_FROM = 50000; // 보자기 택배비 (예시 값)

type CartCtx = { lines: CartLine[]; count: number; add: (l: CartLine) => void; setQty: (i: number, d: number) => void; remove: (i: number) => CartLine | undefined };
const Cart = createContext<CartCtx | null>(null);
export const useCart = () => useContext(Cart)!;

export function cartTotals(lines: CartLine[]) {
  const items = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const quick = lines.reduce((s, l) => s + (l.quick || 0), 0); // 퀵은 꽃꽂이 한 줄마다 한 번
  const bojagi = lines.filter(l => l.kind === 'bojagi').reduce((s, l) => s + l.unit * l.qty, 0);
  const ship = bojagi > 0 && bojagi < SHIP_FREE_FROM ? SHIP_FEE : 0;
  return { items, quick, ship, total: items + quick + ship };
}

// ===== 알림 =====
const Toast = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(Toast);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const loaded = useRef(false);
  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem(CART_KEY) || '[]')); } catch { /* 저장소가 막힌 곳 */ }
    loaded.current = true;
  }, []);
  useEffect(() => { if (loaded.current) try { localStorage.setItem(CART_KEY, JSON.stringify(lines)); } catch { } }, [lines]);

  const add = useCallback((l: CartLine) => setLines(cur => {
    const same = cur.find(x => x.id === l.id);
    return same ? cur.map(x => x === same ? { ...x, qty: Math.min(20, x.qty + l.qty) } : x) : [...cur, l];
  }), []);
  const setQty = useCallback((i: number, d: number) => setLines(cur => cur.map((x, k) => k === i ? { ...x, qty: Math.min(20, Math.max(1, x.qty + d)) } : x)), []);
  const remove = useCallback((i: number) => { const gone = lines[i]; setLines(cur => cur.filter((_, k) => k !== i)); return gone; }, [lines]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const cart = useMemo(() => ({ lines, count, add, setQty, remove }), [lines, count, add, setQty, remove]);

  const [msg, setMsg] = useState(''); const [on, setOn] = useState(false); const timer = useRef<number>(0);
  const show = useCallback((m: string) => { setMsg(m); setOn(true); clearTimeout(timer.current); timer.current = window.setTimeout(() => setOn(false), 2200); }, []);

  // 아직 없는 페이지로 가는 링크: 이동하지 않고 준비 중임을 알린다
  useEffect(() => {
    const h = (e: MouseEvent) => { const a = (e.target as Element).closest('a[data-soon]'); if (!a) return; e.preventDefault(); show('준비 중인 페이지예요.'); };
    document.addEventListener('click', h); return () => document.removeEventListener('click', h);
  }, [show]);

  return (
    <Cart.Provider value={cart}>
      <Toast.Provider value={show}>
        {children}
        <Reveal />
        <p className={'toast' + (on ? ' on' : '')} role="status" aria-live="polite">{msg}</p>
      </Toast.Provider>
    </Cart.Provider>
  );
}

// 스크롤해서 보이면 .rv 요소를 나타낸다. 페이지가 바뀔 때마다 새로 찾는다.
function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: .12 });
    const t = requestAnimationFrame(() => document.querySelectorAll<HTMLElement>('.rv:not(.on)').forEach(el => {
      const i = [...el.parentElement!.children].filter(c => c.classList.contains('rv')).indexOf(el);
      el.style.transitionDelay = (i % 4) * 90 + 'ms'; io.observe(el);
    }));
    return () => { cancelAnimationFrame(t); io.disconnect(); };
  }, [path]);
  return null;
}
