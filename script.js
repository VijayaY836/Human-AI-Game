/* =========================================================
   SIGNAL/NOISE — Human or AI detection game
   ========================================================= */

/* ---------------------------------------------------------
   CONTENT BANK
   Every round has: category, kind (text|code|art|voice),
   content, isAI, explanation, and a short "source" label.
--------------------------------------------------------- */

const ART_HUMAN_1 = `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#151b2e"/>
  <path d="M40,220 C70,120 120,90 150,140 C170,175 140,210 175,190 C220,165 210,90 260,80 C300,72 320,130 300,170 C285,200 330,205 350,170"
        fill="none" stroke="#F0A868" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
  <path d="M60,230 C110,205 130,250 170,225 C205,205 230,255 270,220 C300,196 330,235 355,210"
        fill="none" stroke="#E8ECF4" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>
  <circle cx="128" cy="132" r="10" fill="#F72585" opacity="0.85"/>
  <circle cx="243" cy="101" r="6" fill="#4CC9F0" opacity="0.7"/>
  <path d="M300,235 Q305,245 296,248 Q288,250 292,240" fill="none" stroke="#93A0BE" stroke-width="2" opacity="0.6"/>
  <text x="330" y="280" font-family="monospace" font-size="11" fill="#93A0BE" opacity="0.6">— m.k. '24</text>
</svg>`;

const ART_HUMAN_2 = `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#171224"/>
  <path d="M50,60 L110,50 L100,140 L180,120 L170,230 L90,260 L60,180 Z" fill="#F72585" opacity="0.18"/>
  <path d="M55,65 L108,53 L98,138" fill="none" stroke="#F72585" stroke-width="3" opacity="0.8"/>
  <path d="M150,40 C210,55 240,110 210,150 C185,183 220,190 200,230 C185,258 240,250 260,220"
        fill="none" stroke="#FFB703" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
  <path d="M240,70 l14,-4 -3,15 z" fill="#4CC9F0" opacity="0.8"/>
  <path d="M300,180 q40,-10 55,25 q10,25 -20,35" fill="none" stroke="#E8ECF4" stroke-width="2" opacity="0.5"/>
  <circle cx="330" cy="90" r="3" fill="#E8ECF4" opacity="0.7"/>
  <circle cx="345" cy="100" r="2" fill="#E8ECF4" opacity="0.5"/>
</svg>`;

const ART_HUMAN_3 = `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#101826"/>
  <path d="M30,250 C80,190 60,120 130,110 C190,101 170,50 240,55 C300,59 290,120 350,110"
        fill="none" stroke="#4ADE80" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
  <path d="M40,150 q60,-40 90,10 q25,42 90,5 q45,-25 110,20" fill="none" stroke="#F0A868" stroke-width="2" opacity="0.55"/>
  <rect x="205" y="180" width="26" height="18" fill="#F72585" opacity="0.4" transform="rotate(-8 218 189)"/>
  <path d="M260,230 c8,-14 22,-6 18,10 c-3,12 -20,8 -18,-10z" fill="#4CC9F0" opacity="0.6"/>
  <text x="20" y="285" font-family="monospace" font-size="10" fill="#93A0BE" opacity="0.5">sketchbook, pg. 14</text>
</svg>`;

const ART_AI_1 = `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#4CC9F0"/>
      <stop offset="100%" stop-color="#0B0F1A"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="#0B0F1A"/>
  <g transform="translate(200,150)">
    ${Array.from({length: 12}).map((_,i)=>`<g transform="rotate(${i*30})"><path d="M0,0 L0,-110 A6,6 0 0 1 12,-104 L0,-14 A6,6 0 0 1 -12,-14 Z" fill="url(#g1)" opacity="0.85"/></g>`).join('')}
    <circle r="18" fill="#E8ECF4"/>
    <circle r="10" fill="#0B0F1A"/>
  </g>
  <circle cx="200" cy="150" r="130" fill="none" stroke="#4CC9F0" stroke-width="0.5" opacity="0.3"/>
  <circle cx="200" cy="150" r="145" fill="none" stroke="#4CC9F0" stroke-width="0.5" opacity="0.2"/>
</svg>`;

