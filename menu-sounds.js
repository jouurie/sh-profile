/* Sehyuk: a short, low desk-switch click, synthesized locally after activation. */
(() => {
  'use strict';
  if (window.SHMenuSound) return;
  let context, enabled=true, last=-Infinity, played=0, ended=0;
  const active=new Set();
  function stop(){for(const source of active){try{source.stop();}catch{}}}
  async function click(){
    if(!enabled||document.hidden||performance.now()-last<45)return;
    last=performance.now();
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    context ||= new C();
    if(context.state==='suspended')await context.resume().catch(()=>{});
    if(context.state!=='running'||!enabled||document.hidden)return;
    const now=context.currentTime,osc=context.createOscillator(),gain=context.createGain();
    osc.type='triangle';osc.frequency.setValueAtTime(720,now);osc.frequency.exponentialRampToValueAtTime(180,now+.036);
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.075,now+.0015);gain.gain.exponentialRampToValueAtTime(.0001,now+.045);
    osc.connect(gain);gain.connect(context.destination);active.add(osc);
    osc.onended=()=>{active.delete(osc);osc.disconnect();gain.disconnect();ended++;};
    osc.start(now);osc.stop(now+.048);played++;
  }
  const toggle=document.createElement('button');toggle.type='button';toggle.className='sh-sound-toggle';
  toggle.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8h3l4-3v10l-4-3H3z"/><path class="waves" d="M13 7a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10"/><path class="off" d="m13 8 4 4m0-4-4 4"/></svg>';
  const style=document.createElement('style');style.textContent='.sh-sound-toggle{flex:0 0 28px;width:28px;height:28px;min-height:28px;padding:4px;border:1px solid var(--line);background:transparent;color:inherit;cursor:pointer}@media(max-width:800px){.site-header .sh-sound-toggle{position:absolute;right:0;top:20px}}.sh-sound-toggle svg{display:block;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5}.sh-sound-toggle .off{display:none}.sh-sound-toggle[aria-pressed=false] .waves{display:none}.sh-sound-toggle[aria-pressed=false] .off{display:block}';document.head.append(style);
  function render(){const label=enabled?'효과음 끄기':'효과음 켜기';toggle.setAttribute('aria-label',label);toggle.title=label;toggle.setAttribute('aria-pressed',String(enabled));}
  toggle.addEventListener('click',()=>{enabled=!enabled;render();if(enabled)void click();else stop();});render();
  document.querySelector('.site-header')?.append(toggle);
  document.addEventListener('click',event=>{if(!event.isTrusted)return;const e=event.target.closest?.('button,a[href],summary,[role=tab],[role=button]');if(!e||e===toggle||e.matches(':disabled,[aria-disabled=true]')||e.closest('[hidden],[inert]'))return;void click();},true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
  window.SHMenuSound={get state(){return{enabled,context:context?.state||'uninitialized',played,ended,active:active.size};}};
})();
