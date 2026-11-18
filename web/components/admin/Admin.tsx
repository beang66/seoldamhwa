'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WK_CATS, won } from '@/lib/catalog';
import { dotDate, refreshPublic, ymText, type GatheringRow, type ProductRow, type WorkRow } from '@/lib/data';
import { errText, supabase } from '@/lib/supabase';
import { useAuth } from '../Auth';
import { useToast } from '../Providers';
import { orderDate, type Order } from '../MyPage';

// 관리자 화면. 화면에서 막는 것과 별개로, 쓰기 권한은 DB 정책(is_admin)이 다시 확인한다.

type Tab = 'orders' | 'products' | 'gatherings' | 'works';
const TABS: [Tab, string][] = [['orders', '주문'], ['products', '제품'], ['gatherings', '모임'], ['works', 'works']];

export default function Admin() {
  const router = useRouter();
  const { ready, user, isAdmin, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('orders');

  const leaving = useRef(false);
  useEffect(() => { if (ready && !user && !leaving.current) router.replace('/login?next=/admin'); }, [ready, user, router]);

  if (!supabase) return <Shell><p className="auth-msg">관리자 기능은 DB를 연결한 뒤에 쓸 수 있어요.</p></Shell>;
  if (!ready || !user) return <Shell><p className="auth-msg" role="status">불러오는 중…</p></Shell>;
  if (!isAdmin) return (
    <Shell>
      <p className="auth-msg">관리자로 등록된 계정이 아니에요.</p>
      <Link className="pill" href="/mypage">마이페이지로</Link>
    </Shell>
  );

  return (
    <Shell right={<><span className="ad-who">{user.email}</span><button type="button" className="link" onClick={async () => { leaving.current = true; router.replace('/'); await signOut(); }}>로그아웃</button></>}>
      <div className="cats ad-tabs" role="tablist" aria-label="관리 항목">
        {TABS.map(([k, n]) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => k !== tab && okToLeave() && setTab(k)}>{n}</button>)}
      </div>
      <div role="tabpanel" aria-label={TABS.find(t => t[0] === tab)![1]}>
        {tab === 'orders' && <Orders />}
        {tab === 'products' && <Products />}
        {tab === 'gatherings' && <Gatherings />}
        {tab === 'works' && <Works />}
      </div>
    </Shell>
  );
}

function Shell({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <>
      <div className="page-hd ad-hd">
        <span className="eyebrow">ADMIN · 관리자</span>
        <h1>관리자</h1>
        {right && <p className="ad-right">{right}</p>}
      </div>
      <div className="pg ad">{children}</div>
    </>
  );
}

// ===== 공통: 목록 불러오기 =====
function useRows<T>(table: string, order: [string, boolean][]) {
  const [rows, setRows] = useState<T[] | null>(null);
  const [tick, setTick] = useState(0);
  const ord = JSON.stringify(order);
  useEffect(() => {
    let off = false;
    (async () => {
      let q = supabase!.from(table).select('*');
      for (const [c, asc] of JSON.parse(ord) as [string, boolean][]) q = q.order(c, { ascending: asc });
      const { data } = await q;
      if (!off) setRows((data as T[]) ?? []);
    })();
    return () => { off = true; };
  }, [table, ord, tick]);
  const load = useCallback(() => setTick(t => t + 1), []);
  return { rows, load };
}

// ===== 공통: 칸 정의로 그리는 편집 폼 =====
type Field = {
  name: string; label: string; hint?: string; required?: boolean; wide?: boolean;
  type: 'text' | 'number' | 'textarea' | 'select' | 'check' | 'date' | 'month' | 'sizes' | 'pic';
  options?: [string, string][]; readOnlyWhenEdit?: boolean; show?: (v: Rec) => boolean;
};
type Rec = Record<string, unknown>;

