import type { Metadata, Viewport } from 'next';
import { Noto_Serif_KR, Noto_Sans_KR, EB_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Symbols from '@/components/static/Symbols';

// 한글 글꼴은 크기가 커서 미리 받지 않는다 (preload: false)
const serifKo = Noto_Serif_KR({ weight: ['300', '400', '600'], preload: false, display: 'swap', variable: '--font-serif-ko' });
const sans = Noto_Sans_KR({ weight: ['300', '400', '600'], preload: false, display: 'swap', variable: '--font-sans' });
// 제품 목록의 가격·숫자·영문: 참고 레이아웃의 기하학적 고딕
const geo = Montserrat({ weight: ['400', '500', '600'], subsets: ['latin'], display: 'swap', variable: '--font-geo' });
const serifEn = EB_Garamond({ weight: ['400', '500'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', variable: '--font-serif-en' });

// 사진 경로는 CSS 안의 url()에 basePath가 붙지 않으므로 여기서 붙여 CSS 변수로 넘긴다
// (GitHub Pages에서는 /seoldamhwa 아래에서 열린다)
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const IMAGES = ['bojagi', 'dried-box', 'field', 'ikebana-bamboo', 'ikebana-daffodil', 'ikebana-larch', 'ikebana-nasturtium'];
const imageVars = `:root{${IMAGES.map(n => `--img-${n}:url(${BASE}/img/${n}.jpg)`).join(';')}}`;

export const metadata: Metadata = {
  title: { default: '설담화 · 꽃으로 건네는 말', template: '설담화 · %s' },
  description: '절기마다 고른 꽃 한 줄기를, 다시 쓰는 보자기에 싸서 건네는 1인 꽃 스튜디오.',
};

// 모바일 브라우저 상단바를 한지 바탕색에 맞춘다
export const viewport: Viewport = { themeColor: '#F4F3EF', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" className={[serifKo.variable, sans.variable, serifEn.variable, geo.variable].join(' ')} suppressHydrationWarning>
      <head>
        {/* 스크립트가 켜진 경우에만 나타나기 효과를 쓴다 */}
        <style dangerouslySetInnerHTML={{ __html: imageVars }} />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Symbols />
        <a className="skip" href="#main">본문으로 건너뛰기</a>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
