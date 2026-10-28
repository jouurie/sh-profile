/* Keep the same character order on every introduction site. */
(() => {
  
  const header = document.querySelector('.site-header');
  if (!header || header.querySelector('.character-switcher')) return;
  const menu = document.createElement('details');
  menu.className = 'character-switcher';
  const trigger = document.createElement('summary');
  trigger.setAttribute('aria-label','다른 캐릭터');trigger.title='다른 캐릭터';trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/></svg>';
  const mark = document.createElement('span');
  mark.className = 'character-switch-mark'; mark.setAttribute('aria-hidden', 'true'); mark.textContent = '+';
  trigger.append(mark);
  const list = document.createElement('ul'); list.className = 'character-switch-list';
  const characters = [
    { id: 'home', name: '소개 페이지', href: 'https://jouurie.github.io/' },
    { id: 'ww', name: '와이어트, 웨이드', href: 'https://jouurie.github.io/ww-profile/' },
    { id: 'ig', name: '이결', href: 'https://jouurie.github.io/ig-profile/' },
    { id: 'sh', name: '세혁', href: 'https://jouurie.github.io/sh-profile/' }
  ];
  characters.forEach(character => {
    const item = document.createElement('li');
    const current = character.id === 'sh';
    const row = document.createElement(current ? 'span' : 'a');
    row.className = 'character-switch-row' + (current ? ' is-current' : '');
    if (current) row.setAttribute('aria-current', 'true'); else row.href = character.href;
    const name = document.createElement('span'); name.textContent = character.name;
    const state = document.createElement('small'); state.textContent = current ? '현재 소개' : character.id === 'home' ? '전체 캐릭터 ↗' : '소개 바로가기 ↗';
    row.append(name, state); item.append(row); list.append(item);
  });
  const style=document.createElement('style');
  style.textContent=`.site-header{column-gap:20px}.character-switcher{position:relative;flex:0 0 auto;margin-left:auto}.character-switcher>summary{display:flex;align-items:center;gap:12px;padding:7px 10px;min-height:34px;border:1px solid var(--line);font-size:12px;line-height:1.5;list-style:none;white-space:nowrap;cursor:pointer}.character-switcher>summary::-webkit-details-marker{display:none}.character-switcher>summary:is(:hover,:active,:focus-visible){outline:none;box-shadow:none;transform:none;background:var(--ink);color:var(--paper)}.character-switch-list{position:absolute;right:0;top:calc(100% + 8px);width:280px;max-width:calc(100vw - 32px);list-style:none;margin:0;padding:6px;background:var(--paper);border:1px solid var(--line);z-index:110}.character-switch-row{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:44px;padding:10px;font-size:13px;text-decoration:none}.character-switch-row small{font-size:11px;white-space:nowrap}.character-switch-row.is-current{color:var(--red);background:color-mix(in srgb,var(--red) 7%,var(--paper))}.character-switch-row:is(:hover,:active,:focus-visible){outline:none;box-shadow:none;transform:none;color:var(--paper);background:var(--ink)}@media(max-width:1150px){.site-header{height:auto;min-height:108px;flex-wrap:wrap;gap:8px 16px;padding-block:16px}.site-header nav{order:3;flex-basis:100%;flex-wrap:wrap;justify-content:flex-start}.character-switcher{order:2}.site-header .brand{order:1}}@media(max-width:540px){.character-switcher>summary{font-size:11px;padding:6px 8px;gap:6px}.site-header .brand{font-size:19px}.character-switch-list{width:260px}}`;
  style.textContent += "\n.site-header{display:flex;flex-wrap:nowrap;height:92px;min-height:0;gap:12px;padding:0;align-items:center;justify-content:flex-start}\n.site-header .brand{order:0;min-width:0;flex:0 0 auto;font-size:21px;gap:8px}\n.site-header .brand svg{width:28px;height:28px}\n.site-header nav{order:0;min-width:0;flex:1 1 auto;flex-basis:auto;display:flex;flex-wrap:nowrap;justify-content:flex-end;gap:10px;overflow-x:auto;scrollbar-width:none}\n.site-header nav::-webkit-scrollbar{display:none}\n.site-header nav a{flex:0 0 auto;font-size:12px}\n.character-switcher{order:0;margin:0;flex:0 0 42px;width:42px;min-width:42px}\n.character-switcher>summary{width:42px;height:36px;min-height:36px;box-sizing:border-box;justify-content:center;padding:6px 4px;border:1px solid var(--ink);gap:3px;transform:none!important;box-shadow:none!important}\n.character-switcher>summary svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5;flex:0 0 18px}\n.character-switch-mark{display:inline-block;flex:0 0 9px;width:9px;text-align:center;font:14px/1 sans-serif}\n.character-switch-list{border-color:var(--ink);max-width:min(280px,calc(100vw - 40px))}\n@media(max-width:540px){.site-header{height:72px;gap:10px}.site-header .brand{font-size:15px;gap:6px;white-space:nowrap}.site-header .brand svg{width:20px;height:20px;flex:0 0 20px}.site-header .brand small{display:none}.site-header nav{justify-content:flex-start;gap:14px}.site-header nav a{font-size:12px}.character-switcher>summary{padding:6px 4px;gap:3px}}\n";
  document.head.append(style);
  menu.append(trigger, list); header.append(menu);
  menu.addEventListener('toggle',()=>{mark.textContent=menu.open?'×':'+';});
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.open) { menu.open = false; trigger.focus(); } });
  const nav=header.querySelector('nav');
  if(nav){
    const rail=document.createElement('div');rail.className='sh-nav-rail';
    const before=document.createElement('button'),after=document.createElement('button');
    before.type=after.type='button';before.className=after.className='sh-nav-arrow';
    before.setAttribute('aria-label','이전 메뉴 보기');after.setAttribute('aria-label','다음 메뉴 보기');
    before.title='이전 메뉴 보기';after.title='다음 메뉴 보기';
    before.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3-5 5 5 5"/></svg>';
    after.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>';
    nav.before(rail);rail.append(before,nav,after);
    function update(){const overflow=nav.scrollWidth>nav.clientWidth+2;rail.classList.toggle('has-overflow',overflow);before.disabled=nav.scrollLeft<2;after.disabled=nav.scrollLeft>=nav.scrollWidth-nav.clientWidth-2;}
    before.addEventListener('click',()=>nav.scrollBy({left:-Math.max(80,nav.clientWidth*.8),behavior:'smooth'}));
    after.addEventListener('click',()=>nav.scrollBy({left:Math.max(80,nav.clientWidth*.8),behavior:'smooth'}));
    nav.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(nav);document.fonts.ready.then(update);update();
  }
})();
