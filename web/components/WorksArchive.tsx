'use client';
import { useState } from 'react';
import { WK_CATS } from '@/lib/catalog';
import { picBg, useWorks, ymText, type WorkRow } from '@/lib/data';
import WorksLines from './static/WorksLines';

const NAME = Object.fromEntries(WK_CATS) as Record<string, string>;

const Pic = ({ w }: { w: WorkRow }) => w.pic === 'ill'
  ? <div className="wk-pic ill"><svg viewBox="0 0 360 230" aria-hidden="true"><WorksLines /></svg></div>
  : <div className="wk-pic" role="img" aria-label={`${w.title}, ${w.what}`} style={{ backgroundImage: picBg(w.pic) }} />;

export default function WorksArchive() {
  const [cat, setCat] = useState('all');
  const all = useWorks();
  const list = all.filter(w => cat === 'all' || w.cat === cat);
  const [feat, ...rest] = list;
  return (
    <>
      <div className="cats" role="group" aria-label="작업 분류">
        {WK_CATS.map(([k, n]) => (
          <button key={k} type="button" aria-pressed={cat === k} onClick={() => setCat(k)}>
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
