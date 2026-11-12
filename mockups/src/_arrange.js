// ===== 꽃꽂이 상세 =====
// 사진은 :root 의 --img-<이름> 변수로 한 번만 넣고 여러 곳에서 씁니다.
const ARR = {
  larch: {
    img:'ikebana-larch', no:'No.01 · 꽃꽂이 · 중품', name:'낙엽송과 연잎', en:'LARCH & LOTUS LEAF', base:68000, vesselOff:18000,
    desc:'잎을 떨구기 직전 낙엽송의 마지막 초록을 S자로 세우고, 발치에 둥근 연잎 한 장을 눕혔습니다. 굽 높은 회색 수반 위에 선 하나로 서는 꽃이에요.',
    chips:['낙엽송','연잎','이끼','굽 수반'],
    flowers:[['낙엽송 가지','S자로 굽은 한 가지. 가는 잎이 바람에 흔들려요.','주재'],['연잎','둥글게 펼친 잎 한 장. 선의 끝을 받쳐 줍니다.','받침'],['이끼','침봉을 덮어 수반 안을 정리해요.','마감'],['굽 높은 회색 수반','지름 14cm 도기 수반과 침봉.','화기']],
    memo:['입동의 꽃,','낙엽송 한 가지'], memoText:'선이 주인공인 꽃이라 넓은 벽 앞이나 낮은 장 위에 두면 가장 잘 보여요.',
    h:60, w:45, v:14, life:'7~10일',
    focus:{flower:'48% 28%', vessel:'50% 80%'},
    season:['立冬','입동, 겨울이 들어서는 날','낙엽송은 바늘잎이 노랗게 물들기 직전에 가장 곱습니다. 초록이 남아 있는 마지막 한 주의 가지를 골라, 떠나는 가을과 오는 겨울 사이를 한 선으로 그렸어요.','the last green before winter']
  },
  bamboo: {
    img:'ikebana-bamboo', no:'No.02 · 꽃꽂이 · 중품', name:'대나무와 부채 잎', en:'BAMBOO & FAN LEAF', base:72000, vesselOff:18000,
    desc:'곧게 선 대나무 마디 옆으로 잎을 흩뜨리고, 아래에는 부채처럼 접은 잎을 펼쳤습니다. 흰 들꽃 몇 송이가 선과 면 사이를 이어 줘요.',
    chips:['대나무','부채 잎','흰 들꽃','굽 수반'],
    flowers:[['대나무 줄기','곧은 마디 하나가 중심을 잡아요.','주재'],['대나무 잎 가지','위로 흩어지는 가는 잎.','곁가지'],['부채 잎','손으로 주름 잡아 부채처럼 펼친 잎.','면'],['흰 들꽃','작은 꽃 서너 송이.','점'],['굽 높은 회색 수반','지름 14cm 도기 수반과 침봉.','화기']],
    memo:['곧은 선과','접은 잎 한 장'], memoText:'대나무는 물을 많이 마셔요. 처음 사흘은 하루 두 번 물을 채워 주세요.',
    h:65, w:40, v:14, life:'10~14일',
    focus:{flower:'55% 62%', vessel:'50% 82%'},
    season:['立冬','입동, 바람이 차지는 때','잎이 지는 계절에도 대나무는 푸른빛을 지킵니다. 사철 변하지 않는 선 하나에 접은 잎을 더해, 겨울 채비를 하는 집에 곧은 기운을 들였어요.','evergreen lines for a cold wind']
  },
  daffodil: {
    img:'ikebana-daffodil', no:'No.03 · 꽃꽂이 · 소품', name:'수선 한 줄기', en:'A SINGLE DAFFODIL', base:48000, vesselOff:12000,
    desc:'수선 한 송이와 잎 두 장만 깔때기 모양 화기에 세웠습니다. 한 잎은 곧게, 한 잎은 휘어지게 두어 작은 꽃에 움직임을 줬어요.',
    chips:['수선','수선 잎','깔때기 화기'],
    flowers:[['수선 한 송이','노란 꽃 한 송이가 위를 봐요.','주재'],['수선 잎 두 장','하나는 곧게, 하나는 휘게.','선'],['깔때기 모양 화기','청자빛 유약을 입힌 작은 화기와 침봉.','화기']],
    memo:['한 송이면','충분한 날'], memoText:'작아서 책상이나 창가, 찻상 위에도 놓기 좋아요.',
    h:40, w:20, v:9, life:'5~7일',
    focus:{flower:'50% 28%', vessel:'50% 82%'},
    season:['小雪','소설을 앞두고 기다리는 봄','수선은 한겨울에 피어 봄을 먼저 알리는 꽃입니다. 첫눈을 앞둔 때에 노란 한 송이를 두고, 가장 추운 날들 너머의 봄을 미리 건넵니다.','an early word of spring']
  },
  nasturtium: {
    img:'ikebana-nasturtium', no:'No.04 · 꽃꽂이 · 소품', name:'한련 한 줄기', en:'A SINGLE NASTURTIUM', base:48000, vesselOff:12000,
    desc:'둥근 한련잎 하나를 높이 띄우고, 그 아래 주홍 꽃 한 송이를 걸었습니다. 휘어진 줄기 하나가 잎과 꽃을 이어요.',
    chips:['한련','한련잎','깔때기 화기'],
    flowers:[['한련잎','연잎을 닮은 둥근 잎 하나.','면'],['한련꽃 한 송이','주홍빛 꽃 한 송이.','점'],['깔때기 모양 화기','청자빛 유약을 입힌 작은 화기와 침봉.','화기']],
    memo:['둥근 잎 아래','주홍 한 점'], memoText:'잎이 무거워 줄기가 기울 수 있어요. 기울면 침봉에 다시 깊게 꽂아 주세요.',
    h:38, w:18, v:9, life:'5~7일',
    focus:{flower:'56% 58%', vessel:'50% 84%'},
    season:['立冬','입동의 마지막 주홍','서리가 내리기 전 마지막으로 피는 한련을 골랐습니다. 늦가을의 주홍 한 점이 겨울 초입의 방을 따뜻하게 밝혀요.','the last warm color before frost']
  }
};
const A_WRAP = [{label:'감싸개', note:'기본 포함', add:0},{label:'매듭 보자기', note:'+18,000 · 화기째 싸기', add:18000}];
const A_DELIV = [{label:'작업실 픽업', note:'무료', add:0},{label:'서울 당일 퀵', note:'+15,000', add:15000}];

