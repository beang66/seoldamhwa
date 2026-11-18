// 새 주문이 들어오면 관리자에게 메일을 보낸다.
// 켜는 법(supabase/README.md 참고):
//   1) 메일 서비스(Resend) 키를 비밀값으로 넣는다: RESEND_API_KEY, MAIL_FROM(예: 설담화 <order@도메인>), WEBHOOK_SECRET(임의의 긴 문자열)
//   2) 이 함수를 배포한다: supabase functions deploy notify-new-order --no-verify-jwt
//   3) 대시보드 Database → Webhooks에서 public.orders INSERT → 이 함수 주소, 헤더 x-webhook-secret: WEBHOOK_SECRET
// 키가 없으면 아무것도 보내지 않고 200을 돌려준다(주문 접수는 막지 않는다).
import { createClient } from 'npm:@supabase/supabase-js@2';

type Item = { name: string; opt: string; qty: number; unit: number };
type Order = { id: number; name: string; phone: string; receive_date: string | null; memo: string; items: Item[]; total: number; created_at: string };

const won = (n: number) => n.toLocaleString('ko-KR') + '원';
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

Deno.serve(async req => {
  const secret = Deno.env.get('WEBHOOK_SECRET');
  if (!secret || req.headers.get('x-webhook-secret') !== secret) return new Response('forbidden', { status: 403 });

  const body = await req.json().catch(() => null);
  if (body?.type !== 'INSERT' || body?.table !== 'orders') return new Response('ignored');
  const o = body.record as Order;

  const key = Deno.env.get('RESEND_API_KEY'), from = Deno.env.get('MAIL_FROM');
  if (!key || !from) return new Response('mail not configured');

  // 관리자 이메일은 admins 테이블에서 읽는다(서비스 키는 함수 안에서만 쓴다)
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: admins } = await db.from('admins').select('email');
  const to = (admins ?? []).map(a => a.email as string);
  if (!to.length) return new Response('no admins');

  const lines = o.items.map(i => `<li>${esc(i.name)} · ${esc(i.opt)} · ${i.qty}개 · ${won(i.unit * i.qty)}</li>`).join('');
  const html = `<p>새 주문이 들어왔어요.</p>
<p><b>#${o.id}</b> · ${esc(o.name)} · ${esc(o.phone)}<br>받는 날 ${o.receive_date ?? '상의'}${o.memo ? `<br>요청: ${esc(o.memo)}` : ''}</p>
<ul>${lines}</ul><p>합계 <b>${won(o.total)}</b></p><p>관리자 페이지에서 확인해 주세요.</p>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject: `[설담화] 새 주문 #${o.id} · ${won(o.total)}`, html }),
  });
  return new Response(r.ok ? 'sent' : 'mail failed', { status: r.ok ? 200 : 502 });
});
