(() => {
  'use strict';
  let disposeCurrent = () => {};
  function mount(host, platform) {
    disposeCurrent();
    const payload = window.SH_STATUS_PREVIEW_DATA?.[platform];
    if (!host || !payload?.source) {
      if (host) host.textContent = '상태창 미리보기를 불러오지 못했습니다.';
      return;
    }
    const abort = new AbortController();
    const channel = 'sh-status-' + platform + '-' + Date.now();
    let ready = false, revision = 0, lastWidth = 0;
    const controls = document.createElement('div');
    controls.className = 'status-preview-controls';
    const label = document.createElement('label'), text = document.createElement('span'), select = document.createElement('select');
    text.textContent = '야근 단계'; select.id = channel + '-overtime'; label.htmlFor = select.id;
    [['off','표시 안 함'],['0','퇴근 사수'],['1','아직은 순항'],['2','퇴근이 밀린다'],['3','야근 주의보'],['4','야근 확정']].forEach(([value,title])=>{
      const option=document.createElement('option'); option.value=value; option.textContent=title; select.append(option);
    });
    select.value = 'off'; select.autocomplete = 'off'; label.append(text,select); controls.append(label);
    const frame = document.createElement('iframe');
    frame.className='status-preview-frame'; frame.title='상태창 미리보기';
    frame.style.height='400px'; frame.style.pointerEvents='none';
    frame.setAttribute('sandbox','allow-scripts'); frame.setAttribute('scrolling','no');
    const feedback=document.createElement('p'); feedback.className='status-preview-feedback'; feedback.setAttribute('role','status'); feedback.textContent='상태창을 불러오는 중입니다.';
    host.replaceChildren(controls,frame,feedback);
    const viewport=()=>{if(ready&&host.isConnected&&frame.clientWidth!==lastWidth){lastWidth=frame.clientWidth;frame.contentWindow?.postMessage({type:'elyn:custom-component:viewport',channelId:channel,width:lastWidth},'*');}};
    const render=()=>{
      if(!ready||!host.isConnected)return;
      frame.contentWindow?.postMessage({type:'elyn:custom-component:render',channelId:channel,payloadKey:channel+'-'+(++revision),componentName:'SHStatus',source:payload.source,props:{...payload.props,overtime:select.value},theme:'light',inheritedStyles:'font-size:14px;'},'*'); viewport();
    };
    window.addEventListener('message',event=>{
      if(!host.isConnected||event.source!==frame.contentWindow)return;
      const message=event.data;
      if(message?.type==='elyn:custom-component:ready'){ready=true;render();return;}
      if(message?.channelId!==channel)return;
      if(message.type==='elyn:custom-component:resize'&&Number.isFinite(message.height)){frame.style.height=Math.max(80,Math.min(12000,message.height))+'px';frame.style.pointerEvents='auto';if(feedback.textContent==='상태창을 불러오는 중입니다.')feedback.textContent='';}
      if(message.type==='elyn:custom-component:action')feedback.textContent='미리보기에서 선택한 명령: '+String(message.value||'');
      if(message.type==='elyn:custom-component:error')feedback.textContent='상태창을 불러오지 못했습니다. 다른 항목을 선택한 뒤 다시 열어 주세요.';
    },{signal:abort.signal});
    select.addEventListener('change',render,{signal:abort.signal});
    const resetSelection = () => { select.value = 'off'; render(); };
    window.addEventListener('hashchange', resetSelection, {signal:abort.signal});
    window.addEventListener('pageshow', resetSelection, {signal:abort.signal});
    const observer=new ResizeObserver(viewport); observer.observe(host);
    disposeCurrent=()=>{abort.abort();observer.disconnect();ready=false;frame.remove();};
    frame.src='previews/jsx-a/host.html';
  }
  window.SH_STATUS_PREVIEW={mount,dispose(){disposeCurrent();disposeCurrent=()=>{};}};
})();
