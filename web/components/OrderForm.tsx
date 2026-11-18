'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { won } from '@/lib/catalog';
import { errText, supabase } from '@/lib/supabase';
import { useAuth } from './Auth';
import { cartTotals, useCart, useToast } from './Providers';

// 장바구니의 '주문하기'. 결제는 아직 없어서 주문을 접수만 하고, 설담화가 연락해 입금과 받는 날을 정한다.
// 금액은 DB(quote_order)가 지금 가격으로 계산한 값을 보여 주고, 접수할 때 그 합계가 그대로인지 DB가 다시 확인한다.
type Quote = { items: { unit: number; quick: number }[]; total: number };

// 받는 날의 최소값: 이 기기의 날짜로 내일 (UTC로 바꾸지 않는다)
function tomorrowLocal() {
  const t = new Date(); t.setDate(t.getDate() + 1);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

export default function OrderForm() {
  const router = useRouter();
  const toast = useToast();
  const { ready, user } = useAuth();
  const { lines, clear, reprice } = useCart();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [prof, setProf] = useState({ name: '', phone: '' });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [changed, setChanged] = useState(false);

  const payload = () => lines.map(l => ({ key: l.key, qty: l.qty, ...l.sel }));
  const key = JSON.stringify(payload());

  useEffect(() => {
    if (!open || !supabase || !user) return;
    supabase.from('profiles').select('name, phone').eq('id', user.id).single().then(({ data }) => data && setProf(data));
  }, [open, user]);

  // 폼을 열거나 장바구니가 바뀌면 지금 가격으로 다시 계산한다
  useEffect(() => {
    if (!open || !supabase) return;
    let off = false;
    supabase.rpc('quote_order', { p_lines: JSON.parse(key) }).then(({ data, error }) => {
      if (off) return;
      if (error) { setErr(errText(error)); setQuote(null); return; }
      const q = data as Quote;
      setErr(''); setQuote(q);
      if (q.total !== cartTotals(lines).total) { setChanged(true); reprice(q.items); }
    });
    return () => { off = true; };
    // lines는 key로 대신 본다 (reprice 뒤 같은 key면 다시 부르지 않는다)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, key, reprice]);

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
    if (!quote) return;
    const f = new FormData(e.currentTarget);
    setBusy(true); setErr('');
    const { data, error } = await supabase!.rpc('place_order', {
      p_lines: payload(), p_name: String(f.get('name') ?? ''), p_phone: String(f.get('phone') ?? ''),
      p_receive_date: String(f.get('date') ?? '') || null, p_memo: String(f.get('memo') ?? ''),
      p_expected_total: quote.total,
    });
    setBusy(false);
    if (error) { setErr(errText(error)); return; }
    // 다음 주문을 위해 연락처를 회원 정보에 남긴다
    if (!prof.phone) await supabase!.from('profiles').update({ phone: String(f.get('phone') ?? '').trim() }).eq('id', user!.id);
    clear();
    toast(`주문을 접수했어요 · 주문 번호 ${data}`);
    router.push('/mypage');
  };

  return (
    <form className="form order-form" onSubmit={submit} aria-label="주문 접수">
      <h3>주문 접수</h3>
      <p className="order-quote" role="status">
        {quote ? <>접수할 금액 <b>{won(quote.total)}원</b></> : err ? null : '금액을 확인하는 중…'}
        {changed && quote && <small>가격이 바뀌어 장바구니 금액을 지금 가격으로 고쳤어요.</small>}
      </p>
      <label className="field"><span>받는 분</span><input name="name" defaultValue={prof.name} key={'n' + prof.name} autoComplete="name" required maxLength={40} /></label>
      <label className="field"><span>연락처</span><input name="phone" defaultValue={prof.phone} key={'p' + prof.phone} type="tel" autoComplete="tel" required minLength={6} maxLength={20} placeholder="010-0000-0000" /></label>
      <label className="field"><span>받고 싶은 날</span><input name="date" type="date" min={tomorrowLocal()} /><small>꽃꽂이는 받는 날 아침에 꽂아요. 비워 두면 연락드려 정해요.</small></label>
      <label className="field"><span>요청 사항</span><textarea name="memo" rows={3} maxLength={500} /></label>
      <p className="form-msg err" role="alert">{err}</p>
      <button className="pill dark wide" type="submit" disabled={busy || !quote}>{busy ? '접수하는 중…' : '주문 접수하기'}</button>
      <button className="link" type="button" onClick={() => setOpen(false)}>닫기</button>
      <p className="cart-rule">아직 온라인 결제는 없어요. 접수하면 설담화가 연락드려 입금 계좌와 받는 날을 안내해요.</p>
    </form>
  );
}
