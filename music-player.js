(() => {
  'use strict';
  const tracks = window.SH_TRACKS;
  const videoIds = tracks.map(track => track.id);
  const displayTrack = track => {
    const match = track.title.match(/^(.*?)\s*\((feat\..*)\)$/);
    return { title: match ? match[1] : track.title, artist: track.artist + (match ? '·' + match[2] : '') };
  };
  const $ = id => document.getElementById(id);
  const play = $('track-play'), seek = $('track-seek'), volume = $('track-volume'), mute = $('track-mute');
  let preferredVolume = Number(volume.value), lastAudibleVolume = preferredVolume || 50;
  let selected = 0, widget, ready = false, playing = false, duration = 0, repeatOne = false, failed = false, dead = false;
  let loadTimer, requestTimer;
  const setStatus = text => { $('player-status').textContent = text; };
  const clock = ms => {
    const seconds = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  };
  function playbackState(value) {
    playing = value;
    play.innerHTML = value ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>'; document.querySelector('.record-disc').classList.toggle('is-playing',value);
    play.setAttribute('aria-label', value ? '일시정지' : '재생');
    play.title = play.getAttribute('aria-label');
    play.setAttribute('aria-pressed', String(value));
  }
  function progress(position) {
    $('track-elapsed').textContent = clock(position);
    $('track-duration').textContent = clock(duration);
    seek.value = String(duration ? Math.min(100, Math.max(0, position / duration * 100)) : 0);
    seek.setAttribute('aria-valuetext', clock(position) + ' / ' + clock(duration));
    seek.style.setProperty('--played', seek.value + '%');
    seek.disabled = !ready || !duration;
  }
  function controls() {
    play.disabled = !ready;
    volume.disabled = !ready;
    mute.disabled = !ready;
    seek.disabled = !ready || !duration;
  }
  function clearTimers() {
    window.clearTimeout(loadTimer);
    window.clearTimeout(requestTimer);
  }
  function failure(message) {
    clearTimers();
    failed = true;
    playbackState(false);
    setStatus(message + ' 원본 링크에서 들어 주세요.');
  }
  function waitForPlay() {
    window.clearTimeout(requestTimer);
    requestTimer = window.setTimeout(() => {
      if (!dead && !playing && !failed) setStatus('재생이 시작되지 않았습니다. 재생을 다시 누르거나 원본 링크를 이용해 주세요.');
    }, 10000);
  }
  const buttons = tracks.map((track, index) => {
    const li = document.createElement('li'), button = document.createElement('button');
    const text = document.createElement('span'), title = document.createElement('b'), artist = document.createElement('small');
    button.type = 'button';
    button.className = 'track-button';
    const display = displayTrack(track);
    title.textContent = display.title;
    artist.textContent = display.artist;
    text.append(title, artist);
    button.append(text);
    button.addEventListener('click', () => {
      if (index === selected && ready) requestPlay();
      else select(index, ready);
    });
    li.append(button);
    $('track-list').append(li);
    return button;
  });
  const currentURL = () => 'https://www.youtube.com/watch?v=' + videoIds[selected];
  function select(index, start = false) {
    clearTimers();
    selected = (index + tracks.length) % tracks.length;
    failed = false;
    duration = 0;
    const track = tracks[selected]; $('track-number').textContent = String(selected + 1).padStart(2, '0');
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === selected)));
    $('track-title').textContent = displayTrack(track).title;
    $('track-title').title = track.title;
    $('track-artist').textContent = displayTrack(track).artist;
    $('track-link').href = track.url;
    $('track-link').setAttribute('aria-label', track.artist + ' - ' + track.title + ' 원본에서 듣기 (새 탭)');
    playbackState(false);
    progress(0);
    if (!ready) return;
    // Same load/auto_play contract as the original Tistory/Rhodes toolbar.
    widget.load(currentURL(), { auto_play: start });
    applyVolume();
    setStatus(start ? '음악을 불러오고 있습니다.' : '재생 버튼을 눌러 주세요.');
    if (start) waitForPlay();
  }
  function requestPlay() {
    if (!ready) return;
    if (playing) {
      window.clearTimeout(requestTimer);
      widget.pause();
    } else {
      if (failed) { failed = false; widget.load(currentURL(), { auto_play: true }); }
      else widget.play();
      setStatus('재생을 요청했습니다.');
      waitForPlay();
    }
  }
  $('track-prev').addEventListener('click', () => select(selected - 1, ready));
  $('track-next').addEventListener('click', () => select(selected + 1, ready));
  play.addEventListener('click', requestPlay);
  seek.addEventListener('input', () => {
    if (widget && ready && duration) {
      const position = Number(seek.value) / 100 * duration;
      widget.seekTo(position);
      progress(position);
    }
  });
  const clampVolume = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  function renderVolume(value, muted) {
    value = clampVolume(value);
    if (value > 0) lastAudibleVolume = value;
    const silent = muted || value === 0, shown = silent ? 0 : value;
    volume.value = String(shown);
    volume.style.setProperty('--volume', shown + '%');
    volume.setAttribute('aria-valuetext', silent ? '음소거' : shown + '%');
    $('track-volume-value').textContent = shown + '%';
    mute.setAttribute('aria-pressed', String(silent));
    mute.setAttribute('aria-label', silent ? '음소거 해제' : '음소거');
    mute.title = mute.getAttribute('aria-label');
  }
  function applyVolume() {
    if (!widget || !ready) return;
    widget.setVolume(preferredVolume);
    widget.setMuted(preferredVolume === 0);
  }
  function setVolume(value) {
    if (!widget || !ready) return;
    value = clampVolume(value);
    preferredVolume = value;
    applyVolume();
    renderVolume(value, value === 0);
  }
  volume.addEventListener('input', () => setVolume(volume.value));
  mute.addEventListener('click', () => setVolume(mute.getAttribute('aria-pressed') === 'true' ? lastAudibleVolume : 0));
  volume.closest('.track-volume').addEventListener('wheel', event => {
    if (volume.disabled || event.ctrlKey || !event.deltaY) return;
    event.preventDefault();
    setVolume(Number(volume.value) + (event.deltaY < 0 ? 5 : -5));
  }, { passive: false });
  renderVolume(volume.value, Number(volume.value) === 0);
  $('track-repeat').addEventListener('click', () => {
    repeatOne = !repeatOne;
    $('track-repeat').setAttribute('aria-pressed', String(repeatOne));
    $('track-repeat').setAttribute('aria-label', repeatOne ? '한 곡 반복 끄기' : '한 곡 반복 켜기');
    $('track-repeat').title = $('track-repeat').getAttribute('aria-label');
    $('track-repeat').title = repeatOne ? '한 곡 반복 끄기' : '한 곡 반복 켜기';
  });
  $('track-repeat').title = '한 곡 반복 켜기';
  select(0);
  controls();
  async function connect() {
    try {
      await window.RieYouTube.sdk();
      if (dead) return;
      loadTimer = window.setTimeout(() => { if (!ready && !dead) failure('플레이어 연결이 지연되고 있습니다.'); }, 15000);
      widget = window.RieYouTube.create('youtube-player', currentURL(), {
        ready() {
          if (dead) return;
          window.clearTimeout(loadTimer);
          ready = true;
          failed = false;
          setVolume(Number(volume.value));
          widget.load(currentURL(), { auto_play: false });
          controls();
          setStatus('');
        },
        play() { if (dead) return; failed = false; window.clearTimeout(requestTimer); applyVolume(); playbackState(true); setStatus(''); },
        pause() { if (dead) return; playbackState(false); if (!failed) setStatus(''); },
        volume(value, muted) {
          if (dead) return;
          const level = clampVolume(value), expectedMuted = preferredVolume === 0;
          if (level !== preferredVolume || Boolean(muted) !== expectedMuted) {
            if (playing) applyVolume();
            return;
          }
          renderVolume(preferredVolume, expectedMuted);
        },
        progress(position, total) { if (dead || failed) return; duration = total; progress(position); },
        finish() {
          if (dead) return;
          if (repeatOne && ready) { widget.seekTo(0); widget.play(); }
          else select(selected + 1, true);
        },
        error(code) { if (!dead) failure('이 곡은 페이지에서 재생할 수 없습니다. (YouTube ' + code + ')'); },
        blocked() { if (dead) return; window.clearTimeout(requestTimer); playbackState(false); setStatus('브라우저가 재생을 보류했습니다. 재생을 다시 눌러 주세요.'); }
      });
    } catch {
      if (!dead) failure('YouTube 플레이어를 불러오지 못했습니다.');
    }
  }
  window.addEventListener('pagehide', () => {
    dead = true;
    clearTimers();
    widget?.pause();
    widget?.destroy();
    widget = null;
    ready = false;
  });
  window.addEventListener('pageshow', event => { if (event.persisted) { dead = false; controls(); connect(); } });
  let started=false; function startOnPlaylist(){if(!started&&location.hash==='#playlist'){started=true;connect();}} addEventListener('hashchange',startOnPlaylist); startOnPlaylist();
})();

