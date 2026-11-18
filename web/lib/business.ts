// 사업자 정보: 확정되면 여기만 채운다. 푸터와 약관·개인정보처리방침·환불 정책이 모두 이 값을 쓴다.
// 빈 값은 화면에 '준비 중'으로 보인다. 결제(PG) 심사 전에 반드시 모두 채워야 한다.
export const BUSINESS = {
  name: '',           // 상호 (예: 설담화)
  ceo: '',            // 대표자
  regNo: '',          // 사업자등록번호
  mailOrderNo: '',    // 통신판매업 신고번호
  address: '',        // 사업장 주소
  phone: '',          // 고객 문의 전화
  email: '',          // 고객 문의 메일
  privacyOfficer: '', // 개인정보 보호책임자 (이름 · 연락처)
  hosting: '',        // 호스팅 서비스 제공자 (예: GitHub, Inc. 또는 카페24) — 전자상거래법상 표시 항목
  effectiveDate: '',  // 약관·방침 시행일 (예: 2026-12-15)
};

export const filled = (v: string) => v.trim() !== '';
export const show = (v: string) => (filled(v) ? v : '준비 중');

// 푸터에 보이는 사업자 정보 항목 (전자상거래법상 표시 사항)
export const BUSINESS_FIELDS: [string, keyof typeof BUSINESS][] = [
  ['상호', 'name'], ['대표자', 'ceo'], ['사업자등록번호', 'regNo'], ['통신판매업 신고번호', 'mailOrderNo'],
  ['사업장 주소', 'address'], ['전화', 'phone'], ['이메일', 'email'],
  ['개인정보 보호책임자', 'privacyOfficer'], ['호스팅 제공', 'hosting'],
];
