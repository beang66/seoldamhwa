import Link from 'next/link';
import { BUSINESS, filled, show } from '@/lib/business';

// 사업자 정보는 lib/business.ts 한 곳에서 채운다. 비어 있으면 '확정 전'으로 보인다.
export default function FooterInfo() {
  const b = BUSINESS;
  return (
    <div className="ft-info">
      <div className="word" translate="no">seoldamhwa<small>說談話 · 설담화</small></div>
      <address>
        {filled(b.email) ? b.email : '문의 메일 준비 중'}<br />서울 · 작업실 방문은 예약제로 운영합니다
      </address>
      <ul>
        <li><a href="#" data-soon="">인스타그램</a></li>
        <li><Link href="/terms">이용약관</Link></li>
        <li><Link href="/privacy"><b>개인정보처리방침</b></Link></li>
        <li><Link href="/refund">취소·환불</Link></li>
      </ul>
      <p className="ft-biz">
        상호 {show(b.name)} · 대표 {show(b.ceo)} · 사업자등록번호 {show(b.regNo)} · 통신판매업 신고 {show(b.mailOrderNo)}<br />
        주소 {show(b.address)} · 전화 {show(b.phone)}
      </p>
    </div>
  );
}
