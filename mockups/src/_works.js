// ===== works: 작업 기록 =====
// pic: 사진(--img-<이름>) 또는 'ill'(작업 선화)
const WORKS = [
  {date:'2026.11', iso:'2026-11', cat:'space', title:'입동, 찻자리의 꽃', where:'개인 다회 · 서울', what:'낙엽송과 마른 연밥', pic:'ikebana-larch',
   text:'겨울로 들어서는 날의 다회. 낮은 굽 수반에 잎을 떨구기 직전의 낙엽송 한 가지를 세우고, 찻상 끝에는 마른 연밥 하나만 두었습니다.'},
  {date:'2026.10', iso:'2026-10', cat:'project', title:'갤러리 개관 꽃', where:'성수동 갤러리', what:'억새와 감나무 가지', pic:'ill',
   text:'흰 벽의 전시장 입구에 억새 다발과 감이 달린 가지를 세웠습니다. 전시가 끝난 뒤 가지는 말려 갤러리에 남겼어요.'},
  {date:'2026.09', iso:'2026-09', cat:'sub', title:'백로의 한 줄기', where:'정기 구독 · 아홉 번째 꽃', what:'대나무와 부채 잎', pic:'ikebana-bamboo',
   text:'이슬이 맺히기 시작하는 때, 곧은 대나무와 접은 잎으로 서늘한 선을 보냈습니다.'},
  {date:'2026.08', iso:'2026-08', cat:'meet', title:'보자기 워크숍 기록', where:'설담화 작업실', what:'쪽물 들이기와 매듭 짓기', pic:'bojagi',
   text:'여덟 분과 함께 무명 천에 쪽물을 들이고, 각자 꽂은 꽃을 그 천으로 싸서 가져갔습니다.'},
  {date:'2026.07', iso:'2026-07', cat:'sub', title:'소서, 한련 한 줄기', where:'정기 구독 · 일곱 번째 꽃', what:'한련과 한련잎', pic:'ikebana-nasturtium',
   text:'더위가 시작되는 때, 둥근 잎 아래 주홍 한 점을 걸어 작은 화기에 담았습니다.'},
  {date:'2026.06', iso:'2026-06', cat:'space', title:'들꽃 정원의 오후', where:'가평 정원 촬영', what:'코스모스와 들풀', pic:'field',
   text:'정원 브랜드의 사진 촬영을 위해 들풀 사이에 꽃을 꽂아 두었습니다. 꽃은 촬영 뒤 정원에 그대로 돌려보냈어요.'},
  {date:'2026.04', iso:'2026-04', cat:'project', title:'말린 꽃 상자', where:'출판사 행사 답례품', what:'말린 꽃과 감싸개', pic:'dried-box',
   text:'책 출간 행사의 답례로 말린 꽃 한 줄기를 상자에 담고, 감싸개로 한 번 더 쌌습니다.'},
  {date:'2026.03', iso:'2026-03', cat:'sub', title:'경칩의 수선', where:'정기 구독 · 세 번째 꽃', what:'수선 한 송이', pic:'ikebana-daffodil',
   text:'개구리가 깨어나는 때, 노란 수선 한 송이로 봄을 먼저 알렸습니다.'}
];
const WK_CATS = [['all','전체'],['space','공간 연출'],['project','프로젝트'],['sub','구독'],['meet','모임']];
const WK_NAME = Object.fromEntries(WK_CATS);

function wkPic(w){
  return w.pic === 'ill'
    ? `<div class="wk-pic ill"><svg viewBox="0 0 360 230" aria-hidden="true">${document.querySelector('#home-works .poster svg').innerHTML}</svg></div>`
    : `<div class="wk-pic" role="img" aria-label="${w.title}, ${w.what}" style="background-image:var(--img-${w.pic})"></div>`;
}
function renderWorks(cat){
  const list = WORKS.filter(w => cat === 'all' || w.cat === cat);
  document.querySelectorAll('#wk-cats button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.wcat === cat)));
  const feat = list[0], rest = list.slice(1);
  const f = document.getElementById('wk-feat');
  f.hidden = !feat;
  if (feat) f.innerHTML = `${wkPic(feat)}<div><time datetime="${feat.iso}">${feat.date}</time><span class="wk-tag">${WK_NAME[feat.cat]}</span>
    <h2>${feat.title}</h2><p>${feat.text}</p>
    <dl><div><dt>장소</dt><dd>${feat.where}</dd></div><div><dt>꽃</dt><dd>${feat.what}</dd></div></dl></div>`;
  document.getElementById('wk-grid').innerHTML = rest.length
    ? rest.map(w => `<article class="wk-card">${wkPic(w)}<div class="row"><time datetime="${w.iso}">${w.date}</time><span class="wk-tag">${WK_NAME[w.cat]}</span></div><h3>${w.title}</h3><p>${w.where} · ${w.what}</p></article>`).join('')
    : (feat ? '' : '<p class="wk-empty">이 분류의 기록은 아직 없어요.</p>');
}
document.getElementById('wk-cats').innerHTML = WK_CATS.map(([k,n]) => {
  const c = k === 'all' ? WORKS.length : WORKS.filter(w => w.cat === k).length;
  return `<button type="button" data-wcat="${k}" aria-pressed="false">${n}<small>${c}</small></button>`;
}).join('');
document.querySelectorAll('#wk-cats button').forEach(b => b.addEventListener('click', () => renderWorks(b.dataset.wcat)));
renderWorks('all');
