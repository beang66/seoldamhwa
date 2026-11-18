import LegalPage, { Blank } from '@/components/LegalPage';
import { BUSINESS, show } from '@/lib/business';

export const metadata = { title: '개인정보처리방침' };

// 실제로 모으고 저장하는 항목(Supabase의 profiles·orders, 브라우저 저장소)을 기준으로 적었다.
export default function Page() {
  return (
    <LegalPage eyebrow="PRIVACY · 개인정보처리방침" title="개인정보처리방침" lead="설담화가 어떤 정보를 왜 모으고, 언제 지우는지 알려 드립니다.">
      <section><h2>1. 모으는 정보와 쓰임</h2>
        <table className="legal-table"><thead><tr><th scope="col">언제</th><th scope="col">항목</th><th scope="col">쓰임</th></tr></thead><tbody>
          <tr><td>회원 가입</td><td>이메일, 비밀번호(암호화해 저장), 이름</td><td>로그인, 회원 확인, 주문·모임 안내</td></tr>
          <tr><td>회원 정보 수정</td><td>연락처</td><td>주문·픽업 연락</td></tr>
          <tr><td>주문</td><td>받는 분 이름·연락처, 받고 싶은 날, 요청 사항, 주문 상품과 금액</td><td>상품 제작·전달, 주문 확인, 고객 문의 응대</td></tr>
          <tr><td>사이트 이용</td><td>로그인 상태, 장바구니(이 브라우저에만 저장)</td><td>로그인 유지, 담은 상품 기억</td></tr>
        </tbody></table>
      </section>
      <section><h2>2. 보관 기간과 파기</h2><ol>
        <li>회원 정보는 탈퇴하면 바로 지웁니다.</li>
        <li>다만 전자상거래법에 따라 다음 기록은 정해진 기간 동안 계정과 분리해 보관한 뒤 지웁니다. 계약·청약철회 기록 5년, 대금 결제와 재화 공급 기록 5년, 소비자 불만·분쟁 처리 기록 3년.</li>
        <li>보관 기간이 끝난 주문 기록은 이름·연락처·요청 사항을 지워 다시 알아볼 수 없게 합니다.</li>
      </ol></section>
      <section><h2>3. 처리를 맡기는 곳</h2>
        <table className="legal-table"><thead><tr><th scope="col">받는 곳</th><th scope="col">맡기는 일</th></tr></thead><tbody>
          <tr><td>Supabase Inc.</td><td>회원 계정과 주문 정보 저장(서울 리전 서버)</td></tr>
          <tr><td><Blank>결제대행사 확정 후 기재</Blank></td><td>결제 처리</td></tr>
          <tr><td><Blank>메일 발송 서비스 확정 후 기재</Blank></td><td>가입 확인·주문 안내 메일 발송</td></tr>
        </tbody></table>
        <p>해외 사업자에게 맡기는 경우의 국외 이전 항목은 <Blank>검토 후 기재</Blank>합니다.</p>
      </section>
      <section><h2>4. 이용자의 권리</h2><p>이용자는 마이페이지에서 언제든 자기 정보를 보고 고칠 수 있으며, 탈퇴로 처리 중단을 요청할 수 있습니다. 그 밖의 열람·정정·삭제 요청은 아래 보호책임자에게 하시면 지체 없이 처리합니다.</p></section>
      <section><h2>5. 안전하게 지키는 방법</h2><p>비밀번호는 암호화해 저장하고, 주문 정보는 본인과 지정된 관리자만 볼 수 있도록 데이터베이스 접근 권한을 나누어 둡니다.</p></section>
      <section><h2>6. 개인정보 보호책임자</h2><p>{show(BUSINESS.privacyOfficer)} · {show(BUSINESS.email)}</p></section>
    </LegalPage>
  );
}
