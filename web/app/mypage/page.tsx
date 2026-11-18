import MyPage from '@/components/MyPage';

export const metadata = { title: '마이페이지', robots: { index: false } };

export default function Page() {
  return (
    <div id="my-view">
      <div className="page-hd">
        <span className="eyebrow">MY PAGE · 마이페이지</span>
        <h1>마이페이지</h1>
        <p>주문하신 꽃과 보자기, 회원 정보를 확인하세요.</p>
      </div>
      <div className="pg"><MyPage /></div>
    </div>
  );
}
