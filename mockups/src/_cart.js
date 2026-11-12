// ===== 장바구니 =====
// 이 브라우저에만 저장한다(localStorage). 미리보기 창처럼 저장이 막힌 곳에서는 페이지를 닫으면 비워진다.
const CART_KEY = 'seoldamhwa-cart';
const SHIP_FEE = 3000, SHIP_FREE_FROM = 50000;   // 보자기 택배비 (예시 값)
let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { cart = []; }
function cartSave(){ try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => t.classList.remove('on'), 2200);
}

// line: {id, key, kind:'bojagi'|'arr', name, opt, unit, qty, quick}
function cartAdd(line){
  const same = cart.find(l => l.id === line.id);
  if (same) same.qty = Math.min(20, same.qty + line.qty); else cart.push(line);
  cartSave(); cartBadge();
}
function cartTotals(){
  const items = cart.reduce((s, l) => s + l.unit * l.qty, 0);
  const quick = cart.reduce((s, l) => s + (l.quick || 0), 0);   // 퀵은 꽃꽂이 한 줄마다 한 번
  const bojagi = cart.filter(l => l.kind === 'bojagi').reduce((s, l) => s + l.unit * l.qty, 0);
  const ship = bojagi > 0 && bojagi < SHIP_FREE_FROM ? SHIP_FEE : 0;
  return {items, quick, ship, total: items + quick + ship};
}
function cartBadge(){
  const n = cart.reduce((s, l) => s + l.qty, 0);
  const a = document.querySelector('.hd .ico[href="#cart"]');
  a.querySelector('.cnt').textContent = n;
  a.setAttribute('aria-label', `장바구니, 담긴 상품 ${n}개`);
}
function cartThumb(l){
  return l.kind === 'bojagi'
    ? `<span class="th ill"><svg viewBox="0 0 300 330" aria-hidden="true"><use href="#ill-${l.key === 'knot' ? 'knot' : 'wrap'}"/></svg></span>`
    : `<span class="th" style="background-image:var(--img-${ARR[l.key].img})" aria-hidden="true"></span>`;
}
function renderCart(){
  const empty = cart.length === 0;
  document.getElementById('cart-full').hidden = empty;
  document.getElementById('cart-empty').hidden = !empty;
  if (empty) return;
  document.getElementById('cart-list').innerHTML = cart.map((l, i) => `
    <li>
      <a href="#${l.key}">${cartThumb(l)}</a>
      <div class="info"><a href="#${l.key}"><b>${l.name}</b></a><span>${l.opt}</span>${l.quick ? `<span>서울 당일 퀵 +${won(l.quick)}원</span>` : ''}</div>
      <div class="qty" role="group" aria-label="${l.name} 수량">
        <button type="button" data-cq="${i}" data-d="-1" aria-label="수량 줄이기">−</button><output aria-live="polite">${l.qty}</output><button type="button" data-cq="${i}" data-d="1" aria-label="수량 늘리기">+</button>
      </div>
      <b class="line">${won(l.unit * l.qty)}원</b>
      <button type="button" class="rm" data-rm="${i}" aria-label="${l.name} 빼기">×</button>
    </li>`).join('');
  const t = cartTotals();
  document.getElementById('sum-items').textContent = won(t.items) + '원';
  document.getElementById('sum-quick').textContent = t.quick ? won(t.quick) + '원' : '없음';
  document.getElementById('sum-ship').textContent = cart.some(l => l.kind === 'bojagi') ? (t.ship ? won(t.ship) + '원' : '무료') : '없음';
  document.getElementById('sum-total').textContent = won(t.total) + '원';
}
document.getElementById('cart-list').addEventListener('click', e => {
  const q = e.target.closest('[data-cq]'), r = e.target.closest('[data-rm]');
  if (q) { const l = cart[+q.dataset.cq]; l.qty = Math.min(20, Math.max(1, l.qty + +q.dataset.d)); }
  else if (r) { const [gone] = cart.splice(+r.dataset.rm, 1); showToast(`장바구니에서 뺐어요 · ${gone.name}`); }
  else return;
  cartSave(); cartBadge(); renderCart();
});
document.getElementById('cart-order').addEventListener('click', () => showToast('결제는 준비 중이에요.'));
cartBadge();
