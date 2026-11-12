'use client';
import { usePathname } from 'next/navigation';
import StatementBlock from './static/StatementBlock';
import FooterInfo from './static/FooterInfo';

// 브랜드 소개 페이지는 맨 위에 같은 문장이 있으니 푸터에서는 뺀다
export default function Footer() {
  const path = usePathname();
  return (
    <footer className="ft paper" id="statement">
      {path !== '/about' && <StatementBlock />}
      <FooterInfo />
    </footer>
  );
}
