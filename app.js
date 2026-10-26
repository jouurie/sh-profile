(() => {
const d=window.SH_CONTENT,$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const body=t=>t.split('\n').filter(Boolean).map(l=>'<p>'+esc(l.replace(/^↳\s*/,''))+'</p>').join('');
const blocks=t=>t.split(/\n\n+/).map(s=>{const lines=s.split('\n');if(lines.length>1&&lines[0].length<20&&!/[.!?。]$/.test(lines[0]))return '<div class="text-block"><h3>'+esc(lines.shift())+'</h3>'+body(lines.join('\n'))+'</div>';return '<div class="text-block">'+body(s)+'</div>'}).join('');
$('#intro-copy').innerHTML=d.intro.map(t=>'<p>'+esc(t).replaceAll('\n','<br>')+'</p>').join('');
$('#tw-text').textContent=d.tw;
$('#profile-content').innerHTML=['기본 정보','외형','성격 · 버릇','말투','특징','취향'].map(name=>'<section class="file-section"><h2>'+name+'</h2>'+blocks(d.sections[name])+'</section>').join('');
$('#world-content').innerHTML='<div class="world-lead reading-copy">'+body(d.sections['세계관'])+'</div><div class="world-grid">'+['서진테크','후계 구도','비서실'].map(name=>'<section class="file-section"><h2>'+name+'</h2>'+blocks(d.sections[name])+'</section>').join('')+'</div><section class="file-section"><h2>진행 소재</h2><div class="ideas-grid">'+blocks(d.sections['진행 소재'])+'</div></section>';
$('#people-content').innerHTML=d.npcs.map((p,i)=>'<article class="person"><div class="person-mark" aria-hidden="true">'+esc(p.name[0])+'</div><div><h2>'+esc(p.name)+'</h2>'+p.lines.map(l=>'<p>'+esc(l)+'</p>').join('')+'</div></article>').join('');
$('#starts-content').innerHTML=d.openings.map((p,i)=>'<article class="opening"><span class="opening-no">0'+(i+1)+'</span><h2>'+esc(p.name)+'</h2><p>'+esc(p.description)+'</p><a href="#guide" class="text-link">플레이 안내 ↗</a></article>').join('');
const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)');
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -12px 0px'});
function prepareReveal(host){host.querySelectorAll('.intro-section,.home-bottom,.file-section,.person,.opening,.page-title,.guide-card,.guide-model-section,.copy-card').forEach((el,i)=>{if(el.dataset.reveal)return;el.dataset.reveal='';el.style.setProperty('--entry-direction',i%2?'-24px':'24px');el.classList.add('reveal-ready');if(reduceMotion.matches)el.classList.add('is-visible');else revealObserver.observe(el)})}
function route(){const id=location.hash.slice(1)||'home';const target=document.getElementById(id);if(!target?.classList.contains('view'))return;document.querySelectorAll('.view').forEach(e=>e.hidden=e!==target);document.querySelectorAll('.site-header nav a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.title=(id==='home'?'권세혁 · 업무상 관심입니다.':target.querySelector('h1').textContent+' · 권세혁');window.scrollTo({top:0,behavior:'instant'});prepareReveal(target);if(!reduceMotion.matches)target.animate([{opacity:.6,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:150,easing:'cubic-bezier(.16,1,.3,1)'});}
window.addEventListener('hashchange',route);route();$('#back-top').onclick=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
new MutationObserver(()=>prepareReveal($('#guide-panel'))).observe($('#guide-panel'),{childList:true,subtree:true});
const interactive='a,button,summary';let pressed=null;
document.addEventListener('pointerdown',e=>{const el=e.target.closest(interactive);if(!el)return;pressed=el;el.classList.add('is-pressed')},{passive:true});
const clearPress=()=>{pressed?.classList.remove('is-pressed');pressed=null};
document.addEventListener('pointerup',clearPress,{passive:true});document.addEventListener('pointercancel',clearPress,{passive:true});window.addEventListener('blur',clearPress);
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches)document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible'))});
})();