const sizesToText = (v: unknown) => Array.isArray(v) ? (v as { label: string; price: number }[]).map(s => `${s.label} = ${s.price}`).join('\n') : '';
function textToSizes(t: string) {
  const out = t.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const m = l.match(/^(.+?)\s*=\s*([\d,]+)$/);
    if (!m) throw new Error(`크기 줄을 '이름 = 가격' 꼴로 적어 주세요: ${l}`);
    return { label: m[1].trim(), price: Number(m[2].replace(/,/g, '')) };
  });
  return out.length ? out : null;
}

// 편집 중인데 저장하지 않은 내용이 있는지. 탭을 바꾸거나 닫거나 창을 떠날 때 묻는다
const edits = { dirty: false };
const LOSE = '저장하지 않은 내용이 있어요. 버리고 넘어갈까요?';
const okToLeave = () => !edits.dirty || confirm(LOSE);

function Editor({ fields, value, isNew, onSave, onCancel, onDelete, title }: {
  fields: Field[]; value: Rec; isNew: boolean; title: string;
  onSave: (v: Rec) => Promise<void>; onCancel: () => void; onDelete?: () => Promise<void>;
}) {
  const [v, setV] = useState<Rec>(value);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string, x: unknown) => setV(cur => ({ ...cur, [k]: x }));
  // 처음 값에서 하나라도 고쳤으면 '저장 안 함' 상태
  useEffect(() => { edits.dirty = v !== value; }, [v, value]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (edits.dirty) e.preventDefault(); };
    addEventListener('beforeunload', warn);
    return () => { removeEventListener('beforeunload', warn); edits.dirty = false; };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const out: Rec = { ...v };
      for (const f of fields) {
        if (f.type === 'number') out[f.name] = Number(v[f.name] ?? 0);
        if (f.type === 'sizes') out[f.name] = textToSizes(String(v[f.name + '__text'] ?? sizesToText(v[f.name])));
        if (f.type === 'month') out[f.name] = String(v[f.name] ?? '').slice(0, 7) + '-01';
        delete out[f.name + '__text'];
      }
      await onSave(out);
    } catch (x) { setErr(errText(x)); } finally { setBusy(false); }
  };

  return (
    <form className="form ad-form" onSubmit={submit} aria-label={title} autoComplete="off">
      <h3>{title}</h3>
      <div className="ad-fields">
        {fields.filter(f => !f.show || f.show(v)).map(f => {
          const val = v[f.name];
          const ro = !isNew && f.readOnlyWhenEdit;
          const cls = 'field' + (f.wide || f.type === 'textarea' || f.type === 'sizes' || f.type === 'pic' ? ' wide' : '');
          if (f.type === 'check') return (
            <label key={f.name} className="check"><input type="checkbox" checked={!!val} onChange={e => set(f.name, e.target.checked)} /><span>{f.label}</span></label>
          );
          if (f.type === 'pic') return <PicField key={f.name} label={f.label} value={String(val ?? '')} onChange={x => set(f.name, x)} />;
          return (
            <label key={f.name} className={cls}><span>{f.label}{f.required && <i aria-hidden="true"> *</i>}</span>
              {f.type === 'textarea' ? <textarea rows={4} value={String(val ?? '')} required={f.required} onChange={e => set(f.name, e.target.value)} />
                : f.type === 'select' ? <select value={String(val ?? '')} required={f.required} disabled={ro} onChange={e => set(f.name, e.target.value)}>{f.options!.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select>
                : f.type === 'sizes' ? <textarea rows={3} value={String(v[f.name + '__text'] ?? sizesToText(val))} onChange={e => set(f.name + '__text', e.target.value)} placeholder={'소 45 cm = 38000\n중 70 cm = 46000'} />
                : <input type={f.type === 'month' ? 'month' : f.type} value={f.type === 'month' ? String(val ?? '').slice(0, 7) : String(val ?? '')} required={f.required} readOnly={ro}
                    min={f.type === 'number' ? 0 : undefined} step={f.type === 'number' ? 1 : undefined} onChange={e => set(f.name, e.target.value)} />}
              {f.hint && <small>{f.hint}</small>}
            </label>
          );
        })}
      </div>
      <p className="form-msg err" role="alert">{err}</p>
      <div className="ad-actions">
        <button className="pill dark" type="submit" disabled={busy}>{busy ? '저장하는 중…' : '저장'}</button>
        <button className="pill" type="button" onClick={() => okToLeave() && onCancel()}>닫기</button>
        {onDelete && !isNew && <button className="link danger" type="button" disabled={busy} onClick={async () => {
          if (!confirm('삭제할까요? 삭제한 내용은 되돌릴 수 없습니다.')) return;
          setBusy(true); try { await onDelete(); } catch (x) { setErr(errText(x)); } finally { setBusy(false); }
        }}>삭제</button>}
      </div>
    </form>
  );
}

