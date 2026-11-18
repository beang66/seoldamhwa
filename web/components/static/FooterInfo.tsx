import Link from 'next/link';
import Vase from './Vase';
import { BUSINESS, BUSINESS_FIELDS, filled, show } from '@/lib/business';

// 사업자 정보는 lib/business.ts 한 곳에서 채운다. 비어 있으면 '준비 중'으로 보인다.
// 참고 레이아웃: 큰 머리 → 짧은 열 → 아래 한 줄(약관 링크 · 사업자 정보). 문구는 예전 것을 나눠 쓴다.
export default function FooterInfo() {
  const b = BUSINESS;
  return (
    <div className="ft-info">
      <div className="ft-say">
        <div className="word" translate="no">seoldamhwa<small>說談話 · 설담화</small></div>
        <Vase className="ft-vase" />
      </div>

      <div className="ft-cols">
        <section>
          <h2>서울</h2>
          <p>작업실 방문은 예약제로 운영합니다</p>
        </section>
        <section>
          <h2>문의</h2>
          <p>{filled(b.email) ? <a href={`mailto:${b.email}`}>{b.email}</a> : '문의 메일 준비 중'}</p>
        </section>
        <ul className="ft-links">
          <li><a href="#" data-soon="">인스타그램</a></li>
        </ul>
      </div>

      <div className="ft-bottom">
        <ul>
          <li><Link href="/terms">이용약관</Link></li>
          <li><Link href="/privacy"><b>개인정보처리방침</b></Link></li>
          <li><Link href="/refund">취소·환불</Link></li>
        </ul>
        <dl className="ft-biz" aria-label="사업자 정보">
          {BUSINESS_FIELDS.map(([label, k]) => <div key={k}><dt>{label}</dt><dd>{show(b[k])}</dd></div>)}
        </dl>
      </div>
    </div>
  );
}
