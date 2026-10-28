(() => {
  'use strict';
  const fine=matchMedia('(hover:hover) and (pointer:fine)'), reduced=matchMedia('(prefers-reduced-motion:reduce)');
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

})();
