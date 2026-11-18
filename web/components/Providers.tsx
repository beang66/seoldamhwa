'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from './Auth';

// ===== 장바구니 =====
// shortcut: 이 브라우저(localStorage)에만 저장한다. 회원·주문을 붙일 때 서버 장바구니로 옮긴다.
// sel: 주문할 때 서버가 가격을 다시 계산하는 데 쓰는 선택값. 화면의 unit·quick은 보여 주기용이다
export type CartSel = { vessel?: boolean; wrap?: number; deliv?: number; size?: string };
export type CartLine = { id: string; key: string; kind: 'bojagi' | 'arr'; name: string; opt: string; unit: number; qty: number; quick: number; img?: string; sel?: CartSel };
const CART_KEY = 'seoldamhwa-cart';
export const SHIP_FEE = 3000, SHIP_FREE_FROM = 50000; // 보자기 택배비 (예시 값)

type CartCtx = { lines: CartLine[]; count: number; add: (l: CartLine) => void; setQty: (i: number, d: number) => void; remove: (i: number) => CartLine | undefined; restore: (i: number, l: CartLine) => void; clear: () => void; reprice: (p: { unit: number; quick: number }[]) => void };
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
export type ToastAction = { label: string; run: () => void };
const Toast = createContext<(msg: string, action?: ToastAction) => void>(() => {});
export const useToast = () => useContext(Toast);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  // 저장된 장바구니를 다 읽은 뒤에만 다시 저장한다 (읽기 전에 빈 목록으로 덮어쓰지 않게)
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem(CART_KEY) || '[]')); } catch { /* 저장소가 막힌 곳 */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) try { localStorage.setItem(CART_KEY, JSON.stringify(lines)); } catch { } }, [lines, loaded]);

  const add = useCallback((l: CartLine) => setLines(cur => {
    const same = cur.find(x => x.id === l.id);
    return same ? cur.map(x => x === same ? { ...x, qty: Math.min(20, x.qty + l.qty) } : x) : [...cur, l];
  }), []);
  const setQty = useCallback((i: number, d: number) => setLines(cur => cur.map((x, k) => k === i ? { ...x, qty: Math.min(20, Math.max(1, x.qty + d)) } : x)), []);
  const remove = useCallback((i: number) => { const gone = lines[i]; setLines(cur => cur.filter((_, k) => k !== i)); return gone; }, [lines]);
  // 뺀 줄을 원래 자리에 되돌린다 (알림의 '되돌리기')
  const restore = useCallback((i: number, l: CartLine) => setLines(cur => cur.some(x => x.id === l.id) ? cur : [...cur.slice(0, i), l, ...cur.slice(i)]), []);
  const clear = useCallback(() => setLines([]), []);
  // 서버가 계산한 지금 가격으로 장바구니의 단가와 퀵 금액을 맞춘다 (줄 순서는 같다)
  const reprice = useCallback((p: { unit: number; quick: number }[]) => setLines(cur => cur.map((x, i) => p[i] ? { ...x, unit: p[i].unit, quick: p[i].quick } : x)), []);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const cart = useMemo(() => ({ lines, count, add, setQty, remove, restore, clear, reprice }), [lines, count, add, setQty, remove, restore, clear, reprice]);

  const [msg, setMsg] = useState(''); const [act, setAct] = useState<ToastAction | null>(null); const [on, setOn] = useState(false); const timer = useRef<number>(0);
  // 되돌리기가 있는 알림은 누를 시간을 주려고 더 오래 둔다
  const show = useCallback((m: string, a?: ToastAction) => { setMsg(m); setAct(a ?? null); setOn(true); clearTimeout(timer.current); timer.current = window.setTimeout(() => { setOn(false); setAct(null); }, a ? 5000 : 2200); }, []);

  // 아직 없는 페이지로 가는 링크: 이동하지 않고 준비 중임을 알린다
  useEffect(() => {
    const h = (e: MouseEvent) => { const a = (e.target as Element).closest('a[data-soon]'); if (!a) return; e.preventDefault(); show('준비 중인 페이지예요.'); };
    document.addEventListener('click', h); return () => document.removeEventListener('click', h);
  }, [show]);

  return (
    <AuthProvider>
      <Cart.Provider value={cart}>
        <Toast.Provider value={show}>
          {children}
          <Reveal />
          <div className={'toast' + (on ? ' on' : '')}><span role="status" aria-live="polite">{msg}</span>{act && <button type="button" onClick={() => { act.run(); setOn(false); setAct(null); }}>{act.label}</button>}</div>
        </Toast.Provider>
      </Cart.Provider>
    </AuthProvider>
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
