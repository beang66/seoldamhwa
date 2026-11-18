'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { todayIso } from '@/lib/data';
import { errText, supabase } from '@/lib/supabase';
import { useAuth } from './Auth';
import { useCart, useToast } from './Providers';

// 장바구니의 '주문하기'. 결제는 아직 없어서 주문을 접수만 하고, 설담화가 연락해 입금과 받는 날을 정한다.
// 금액은 DB 함수(place_order)가 제품 가격으로 다시 계산한다. 화면의 합계는 보여 주기용이다.
export default function OrderForm() {
  const router = useRouter();
  const toast = useToast();
  const { ready, user } = useAuth();
  const { lines, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [prof, setProf] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (!open || !supabase || !user) return;
    supabase.from('profiles').select('name, phone').eq('id', user.id).single().then(({ data }) => data && setProf(data));
  }, [open, user]);

  const start = () => {
    if (!supabase) { toast('주문은 준비 중이에요.'); return; }
    if (!ready) return;
    if (!user) { router.push('/login?next=/cart'); return; }
    if (lines.some(l => !l.sel)) { toast('예전에 담은 상품이 있어요. 빼고 다시 담아 주세요.'); return; }
    setOpen(true);
  };

  if (!open) return <button type="button" className="pill dark wide" onClick={start}>주문하기</button>;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setErr('');
    const p_lines = lines.map(l => ({ key: l.key, qty: l.qty, ...l.sel }));
    const { data, error } = await supabase!.rpc('place_order', {
      p_lines, p_name: String(f.get('name') ?? ''), p_phone: String(f.get('phone') ?? ''),
      p_receive_date: String(f.get('date') ?? '') || null, p_memo: String(f.get('memo') ?? ''),
    });
    setBusy(false);
    if (error) { setErr(errText(error)); return; }
    // 다음 주문을 위해 연락처를 회원 정보에 남긴다
    if (!prof.phone) await supabase!.from('profiles').update({ phone: String(f.get('phone') ?? '').trim() }).eq('id', user!.id);
    clear();
    toast(`주문을 접수했어요 · 주문 번호 ${data}`);
    router.push('/mypage');
  };

  const tomorrow = (() => { const t = new Date(todayIso() + 'T00:00:00'); t.setDate(t.getDate() + 1); return t.toISOString().slice(0, 10); })();
  return (
    <form className="form order-form" onSubmit={submit} aria-label="주문 접수">
      <h3>주문 접수</h3>
      <label className="field"><span>받는 분</span><input name="name" defaultValue={prof.name} key={'n' + prof.name} autoComplete="name" required maxLength={40} /></label>
      <label className="field"><span>연락처</span><input name="phone" defaultValue={prof.phone} key={'p' + prof.phone} type="tel" autoComplete="tel" required minLength={6} maxLength={20} placeholder="010-0000-0000" /></label>
      <label className="field"><span>받고 싶은 날</span><input name="date" type="date" min={tomorrow} /><small>꽃꽂이는 받는 날 아침에 꽂아요. 비워 두면 연락드려 정해요.</small></label>
      <label className="field"><span>요청 사항</span><textarea name="memo" rows={3} maxLength={500} /></label>
      <p className="form-msg err" role="alert">{err}</p>
      <button className="pill dark wide" type="submit" disabled={busy}>{busy ? '접수하는 중…' : '주문 접수하기'}</button>
      <button className="link" type="button" onClick={() => setOpen(false)}>닫기</button>
      <p className="cart-rule">아직 온라인 결제는 없어요. 접수하면 설담화가 연락드려 입금 계좌와 받는 날을 안내해요. 금액은 접수할 때 다시 확인해요.</p>
    </form>
  );
}
