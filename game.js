/* =========================================================================
   game.js — Human // AI game engine
   ========================================================================= */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LS = {
    board:    'hai_board',
    sound:    'hai_sound'
  };

  /* --------------------------- persistent state --------------------------- */
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
    for (let i=0;i<len;i++){
      specs.push({ item: woven[i % woven.length] });
    }
    return shuffle(specs);
  }

  /* ============================== RENDER ================================= */
  const stage = $('#contentStage');
  const esc = s => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  function renderContent(item){
    $('#roundType').textContent = ({text:'Text', code:'Code', art:'Artwork', image:'Image', voice:'Voice'})[item.type];
    $('#voiceControls').classList.add('hidden');
    if ('speechSynthesis' in window) stopVoice();

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

  /* =============================== VOICE ================================= */
  // NOTE: speechSynthesis.pause() is unreliable across browsers (notably Chrome,
  // where it often keeps talking until the utterance ends instead of stopping
  // immediately). To get a pause that actually stops instantly, we split the
  // passage into sentences and use cancel() — which *is* reliable — to stop,
  // remembering which sentence to resume from next.
  const playBtn = $('#playVoice');
  let vq = null;           // { sentences, idx }
  let activeUtter = null;  // the SpeechSynthesisUtterance currently in flight, if any

  function setPlayBtn(state){
    if (state === 'pause')       playBtn.innerHTML = '⏸ Pause';
    else if (state === 'resume') playBtn.innerHTML = '▶ Resume';
    else                          playBtn.innerHTML = '▶ Play clip';
  }

  function splitSentences(text){
    return (text.match(/[^.!?]+[.!?]*/g) || [text]).map(s => s.trim()).filter(Boolean);
  }

  // cancel() reliably stops audio instantly, unlike pause() which can lag in some
  // browsers (notably Chrome). We mark the in-flight utterance as deliberately
  // cancelled *before* calling cancel(), so its (possibly async) onend/onerror
  // knows to no-op instead of being mistaken for the sentence finishing naturally.
  function cancelActive(){
    if (activeUtter) activeUtter._cancelled = true;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    activeUtter = null;
  }

  function stopVoice(){
    cancelActive();
    vq = null;
    const wave = $('.c-voice');
    wave && wave.classList.remove('playing');
    setPlayBtn('play');
  }

  function speakFromQueue(){
    if (!vq || vq.idx >= vq.sentences.length){
      stopVoice();
      return;
    }
    const wave = $('.c-voice');
    const u = new SpeechSynthesisUtterance(vq.sentences[vq.idx]);
    u.rate = 1; u.pitch = 1;
    const vs = speechSynthesis.getVoices();
    const pref = vs.find(v => /en[-_]/i.test(v.lang)) || vs[0];
    if (pref) u.voice = pref;
    activeUtter = u;

    u.onstart = () => { wave && wave.classList.add('playing'); setPlayBtn('pause'); };
    const advance = () => {
      if (u._cancelled) return;        // this end/error came from a deliberate cancel — ignore
      if (!vq) return;
      vq.idx++;
      if (vq.idx >= vq.sentences.length){ stopVoice(); }
      else { speakFromQueue(); }       // seamlessly continue to the next sentence
    };
    u.onend = advance;
    u.onerror = advance;
    speechSynthesis.speak(u);
  }

  playBtn.addEventListener('click', () => {
    if (!game.current || !('speechSynthesis' in window)) return;

    if (!vq){
      vq = { sentences: splitSentences(game.current.content), idx: 0 };
      speakFromQueue();
    } else if ($('.c-voice')?.classList.contains('playing')){
      // currently playing → pause: cancel() stops instantly and reliably
      cancelActive();
      $('.c-voice')?.classList.remove('playing');
      setPlayBtn('resume');
    } else {
      // paused → resume from the same sentence
      speakFromQueue();
    }
  });

  /* ============================== ROUNDS ================================= */
  async function loadRound(){
    const spec = game.deck[game.idx];
    $('#roundNow').textContent = game.idx + 1;
    $('#progBar').style.width = ((game.idx) / game.deck.length * 100) + '%';
    enableGuess(true);
    game.current = spec.item;
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
    truthEl.innerHTML = `It was <strong>${truth === 'human' ? 'Human' : 'AI'}</strong>.`;

    const tells = $('#revealTells');
    tells.innerHTML = (game.current.tells || []).map(t => `<li>${esc(t)}</li>`).join('');

    box.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      needle.style.left = truth === 'human' ? '10%' : '90%';
    }));
    if (right) confetti();

    // stop any voice playback on reveal
    stopVoice();
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

  /* preload TTS voices (Chrome loads async) */
  if ('speechSynthesis' in window){ speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }

  /* --------------------------------- init -------------------------------- */
  renderBoard($('#startBoard'));
})();