// 저장 결과 오류를 예외로
const must = async (p: PromiseLike<{ error: unknown }>) => { const { error } = await p; if (error) throw error; };

// ===== 주문 =====
const STATUSES = ['접수', '확인', '준비 중', '완료', '취소'] as const;
function Orders() {
  const toast = useToast();
  const { rows, load } = useRows<Order>('orders', [['created_at', false]]);
  const [filter, setFilter] = useState<string>('open');
  const list = useMemo(() => (rows ?? []).filter(o => filter === 'all' ? true : filter === 'open' ? !['완료', '취소'].includes(o.status) : o.status === filter), [rows, filter]);

  const update = async (o: Order, patch: Partial<Order>) => {
    try { await must(supabase!.from('orders').update(patch).eq('id', o.id)); toast('주문을 고쳤어요.'); load(); }
    catch (x) { toast(errText(x)); }
  };

  return (
    <section>
      <div className="ad-bar">
        <label className="field inline"><span>보기</span>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="open">처리할 주문</option><option value="all">전체</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <button type="button" className="link" onClick={load}>새로 고침</button>
      </div>
      {rows === null ? <p className="auth-msg" role="status">불러오는 중…</p>
        : list.length === 0 ? <p className="ad-empty">해당하는 주문이 없어요.</p>
        : (
          <ul className="order-list ad-orders">
            {list.map(o => (
              <li key={o.id} className={'order' + (o.status === '취소' ? ' off' : '')}>
                <div className="order-hd">
                  <span><b>#{o.id}</b> · <time dateTime={o.created_at}>{orderDate(o.created_at)}</time></span>
                  <label className="field inline"><span className="sr-only">상태</span>
                    <select value={o.status} onChange={e => update(o, { status: e.target.value as Order['status'] })}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                </div>
                <dl className="ad-cust">
                  <div><dt>주문한 분</dt><dd>{o.name}</dd></div>
                  <div><dt>연락처</dt><dd><a href={`tel:${o.phone}`}>{o.phone}</a></dd></div>
                  <div><dt>받는 날</dt><dd>{o.receive_date ? dotDate(o.receive_date) : '상의'}</dd></div>
                  {o.memo && <div><dt>요청</dt><dd>{o.memo}</dd></div>}
                </dl>
                <ul>{o.items.map((it, i) => <li key={i}><b>{it.name}</b><span>{it.opt} · {it.qty}개</span><em>{won(it.unit * it.qty)}원</em></li>)}</ul>
                <div className="order-ft">
                  <span>상품 {won(o.items_total)} · 퀵 {won(o.quick_total)} · 택배 {won(o.ship)}</span>
                  <b>합계 {won(o.total)}원</b>
                </div>
                <form className="ad-note" autoComplete="off" onSubmit={e => { e.preventDefault(); update(o, { admin_note: String(new FormData(e.currentTarget).get('note') ?? '').trim() }); }}>
                  <label className="field"><span>고객에게 보이는 메모</span><input name="note" defaultValue={o.admin_note} maxLength={500} placeholder="예: 11월 20일 오전에 퀵으로 보내 드려요." /></label>
                  <button className="pill" type="submit">메모 저장</button>
                </form>
              </li>
            ))}
          </ul>
        )}
    </section>
  );
}

