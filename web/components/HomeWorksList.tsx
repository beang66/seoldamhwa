'use client';
import { WK_CATS } from '@/lib/catalog';
import { useWorks, ymText } from '@/lib/data';

const NAME = Object.fromEntries(WK_CATS) as Record<string, string>;

export default function HomeWorksList() {
  const list = useWorks().slice(0, 4);
  return (
    <ol className="wlist">
      {list.map(w => (
        <li key={w.id}><time dateTime={w.ym.slice(0, 7)}>{ymText(w.ym)}</time><div><b>{w.title}</b><small>{w.where_text} · {w.what}</small></div><i>{NAME[w.cat]}</i></li>
      ))}
    </ol>
  );
}
