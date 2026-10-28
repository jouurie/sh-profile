(() => {
  'use strict';
  const fine=matchMedia('(hover:hover) and (pointer:fine)'), reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const seals=new Set();
  const touchTargets=new Map();
  document.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse')return;
    const target=event.target.closest('.tags span,.hand-note');if(!target)return;
    clearTimeout(touchTargets.get(target));target.classList.add('is-touch-active');touchTargets.set(target,null);
  },{passive:true});
  const releaseTouch=()=>{for(const [target,timer]of touchTargets){clearTimeout(timer);touchTargets.set(target,setTimeout(()=>{target.classList.remove('is-touch-active');touchTargets.delete(target);},220));}};
  document.addEventListener('pointerup',releaseTouch,{passive:true});
  document.addEventListener('pointercancel',releaseTouch,{passive:true});
  window.addEventListener('blur',releaseTouch);

  document.addEventListener('pointerdown',event=>{
    if(!fine.matches||reduced.matches||event.button!==0||event.pointerType!=='mouse'||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(seals.size>=4){const first=seals.values().next().value;first.remove();seals.delete(first);}
    const seal=document.createElement('span');seal.className='sh-click-seal';seal.setAttribute('aria-hidden','true');
    seal.style.left=Math.max(4,Math.min(innerWidth-52,event.clientX+10))+'px';
    seal.style.top=Math.max(4,Math.min(innerHeight-52,event.clientY+10))+'px';
    seal.innerHTML='<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" stroke-width="1.6"/><circle cx="24" cy="24" r="17.5" stroke-width=".7"/><path d="M20 12h8M20 36h8" stroke-width="1"/><text x="25" y="29" text-anchor="middle">접수</text></svg>';
    (document.querySelector('dialog[open]')||document.body).append(seal);seals.add(seal);
    const remove=()=>{seal.remove();seals.delete(seal);};
    seal.addEventListener('animationend',remove,{once:true});setTimeout(remove,700);
  },{passive:true});
})();
