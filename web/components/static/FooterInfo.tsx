import Link from 'next/link';
import Vase from './Vase';
import { BUSINESS, BUSINESS_FIELDS, filled, show } from '@/lib/business';

// 사업자 정보는 lib/business.ts 한 곳에서 채운다. 비어 있으면 '준비 중'으로 보인다.
// 배치만 참고 레이아웃(큰 머리 + 열 + 아래 줄)을 따르고, 문구는 예전 그대로 둔다.
export default function FooterInfo() {
  const b = BUSINESS;
  return (
    <div className="ft-info">
      <div className="ft-say">
        <div className="word" translate="no">seoldamhwa<small>說談話 · 설담화</small></div>
        <Vase className="ft-vase" />
      </div>

      <div className="ft-cols">
        <address>
          {filled(b.email) ? b.email : '문의 메일 준비 중'}<br />서울 · 작업실 방문은 예약제로 운영합니다
        </address>
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
      </div>

      <dl className="ft-biz" aria-label="사업자 정보">
        {BUSINESS_FIELDS.map(([label, k]) => <div key={k}><dt>{label}</dt><dd>{show(b[k])}</dd></div>)}
      </dl>
    </div>
  );
}
