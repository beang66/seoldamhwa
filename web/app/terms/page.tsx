import Link from 'next/link';
import LegalPage, { Blank } from '@/components/LegalPage';
import { BUSINESS, show } from '@/lib/business';

export const metadata = { title: '이용약관' };

export default function Page() {
  return (
    <LegalPage eyebrow="TERMS · 이용약관" title="이용약관" lead="설담화 온라인 상점과 모임을 이용할 때의 약속입니다.">
      <section><h2>제1조 목적</h2><p>이 약관은 {show(BUSINESS.name)}(이하 &lsquo;설담화&rsquo;)가 운영하는 웹사이트에서 상품을 사고 모임에 참여할 때, 설담화와 이용자 사이의 권리·의무와 책임을 정합니다.</p></section>
      <section><h2>제2조 회원 가입과 탈퇴</h2><ol>
        <li>이용자는 이메일과 비밀번호로 가입하며, 가입할 때 이 약관과 개인정보처리방침에 동의합니다.</li>
        <li>회원은 마이페이지에서 언제든 탈퇴할 수 있습니다. 탈퇴하면 계정과 회원 정보는 바로 지우고, 주문 기록은 법에서 정한 기간 동안만 보관합니다.</li>
        <li>준비 중인 주문이 있으면 그 주문이 끝난 뒤 탈퇴할 수 있습니다.</li>
      </ol></section>
      <section><h2>제3조 상품과 주문</h2><ol>
        <li>꽃꽂이와 선물은 받는 날에 맞춰 만드는 상품이며, 계절에 따라 꽃 구성이 조금씩 달라질 수 있습니다.</li>
        <li>주문은 설담화가 접수를 확인했을 때 성립합니다. 재료 수급이 어렵거나 하루 제작 수량을 넘으면 접수를 거절하고 안내드릴 수 있습니다.</li>
        <li>결제 방법: <Blank>카드·간편결제·무통장 입금 중 확정</Blank></li>
      </ol></section>
      <section><h2>제4조 배송과 받는 방법</h2><p>작업실 픽업, 서울 당일 퀵, 택배(보자기)로 보냅니다. 지역·요금·마감 시간은 <Blank>확정 후 기재</Blank>합니다.</p></section>
      <section><h2>제5조 취소·환불</h2><p>취소와 환불은 <Link href="/refund">환불 정책</Link>을 따릅니다.</p></section>
      <section><h2>제6조 모임</h2><p>모임 신청과 취소, 참가비 환불은 각 모임 안내와 환불 정책을 따릅니다. 신청 방법은 <Blank>확정 후 기재</Blank>합니다.</p></section>
      <section><h2>제7조 이용자의 의무</h2><p>이용자는 다른 사람의 정보를 도용하거나, 사이트 운영을 방해하거나, 설담화의 사진·그림·글을 허락 없이 상업적으로 쓰지 않습니다.</p></section>
      <section><h2>제8조 분쟁 해결</h2><p>이용과 관련한 불만은 {show(BUSINESS.email)} 또는 {show(BUSINESS.phone)}로 접수하며, 해결되지 않은 분쟁은 관계 법령과 공정거래위원회 소비자분쟁해결기준에 따릅니다.</p></section>
    </LegalPage>
  );
}
