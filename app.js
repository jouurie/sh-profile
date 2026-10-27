(() => {
const d=window.SH_CONTENT,$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const body=t=>t.split('\n').filter(Boolean).map(l=>'<p>'+esc(l.replace(/^↳\s*/,''))+'</p>').join('');
const blocks=t=>t.split(/\n\n+/).map(s=>{const lines=s.split('\n');if(lines.length>1&&lines[0].length<20&&!/[.!?。]$/.test(lines[0]))return '<div class="text-block"><h3>'+esc(lines.shift())+'</h3>'+body(lines.join('\n'))+'</div>';return '<div class="text-block">'+body(s)+'</div>'}).join('');
$('#intro-copy').innerHTML=d.intro.map(t=>'<p>'+esc(t).replaceAll('\n','<br>')+'</p>').join('');
$('#tw-text').textContent=d.tw;
$('#profile-content').innerHTML=['기본 정보','외형','성격 · 버릇','말투','특징','취향'].map(name=>'<section class="file-section"><h2>'+name+'</h2>'+blocks(d.sections[name])+'</section>').join('');
$('#world-content').innerHTML='<figure class="world-art"><img src="assets/world-city-empty-v5.png" alt="사무 빌딩과 카페, 나무가 있는 인물 없는 현대 도심 삽화" width="1536" height="1024" decoding="async"></figure><div class="world-lead reading-copy">'+body(d.sections['세계관'])+'</div><div class="world-grid">'+['서진테크','후계 구도','비서실'].map(name=>'<section class="file-section"><h2>'+name+'</h2>'+blocks(d.sections[name])+'</section>').join('')+'</div><section class="file-section"><h2>진행 소재</h2><div class="ideas-grid">'+blocks(d.sections['진행 소재'])+'</div></section>';
$('#people-content').innerHTML=d.npcs.map((p,i)=>'<article class="person"><div class="person-mark" aria-hidden="true">'+esc(p.name[0])+'</div><div><h2>'+esc(p.name)+'</h2>'+p.lines.map(l=>'<p>'+esc(l)+'</p>').join('')+'</div></article>').join('');
const openingAlt=['야경이 보이는 전무실 책상 위의 찢어진 서류와 만년필','야간 테스트 트랙에 세워진 검은 세단과 운전 장갑','와인 잔과 얼룩진 옷이 놓인 붉은 커튼의 피팅룸','랜턴 하나를 켜 둔 펜트하우스의 소파와 업무 서류','자선 행사장 뒤편에 나란히 놓인 두 고양이 인형탈','햇빛 드는 책상의 빈 노트와 만년필, 하트 도장'];
$('#starts-content').innerHTML=d.openings.map((p,i)=>'<article class="opening"><button class="opening-image" type="button" data-opening-image="'+i+'" aria-label="이미지 크게 보기: '+esc(p.name)+'"><img src="assets/opening-0'+(i+1)+'-v4.png" alt="'+openingAlt[i]+'" width="1536" height="1024" loading="'+(i===0?'eager':'lazy')+'" decoding="async"><span class="opening-expand" aria-hidden="true">↗</span></button><div class="opening-copy"><div class="opening-heading"><span class="opening-no">0'+(i+1)+'</span><h2>'+esc(p.name)+'</h2></div><p>'+esc(p.description)+'</p><button type="button" class="text-link sh-opening-preview-button" data-opening-preview="'+i+'" aria-haspopup="dialog" aria-label="'+esc(p.name)+' 전문보기">전문보기 ↗</button></div></article>').join('');
const artDialog=document.createElement('dialog');artDialog.className='opening-lightbox';artDialog.setAttribute('aria-label','시작 상황 이미지 크게 보기');artDialog.innerHTML='<form method="dialog"><button class="opening-lightbox-close" aria-label="이미지 닫기">닫기 ×</button></form><figure><img alt=""></figure>';document.body.append(artDialog);
$('#starts-content').addEventListener('click',e=>{const button=e.target.closest('[data-opening-image]');if(!button)return;const i=Number(button.dataset.openingImage),img=artDialog.querySelector('img');img.src='assets/opening-0'+(i+1)+'-v4.png';img.alt=openingAlt[i];artDialog.showModal();});
artDialog.addEventListener('click',e=>{if(e.target===artDialog){const r=artDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)artDialog.close();}});
const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)');
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -12px 0px'});
function prepareReveal(host){host.querySelectorAll('.intro-section,.home-bottom,.file-section,.person,.opening,.world-art,.page-title,.guide-card,.guide-model-section,.copy-card').forEach((el,i)=>{if(el.dataset.reveal)return;el.dataset.reveal='';el.style.setProperty('--entry-direction',i%2?'-24px':'24px');el.classList.add('reveal-ready');if(reduceMotion.matches)el.classList.add('is-visible');else revealObserver.observe(el)})}
function route(){const id=location.hash.slice(1)||'home';const target=document.getElementById(id);if(!target?.classList.contains('view'))return;document.querySelectorAll('.view').forEach(e=>e.hidden=e!==target);document.querySelectorAll('.site-header nav a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.title=(id==='home'?'권세혁 · 업무상 관심입니다.':target.querySelector('h1').textContent+' · 권세혁');window.scrollTo({top:0,behavior:'instant'});prepareReveal(target);if(!reduceMotion.matches)target.animate([{opacity:.6,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:150,easing:'cubic-bezier(.16,1,.3,1)'});}
window.addEventListener('hashchange',route);route();$('#back-top').onclick=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
new MutationObserver(()=>prepareReveal($('#guide-panel'))).observe($('#guide-panel'),{childList:true,subtree:true});
const interactive='a,button,summary';let pressed=null;
document.addEventListener('pointerdown',e=>{const el=e.target.closest(interactive);if(!el)return;pressed=el;el.classList.add('is-pressed')},{passive:true});
const clearPress=()=>{pressed?.classList.remove('is-pressed');pressed=null};
document.addEventListener('pointerup',clearPress,{passive:true});document.addEventListener('pointercancel',clearPress,{passive:true});window.addEventListener('blur',clearPress);
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches)document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible'))});
})();

// Subtle per-item response, shared with the character panels.
(() => {
  let active = null;
  const clear = () => {
    if (!active) return;
    active.node.style.backgroundColor = active.background;
    active.node.style.transition = active.transition;
    active = null;
  };
  const target = event => {
    if (event.target.closest('button,a,summary,input,textarea,select')) return null;
    for (let node = event.target; node && node !== document.body; node = node.parentElement) {
      if (!node.matches('main *,header *,footer *')) return null;
      if (node.matches('img,svg') || [...node.childNodes].some(child => child.nodeType === 3 && child.textContent.trim())) return node;
    }
    return null;
  };
  const show = (event, pressed = false) => {
    const node = target(event);
    if (!node) { clear(); return; }
    if (active?.node !== node) { clear(); active = {node, background:node.style.backgroundColor, transition:node.style.transition}; }
    node.style.transition = 'background-color .14s ease';
    node.style.backgroundColor = node.closest('.red-band') ? (pressed ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.1)') : (pressed ? 'rgba(182,64,44,.09)' : 'rgba(182,64,44,.045)');
  };
  document.addEventListener('pointerover', event => { if(event.pointerType !== 'touch') show(event); }, {passive:true});
  document.addEventListener('pointerdown', event => show(event,true), {passive:true});
  document.addEventListener('pointerup', event => { if(event.pointerType === 'touch') clear(); else show(event); }, {passive:true});
  document.addEventListener('pointercancel', clear, {passive:true});
  document.documentElement.addEventListener('pointerleave', clear, {passive:true});
})();