const ART_AI_2 = `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#0B0F1A"/>
  <g stroke="#F72585" stroke-width="1" opacity="0.5">
    ${Array.from({length: 9}).map((_,r)=>Array.from({length:12}).map((_,c)=>`<circle cx="${20+c*33}" cy="${20+r*30}" r="${4+ (Math.sin(r+c)>0?4:2)}" fill="${(r+c)%2===0?'#F72585':'#4CC9F0'}" opacity="0.55"/>`).join('')).join('')}
  </g>
  <rect x="0" y="0" width="400" height="300" fill="none" stroke="#93A0BE" stroke-width="1" opacity="0.15"/>
</svg>`;

const ART_AI_3 = `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#0B0F1A"/>
  <g transform="translate(200,150)">
    ${Array.from({length: 60}).map((_,i)=>{const a=(i/60)*Math.PI*2; const r=90+ (i%2===0?0:0); const x=Math.cos(a)*r; const y=Math.sin(a)*r; return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.2" fill="#FFB703" opacity="0.9"/>`}).join('')}
    ${Array.from({length: 30}).map((_,i)=>{const a=(i/30)*Math.PI*2; const r=55; const x=Math.cos(a)*r; const y=Math.sin(a)*r; return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.4" fill="#4CC9F0" opacity="0.9"/>`}).join('')}
    <circle r="20" fill="none" stroke="#E8ECF4" stroke-width="0.6" opacity="0.4"/>
  </g>
</svg>`;

const ROUNDS = [
  // ---------------- TEXT ----------------
  {
    category: "text", kind: "text", isAI: false,
    title: "Journal entry",
    content: "Missed the 7:42 again because the guy in 4B decided today was the day to argue with the elevator about it being too slow. Walked the eleven flights, which I will now pretend was intentional cardio. There's a puddle by the north exit that's basically achieved permanent resident status, has its own little ecosystem probably. Bought coffee I didn't need and forgot my badge for the third time this month, which the front desk guy no longer even reacts to, just slides me the visitor sticker with this tired little nod.",
    explanation: "Notice the specificity that serves no argumentative purpose — the elevator dispute, the puddle's \"ecosystem,\" the front desk guy's tired nod. Humans include irrelevant, oddly vivid details because that's genuinely what they remember. AI text tends to stay on-topic and purposeful."
  },
  {
    category: "text", kind: "text", isAI: true,
    title: "Blog intro",
    content: "In today's fast-paced world, maintaining a healthy work-life balance has never been more important. Whether you're a busy professional, a dedicated parent, or a student juggling multiple responsibilities, finding time for yourself can feel like an impossible task. In this article, we'll explore practical strategies to help you reclaim your time, reduce stress, and cultivate habits that support long-term wellbeing. Let's dive in.",
    explanation: "Classic AI-essay scaffolding: the throat-clearing opener (\"in today's fast-paced world\"), the audience triad (professional / parent / student), and the \"let's dive in\" transition. It's fluent and well-organized but says nothing yet — a structural tell more than a content one."
  },
  {
    category: "text", kind: "text", isAI: false,
    title: "Marketplace listing",
    content: "Selling my old kayak, used it maybe 5 times honestly. Has a scratch on the bottom from a rock I definitely should've seen coming, doesn't affect anything. Comes with paddle but not the life vest bc my dog chewed it up (don't ask). $120 or best offer, need it gone by Sunday cause my landlord is not a fan of it living in the hallway anymore lol",
    explanation: "Real inconsistency and self-deprecating asides (\"don't ask,\" \"lol\") that don't build toward anything — they're just how people actually talk. The messy honesty about the scratch and the dog is hard for a model to fake convincingly at this length."
  },
  {
    category: "text", kind: "text", isAI: true,
    title: "Product description",
    content: "Elevate your everyday routine with this versatile, ergonomically designed water bottle. Crafted from premium, BPA-free materials, it seamlessly combines style and functionality to keep your beverages at the perfect temperature all day long. Whether you're hitting the gym, heading to the office, or exploring the great outdoors, this bottle is the perfect companion for an active lifestyle.",
    explanation: "The giveaway vocabulary cluster — \"elevate,\" \"seamlessly,\" \"perfect companion,\" the gym/office/outdoors triad — is extremely common in generated marketing copy. It's grammatically flawless and emotionally flat, optimizing for coverage rather than a specific voice."
  },
  {
    category: "text", kind: "text", isAI: false,
    title: "Group chat message",
    content: "ok so the venue guy just called and apparently they double booked us with a QUINCEAÑERA. like a whole quinceañera. he's offering us the Tuesday before instead which,, no. I already told him no but wanted to vent first. anyway does anyone actually know if uncle Ray is coming bc the seating chart depends on it and he hasn't answered literally anyone",
    explanation: "The run-on structure, the mid-sentence trailing punctuation (\",,\"), and jumping from crisis to an unrelated logistical question in the same breath — that associative, unfiltered flow is very human. AI text rarely abandons a thought mid-stride like this."
  },
  {
    category: "text", kind: "text", isAI: true,
    title: "Advice answer",
    content: "There are several factors to consider when deciding whether to change careers. On one hand, pursuing a new path can lead to greater fulfillment, growth opportunities, and renewed motivation. On the other hand, it's important to weigh the financial implications, potential loss of seniority, and the time it may take to build new skills. Ultimately, the right choice depends on your personal circumstances, risk tolerance, and long-term goals.",
    explanation: "Perfectly balanced on-the-one-hand/on-the-other-hand structure with no actual opinion or lived stake in the outcome. It's a fair summary of considerations, not an answer from someone who has anything on the line — a hallmark of hedged AI advice."
  },

  // ---------------- CODE ----------------
  {
    category: "code", kind: "code", isAI: false,
    title: "utils.py",
    content: `def parse_time(s):
    # ugh this format again, sometimes has ms sometimes doesnt
    if '.' in s:
        s = s.split('.')[0]
    h, m, sec = s.split(':')
    return int(h)*3600 + int(m)*60 + int(sec)

# TODO: handle negative offsets, breaks on the export from old system
def diff(a, b):
    return parse_time(b) - parse_time(a)`,
    explanation: "The comment \"ugh this format again\" and the unresolved TODO pointing at a specific known-broken edge case read like a real person mid-project, not a documentation pass. There's no docstring, no type hints — just a quick fix that works for now."
  },
  {
    category: "code", kind: "code", isAI: true,
    title: "time_utils.py",
    content: `def parse_time(time_str: str) -> int:
    """
    Convert a time string in HH:MM:SS format to total seconds.

    Args:
        time_str (str): The time string to parse.

    Returns:
        int: The total number of seconds.

    Raises:
        ValueError: If the input string is not in the expected format.
    """
    try:
        hours, minutes, seconds = map(int, time_str.split(':'))
        return hours * 3600 + minutes * 60 + seconds
    except ValueError as e:
        raise ValueError(f"Invalid time format: {time_str}") from e`,
    explanation: "A textbook Google-style docstring with Args/Returns/Raises, generic exception handling wrapped around the exact operation that would fail, and no messy real-world context. It's what a style guide asks for, which is exactly why it reads as generated rather than organically written."
  },
  {
    category: "code", kind: "code", isAI: false,
    title: "app.js",
    content: `// dont judge me i know this is hacky
function fixDate(d) {
  if (!d) return null
  try {
    const x = new Date(d)
    if (isNaN(x)) return null
    return x
  } catch(e) {
    console.log('date broke again', d)
    return null
  }
}

let cache = {} // yolo global, refactor later maybe`,
    explanation: "Inconsistent formatting (missing semicolons in some spots, present in none consistently), a self-aware apology comment, and a global variable admitted to be a bad idea with \"refactor later maybe\" — nobody writing polished sample code includes an apology for their own shortcuts."
  },
  {
    category: "code", kind: "code", isAI: true,
    title: "dateUtils.js",
    content: `/**
 * Safely parses a value into a Date object.
 * @param {string|number|Date} input - The value to parse.
 * @returns {Date|null} A valid Date object, or null if parsing fails.
 */
function safeParseDate(input) {
  if (input === null || input === undefined) {
    return null;
  }

  const parsed = new Date(input);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export default safeParseDate;`,
    explanation: "Every edge case is handled preemptively and explicitly (null, undefined, invalid date) with a JSDoc block covering params and return type — consistent, defensive, and complete on the first pass. Human first drafts are rarely this exhaustively guarded before something actually breaks."
  },
  {
    category: "code", kind: "code", isAI: false,
    title: "styles.css",
    content: `.card {
  padding: 16px;
  border-radius: 8px;
  /* this shadow took forever to get right pls dont touch */
  box-shadow: 0 2px 4px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.08);
}

.card.card {
  margin-top: 12px; /* specificity hack bc of that legacy override, sorry */
}`,
    explanation: "The double-class specificity hack (\".card.card\") is a real workaround for a legacy CSS conflict, paired with a plea not to touch a carefully-tuned shadow. That's the residue of actual debugging history — something a model generating clean code from scratch has no reason to reproduce."
  },
  {
    category: "code", kind: "code", isAI: true,
    title: "Card.module.css",
    content: `.card {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--surface-color);
  box-shadow: var(--shadow-elevation-low);
  transition: box-shadow 0.2s ease-in-out;
}

.card:hover {
  box-shadow: var(--shadow-elevation-medium);
}`,
    explanation: "Clean use of design tokens (CSS variables) for color and shadow, rem units throughout, and a tidy hover state — the kind of consistent, best-practices-first styling you get when there's no legacy codebase to fight with, which is a subtle sign it wasn't written against a messy real project."
  },

  // ---------------- ARTWORK ----------------
  { category: "art", kind: "art", isAI: false, title: "Untitled sketch", content: ART_HUMAN_1,
    explanation: "The strokes vary in pressure and don't quite close their loops — asymmetry and small \"errors\" like the uneven blob and off-register accent marks are typical of a hand actually moving a pen." },
  { category: "art", kind: "art", isAI: true, title: "Generated composition #4471", content: ART_AI_1,
    explanation: "Perfect radial symmetry, twelve identical petals rotated at exact 30° intervals around a precise center — that level of mathematical regularity is a strong tell of algorithmic, parametric generation rather than a hand-drawn piece." },
  { category: "art", kind: "art", isAI: false, title: "Mixed media study", content: ART_HUMAN_2,
    explanation: "Overlapping shapes with inconsistent opacity, a stray triangle that doesn't align with anything else, and scattered marks that seem to trail off — the composition has the loose, exploratory quality of someone working out an idea on the page in real time." },
  { category: "art", kind: "art", isAI: true, title: "Generated pattern #2208", content: ART_AI_2,
    explanation: "A rigid grid of dots with alternating colors and sizes following a strict rule (based on row+column parity) — the underlying logic is visible in the perfect repetition, which is characteristic of code-generated patterns rather than freehand mark-making." },
  { category: "art", kind: "art", isAI: false, title: "Notebook doodle", content: ART_HUMAN_3,
    explanation: "A single flowing line that wanders across the whole canvas with no repeated unit, plus an off-hand rectangle rotated at a slightly odd angle — the kind of one-off improvisation that doesn't repeat itself is hard for a generative process to imitate believably." },
  { category: "art", kind: "art", isAI: true, title: "Generated composition #5013", content: ART_AI_3,
    explanation: "Two concentric rings made of evenly-spaced, identically-sized dots placed via precise trigonometric calculation — the perfect spacing and circular symmetry are the signature of coordinates generated by a formula, not a hand placing marks freehand." },

  // ---------------- VOICE (script read aloud via speech synthesis) ----------------
  {
    category: "voice", kind: "voice", isAI: false,
    title: "Voicemail transcript",
    content: "Hey, it's me — uh, obviously, you have caller ID. Anyway I'm gonna be like twenty minutes late, there's construction on Fifth and everyone's just sitting here like it's a parking lot. Just start without me, order the usual, I'll pay you back. Okay bye — oh wait, did you find your keys? Okay never mind, tell me when I get there. Bye.",
    explanation: "Self-interruptions and a real-time change of mind (\"oh wait, did you find your keys? ... never mind\") — the message doubles back on itself the way unscripted speech does, with no clean structure because it wasn't planned before being spoken."
  },
  {
    category: "voice", kind: "voice", isAI: true,
    title: "Voice assistant script",
    content: "Good morning! Here's your daily briefing. The weather today is partly cloudy with a high of seventy-two degrees. You have three meetings scheduled, starting with a project sync at ten a.m. Traffic on your usual commute route is currently light. Would you like me to read your top news headlines as well?",
    explanation: "A tidy, itemized rundown with an offer to continue at the end — evenly paced, no filler words or false starts, and structured exactly like a briefing template. Real unscripted speech almost never comes out this cleanly organized on the first take."
  },
  {
    category: "voice", kind: "voice", isAI: false,
    title: "Podcast clip transcript",
    content: "So — and this is the part that gets me every time — the guy shows up, right, TWO HOURS late, doesn't apologize, just goes 'traffic,' and everyone just... accepts that? Like that's just a thing you can say now? I don't know, maybe I'm the weird one, maybe 'traffic' is just a universally accepted excuse and I missed the memo.",
    explanation: "Escalating emphasis, a rhetorical rant that spirals into self-doubt (\"maybe I'm the weird one\"), and trailing off with an aside — the emotional momentum builds unpredictably rather than making a clean point, which is very characteristic of live, unscripted talking."
  },
  {
    category: "voice", kind: "voice", isAI: true,
    title: "Guided meditation script",
    content: "Take a deep breath in, and slowly let it out. Feel your shoulders relax as you settle into this moment. There is nothing you need to do right now except be present. With each breath, allow any tension to melt away, leaving you feeling calm, centered, and at ease.",
    explanation: "Soothing, evenly cadenced instructions with parallel structure (\"calm, centered, and at ease\") and no verbal missteps — pleasant and well-formed, but the metronomic evenness and lack of any spontaneous aside are typical of a written-then-read script."
  },
];

/* ---------------------------------------------------------
   STATE
--------------------------------------------------------- */
const ROUNDS_PER_GAME = 10;
const CATEGORY_META = {
  text:  { label: "TEXT",     icon: "✎" },
  code:  { label: "CODE",     icon: "⌘" },
  art:   { label: "ARTWORK",  icon: "◈" },
  voice: { label: "VOICE",    icon: "◔" },
};

let state = {
  deck: [],
  index: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  answered: false,
  history: [],
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck() {
  return shuffle(ROUNDS).slice(0, ROUNDS_PER_GAME);
}

function $(sel) { return document.querySelector(sel); }

/* ---------------------------------------------------------
   RENDER
--------------------------------------------------------- */
function renderHUD() {
  $("#score").textContent = state.score;
  $("#streak").textContent = state.streak;
  $("#roundNum").textContent = Math.min(state.index + 1, ROUNDS_PER_GAME);
  $("#roundTotal").textContent = ROUNDS_PER_GAME;
  const pct = (state.index / ROUNDS_PER_GAME) * 100;
  $("#progressFill").style.width = pct + "%";
}

function renderRound() {
  const round = state.deck[state.index];
  state.answered = false;
  $("#verdictPanel").classList.remove("show");
  $("#stage").classList.remove("locked");
  $("#btnHuman").disabled = false;
  $("#btnAI").disabled = false;
  $("#btnHuman").classList.remove("correct","wrong","dim");
  $("#btnAI").classList.remove("correct","wrong","dim");

  const meta = CATEGORY_META[round.category];
  $("#categoryTag").innerHTML = `<span class="cat-icon">${meta.icon}</span> ${meta.label}`;
  $("#artifactTitle").textContent = round.title;

  const stageBody = $("#stageBody");
  stageBody.innerHTML = "";

  if (round.kind === "text") {
    stageBody.innerHTML = `<p class="artifact-text">${escapeHtml(round.content)}</p>`;
  } else if (round.kind === "code") {
    stageBody.innerHTML = `<pre class="artifact-code"><code>${escapeHtml(round.content)}</code></pre>`;
  } else if (round.kind === "art") {
    stageBody.innerHTML = `<div class="artifact-art">${round.content}</div>`;
  } else if (round.kind === "voice") {
    stageBody.innerHTML = `
      <div class="artifact-voice">
        <button class="play-btn" id="playBtn" aria-label="Play voice clip">
          <svg viewBox="0 0 24 24" width="26" height="26"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
        </button>
        <div class="waveform" id="waveform">${buildWaveformBars()}</div>
      </div>
      <p class="artifact-hint">Tap play to hear the clip, then decide: was the script written by a human or an AI?</p>
    `;
    $("#playBtn").addEventListener("click", () => playVoice(round.content));
  }

  renderHUD();
}

function buildWaveformBars() {
  let bars = "";
  for (let i = 0; i < 40; i++) {
    const h = 8 + Math.round(Math.random() * 32);
    bars += `<span class="bar" style="height:${h}px"></span>`;
  }
  return bars;
}

function playVoice(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.98;
  utter.pitch = 1.0;
  const btn = $("#playBtn");
  const wave = $("#waveform");
  if (btn) btn.classList.add("playing");
  if (wave) wave.classList.add("animate");
  utter.onend = () => {
    if (btn) btn.classList.remove("playing");
    if (wave) wave.classList.remove("animate");
  };
  window.speechSynthesis.speak(utter);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ---------------------------------------------------------
   GAME FLOW
--------------------------------------------------------- */
function answer(guessAI) {
  if (state.answered) return;
  state.answered = true;
  const round = state.deck[state.index];
  const isCorrect = guessAI === round.isAI;

  $("#btnHuman").disabled = true;
  $("#btnAI").disabled = true;
  $("#stage").classList.add("locked");

  const chosenBtn = guessAI ? $("#btnAI") : $("#btnHuman");
  const correctBtn = round.isAI ? $("#btnAI") : $("#btnHuman");

  if (isCorrect) {
    chosenBtn.classList.add("correct");
    state.score += 10 + Math.min(state.streak, 5) * 2;
    state.streak += 1;
    state.correct += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
  } else {
    chosenBtn.classList.add("wrong");
    correctBtn.classList.add("correct", "dim");
    state.streak = 0;
  }

  state.history.push({ round, guessAI, isCorrect });

  const verdict = $("#verdictPanel");
  verdict.innerHTML = `
    <div class="verdict-head">
      <div class="stamp ${round.isAI ? 'stamp-ai' : 'stamp-human'}">${round.isAI ? "SYNTHETIC" : "HUMAN-MADE"}</div>
      <div class="verdict-result ${isCorrect ? 'is-correct' : 'is-wrong'}">${isCorrect ? "Correct +" + (10 + Math.min(state.streak - 1, 5) * 2) : "Missed it"}</div>
    </div>
    <p class="verdict-explain">${round.explanation}</p>
    <button class="btn-next" id="btnNext">${state.index + 1 >= ROUNDS_PER_GAME ? "See final results" : "Next round"} →</button>
  `;
  verdict.classList.add("show");
  $("#btnNext").addEventListener("click", nextRound);

  renderHUD();
}

function nextRound() {
  state.index += 1;
  if (state.index >= ROUNDS_PER_GAME) {
    showResults();
  } else {
    renderRound();
  }
}

function showResults() {
  $("#gameScreen").classList.remove("active");
  $("#resultsScreen").classList.add("active");
  $("#finalScore").textContent = state.score;
  $("#finalCorrect").textContent = state.correct;
  $("#finalTotal").textContent = ROUNDS_PER_GAME;
  $("#finalStreak").textContent = state.bestStreak;

  const accuracy = Math.round((state.correct / ROUNDS_PER_GAME) * 100);
  let rank;
  if (accuracy >= 90) rank = "Human/AI Forensics Expert";
  else if (accuracy >= 70) rank = "Sharp Eye";
  else if (accuracy >= 50) rank = "Coin Flip Plus";
  else rank = "Easily Fooled";
  $("#finalRank").textContent = rank;

  renderBreakdown();
  renderLeaderboard();
}

function renderBreakdown() {
  const wrap = $("#breakdown");
  wrap.innerHTML = "";
  state.history.forEach((h) => {
    const meta = CATEGORY_META[h.round.category];
    const item = document.createElement("div");
    item.className = "breakdown-item " + (h.isCorrect ? "bi-correct" : "bi-wrong");
    item.innerHTML = `
      <span class="bi-icon">${meta.icon}</span>
      <span class="bi-title">${h.round.title}</span>
      <span class="bi-verdict">${h.round.isAI ? "AI" : "Human"}</span>
      <span class="bi-mark">${h.isCorrect ? "✓" : "✕"}</span>
    `;
    wrap.appendChild(item);
  });
}

/* ---------------------------------------------------------
   LEADERBOARD (localStorage)
--------------------------------------------------------- */
const LB_KEY = "signalnoise_leaderboard_v1";

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveScore(name) {
  const board = getLeaderboard();
  board.push({ name, score: state.score, accuracy: Math.round((state.correct/ROUNDS_PER_GAME)*100), date: new Date().toLocaleDateString() });
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(LB_KEY, JSON.stringify(board.slice(0, 10)));
  renderLeaderboard();
}

function renderLeaderboard() {
  const board = getLeaderboard();
  const wrap = $("#leaderboardList");
  if (!board.length) {
    wrap.innerHTML = `<p class="lb-empty">No scores saved yet — be the first.</p>`;
    return;
  }
  wrap.innerHTML = board
    .map((e, i) => `
      <div class="lb-row ${i === 0 ? 'lb-first' : ''}">
        <span class="lb-rank">${i + 1}</span>
        <span class="lb-name">${escapeHtml(e.name)}</span>
        <span class="lb-acc">${e.accuracy}%</span>
        <span class="lb-score">${e.score}</span>
      </div>`)
    .join("");
}

/* ---------------------------------------------------------
   INIT / EVENTS
--------------------------------------------------------- */
function startGame() {
  state = { deck: buildDeck(), index: 0, score: 0, streak: 0, bestStreak: 0, correct: 0, answered: false, history: [] };
  $("#introScreen").classList.remove("active");
  $("#resultsScreen").classList.remove("active");
  $("#gameScreen").classList.add("active");
  renderRound();
}

document.addEventListener("DOMContentLoaded", () => {
  $("#btnStart").addEventListener("click", startGame);
  $("#btnHuman").addEventListener("click", () => answer(false));
  $("#btnAI").addEventListener("click", () => answer(true));
  $("#btnPlayAgain").addEventListener("click", startGame);
  $("#btnShowLeaderboard").addEventListener("click", () => {
    $("#leaderboardModal").classList.add("show");
    renderLeaderboard();
  });
  $("#closeLeaderboard").addEventListener("click", () => {
    $("#leaderboardModal").classList.remove("show");
  });
  $("#btnSaveScore").addEventListener("click", () => {
    const input = $("#nameInput");
    const name = (input.value || "Anonymous").trim().slice(0, 18) || "Anonymous";
    saveScore(name);
    input.value = "";
    $("#saveConfirm").textContent = "Saved to leaderboard ✓";
    setTimeout(() => { $("#saveConfirm").textContent = ""; }, 2500);
  });

  document.addEventListener("keydown", (e) => {
    if (!$("#gameScreen").classList.contains("active")) return;
    if (e.key === "ArrowLeft") $("#btnHuman").click();
    if (e.key === "ArrowRight") $("#btnAI").click();
    if (e.key === "Enter" && state.answered) {
      const btn = $("#btnNext");
      if (btn) btn.click();
    }
  });

  renderLeaderboard();
});