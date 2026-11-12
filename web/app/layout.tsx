import type { Metadata } from 'next';
import { Noto_Serif_KR, Noto_Sans_KR, EB_Garamond, Nanum_Pen_Script } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Symbols from '@/components/static/Symbols';

// 한글 글꼴은 크기가 커서 미리 받지 않는다 (preload: false)
const serifKo = Noto_Serif_KR({ weight: ['300', '400', '600'], preload: false, display: 'swap', variable: '--font-serif-ko' });
const sans = Noto_Sans_KR({ weight: ['300', '400', '600'], preload: false, display: 'swap', variable: '--font-sans' });
const serifEn = EB_Garamond({ weight: ['400', '500'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', variable: '--font-serif-en' });
const hand = Nanum_Pen_Script({ weight: '400', preload: false, display: 'swap', variable: '--font-hand' });

export const metadata: Metadata = {
  title: { default: '설담화 · 꽃으로 건네는 말', template: '설담화 · %s' },
  description: '절기마다 고른 꽃 한 줄기를, 다시 쓰는 보자기에 싸서 건네는 1인 꽃 스튜디오.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" className={[serifKo.variable, sans.variable, serifEn.variable, hand.variable].join(' ')} suppressHydrationWarning>
      <head>
        {/* 스크립트가 켜진 경우에만 나타나기 효과를 쓴다 */}
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
