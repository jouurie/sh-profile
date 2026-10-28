(() => {
const d=window.SH_CONTENT,$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const body=t=>t.split('\n').filter(Boolean).map(l=>'<p>'+esc(l.replace(/^↳\s*/,''))+'</p>').join('');
const blocks=t=>t.split(/\n\n+/).map(s=>{const lines=s.split('\n');if(lines.length>1&&lines[0].length<20&&!/[.!?。]$/.test(lines[0]))return '<div class="text-block"><h3>'+esc(lines.shift())+'</h3>'+body(lines.join('\n'))+'</div>';return '<div class="text-block">'+body(s)+'</div>'}).join('');
$('#intro-copy').innerHTML=d.intro.map(t=>'<p>'+esc(t).replaceAll('\n','<br>')+'</p>').join('');
$('#tw-text').textContent=d.tw;
$('#profile-content').innerHTML=['기본 정보','외형','성격 · 버릇','말투','특징','취향'].map(name=>'<section class="file-section"><h2>'+name+'</h2>'+blocks(d.sections[name].replace(/\n(?=버릇\n|불호\n)/g,'\n\n'))+'</section>').join('');
const ageLine=[...$('#profile-content').querySelectorAll('.file-section:first-child p')].find(p=>p.textContent.startsWith('28세 /'));
if(ageLine){const original=ageLine.textContent,age=document.createElement('span');age.className='profile-age-anchor';age.textContent='28세';const note=document.createElement('span');note.className='profile-age-annotation';note.setAttribute('aria-hidden','true');note.innerHTML='<svg class="profile-age-circle" viewBox="0 0 64 44"><path d="M55 9C44-2 9 2 5 19S15 42 37 40 63 25 57 13C53 5 37 2 25 5"/></svg><svg class="profile-age-arrow" viewBox="0 0 74 46"><path d="M70 6C47 4 23 13 9 36M10 22 8 37 24 35"/></svg><span class="profile-age-memo">낙하산?</span>';age.append(note);ageLine.replaceChildren(age,document.createTextNode(original.slice(3)));}
$('#world-content').innerHTML='<figure class="world-art"><img src="assets/world-city-empty-v5.png" alt="사무 빌딩과 카페, 나무가 있는 인물 없는 현대 도심 삽화" width="1536" height="1024" decoding="async"></figure><div class="world-lead reading-copy">'+body(d.sections['세계관'])+'</div><div class="world-grid">'+['서진테크','후계 구도','비서실'].map(name=>'<section class="file-section"><h2>'+name+'</h2>'+blocks(d.sections[name])+'</section>').join('')+'</div><section class="file-section"><h2>진행 소재</h2><div class="ideas-grid">'+blocks(d.sections['진행 소재'])+'</div></section>';
const npcPortraits={"권태진":"assets/npc-taejin-simple.png","윤정희":"assets/npc-jeonghui-simple.png","권서윤":"assets/npc-seoyun-simple.png","오나경":"assets/npc-nagyeong-simple.png","박도준":"assets/npc-dojun-simple.png","임해리":"assets/npc-haeri-simple.png","최기태":"assets/npc-gitae-simple.png","장도윤":"assets/npc-doyun-simple.png","민서현":"assets/npc-seohyeon-simple.png","고태섭":"assets/npc-taeseop-simple.png","문하린":"assets/npc-harin-simple.png"};
$('#people-content').innerHTML=d.npcs.map((p,i)=>'<article class="person"><div class="person-mark" aria-hidden="true"><img src="'+npcPortraits[p.name]+'" alt="" width="72" height="72" loading="lazy" decoding="async"></div><div><h2>'+esc(p.name)+'</h2>'+p.lines.map(l=>'<p>'+esc(l)+'</p>').join('')+'</div></article>').join('');
const openingAlt=['야경이 보이는 전무실 책상 위의 찢어진 서류와 만년필','야간 테스트 트랙에 세워진 검은 세단과 운전 장갑','와인 잔과 얼룩진 옷이 놓인 붉은 커튼의 피팅룸','랜턴 하나를 켜 둔 펜트하우스의 소파와 업무 서류','자선 행사장 뒤편에 나란히 놓인 두 고양이 인형탈','햇빛이 드는 사옥 임원층 로비와 열린 엘리베이터'];
$('#starts-content').innerHTML=d.openings.map((p,i)=>'<article class="opening"><button class="opening-image" type="button" data-opening-image="'+i+'" aria-label="이미지 크게 보기: '+esc(p.name)+'"><img src="assets/opening-0'+(i+1)+(i===5?'-v5.png':'-v4.png')+'" alt="'+openingAlt[i]+'" width="1536" height="1024" loading="'+(i===0?'eager':'lazy')+'" decoding="async"><span class="opening-expand" aria-hidden="true">↗</span></button><div class="opening-copy"><div class="opening-heading"><span class="opening-no">0'+(i+1)+'</span><h2>'+esc(p.name)+'</h2></div><p>'+esc(p.description)+'</p><button type="button" class="text-link sh-opening-preview-button" data-opening-preview="'+i+'" aria-haspopup="dialog" aria-label="'+esc(p.name)+' 전문보기">전문보기 ↗</button></div></article>').join('');
const artDialog=document.createElement('dialog');artDialog.className='opening-lightbox';artDialog.setAttribute('aria-label','시작 상황 이미지 크게 보기');artDialog.innerHTML='<form method="dialog"><button class="opening-lightbox-close" aria-label="이미지 닫기">닫기 ×</button></form><figure><img alt=""></figure>';document.body.append(artDialog);
$('#starts-content').addEventListener('click',e=>{const button=e.target.closest('[data-opening-image]');if(!button)return;const i=Number(button.dataset.openingImage),img=artDialog.querySelector('img');img.src='assets/opening-0'+(i+1)+(i===5?'-v5.png':'-v4.png');img.alt=openingAlt[i];artDialog.setAttribute('aria-label','시작 상황 이미지 크게 보기');artDialog.showModal();});
const portrait=$('.profile-photo img');
portrait.tabIndex=0;portrait.setAttribute('role','button');portrait.setAttribute('aria-label','권세혁 프로필 이미지 크게 보기');portrait.setAttribute('aria-haspopup','dialog');
function openPortrait(){const img=artDialog.querySelector('img');img.src=portrait.currentSrc||portrait.src;img.alt=portrait.alt;artDialog.setAttribute('aria-label','권세혁 프로필 이미지 크게 보기');artDialog.showModal();}
portrait.addEventListener('click',openPortrait);
portrait.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPortrait();}});
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
    if (event.target.closest('button,a,summary,input,textarea,select,img,.hero-art,.profile-photo,.hero h1.sh-hook,.red-band')) return null;
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

// Keep the existing platform menu above clipping and stacking contexts.
(() => {
 const chooser=document.querySelector('.hero-platform-chooser'),menu=chooser.querySelector('.hero-platform-menu'),trigger=chooser.querySelector('summary');
 menu.setAttribute('popover','auto');
 const place=()=>{
  if(!menu.matches(':popover-open'))return;
  const r=trigger.getBoundingClientRect(),w=menu.offsetWidth,h=menu.offsetHeight;
  menu.style.left=Math.max(8,Math.min(innerWidth-w-8,r.right-w))+'px';
  menu.style.top=(r.bottom+8+h<=innerHeight-8?r.bottom+8:Math.max(8,r.top-h-8))+'px';
 };
 chooser.addEventListener('toggle',()=>{
  if(chooser.open){if(!menu.matches(':popover-open'))menu.showPopover();place();}
  else if(menu.matches(':popover-open'))menu.hidePopover();
 });
 menu.addEventListener('toggle',e=>{if(e.newState==='closed')chooser.open=false;});
 addEventListener('resize',place);addEventListener('scroll',place,{passive:true});
})();
