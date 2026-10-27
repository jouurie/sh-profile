(() => {
  'use strict';
  const list = document.getElementById('starts-content');
  const snapshot = window.SH_OPENING_PREVIEWS;
  if (!list || snapshot?.openings?.length !== 6) return;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const dialog = make('dialog', 'sh-opening-preview');
  dialog.setAttribute('aria-labelledby', 'sh-opening-preview-title');
  const header = make('header', 'sh-opening-preview-head');
  const title = make('h2');
  title.id = 'sh-opening-preview-title';
  const close = make('button', 'sh-opening-preview-close', '닫기 ×');
  close.type = 'button';
  const content = make('div', 'sh-opening-preview-content');
  const feedback = make('p', 'sh-opening-preview-feedback');
  feedback.setAttribute('role', 'status');
  feedback.hidden = true;
  header.append(title, close);
  dialog.append(header, content, feedback);
  document.body.append(dialog);
  let opener, saved, frame, channel;
  const restore = () => {
    if (!saved) return;
    document.documentElement.style.overflow = saved.html;
    document.body.style.overflow = saved.body;
    saved = null;
    frame = null;
    channel = null;
    content.replaceChildren();
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  };
  const dismiss = () => { if (dialog.open) dialog.close(); };
  close.addEventListener('click', dismiss);
  dialog.addEventListener('close', restore);
  dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss();
  });
  const sendViewport = () => {
    if (frame?.contentWindow) frame.contentWindow.postMessage({ type: 'elyn:custom-component:viewport', channelId: channel, width: frame.clientWidth }, '*');
  };
  window.addEventListener('message', event => {
    if (!dialog.open || !frame || event.source !== frame.contentWindow) return;
    const message = event.data;
    if (message?.type === 'elyn:custom-component:ready') {
      frame.contentWindow.postMessage({ type: 'elyn:custom-component:render', channelId: channel, payloadKey: channel, componentName: snapshot.intro.componentName, source: snapshot.intro.source, props: snapshot.intro.props, theme: 'light', inheritedStyles: 'font-size:14px;' }, '*');
      sendViewport();
      return;
    }
    if (message?.channelId !== channel) return;
    if (message.type === 'elyn:custom-component:resize' && Number.isFinite(message.height)) frame.style.height = Math.max(80, Math.min(12000, message.height)) + 'px';
    if (message.type === 'elyn:custom-component:action') {
      feedback.textContent = '미리보기에서 선택한 명령: ' + message.value;
      feedback.hidden = false;
    }
    if (message.type === 'elyn:custom-component:error') {
      feedback.textContent = '도입부 안내를 불러오지 못했습니다. 닫은 뒤 다시 열어 주세요.';
      feedback.hidden = false;
    }
  });
  window.addEventListener('resize', sendViewport, { passive: true });
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-opening-preview]');
    if (!button || document.querySelector('dialog[open]')) return;
    const index = Number(button.dataset.openingPreview);
    const opening = snapshot.openings[index];
    if (!Number.isInteger(index) || !opening) return;
    opener = button;
    title.textContent = window.SH_CONTENT.openings[index].name;
    content.replaceChildren();
    feedback.hidden = true;
    feedback.textContent = '';
    saved = { html: document.documentElement.style.overflow, body: document.body.style.overflow };
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (opening.id === 'plot_auto_intro') {
      frame = make('iframe', 'sh-opening-component');
      channel = 'sh-opening-' + Date.now();
      frame.title = '자유 도입부 안내 미리보기';
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.setAttribute('scrolling', 'no');
      frame.src = 'previews/jsx-a/host.html';
      content.append(frame);
    } else {
      const prose = make('div', 'sh-opening-preview-prose');
      opening.text.split(/\r?\n\s*\r?\n/).forEach(text => prose.append(make('p', '', text)));
      content.append(prose);
    }
    dialog.showModal();
    dialog.scrollTop = 0;
    close.focus({ preventScroll: true });
  });
})();
