'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { won } from '@/lib/catalog';
import { errText, supabase } from '@/lib/supabase';
import { useAuth } from './Auth';
import { useToast } from './Providers';

export type OrderItem = { key: string; name: string; opt: string; unit: number; qty: number; quick: number };
export type Order = {
  id: number; user_id: string; status: '접수' | '확인' | '준비 중' | '완료' | '취소'; name: string; phone: string; receive_date: string | null;
  memo: string; items: OrderItem[]; items_total: number; quick_total: number; ship: number; total: number; admin_note: string; created_at: string;
};
export const orderDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

export default function MyPage() {
  const router = useRouter();
  const toast = useToast();
  const { ready, user, isAdmin, signOut } = useAuth();
  const [profile, setProfile] = useState<{ name: string; phone: string } | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [busy, setBusy] = useState(false);

  // 로그아웃으로 나가는 중에는 로그인 화면으로 보내지 않는다
  const leaving = useRef(false);
  useEffect(() => { if (ready && !user && !leaving.current) router.replace('/login?next=/mypage'); }, [ready, user, router]);

  const [tick, setTick] = useState(0);
  const load = useCallback(() => setTick(t => t + 1), []);
  const uid = user?.id;
  useEffect(() => {
    if (!supabase || !uid) return;
    let off = false;
    (async () => {
      const [p, o] = await Promise.all([
        supabase!.from('profiles').select('name, phone').eq('id', uid).single(),
        supabase!.from('orders').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      ]);
      if (off) return;
      setProfile(p.data ?? { name: '', phone: '' });
      setOrders((o.data as Order[]) ?? []);
    })();
    return () => { off = true; };
  }, [uid, tick]);

  if (!supabase) return <p className="auth-msg">마이페이지는 준비 중이에요.</p>;
  if (!ready || !user) return <p className="auth-msg" role="status">불러오는 중…</p>;

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase!.from('profiles').update({ name: String(f.get('name')).trim(), phone: String(f.get('phone')).trim() }).eq('id', user.id);
    setBusy(false);
    toast(error ? errText(error) : '회원 정보를 저장했어요.');
  };
  const cancel = async (o: Order) => {
    if (!confirm(`${orderDate(o.created_at)} 주문을 취소할까요?`)) return;
    const { error } = await supabase!.rpc('cancel_my_order', { p_id: o.id });
    toast(error ? errText(error) : '주문을 취소했어요.'); load();
  };
  const out = async () => { leaving.current = true; router.replace('/'); await signOut(); };
  // 탈퇴: 계정은 바로 지우고, 주문 기록은 계정과 분리해 법정 기간만 보관한다(DB 함수 delete_my_account)
  const leave = async () => {
    const typed = prompt('탈퇴하면 계정과 회원 정보가 바로 지워지고 되돌릴 수 없어요.\n주문 기록은 법에 따라 정해진 기간 동안만 보관한 뒤 지워요.\n\n계속하려면 "탈퇴"라고 적어 주세요.');
    if (typed?.trim() !== '탈퇴') return;
    setBusy(true);
    const { error } = await supabase!.rpc('delete_my_account');
    setBusy(false);
    if (error) { toast(errText(error)); return; }
    leaving.current = true; router.replace('/'); await signOut();
    toast('탈퇴했어요. 그동안 고마웠어요.');
  };

  return (
    <div className="my">
      <section className="my-orders" aria-labelledby="my-orders-title">
        <h2 id="my-orders-title">주문 내역</h2>
        {orders === null ? <p className="auth-msg" role="status">불러오는 중…</p>
          : orders.length === 0 ? (
            <div className="my-empty"><p>아직 주문하신 꽃이 없어요.</p><Link className="pill" href="/shop">제품 보러 가기</Link></div>
          ) : (
            <ul className="order-list">
              {orders.map(o => (
                <li key={o.id} className={'order' + (o.status === '취소' ? ' off' : '')}>
                  <div className="order-hd">
                    <time dateTime={o.created_at}>{orderDate(o.created_at)}</time>
                    <span className="badge" data-s={o.status}>{o.status}</span>
                  </div>
                  <ul>{o.items.map((it, i) => <li key={i}><b>{it.name}</b><span>{it.opt} · {it.qty}개</span><em>{won(it.unit * it.qty)}원</em></li>)}</ul>
                  <div className="order-ft">
                    <span>{o.receive_date ? `받는 날 ${o.receive_date.replaceAll('-', '.')}` : '받는 날 상의'}</span>
                    <b>합계 {won(o.total)}원</b>
                  </div>
                  {o.admin_note && <p className="order-note">설담화 · {o.admin_note}</p>}
                  {o.status === '접수' && <button type="button" className="link" onClick={() => cancel(o)}>주문 취소</button>}
                </li>
              ))}
            </ul>
          )}
        <p className="my-help">주문을 접수하면 설담화가 연락드려 받는 날과 입금 방법을 안내해요. 확인 뒤의 취소는 문의로 도와드려요.</p>
      </section>

      <aside className="my-side" aria-labelledby="my-info-title">
        <h2 id="my-info-title">회원 정보</h2>
        {profile && (
          <form className="form" onSubmit={save}>
            <label className="field"><span>이메일</span><input value={user.email ?? ''} readOnly /></label>
            <label className="field"><span>이름</span><input name="name" defaultValue={profile.name} autoComplete="name" maxLength={40} required /></label>
            <label className="field"><span>연락처</span><input name="phone" defaultValue={profile.phone} type="tel" autoComplete="tel" maxLength={20} placeholder="010-0000-0000" /></label>
            <button className="pill wide" type="submit" disabled={busy}>저장</button>
          </form>
        )}
        {isAdmin && <Link className="pill dark wide" href="/admin">관리자 페이지</Link>}
        <button type="button" className="link" onClick={out}>로그아웃</button>
        <button type="button" className="link quiet" onClick={leave} disabled={busy}>회원 탈퇴</button>
      </aside>
    </div>
  );
}