/* Function hints stay within the viewport and follow current control state. */
(() => {
 if(window.IG_FRAME_SHELL||window.CR_FRAME_SHELL)return;
 const tip=document.createElement('span');tip.className='player-function-tip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip);
 let active;
 const selector='.player-controls button,.player-controls a,#track-mute,.sh-nav-arrow';
 function show(event){const target=event.target.closest?.(selector);if(!target)return;active=target;
  const text=target.id==='track-link'?'원본에서 듣기':target.getAttribute('aria-label')||target.title;
  if(!text)return;target.removeAttribute('title');tip.textContent=text;tip.hidden=false;
  const r=target.getBoundingClientRect(),t=tip.getBoundingClientRect();
  tip.style.left=Math.max(6,Math.min(innerWidth-t.width-6,r.left+r.width/2-t.width/2))+'px';
  tip.style.top=(r.bottom+t.height+8<innerHeight?r.bottom+6:Math.max(6,r.top-t.height-6))+'px';
 }
 function hide(event){if(event?.relatedTarget&&active?.contains(event.relatedTarget))return;tip.hidden=true;active=null;}
 document.addEventListener('pointerover',show);document.addEventListener('focusin',show);
 document.addEventListener('pointerout',hide);document.addEventListener('focusout',hide);
 document.addEventListener('pointerdown',hide);document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
 window.addEventListener('scroll',()=>hide(),true);window.addEventListener('resize',()=>hide());
})();
