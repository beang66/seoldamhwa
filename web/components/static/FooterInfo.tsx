import Link from 'next/link';
import Vase from './Vase';
import { BUSINESS, BUSINESS_FIELDS, filled, show } from '@/lib/business';

// 사업자 정보는 lib/business.ts 한 곳에서 채운다. 비어 있으면 '준비 중'으로 보인다.
export default function FooterInfo() {
  const b = BUSINESS;
  return (
    <div className="ft-info">
      <div className="ft-say">
        <p>꽃 한 줄기로,<br />안부를 건네 보세요.</p>
        <Vase className="ft-vase" />
      </div>

      <div className="ft-cols">
        <section>
          <h2>서울 · 작업실</h2>
          <p>{filled(b.address) ? b.address : '주소 준비 중'}</p>
          <p>작업실 방문은 예약제로 운영합니다</p>
        </section>
        <section>
          <h2>문의하기</h2>
          <p>{filled(b.email) ? <a href={`mailto:${b.email}`}>{b.email}</a> : '문의 메일 준비 중'}</p>
          <p>{filled(b.phone) ? <a href={`tel:${b.phone}`}>{b.phone}</a> : '전화 준비 중'}</p>
        </section>
        <section>
          <h2>꽃 모임</h2>
          <p>매월 둘째 토요일 · 열 명 남짓</p>
          <p><Link href="/community">이번 달 모임 보기</Link></p>
        </section>
        <ul className="ft-links" aria-label="바로가기">
          <li><a href="#" data-soon="">INSTAGRAM</a></li>
          <li><Link href="/shop">제품</Link></li>
          <li><Link href="/about">브랜드 소개</Link></li>
          <li><Link href="/works">WORKS</Link></li>
        </ul>
      </div>

      <div className="ft-bottom">
        <ul>
          <li><Link href="/terms">이용약관</Link></li>
          <li><Link href="/privacy"><b>개인정보처리방침</b></Link></li>
          <li><Link href="/refund">취소·환불</Link></li>
        </ul>
        <small translate="no">© 2026 설담화 SEOLDAMHWA</small>
      </div>

      <dl className="ft-biz" aria-label="사업자 정보">
        {BUSINESS_FIELDS.map(([label, k]) => <div key={k}><dt>{label}</dt><dd>{show(b[k])}</dd></div>)}
      </dl>
    </div>
  );
}
