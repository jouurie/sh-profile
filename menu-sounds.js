/* Dry mechanical click; independent of the music player's volume. */
(() => {
 'use strict';
 if(window.SHMenuSound)return;
 let context,buffer,last=-Infinity,played=0,ended=0;
 const active=new Set();
 function stop(){for(const source of active){try{source.stop();}catch{}}}
 async function click(){
  if(document.hidden||performance.now()-last<45)return;
  last=performance.now();
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  context ||= new C();
  if(context.state==='suspended')await context.resume().catch(()=>{});
  if(context.state!=='running'||document.hidden)return;
  if(!buffer){
   buffer=context.createBuffer(1,Math.ceil(context.sampleRate*.035),context.sampleRate);
   const data=buffer.getChannelData(0);let seed=593;
   for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;const t=i/context.sampleRate;const attack=Math.min(1,t/.0007);const tail=Math.exp(-t/.0045);const release=t>.009?.24*Math.exp(-(t-.009)/.003):0;data[i]=(seed/2147483648-1)*attack*(tail+release);}
  }
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
  source.buffer=buffer;filter.type='lowpass';filter.frequency.value=4200;gain.gain.value=.65;
  source.connect(filter);filter.connect(gain);gain.connect(context.destination);active.add(source);
  source.onended=()=>{active.delete(source);source.disconnect();filter.disconnect();gain.disconnect();ended++;};
  source.start();played++;
 }
 document.addEventListener('click',event=>{if(!event.isTrusted)return;const e=event.target.closest?.('button,a[href],summary,[role=tab],[role=button]');if(!e||e.matches(':disabled,[aria-disabled=true]')||e.closest('[hidden],[inert]'))return;void click();},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
 window.SHMenuSound={get state(){return{enabled:true,context:context?.state||'uninitialized',played,ended,active:active.size};}};
})();
