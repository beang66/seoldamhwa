import LegalPage, { Blank } from '@/components/LegalPage';
import { BUSINESS, show } from '@/lib/business';

export const metadata = { title: '취소·환불 정책' };

export default function Page() {
  return (
    <LegalPage eyebrow="REFUND · 취소와 환불" title="취소·환불 정책" lead="꽃은 받는 날에 맞춰 만드는 신선 상품이라, 상품마다 취소할 수 있는 때가 다릅니다.">
      <section><h2>꽃꽂이와 선물</h2><ol>
        <li>받는 날 <Blank>__일</Blank> 전까지는 마이페이지나 문의로 취소하면 전액 돌려드립니다.</li>
        <li>그 뒤에는 꽃을 이미 들여 만들기 시작하므로 <Blank>__%</Blank>를 돌려드립니다.</li>
        <li>꽃은 시간이 지나면 다시 팔 수 없는 상품이라, 받은 뒤 단순 변심으로는 반품·환불이 어렵습니다(전자상거래법 제17조 제2항). 이 점을 주문 화면에서도 미리 알려 드립니다.</li>
        <li>받은 꽃이 상했거나 주문과 다르면 받은 날 사진과 함께 알려 주세요. 다시 만들어 드리거나 전액 돌려드립니다.</li>
      </ol></section>
      <section><h2>보자기</h2><ol>
        <li>받은 날부터 7일 안에 교환·반품할 수 있습니다.</li>
        <li>단순 변심이면 왕복 택배비는 이용자가 부담하고, 상품에 문제가 있으면 설담화가 부담합니다.</li>
        <li>사용했거나 세탁해 상품 가치가 떨어진 경우에는 교환·반품이 어렵습니다.</li>
      </ol></section>
      <section><h2>모임</h2><p>모임 사흘 전까지 취소하면 참가비 전액을 돌려드립니다. 그 뒤 취소는 <Blank>확정 후 기재</Blank>합니다.</p></section>
      <section><h2>돌려받는 방법과 기간</h2><p>결제한 수단으로 취소하며, 카드는 카드사에 따라 영업일 기준 3~7일이 걸립니다. 무통장 입금은 알려 주신 계좌로 <Blank>__영업일</Blank> 안에 보내 드립니다.</p></section>
      <section><h2>문의</h2><p>{show(BUSINESS.email)} · {show(BUSINESS.phone)}</p></section>
    </LegalPage>
  );
}
