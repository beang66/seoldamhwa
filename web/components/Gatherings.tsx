'use client';
// 커뮤니티의 모임 정보. DB가 있으면 DB의 모임으로, 없으면 fallback(코드 안의 안내)을 그대로 보여 준다
import { won } from '@/lib/catalog';
import { dateText, todayIso, useGatherings, type GatheringRow } from '@/lib/data';

const upcoming = (list: GatheringRow[]) => { const t = todayIso(); return list.filter(g => g.date >= t).sort((a, b) => a.date.localeCompare(b.date)); };
export const featured = (list: GatheringRow[]) => upcoming(list).find(g => g.status !== '마감') ?? null;
const statusText = (g: GatheringRow) => g.status === '모집 중' ? `모집 중 · 남은 자리 ${g.seats_left}` : g.status;

export function GatherFeat({ fallback }: { fallback: React.ReactNode }) {
  const list = useGatherings();
  if (!list) return <>{fallback}</>;
  const g = featured(list);
  if (!g) return <><span className="eyebrow">다음 모임</span><h2>다음 모임을 준비하고 있어요</h2><p>일정이 정해지면 이곳에 먼저 알려 드릴게요.</p></>;
  return (
    <>
      <span className="eyebrow">{g.date.slice(0, 7) === todayIso().slice(0, 7) ? '이번 달 모임' : '다음 모임'}</span>
      <h2>{g.title}</h2>
      {g.description && <p>{g.description}</p>}
      <p className="cm-status">{g.status === '모집 중' && <i className="pt" aria-hidden="true"></i>}{statusText(g)}</p>
      <dl>
        <div><dt>일시</dt><dd>{dateText(g.date, true)}{g.time_text ? ' ' + g.time_text.replace(/^.요일\s*/, '') : ''}</dd></div>
        {g.place && <div><dt>장소</dt><dd>{g.place}</dd></div>}
        <div><dt>인원</dt><dd>{g.capacity}명</dd></div>
        <div><dt>참가비</dt><dd>{won(g.fee)}원{g.fee_note ? ' · ' + g.fee_note : ''}</dd></div>
      </dl>
      <a className="pill dark" href="#" data-soon="">참여 신청하기</a>
    </>
  );
}

export function GatherSched({ fallback }: { fallback: React.ReactNode }) {
  const list = useGatherings();
  if (!list) return <>{fallback}</>;
  const up = upcoming(list);
  if (!up.length) return <p className="cm-empty">정해진 일정이 아직 없어요.</p>;
  return (
    <ol className="cm-sched">
      {up.map(g => <li key={g.id}><time dateTime={g.date}>{dateText(g.date)}</time><b>{g.title}</b><span>{g.kind}</span><em>{g.status}</em></li>)}
    </ol>
  );
}

export function GatherNotes({ fallback }: { fallback: React.ReactNode }) {
  const list = useGatherings();
  if (!list) return <>{fallback}</>;
  const t = todayIso();
  const past = list.filter(g => g.date < t && g.note).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  if (!past.length) return <p className="cm-empty">아직 남긴 기록이 없어요.</p>;
  return (
    <div className="cm-notes">
      {past.map(g => <article key={g.id}><time dateTime={g.date}>{g.date.replaceAll('-', '.')}</time><h3>{g.title}</h3><p>{g.note}</p></article>)}
    </div>
  );
}

// 메인 화면 커뮤니티 카드의 '이번 달 모임'
export function HomeGather({ fallback }: { fallback: React.ReactNode }) {
  const list = useGatherings();
  if (!list) return <>{fallback}</>;
  const g = featured(list);
  if (!g) return <dl><dt>다음 모임</dt><dd>준비하고 있어요</dd></dl>;
  return (
    <dl>
      <dt>{g.date.slice(0, 7) === todayIso().slice(0, 7) ? '이번 달 모임' : '다음 모임'}</dt><dd>{g.title}</dd>
      <dt>일시</dt><dd>{dateText(g.date, true)}{g.time_text ? ' ' + g.time_text.replace(/^.요일\s*/, '').replace(/–.*$/, '') : ''}</dd>
      <dt>함께 나누는 것</dt><dd>{g.fee_note || '꽃 한 단, 차 한 잔, 보자기 한 장'}</dd>
    </dl>
  );
}