// ===== 공통: 목록 + 편집 =====
function Crud<T extends { [k: string]: unknown }>({ table, idKey, order, fields, blank, head, row, title, canDelete, afterSave }: {
  table: string; idKey: string; order: [string, boolean][]; fields: Field[]; blank: Rec;
  head: string[]; row: (r: T) => React.ReactNode[]; title: (r: T | null) => string;
  canDelete?: (r: T) => boolean; afterSave?: () => void;
}) {
  const toast = useToast();
  const { rows, load } = useRows<T>(table, order);
  const [edit, setEdit] = useState<{ v: Rec; isNew: boolean } | null>(null);
  const done = (m: string) => { toast(m); setEdit(null); load(); afterSave?.(); };

  const save = async (v: Rec) => {
    const body = { ...v }; const id = body[idKey];
    if (edit!.isNew) { if (idKey === 'id') delete body.id; await must(supabase!.from(table).insert(body)); done('추가했어요.'); }
    else { delete body[idKey]; delete body.created_at; delete body.updated_at; await must(supabase!.from(table).update(body).eq(idKey, id)); done('저장했어요.'); }
  };
  const del = async () => { await must(supabase!.from(table).delete().eq(idKey, edit!.v[idKey])); done('삭제했어요.'); };
  // 목록 줄에서 바로 삭제
  const delRow = async (r: T) => {
    if (canDelete && !canDelete(r)) { toast('상세 페이지가 있는 기본 항목은 삭제할 수 없어요. 숨기려면 고치기에서 표시를 끄세요.'); return; }
    if (!confirm('삭제할까요? 삭제한 내용은 되돌릴 수 없습니다.')) return;
    try { await must(supabase!.from(table).delete().eq(idKey, r[idKey])); if (edit && edit.v[idKey] === r[idKey]) setEdit(null); toast('삭제했어요.'); load(); afterSave?.(); }
    catch (x) { toast(errText(x)); }
  };

  return (
    <section>
      <div className="ad-bar">
        <button type="button" className="pill dark" onClick={() => okToLeave() && setEdit({ v: { ...blank }, isNew: true })}>새로 만들기</button>
        <button type="button" className="link" onClick={load}>새로 고침</button>
      </div>
      {edit && <Editor key={String(edit.v[idKey] ?? 'new')} fields={fields} value={edit.v} isNew={edit.isNew} title={edit.isNew ? title(null) : title(edit.v as T)}
        onSave={save} onCancel={() => setEdit(null)} onDelete={!edit.isNew && (!canDelete || canDelete(edit.v as T)) ? del : undefined} />}
      {rows === null ? <p className="auth-msg" role="status">불러오는 중…</p>
        : rows.length === 0 ? <p className="ad-empty">아직 없어요.</p>
        : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}<th scope="col"><span className="sr-only">고치기·삭제</span></th></tr></thead>
              <tbody>{rows.map(r => (
                <tr key={String(r[idKey])}>{row(r).map((c, i) => <td key={i}>{c}</td>)}
                  <td><button type="button" className="link" onClick={() => { if (!okToLeave()) return; setEdit({ v: { ...r }, isNew: false }); scrollTo({ top: 0, behavior: 'smooth' }); }}>고치기</button>
                    <button type="button" className="link danger" onClick={() => delRow(r)}>삭제</button></td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
    </section>
  );
}

const yes = (b: unknown, on: string, off = '') => b ? on : off;

// ===== 제품 =====
const CATS: [string, string][] = [['arrange', '꽃꽂이'], ['gift', '선물'], ['bojagi', '보자기'], ['sub', '정기 구독']];
const CAT_NAME = Object.fromEntries(CATS);
const IMAGES: [string, string][] = [['', '사진 없음 (보자기는 선화)'], ['ikebana-larch', '낙엽송 꽃꽂이'], ['ikebana-bamboo', '대나무 꽃꽂이'], ['ikebana-daffodil', '수선 꽃꽂이'], ['ikebana-nasturtium', '한련 꽃꽂이'], ['bojagi', '보자기 선물'], ['dried-box', '말린 꽃 상자'], ['field', '들꽃']];
function Products() {
  return (
    <Crud<ProductRow & Rec>
      table="products" idKey="key" order={[['sort', true]]} afterSave={refreshPublic}
      blank={{ key: '', cat: 'gift', name: '', meta: '', price: 0, sizes: null, vessel_off: 0, img: '', has_detail: false, sold_out: false, visible: true, sort: 100 }}
      title={r => r ? `제품 고치기 · ${r.name}` : '새 제품'}
      canDelete={r => !r.has_detail}
      head={['이름', '분류', '가격', '상태', '순서']}
      row={r => [<b key="n">{r.name}</b>, CAT_NAME[r.cat], won(r.price) + '원', [yes(r.sold_out, '품절'), yes(!r.visible, '숨김')].filter(Boolean).join(' · ') || '판매 중', r.sort]}
      fields={[
        { name: 'key', label: '주소 이름', type: 'text', required: true, readOnlyWhenEdit: true, hint: '영문 소문자·숫자·- (예: winter-box). 만든 뒤에는 못 바꿔요.' },
        { name: 'cat', label: '분류', type: 'select', options: CATS, required: true },
        { name: 'name', label: '이름', type: 'text', required: true },
        { name: 'meta', label: '한 줄 설명', type: 'text', hint: '목록 카드에 이름 아래로 보여요. 예: 꽃꽂이 · 중품' },
        { name: 'price', label: '가격 (원)', type: 'number', required: true, hint: '보자기는 가장 작은 크기 가격' },
        { name: 'vessel_off', label: '화기 뺄 때 빼는 금액 (원)', type: 'number', show: v => v.cat === 'arrange' },
        { name: 'sizes', label: '크기별 가격', type: 'sizes', show: v => v.cat === 'bojagi', hint: "한 줄에 하나씩 '크기 = 가격'" },
        { name: 'img', label: '사진', type: 'select', options: IMAGES },
        { name: 'sort', label: '순서', type: 'number', hint: '작을수록 앞에 보여요' },
        { name: 'sold_out', label: '품절', type: 'check' },
        { name: 'visible', label: '사이트에 보이기', type: 'check' },
      ]}
    />
  );
}

// ===== 모임 =====
const KINDS: [string, string][] = [['꽃 모임', '꽃 모임'], ['보자기 매듭 수업', '보자기 매듭 수업'], ['계절 찻자리', '계절 찻자리']];
const G_STATUS: [string, string][] = [['모집 예정', '모집 예정'], ['모집 중', '모집 중'], ['마감', '마감']];
function Gatherings() {
  return (
    <Crud<GatheringRow & Rec>
      table="gatherings" idKey="id" order={[['date', false]]} afterSave={refreshPublic}
      blank={{ kind: '꽃 모임', title: '', date: '', time_text: '토요일 오후 2시–4시', place: '설담화 작업실 (서울)', capacity: 10, seats_left: 10, fee: 55000, fee_note: '', description: '', status: '모집 예정', note: '', visible: true }}
      title={r => r ? `모임 고치기 · ${r.title}` : '새 모임'}
      head={['날짜', '모임', '종류', '상태', '자리']}
      row={r => [dotDate(r.date), <b key="t">{r.title}</b>, r.kind, r.status + yes(!r.visible, ' · 숨김'), `${r.seats_left}/${r.capacity}`]}
      fields={[
        { name: 'title', label: '모임 이름', type: 'text', required: true },
        { name: 'kind', label: '종류', type: 'select', options: KINDS, required: true },
        { name: 'date', label: '날짜', type: 'date', required: true },
        { name: 'time_text', label: '시간', type: 'text', hint: '예: 오후 2시–4시' },
        { name: 'place', label: '장소', type: 'text' },
        { name: 'status', label: '모집 상태', type: 'select', options: G_STATUS },
        { name: 'capacity', label: '정원', type: 'number', required: true },
        { name: 'seats_left', label: '남은 자리', type: 'number', required: true },
        { name: 'fee', label: '참가비 (원)', type: 'number', required: true },
        { name: 'fee_note', label: '참가비에 포함된 것', type: 'text', hint: '예: 꽃, 화기 대여, 차, 감싸개 포함' },
        { name: 'description', label: '소개', type: 'textarea' },
        { name: 'note', label: '지난 모임 기록', type: 'textarea', hint: '모임이 끝난 뒤 적으면 커뮤니티의 ‘지난 모임에서’에 보여요.' },
        { name: 'visible', label: '사이트에 보이기', type: 'check' },
      ]}
    />
  );
}

// ===== works =====
function Works() {
  return (
    <Crud<WorkRow & Rec>
      table="works" idKey="id" order={[['ym', false], ['id', false]]} afterSave={refreshPublic}
      blank={{ ym: new Date().toISOString().slice(0, 7) + '-01', cat: 'space', title: '', where_text: '', what: '', pic: 'ill', body: '', visible: true }}
      title={r => r ? `works 고치기 · ${r.title}` : '새 works'}
      head={['날짜', '제목', '분류', '장소']}
      row={r => [ymText(r.ym), <b key="t">{r.title}{yes(!r.visible, ' (숨김)')}</b>, (Object.fromEntries(WK_CATS) as Record<string, string>)[r.cat], r.where_text]}
      fields={[
        { name: 'title', label: '제목', type: 'text', required: true },
        { name: 'ym', label: '날짜 (월)', type: 'month', required: true },
        { name: 'cat', label: '분류', type: 'select', options: WK_CATS.filter(([k]) => k !== 'all') as [string, string][], required: true },
        { name: 'where_text', label: '장소', type: 'text' },
        { name: 'what', label: '꽃', type: 'text' },
        { name: 'pic', label: '사진', type: 'pic' },
        { name: 'body', label: '글', type: 'textarea' },
        { name: 'visible', label: '사이트에 보이기', type: 'check' },
      ]}
    />
  );
}

// 사진: 선화, 기본 사진, 또는 새로 올리기
const PICS: [string, string][] = [['ill', '선화'], ...IMAGES.slice(1)];
function PicField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const uploaded = /^https:\/\//.test(value);
  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('사진은 5MB 이하로 올려 주세요.'); return; }
    setBusy(true);
    const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase!.storage.from('works').upload(path, file, { contentType: file.type, upsert: false });
    setBusy(false);
    if (error) { toast(errText(error)); return; }
    onChange(supabase!.storage.from('works').getPublicUrl(path).data.publicUrl);
  };
  return (
    <div className="field wide pic-field">
      <span>{label}</span>
      <div className="pic-row">
        <select aria-label="사진 고르기" value={uploaded ? 'upload' : value} onChange={e => e.target.value !== 'upload' && onChange(e.target.value)}>
          {PICS.map(([k, n]) => <option key={k} value={k}>{n}</option>)}
          {uploaded && <option value="upload">올린 사진</option>}
        </select>
        <label className="pill"><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={e => upload(e.target.files?.[0])} />{busy ? '올리는 중…' : '사진 올리기'}</label>
      </div>
      {uploaded && <span className="pic-prev" style={{ backgroundImage: `url("${value}")` }} role="img" aria-label="올린 사진 미리 보기" />}
    </div>
  );
}
