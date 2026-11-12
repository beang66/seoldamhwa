const ill = id => `<svg viewBox="0 0 300 330" aria-hidden="true"><use href="#${id}"/></svg>`;
const tpl = id => document.getElementById(id).innerHTML;
const won = n => n.toLocaleString('ko-KR');

const ITEMS = {
  wrap: {
    no:'No.1 · 꽃다발', name:'감싸개', en:'WRAP',
    desc:'꽃다발을 원뿔로 감싸고, 천에 꿰매 단 끈 세 쌍으로 묶는 보자기입니다. 꽃이 시든 뒤에는 정사각 천 한 장으로 남아 스카프나 손수건으로 씁니다.',
    modes:['감싸기','스카프','손수건'],
    sizes:[{label:'70 × 70 cm', price:28000}],
    gallery:[['사용 모습',ill('ill-wrap')],['쪽빛 테두리',tpl('t-border')],['천 라벨',tpl('t-label')],['귀퉁이 손그림',tpl('t-sprig')]],
    spec:[['소재','아이보리 무명 100%, 테두리 쪽빛 바이어스(천연 쪽염)'],['구성','감싸개 1, 다시 쓰는 법 카드 1'],['관리','찬물 손세탁. 쪽빛 테두리는 처음 몇 번은 따로 빨아 주세요.'],['배송','꽃과 함께 주문하면 꽃을 감싸서 보내드려요. 단품은 2~3일 안에 출고해요.']],
    other:'knot'
  },
  knot: {
    no:'No.2 · 화기 · 상자 · 큰 다발', name:'매듭 보자기', en:'TIE & CARRY',
    desc:'전통 방식으로 싸서 매듭을 짓는 두 겹 보자기입니다. 두 귀퉁이의 고리에 가방 끈을 걸면 그대로 들고 다니는 주머니가 되고, 끈은 떼었다 붙일 수 있어요.',
    modes:['보자기','주머니','어깨 가방','식탁보'],
    sizes:[{label:'소 45 cm', price:38000},{label:'중 70 cm', price:46000},{label:'대 90 cm', price:56000}],
    gallery:[['사용 모습',ill('ill-knot')],['연출 사진',tpl('t-photo')],['가방 끈과 매듭 단추',tpl('t-strap')],['쪽빛 매듭',tpl('t-knot')]],
    spec:[['소재','무명 두 겹, 생리넨 가방 끈, 쪽빛 매듭 장식(천연 쪽염)'],['구성','매듭 보자기 1, 가방 끈 1(110 cm, 탈착), 다시 쓰는 법 카드 1'],['관리','찬물 손세탁. 매듭 장식과 가방 끈은 떼어서 빨아 주세요.'],['배송','꽃이나 화기와 함께 주문하면 싸서 보내드려요. 단품은 2~3일 안에 출고해요.']],
    other:'wrap'
  }
};

let cur, size = 0, qty = 1;
const $ = id => document.getElementById(id);

function setMain(i){
  $('d-main').innerHTML = cur.gallery[i][1];
  [...$('d-thumbs').children].forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)));
}
function setPrice(){
  const p = cur.sizes[size].price * qty;
  $('price').innerHTML = won(p) + '<small>원</small>';
}
function renderDetail(key){
  cur = ITEMS[key] || ITEMS.wrap; size = 0; qty = 1; $('qty').value = 1; $('qty').textContent = 1; $('note').textContent = '';
  document.title = '설담화 · ' + cur.name;
  $('crumb-name').textContent = cur.name;
  $('no').textContent = cur.no;
  $('name').innerHTML = cur.name + '<small>' + cur.en + '</small>';
  $('desc').textContent = cur.desc;
  $('modes').innerHTML = cur.modes.map(m=>`<span>${m}</span>`).join('');
  $('sizes').innerHTML = cur.sizes.map((s,i)=>`<label><input type="radio" name="size" value="${i}" ${i===0?'checked':''}><span>${s.label}<b>${won(s.price)}</b></span></label>`).join('');
  $('spec').innerHTML = cur.spec.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  $('d-thumbs').innerHTML = cur.gallery.map(([label,html],i)=>`<button type="button" aria-label="${label}" aria-pressed="false">${html}</button>`).join('');
  [...$('d-thumbs').children].forEach((b,i)=>b.addEventListener('click',()=>setMain(i)));
  const o = ITEMS[cur.other];
  $('other').href = '#' + cur.other;
  $('other').innerHTML = `<i>${ill(cur.other==='wrap'?'ill-wrap':'ill-knot')}</i><span><small>함께 쓰면 좋은 보자기</small><b>${o.name}</b></span>`;
  setMain(0); setPrice();
}
$('sizes').addEventListener('change',e=>{size = +e.target.value; setPrice()});
document.querySelectorAll('.qty button').forEach(b=>b.addEventListener('click',()=>{
  qty = Math.min(20, Math.max(1, qty + +b.dataset.d)); $('qty').textContent = qty; setPrice();
}));
// 장바구니 담기 / 바로 구매 (_cart.js)
document.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{
  const key = Object.keys(ITEMS).find(k=>ITEMS[k]===cur), s = cur.sizes[size];
  cartAdd({id:key+'|'+s.label, key, kind:'bojagi', name:cur.name, opt:s.label, unit:s.price, qty, quick:0});
  if(b.dataset.act==='buy') go('cart'); else { $('note').textContent = '장바구니에 담았어요.'; showToast('장바구니에 담았어요 · '+cur.name); }
}));
