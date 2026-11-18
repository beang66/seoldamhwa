import LoginForm from '@/components/LoginForm';

export const metadata = { title: '로그인', robots: { index: false } };

export default function Page() {
  return (
    <div id="auth-view">
      <div className="page-hd">
        <span className="eyebrow">MEMBER · 회원</span>
        <h1>로그인</h1>
        <p>주문 내역과 모임 신청을 한곳에서 볼 수 있어요.</p>
      </div>
      <div className="pg"><LoginForm /></div>
    </div>
  );
}