let aCur, aKey, aSel = {vessel:0, wrap:0, deliv:0}, aQty = 1;
const a$ = id => document.getElementById(id);
const aWon = n => n.toLocaleString('ko-KR');
const aImg = (k, pos, size) => `<span class="photo" style="background-image:var(--img-${ARR[k].img});background-position:${pos};background-size:${size}"></span>`;

function aRadios(id, name, list, sel){
  a$(id).innerHTML = list.map((o,i)=>`<label><input type="radio" name="${name}" value="${i}" ${i===sel?'checked':''}><span>${o.label}<em>${o.note}</em></span></label>`).join('');
}
function aPrice(){
  const unit = aCur.base - (aSel.vessel ? aCur.vesselOff : 0) + A_WRAP[aSel.wrap].add;
  a$('a-price').innerHTML = aWon(unit * aQty + A_DELIV[aSel.deliv].add) + '<small>원</small>';
}
function aSetMain(i, gallery){
  a$('a-main').innerHTML = gallery[i][1];
  [...a$('a-thumbs').children].forEach((b,k)=>b.setAttribute('aria-pressed', String(k===i)));
}
function aSizeSvg(c){
  const s = 230 / 65, H = c.h*s, W = c.w*s, V = c.v*s, cx = 150, base = 270;
  return `<svg viewBox="0 0 300 300" aria-label="높이 ${c.h}cm, 폭 ${c.w}cm">
    <g fill="none" stroke="#141413" stroke-width="1.2" stroke-linecap="round">
      <rect x="${cx-W/2}" y="${base-H}" width="${W}" height="${H}" stroke-dasharray="4 4" stroke="#A9A59E"/>
      <path d="M${cx-V/2} ${base-14} L${cx+V/2} ${base-14} L${cx+V/2-4} ${base} L${cx-V/2+4} ${base} Z" fill="#E4E1DA"/>
      <path d="M${cx} ${base-14} C${cx-W*0.18} ${base-H*0.45} ${cx+W*0.22} ${base-H*0.7} ${cx+W*0.05} ${base-H+6}"/>
      <path d="M${cx+W/2+14} ${base-H} V${base} M${cx+W/2+9} ${base-H} h10 M${cx+W/2+9} ${base} h10"/>
      <path d="M${cx-W/2} ${base+14} H${cx+W/2} M${cx-W/2} ${base+9} v10 M${cx+W/2} ${base+9} v10"/>
    </g>
    <g font-family="Noto Sans KR" font-size="10" fill="#6E6B66" letter-spacing="1">
      <text x="${cx+W/2+22}" y="${base-H/2}" dominant-baseline="middle">${c.h} cm</text>
      <text x="${cx}" y="${base+30}" text-anchor="middle">${c.w} cm</text>
    </g></svg>`;
}
function renderArrange(key){
  aKey = key in ARR ? key : 'larch'; aCur = ARR[aKey];
  aSel = {vessel:0, wrap:0, deliv:0}; aQty = 1; a$('a-qty').textContent = 1; a$('a-note').textContent = '';
  document.title = '설담화 · ' + aCur.name;
  a$('a-crumb').textContent = aCur.name;
  a$('a-no').textContent = aCur.no;
  a$('a-name').innerHTML = aCur.name + '<small>' + aCur.en + '</small>';
  a$('a-desc').textContent = aCur.desc;
  a$('a-chips').innerHTML = aCur.chips.map(c=>`<span>${c}</span>`).join('');
  aRadios('a-vessel','a-vessel',[{label:'화기 포함', note:'수반 · 침봉'},{label:'꽃과 침봉만', note:'−' + aWon(aCur.vesselOff)}],0);
  aRadios('a-wrap','a-wrap',A_WRAP,0);
  aRadios('a-deliv','a-deliv',A_DELIV,0);
  a$('a-spec').innerHTML = [['구성', aCur.chips.join(', ')],['크기','높이 약 '+aCur.h+'cm · 폭 약 '+aCur.w+'cm'],['기간', aCur.life],['포장','감싸개 기본 포함']]
    .map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  const gallery = [
    ['전체 모습', aImg(aKey,'center','cover')],
    ['꽃 가까이', aImg(aKey, aCur.focus.flower, '240%')],
    ['화기 가까이', aImg(aKey, aCur.focus.vessel, '240%')],
    ['감싸개 포장', '<svg viewBox="0 0 300 330" aria-hidden="true"><use href="#ill-wrap"/></svg>']
  ];
  a$('a-thumbs').innerHTML = gallery.map(([label,html])=>`<button type="button" aria-label="${label}" aria-pressed="false">${html}</button>`).join('');
  [...a$('a-thumbs').children].forEach((b,i)=>b.addEventListener('click',()=>aSetMain(i, gallery)));
  aSetMain(0, gallery);
  a$('a-others').innerHTML = Object.keys(ARR).filter(k=>k!==aKey).map(k=>`<a href="#${k}"><i style="background-image:var(--img-${ARR[k].img})"></i><b>${ARR[k].name}</b>${aWon(ARR[k].base)}</a>`).join('');
  // 01~05
  const last = aCur.name.charCodeAt(aCur.name.length-1);
  const josa = (last >= 0xAC00 && last <= 0xD7A3 && (last - 0xAC00) % 28) ? '을' : '를';
  a$('a-story-title').textContent = aCur.name + josa + ' 들이는 방법';
  a$('a-flist').innerHTML = aCur.flowers.map(([n,d,t],i)=>`<li><i>${String(i+1).padStart(2,'0')}</i><div><b>${n}</b><small>${d}</small></div><span>${t}</span></li>`).join('');
  a$('a-memo-hand').innerHTML = aCur.memo.join('<br>');
  a$('a-memo').textContent = aCur.memoText;
  a$('a-memo-vt').textContent = aCur.season[0];
  a$('a-size-svg').innerHTML = aSizeSvg(aCur);
  a$('a-h').innerHTML = aCur.h + '<small>cm</small>';
  a$('a-w').innerHTML = aCur.w + '<small>cm</small>';
  a$('a-v').innerHTML = aCur.v + '<small>cm</small>';
  a$('a-size-note').textContent = '손으로 꽂는 꽃이라 실제 크기는 ±5cm 정도 달라질 수 있어요. 둘 자리의 높이와 폭을 한 번 재 보시면 좋아요.';
  a$('a-life').textContent = aCur.life;
  a$('a-season-big').textContent = aCur.season[0];
  a$('a-season-h').textContent = aCur.season[1];
  a$('a-season-p').textContent = aCur.season[2];
  a$('a-season-en').textContent = aCur.season[3];
  aPrice();
}
['a-vessel','a-wrap','a-deliv'].forEach(id=>a$(id).addEventListener('change',e=>{
  aSel[id.slice(2)] = +e.target.value; aPrice();
}));
document.querySelectorAll('[data-ad]').forEach(b=>b.addEventListener('click',()=>{
  aQty = Math.min(20, Math.max(1, aQty + +b.dataset.ad)); a$('a-qty').textContent = aQty; aPrice();
}));
// 장바구니 담기 / 바로 구매 (_cart.js)
document.querySelectorAll('[data-aact]').forEach(b=>b.addEventListener('click',()=>{
  const vessel = aSel.vessel ? '꽃과 침봉만' : '화기 포함';
  const opt = [vessel, A_WRAP[aSel.wrap].label].concat(aSel.deliv ? [] : [A_DELIV[0].label]).join(' · ');  // 퀵은 따로 한 줄로 보여준다
  const unit = aCur.base - (aSel.vessel ? aCur.vesselOff : 0) + A_WRAP[aSel.wrap].add;
  cartAdd({id:aKey+'|'+opt, key:aKey, kind:'arr', name:aCur.name, opt, unit, qty:aQty, quick:A_DELIV[aSel.deliv].add});
  if(b.dataset.aact==='buy') go('cart'); else { a$('a-note').textContent = '장바구니에 담았어요.'; showToast('장바구니에 담았어요 · '+aCur.name); }
}));
