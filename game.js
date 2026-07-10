/* =========================================================================
   game.js — Human // AI game engine
   ========================================================================= */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LS = {
    board:    'hai_board',
    settings: 'hai_settings',
    sound:    'hai_sound'
  };

  /* --------------------------- persistent state --------------------------- */
  const settings = load(LS.settings, { key: '', model: 'google/gemini-2.0-flash-001', live: false });
  let board = load(LS.board, []);
  let soundOn = load(LS.sound, true);

  function load(k, fallback){ try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } }
  function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

  /* ------------------------------- game state ----------------------------- */
  const game = {
    deck: [], idx: 0, score: 0, streak: 0, bestStreak: 0, correct: 0, total: 0, current: null
  };

  /* =============================== AUDIO ================================== */
  let actx = null;
  function ac(){ if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); return actx; }
  function tone(freq, start, dur, type = 'sine', gain = 0.18){
    const t = ac().currentTime + start;
    const o = ac().createOscillator(), g = ac().createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ac().destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function sfxRight(){ if (!soundOn) return; [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f, i*0.07, 0.28, 'triangle', 0.16)); }
  function sfxWrong(){ if (!soundOn) return; tone(180, 0, 0.3, 'sawtooth', 0.12); tone(120, 0.08, 0.34, 'sine', 0.14); }
  function sfxClick(){ if (!soundOn) return; tone(660, 0, 0.08, 'square', 0.06); }

  /* ============================== CONFETTI =============================== */
  const cv = $('#confetti'), cx = cv.getContext('2d');
  let parts = [], raf = null;
  function sizeCanvas(){ cv.width = innerWidth; cv.height = innerHeight; }
  addEventListener('resize', sizeCanvas); sizeCanvas();
  const CONF = ['#ff5d73','#ffb03a','#6c5cff','#12c7c7','#ffffff'];
  function confetti(n = 130){
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i=0;i<n;i++) parts.push({
      x: innerWidth/2 + (Math.random()-.5)*120, y: innerHeight*0.4,
      vx:(Math.random()-.5)*11, vy:Math.random()*-13-4, g:0.32+Math.random()*0.12,
      s:6+Math.random()*7, rot:Math.random()*6.28, vr:(Math.random()-.5)*0.35,
      c:CONF[(Math.random()*CONF.length)|0], life:90+Math.random()*40
    });
    if (!raf) tick();
  }
  function tick(){
    cx.clearRect(0,0,cv.width,cv.height);
    parts = parts.filter(p => p.life-- > 0 && p.y < cv.height+40);
    parts.forEach(p => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      cx.save(); cx.translate(p.x,p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
      cx.fillRect(-p.s/2,-p.s/2,p.s,p.s*0.6); cx.restore();
    });
    raf = parts.length ? requestAnimationFrame(tick) : (cx.clearRect(0,0,cv.width,cv.height), null);
  }

  /* ============================== SCREENS ================================ */
  function show(id){ $$('.screen').forEach(s => s.classList.toggle('is-active', s.id === id)); }

  /* =========================== DECK BUILDING ============================= */
  function shuffle(a){ a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a; }

  function buildDeck(len){
    const pool = shuffle(window.CONTENT_BANK);
    // interleave sources so it isn't clumped human/human/human
    const humans = pool.filter(x => x.source === 'human');
    const ais    = pool.filter(x => x.source === 'ai');
    const woven = [];
    const maxLen = Math.max(humans.length, ais.length);
    for (let i=0;i<maxLen;i++){ if (humans[i]) woven.push(humans[i]); if (ais[i]) woven.push(ais[i]); }

    const specs = [];
    const liveOn = settings.live && settings.key;
    for (let i=0;i<len;i++){
      const bankItem = woven[i % woven.length];
      // ~40% of eligible slots become live AI rounds (text/code only)
      if (liveOn && Math.random() < 0.4){
        specs.push({ kind:'live', type: Math.random() < 0.5 ? 'text' : 'code', fallback: bankItem });
      } else {
        specs.push({ kind:'bank', item: bankItem });
      }
    }
    return shuffle(specs);
  }

  /* ============================== RENDER ================================= */
  const stage = $('#contentStage');
  const esc = s => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  function renderContent(item){
    $('#roundType').textContent = ({text:'Text', code:'Code', art:'Artwork', image:'Image', voice:'Voice'})[item.type];
    $('#voiceControls').classList.add('hidden');
    speechSynthesis && speechSynthesis.cancel();

    if (item.type === 'text'){
      stage.innerHTML = `<p class="c-text">${esc(item.content)}</p>`;
    } else if (item.type === 'code'){
      stage.innerHTML = `<pre class="c-code"><span class="lang">${esc(item.lang||'code')}</span>${esc(item.content)}</pre>`;
    } else if (item.type === 'art' || item.type === 'image'){
      stage.innerHTML = `<div class="c-art">${item.content}</div>`;  // svg is from our trusted bank
    } else if (item.type === 'voice'){
      const bars = Array.from({length:14}).map((_,i)=>`<i style="animation-delay:${(i*0.08).toFixed(2)}s"></i>`).join('');
      stage.innerHTML = `<div class="c-voice"><div class="wave">${bars}</div>
        <p class="voice-hint">Press play and listen — is the <em>writing</em> human or AI?</p></div>`;
      $('#voiceControls').classList.remove('hidden');
    }
  }

  function renderLoading(){
    stage.innerHTML = `<p class="c-text" style="color:var(--ink-soft)">⚡ generating a fresh sample…</p>`;
    $('#roundType').textContent = 'Live';
  }

  /* =============================== VOICE ================================= */
  let voiceUtter = null;
  function speak(text){
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    voiceUtter = new SpeechSynthesisUtterance(text);
    voiceUtter.rate = 1; voiceUtter.pitch = 1;
    const vs = speechSynthesis.getVoices();
    const pref = vs.find(v => /en[-_]/i.test(v.lang)) || vs[0];
    if (pref) voiceUtter.voice = pref;
    const wave = $('.c-voice');
    voiceUtter.onstart = () => wave && wave.classList.add('playing');
    voiceUtter.onend   = () => wave && wave.classList.remove('playing');
    speechSynthesis.speak(voiceUtter);
  }
  $('#playVoice').addEventListener('click', () => { if (game.current) speak(game.current.content); });

  /* ============================== ROUNDS ================================= */
  async function loadRound(){
    const spec = game.deck[game.idx];
    $('#roundNow').textContent = game.idx + 1;
    $('#progBar').style.width = ((game.idx) / game.deck.length * 100) + '%';
    enableGuess(true);

    if (spec.kind === 'live'){
      renderLoading();
      try {
        game.current = await window.OpenRouter.generate({ apiKey: settings.key, model: settings.model, type: spec.type });
      } catch (e){
        game.current = spec.fallback; // graceful fallback to the curated bank
      }
    } else {
      game.current = spec.item;
    }
    renderContent(game.current);
  }

  function enableGuess(on){
    $('#guessHuman').disabled = !on;
    $('#guessAI').disabled = !on;
  }

  function guess(choice){
    if (!game.current || $('#guessHuman').disabled) return;
    enableGuess(false);
    sfxClick();
    const truth = game.current.source;
    const right = choice === truth;
    game.total++;
    if (right){
      game.correct++;
      game.streak++;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      const gained = 100 + (game.streak - 1) * 20;
      animateNumber($('#scoreNow'), game.score, game.score + gained, 500);
      game.score += gained;
      sfxRight();
    } else {
      game.streak = 0;
      sfxWrong();
    }
    $('#streakNow').innerHTML = game.streak + '<span class="flame">🔥</span>';
    reveal(right, truth);
  }

  /* ============================== REVEAL ================================= */
  function reveal(right, truth){
    const box = $('#reveal');
    const needle = $('#meterNeedle');
    const verdict = $('#revealVerdict');
    const truthEl = $('#revealTruth');

    needle.style.left = '50%';
    verdict.className = 'reveal-verdict ' + (right ? 'ok' : 'no');
    verdict.textContent = right ? 'Correct!' : 'Not quite';
    truthEl.innerHTML = `It was <strong>${truth === 'human' ? 'Human' : 'AI'}</strong>${game.current.live ? ' — live-generated just now' : ''}.`;

    const tells = $('#revealTells');
    tells.innerHTML = (game.current.tells || []).map(t => `<li>${esc(t)}</li>`).join('');

    box.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      needle.style.left = truth === 'human' ? '10%' : '90%';
    }));
    if (right) confetti();

    // stop any voice playback on reveal
    speechSynthesis && speechSynthesis.cancel();
  }

  $('#nextBtn').addEventListener('click', () => {
    $('#reveal').classList.add('hidden');
    game.idx++;
    if (game.idx >= game.deck.length) finish();
    else loadRound();
  });

  /* ============================== FINISH ================================= */
  function finish(){
    $('#progBar').style.width = '100%';
    const acc = game.total ? Math.round(game.correct / game.total * 100) : 0;

    $('#finalScore').textContent   = game.score;
    $('#finalCorrect').textContent = `${game.correct} / ${game.total}`;
    $('#finalStreak').textContent  = game.bestStreak;

    // accuracy ring
    const ring = $('#ringFill'), C = 327;
    ring.style.strokeDashoffset = C;
    animateNumber($('#accPct'), 0, acc, 900, v => v + '%');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ring.style.strokeDashoffset = C - (C * acc / 100);
      ring.style.stroke = acc >= 70 ? 'var(--good)' : acc >= 40 ? 'var(--ai)' : 'var(--human)';
    }));

    // rank label
    $('#resultRank').textContent =
      acc === 100 ? 'Flawless — you see through the machine' :
      acc >= 80  ? 'Sharp eye' :
      acc >= 50  ? 'Not bad at all' : 'The machines are winning';

    // leaderboard qualification
    const qualifies = board.length < 10 || game.score > Math.min(...board.map(b => b.score));
    const entry = $('#nameEntry');
    entry.classList.toggle('hidden', !(qualifies && game.score > 0));
    if (qualifies && game.score > 0){ $('#nameInput').value = ''; setTimeout(() => $('#nameInput').focus(), 400); }

    renderBoard($('#resultBoard'));
    if (acc >= 80) setTimeout(() => confetti(180), 300);
    show('screen-results');
  }

  $('#saveScore').addEventListener('click', saveEntry);
  $('#nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveEntry(); });
  function saveEntry(){
    const name = ($('#nameInput').value.trim() || 'anon').slice(0, 14);
    board.push({ name, score: game.score, acc: game.total ? Math.round(game.correct/game.total*100) : 0, date: Date.now() });
    board.sort((a,b) => b.score - a.score);
    board = board.slice(0, 10);
    save(LS.board, board);
    $('#nameEntry').classList.add('hidden');
    renderBoard($('#resultBoard'));
    renderBoard($('#startBoard'));
  }

  /* ============================ LEADERBOARD ============================== */
  function renderBoard(el){
    if (!board.length){ el.innerHTML = '<li class="board-empty">No scores yet — be the first.</li>'; return; }
    el.innerHTML = board.map(b =>
      `<li><span class="bl-name">${esc(b.name)}</span>
        <span class="bl-acc">${b.acc}%</span>
        <span class="bl-score">${b.score}</span></li>`).join('');
  }

  /* =========================== number tween ============================= */
  function animateNumber(el, from, to, dur, fmt = v => v){
    const t0 = performance.now();
    (function step(t){
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ============================ start game ============================== */
  let chosenLen = 8;
  function startGame(){
    try { ac().resume(); } catch {}
    Object.assign(game, { deck: buildDeck(chosenLen), idx:0, score:0, streak:0, bestStreak:0, correct:0, total:0, current:null });
    $('#roundTot').textContent = chosenLen;
    $('#scoreNow').textContent = '0';
    $('#streakNow').innerHTML = '0<span class="flame">🔥</span>';
    show('screen-game');
    loadRound();
  }

  /* ============================== WIRING ================================ */
  $('#startBtn').addEventListener('click', startGame);
  $('#againBtn').addEventListener('click', () => { renderBoard($('#startBoard')); show('screen-start'); });
  $('#guessHuman').addEventListener('click', () => guess('human'));
  $('#guessAI').addEventListener('click', () => guess('ai'));

  $$('.len').forEach(b => b.addEventListener('click', () => {
    $$('.len').forEach(x => x.classList.remove('is-on'));
    b.classList.add('is-on'); chosenLen = +b.dataset.len;
  }));

  // sound toggle
  const soundBtn = $('#soundBtn');
  function paintSound(){ soundBtn.setAttribute('aria-pressed', String(soundOn)); }
  paintSound();
  soundBtn.addEventListener('click', () => { soundOn = !soundOn; save(LS.sound, soundOn); paintSound(); if (soundOn) sfxClick(); });

  /* ============================= SETTINGS =============================== */
  const modal = $('#settingsModal');
  function openSettings(){
    $('#keyInput').value   = settings.key || '';
    $('#modelInput').value = settings.model || 'google/gemini-2.0-flash-001';
    $('#liveToggle').checked = !!settings.live;
    $('#settingsMsg').textContent = ''; $('#settingsMsg').className = 'settings-msg';
    modal.classList.remove('hidden');
  }
  function closeSettings(){ modal.classList.add('hidden'); }
  $('#settingsBtn').addEventListener('click', openSettings);
  $('#closeSettings').addEventListener('click', closeSettings);
  modal.addEventListener('click', e => { if (e.target === modal) closeSettings(); });

  $('#saveSettings').addEventListener('click', () => {
    settings.key = $('#keyInput').value.trim();
    settings.model = $('#modelInput').value.trim() || 'google/gemini-2.0-flash-001';
    settings.live = $('#liveToggle').checked;
    save(LS.settings, settings);
    reflectLive();
    const msg = $('#settingsMsg'); msg.className = 'settings-msg ok';
    msg.textContent = settings.live && settings.key ? 'Saved — live rounds on.' : 'Saved.';
    setTimeout(closeSettings, 700);
  });

  $('#testKey').addEventListener('click', async () => {
    const msg = $('#settingsMsg'); msg.className = 'settings-msg'; msg.textContent = 'Testing…';
    const key = $('#keyInput').value.trim();
    const model = $('#modelInput').value.trim() || 'google/gemini-2.0-flash-001';
    if (!key){ msg.className = 'settings-msg err'; msg.textContent = 'Enter a key first.'; return; }
    try {
      await window.OpenRouter.test({ apiKey: key, model });
      msg.className = 'settings-msg ok'; msg.textContent = '✓ Key works.';
    } catch (e){
      msg.className = 'settings-msg err'; msg.textContent = '✕ ' + (e.message || 'Failed.');
    }
  });

  function reflectLive(){ $('#liveHint').classList.toggle('hidden', !(settings.live && settings.key)); }

  // Esc closes overlays
  addEventListener('keydown', e => { if (e.key === 'Escape'){ closeSettings(); } });

  /* preload TTS voices (Chrome loads async) */
  if ('speechSynthesis' in window){ speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }

  /* --------------------------------- init -------------------------------- */
  renderBoard($('#startBoard'));
  reflectLive();
})();