'use client';
import { usePathname } from 'next/navigation';
import StatementBlock from './static/StatementBlock';
import FooterInfo from './static/FooterInfo';

// 큰 문장 블록은 메인에서만 두루마리의 끝으로 보인다. 다른 화면에서는 본문보다 커지므로 뺀다
// (브랜드 소개 페이지는 맨 위에 같은 문장이 있다)
export default function Footer() {
  const path = usePathname();
  return (
    <footer className="ft paper" id="statement">
      {path === '/' && <StatementBlock />}
      <FooterInfo />
    </footer>
  );
}
