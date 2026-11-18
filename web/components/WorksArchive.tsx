'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { WK_CATS } from '@/lib/catalog';
import { picBg, useWorks, ymText, type WorkRow } from '@/lib/data';
import WorksLines from './static/WorksLines';

const NAME = Object.fromEntries(WK_CATS) as Record<string, string>;

const Pic = ({ w }: { w: WorkRow }) => w.pic === 'ill'
  ? <div className="wk-pic ill"><svg viewBox="0 0 360 230" aria-hidden="true"><WorksLines /></svg></div>
  : <div className="wk-pic" role="img" aria-label={`${w.title}, ${w.what}`} style={{ backgroundImage: picBg(w.pic) }} />;

export default function WorksArchive({ initial = 'all' }: { initial?: string }) {
  const [cat, setCat] = useState(initial);
  // 고른 분류를 주소에 남겨 새로 고치거나 공유해도 그대로 보이게 한다
  const pick = (k: string) => { setCat(k); history.replaceState(null, '', (process.env.NEXT_PUBLIC_BASE_PATH ?? '') + (k === 'all' ? '/works/' : `/works/?cat=${k}`)); };
  const all = useWorks();
  const list = all.filter(w => cat === 'all' || w.cat === cat);
  const [feat, ...rest] = list;
  return (
    <>
      <div className="cats" role="group" aria-label="작업 분류">
        {WK_CATS.map(([k, n]) => (
          <button key={k} type="button" aria-pressed={cat === k} onClick={() => pick(k)}>
            {n}<small>{k === 'all' ? all.length : all.filter(w => w.cat === k).length}</small>
          </button>
        ))}
      </div>
      <div className="pg">
        {feat && (
          <article className="wk-feat">
            <Pic w={feat} />
            <div><time dateTime={feat.ym.slice(0, 7)}>{ymText(feat.ym)}</time><span className="wk-tag">{NAME[feat.cat]}</span>
              <h2>{feat.title}</h2><p>{feat.body}</p>
              <dl><div><dt>장소</dt><dd>{feat.where_text}</dd></div><div><dt>꽃</dt><dd>{feat.what}</dd></div></dl></div>
          </article>
        )}
        <div className="wk-grid">
          {rest.map(w => (
            <article className="wk-card" key={w.id}><Pic w={w} />
              <div className="row"><time dateTime={w.ym.slice(0, 7)}>{ymText(w.ym)}</time><span className="wk-tag">{NAME[w.cat]}</span></div>
              <h3>{w.title}</h3><p>{w.where_text} · {w.what}</p></article>
          ))}
          {!feat && <p className="wk-empty">이 분류의 기록은 아직 없어요.</p>}
        </div>
      </div>
    </>
  );
}

export function WorksFromQuery() {
  const q = useSearchParams().get('cat');
  const initial = WK_CATS.some(([k]) => k === q) ? q! : 'all';
  return <WorksArchive key={initial} initial={initial} />;
}
