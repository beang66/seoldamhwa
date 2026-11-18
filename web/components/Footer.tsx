import FooterInfo from './static/FooterInfo';

// 큰 문장 블록은 브랜드 소개 페이지 맨 위에만 둔다. 푸터에는 로고 옆 풀꽃 그림만 남긴다
export default function Footer() {
  return (
    <footer className="ft paper">
      <FooterInfo />
    </footer>
  );
}
