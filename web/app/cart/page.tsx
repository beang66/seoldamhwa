'use client';
import Link from 'next/link';
import { isLegacyPackaging, won } from '@/lib/catalog';
import { cartTotals, useCart, useToast, type CartLine } from '@/components/Providers';
import OrderForm from '@/components/OrderForm';

const Thumb = ({ l }: { l: CartLine }) => l.kind === 'bojagi'
  ? <span className="th ill"><svg viewBox="0 0 300 330" aria-hidden="true"><use href={`#ill-${l.key === 'knot' ? 'knot' : 'wrap'}`} /></svg></span>
  : <span className="th" style={{ backgroundImage: `var(--img-${l.img ?? 'ikebana-' + l.key})` }} aria-hidden="true" />;

export default function CartPage() {
  const { lines, setQty, remove, restore } = useCart();
  const toast = useToast();
  const t = cartTotals(lines);
  const outdated = lines.some(l => isLegacyPackaging(l.key) || (l.sel?.wrap ?? 0) > 0 || l.opt.includes('감싸개'));
  return (
    <div id="cart-view">
      <div className="page-hd">
        <span className="eyebrow">CART · 장바구니</span>
        <h1>장바구니</h1>
        <p>담아 두신 상품을 확인하세요.</p>
      </div>
      <div className="pg">
        {lines.length ? (
          <div className="cart">
            <section aria-labelledby="cart-list-title">
              <h2 className="sr-only" id="cart-list-title">담은 상품</h2>
              <ul className="cart-list">
                {lines.map((l, i) => (
                  <li key={l.id}>
                    <Link href={`/shop/${l.key}`}><Thumb l={l} /></Link>
                    <div className="info"><Link href={`/shop/${l.key}`}><b>{l.name}</b></Link><span>{l.opt}</span>{l.quick ? <span>서울 당일 퀵 +{won(l.quick)}원</span> : null}</div>
                    <div className="qty" role="group" aria-label={`${l.name} 수량`}>
                      <button type="button" aria-label="수량 줄이기" onClick={() => setQty(i, -1)}>−</button><output aria-live="polite">{l.qty}</output><button type="button" aria-label="수량 늘리기" onClick={() => setQty(i, 1)}>+</button>
                    </div>
                    <b className="line">{won(l.unit * l.qty)}원</b>
                    <button type="button" className="rm" aria-label={`${l.name} 빼기`} onClick={() => { const g = remove(i); if (g) toast(`장바구니에서 뺐어요 · ${g.name}`, { label: '되돌리기', run: () => restore(i, g) }); }}>×</button>
                  </li>
                ))}
              </ul>
              <p className="cart-note">꽃은 복주머니 형태의 설담화 패키지에 담아 전합니다.</p>
            </section>
            <aside className="cart-sum" aria-labelledby="cart-sum-title">
              <h2 id="cart-sum-title">주문 금액</h2>
              <dl>
                <div><dt>상품 금액</dt><dd>{won(t.items)}원</dd></div>
                <div><dt>서울 당일 퀵</dt><dd>{t.quick ? won(t.quick) + '원' : '없음'}</dd></div>
                <div><dt>택배</dt><dd>{lines.some(l => l.kind === 'bojagi') ? (t.ship ? won(t.ship) + '원' : '무료') : '없음'}</dd></div>
                <div className="total"><dt><i className="pt" aria-hidden="true" />합계</dt><dd>{won(t.total)}원</dd></div>
              </dl>
              {/* 결제는 아직 없다. 주문을 접수하고, 금액은 DB 함수가 다시 계산한다 */}
              {outdated ? <p role="status">이전 포장 옵션이나 시안 상품이 담겨 있어요. 해당 상품을 빼고 다시 담아 주세요.</p> : <OrderForm />}
              <Link className="pill wide" href="/shop">계속 둘러보기</Link>
            </aside>
          </div>
        ) : (
          <div className="cart-empty">
            <svg viewBox="0 0 300 330" aria-hidden="true"><use href="#ill-wrap" /></svg>
            <h2>장바구니가 비어 있어요</h2>
            <p>계절의 꽃을 담아 보세요.</p>
            <Link className="pill dark" href="/shop">제품 보러 가기</Link>
          </div>
        )}
      </div>
    </div>
  );
}
