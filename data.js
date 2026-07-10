/* =========================================================================
   data.js — the curated content bank
   Each round item:
   {
     id, type: 'text'|'code'|'art'|'voice',
     source: 'human' | 'ai',      // the correct answer
     title,                        // short category label shown on the card
     content,                      // text/code string OR svg markup OR spoken passage
     lang,                         // (code only) language for the mono label
     tells: [ ... ]                // bullet points used to build the explanation
   }
   Every sample here is original writing/art authored for this game, so the
   "human" vs "ai" labels describe the *style and intent* each was crafted to
   exhibit — which is exactly what the game teaches you to read.
   ========================================================================= */

const CONTENT_BANK = [

  /* ----------------------------- TEXT ---------------------------------- */
  {
    id: 'txt-h1', type: 'text', source: 'human',
    title: 'Prose passage',
    content: `The bus was late again, so I ate my sandwich standing up by the flickering \
timetable that nobody's fixed since 2019. Cheese and pickle. Same as always. A pigeon \
kept eyeing me like it had somewhere better to be, which, fair enough — so did I. When \
the 47 finally showed it was the wrong 47, the one that skips my stop, and I got on it \
anyway because I was tired of being right.`,
    tells: [
      'Specific, un-Googleable detail ("cheese and pickle", "the wrong 47", "since 2019") that a person actually lived.',
      'Emotional logic that is a little irrational — getting on the wrong bus "because I was tired of being right" — rather than tidy and sensible.',
      'Uneven rhythm and sentence fragments ("Same as always.") instead of smooth balanced clauses.'
    ]
  },
  {
    id: 'txt-a1', type: 'text', source: 'ai',
    title: 'Prose passage',
    content: `Waiting for the bus can be a surprisingly reflective experience. As the \
minutes pass, we often find ourselves observing the small details of the world around \
us — the changing light, the quiet hum of the city, the gentle rhythm of everyday life. \
In these moments of stillness, there is an opportunity to slow down, to breathe, and to \
appreciate the beauty in the ordinary. After all, sometimes the journey teaches us more \
than the destination.`,
    tells: [
      'Zooms out to a universal lesson ("the journey teaches us more than the destination") instead of staying in one concrete moment.',
      'Uses the collective "we" and generic sensory nouns ("the quiet hum", "the gentle rhythm") that could describe anywhere.',
      'Perfectly balanced, comma-spliced cadence with no rough edges, fragments, or surprising word choices.'
    ]
  },
  {
    id: 'txt-h2', type: 'text', source: 'human',
    title: 'Product review',
    content: `Ordered the "large." It is not large. My cat could wear it as a hat. That \
said, washed it three times now and it hasn't shrunk further or fallen apart, which is \
more than I can say for the last two hoodies I bought online. Two stars for sizing, \
bumping to three because honestly it's warm and I've stopped taking it off.`,
    tells: [
      'A concrete, funny exaggeration ("my cat could wear it as a hat") rooted in a real gripe.',
      'Self-contradiction the writer works through in real time — dropping to two stars, then bumping back to three.',
      'Off-hand personal admission ("I\'ve stopped taking it off") that adds nothing to the rating but everything to the voice.'
    ]
  },
  {
    id: 'txt-a2', type: 'text', source: 'ai',
    title: 'Product review',
    content: `This hoodie exceeded my expectations! The material is soft and comfortable, \
and it keeps me warm during chilly evenings. While the sizing runs slightly small, the \
overall quality is excellent and it has held up well after multiple washes. I would \
definitely recommend this product to anyone looking for a cozy and reliable option. \
Great value for the price!`,
    tells: [
      'Front-loads positivity and an exclamation, then neatly sandwiches one mild negative between two positives ("compliment sandwich").',
      'Reaches for marketing adjectives ("soft and comfortable", "cozy and reliable") rather than a specific observation.',
      'Ends with a recommendation and a value verdict — the tidy structure of a template, not a person venting.'
    ]
  },
  {
    id: 'txt-h3', type: 'text', source: 'human',
    title: 'Forum answer',
    content: `Yeah don't do that. I lost half a day to exactly this last year. The \
timezone is stored as UTC in the DB but the ORM was silently re-localising it on read, \
so everything looked "off by 5.5" and I nearly rewrote the whole scheduler. Turned \
out one config flag. One. I'm still annoyed about it.`,
    tells: [
      'Hyper-specific war story ("off by 5.5", "one config flag") that only comes from being burned by the exact bug.',
      'Lingering emotion — "I\'m still annoyed about it" — that serves no informational purpose.',
      'Loose, spoken grammar ("One.") rather than fully-formed explanatory sentences.'
    ]
  },
  {
    id: 'txt-a3', type: 'text', source: 'ai',
    title: 'Forum answer',
    content: `Great question! This is a common issue when working with timezones. The \
problem usually occurs because dates are stored in UTC but displayed in local time \
without proper conversion. To resolve this, make sure you consistently convert between \
UTC and local time at the boundaries of your application. It's also worth noting that \
using a well-tested date library can help you avoid many of these pitfalls.`,
    tells: [
      'Opens with "Great question!" and frames the issue as "common" — a generic, reassuring preamble.',
      'Explains the concept correctly but abstractly, with no evidence the writer ever hit the bug themselves.',
      'The hedge "It\'s also worth noting" plus a safe closing recommendation is a classic assistant cadence.'
    ]
  },

  /* ----------------------------- CODE ---------------------------------- */
  {
    id: 'code-a1', type: 'code', source: 'ai', lang: 'python',
    title: 'Code snippet',
    content: `def calculate_average(numbers):
    """
    Calculate the average of a list of numbers.

    Args:
        numbers (list): A list of numeric values.

    Returns:
        float: The average of the numbers, or 0 if the list is empty.
    """
    if not numbers:
        return 0  # Handle the edge case of an empty list

    total = 0
    for number in numbers:
        total += number  # Add each number to the running total

    average = total / len(numbers)
    return average`,
    tells: [
      'Textbook-perfect docstring with Args/Returns for a three-line function — documentation heavier than the code.',
      'Comments narrate obvious lines ("Add each number to the running total"), the hallmark of over-explaining models.',
      'Reimplements sum() and a loop instead of the idiomatic `sum(numbers) / len(numbers)` a fluent human would reach for.'
    ]
  },
  {
    id: 'code-h1', type: 'code', source: 'human', lang: 'python',
    title: 'Code snippet',
    content: `def avg(xs):
    return sum(xs) / len(xs) if xs else 0

# FIXME: this blows up on generators, whatever, we only ever pass lists here
def weighted(xs, ws):
    return sum(x*w for x, w in zip(xs, ws)) / sum(ws)`,
    tells: [
      'Terse naming (`xs`, `ws`) and a one-line expression — a fluent programmer optimising for their own reading speed.',
      'A candid FIXME admitting a known limitation ("whatever, we only ever pass lists here") that no assistant would volunteer.',
      'Uses idiomatic `zip` and a generator expression without ceremony or defensive checks.'
    ]
  },
  {
    id: 'code-a2', type: 'code', source: 'ai', lang: 'javascript',
    title: 'Code snippet',
    content: `/**
 * Checks whether a given string is a palindrome.
 * @param {string} str - The input string to check.
 * @returns {boolean} True if the string is a palindrome, false otherwise.
 */
function isPalindrome(str) {
  // Convert the string to lowercase and remove non-alphanumeric characters
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  // Reverse the cleaned string
  const reversed = cleaned.split('').reverse().join('');
  // Compare the cleaned string with its reversed version
  return cleaned === reversed;
}`,
    tells: [
      'Full JSDoc block plus a comment on every single line, including trivially obvious ones.',
      'Variable names spell out the tutorial ("cleaned", "reversed") and each step gets its own line for maximum clarity.',
      'Correct and complete, but written to *teach* the reader rather than to ship — the signature of generated code.'
    ]
  },
  {
    id: 'code-h2', type: 'code', source: 'human', lang: 'javascript',
    title: 'Code snippet',
    content: `const isPalin = s => {
  s = s.toLowerCase().replace(/[\\W_]/g, '')
  return s === [...s].reverse().join('')
}

// TODO(vij): unicode? probably fine lol
export { isPalin }`,
    tells: [
      'Compact arrow function, no docstring, reassigns the parameter in place — pragmatic human shorthand.',
      'A personal, timestamp-free TODO signed with a name and "probably fine lol" — unmistakably human casualness.',
      'Uses spread `[...s]` and a tighter regex (`[\\W_]`) — clever, terse, not tutorial-style.'
    ]
  },

  /* ------------------------------ ART ---------------------------------- */
  {
    id: 'art-a1', type: 'art', source: 'ai',
    title: 'Generated artwork',
    content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Symmetrical geometric pattern">
      <rect width="400" height="300" fill="#0f1226"/>
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#7b5cff"/>
          <stop offset="60%" stop-color="#2a2a72"/>
          <stop offset="100%" stop-color="#0f1226"/>
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#g1)"/>
      <g fill="none" stroke="#66f5ff" stroke-width="1" opacity="0.85">
        ${Array.from({length: 24}).map((_,i)=>{
          const a = (i/24)*Math.PI*2;
          const x = 200 + Math.cos(a)*120, y = 150 + Math.sin(a)*120;
          const x2 = 200 + Math.cos(a)*40, y2 = 150 + Math.sin(a)*40;
          return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
        }).join('')}
      </g>
      <g fill="none" stroke="#ff5cf0" stroke-width="1.2" opacity="0.7">
        ${Array.from({length: 6}).map((_,i)=>`<circle cx="200" cy="150" r="${20+i*20}"/>`).join('')}
      </g>
    </svg>`,
    tells: [
      'Flawless radial symmetry — 24 identical spokes and perfectly concentric rings, spacing accurate to the pixel.',
      'Smooth algorithmic gradient and neon palette with no focal point, subject, or story — pure decorative pattern.',
      'Every element is a mathematical repetition; nothing was placed by a hand making a compositional decision.'
    ]
  },
  {
    id: 'art-h1', type: 'art', source: 'human',
    title: 'Hand-made illustration',
    content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A small house on a hill with a crooked tree">
      <rect width="400" height="300" fill="#fdf3e3"/>
      <path d="M0 230 Q120 190 220 215 T400 205 L400 300 L0 300 Z" fill="#a8d08d"/>
      <path d="M235 214 q6 -60 14 -66 q10 8 8 64" fill="none" stroke="#6b4a2b" stroke-width="6" stroke-linecap="round"/>
      <circle cx="252" cy="150" r="26" fill="#7fb069"/>
      <circle cx="238" cy="162" r="20" fill="#94c47d"/>
      <circle cx="266" cy="160" r="18" fill="#6a9a55"/>
      <path d="M90 215 L90 165 L140 135 L190 165 L190 215 Z" fill="#e8a598"/>
      <path d="M84 168 L140 130 L196 168 L140 148 Z" fill="#c9584b"/>
      <rect x="122" y="182" width="20" height="33" fill="#5c3b28"/>
      <rect x="100" y="175" width="16" height="16" fill="#ffe28a"/>
      <circle cx="330" cy="60" r="22" fill="#ffd15c"/>
      <path d="M18 60 q10 -8 20 0 q10 -8 20 0 q10 8 -2 10 q-8 6 -18 0 q-14 4 -20 -10z" fill="#ffffff" opacity="0.9"/>
    </svg>`,
    tells: [
      'A clear subject and small story — a lopsided house, a crooked hand-drawn tree, a lit window — arranged by intent.',
      'Deliberate asymmetry and imperfect curves; the tree leans, the hill dips unevenly, nothing is machine-perfect.',
      'A warm, limited, chosen palette with a single focal point (the yellow window) rather than uniform decoration.'
    ]
  },
  {
    id: 'art-a2', type: 'art', source: 'ai',
    title: 'Generated artwork',
    content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grid of gradient tiles">
      <rect width="400" height="300" fill="#141414"/>
      ${(() => {
        const h2h = (h,s,l) => { // hsl(0-360,0-1,0-1) -> #rrggbb
          const a = s*Math.min(l,1-l);
          const f = n => { const k=(n+h/30)%12; const c=l-a*Math.max(-1,Math.min(k-3,9-k,1));
            return Math.round(255*c).toString(16).padStart(2,'0'); };
          return '#'+f(0)+f(8)+f(4);
        };
        return Array.from({length: 8}).map((_,r)=>Array.from({length: 10}).map((__,c)=>{
          const hue = (r*10 + c*24) % 360;
          return `<rect x="${c*40}" y="${r*37.5}" width="39" height="36.5" fill="${h2h(hue,0.8,0.6)}" opacity="0.92"/>`;
        }).join('')).join('');
      })()}
    </svg>`,
    tells: [
      'A perfectly regular 10×8 grid where hue rotates by a fixed step per cell — a formula you can read straight off the image.',
      'Identical tile size and spacing throughout, with no cell breaking the pattern or drawing the eye.',
      'Beautiful but authorless: it renders a rule rather than depicting anything or making a compositional choice.'
    ]
  },
  {
    id: 'art-h2', type: 'art', source: 'human',
    title: 'Hand-made illustration',
    content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A steaming cup of coffee with a doodled heart">
      <rect width="400" height="300" fill="#f3ede7"/>
      <ellipse cx="200" cy="250" rx="120" ry="16" fill="#d9cfc4"/>
      <path d="M120 150 q-4 90 40 96 q40 8 80 0 q44 -6 40 -96 z" fill="#f7f2ec" stroke="#3b2b22" stroke-width="4"/>
      <path d="M126 165 q60 20 148 0 l-6 40 q-68 16 -136 0 z" fill="#6f4a34"/>
      <path d="M275 165 q46 -6 40 40 q-6 40 -44 30" fill="none" stroke="#3b2b22" stroke-width="4"/>
      <path d="M170 120 q-10 -22 6 -30 q14 12 -2 30" fill="none" stroke="#b7a99b" stroke-width="4" stroke-linecap="round"/>
      <path d="M205 116 q-12 -26 6 -36 q16 14 -2 36" fill="none" stroke="#b7a99b" stroke-width="4" stroke-linecap="round"/>
      <path d="M232 122 q-9 -20 5 -27 q13 11 -1 27" fill="none" stroke="#b7a99b" stroke-width="4" stroke-linecap="round"/>
      <path d="M300 210 q10 6 4 18 q10 -4 8 -18 q10 10 -2 24 q-12 8 -14 -6 q-8 -6 4 -18z" fill="#e0596b"/>
    </svg>`,
    tells: [
      'Depicts something specific and affectionate — a mug with a wobbly doodled heart and three uneven steam wisps.',
      'Hand-tuned bézier curves that are charmingly uneven; the steam trails all differ, as a person would draw them.',
      'Composition has weight and intent: the mug is grounded by a shadow and the heart is placed as a personal accent.'
    ]
  },

  /* ------------------------------ IMAGE -------------------------------- */
  {
    id: "img-h1", type: "image", source: "human",
    title: "Photograph",
    content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Photograph of a sunset over the sea">
  <defs>
    <linearGradient id="h1sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2b3a67"/>
      <stop offset="38%" stop-color="#c96f8b"/>
      <stop offset="62%" stop-color="#f4a259"/>
      <stop offset="100%" stop-color="#ffd79a"/>
    </linearGradient>
    <linearGradient id="h1sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e9a86b"/>
      <stop offset="30%" stop-color="#b06a70"/>
      <stop offset="100%" stop-color="#3d3350"/>
    </linearGradient>
    <radialGradient id="h1sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff6e0"/>
      <stop offset="45%" stop-color="#ffd27a"/>
      <stop offset="100%" stop-color="#ffd27a" stop-opacity="0"/>
    </radialGradient>
    <filter id="h1blur"><feGaussianBlur stdDeviation="6"/></filter>
    <radialGradient id="h1vig" cx="50%" cy="45%" r="70%">
      <stop offset="60%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.34"/>
    </radialGradient>
  </defs>
  <rect width="400" height="182" fill="url(#h1sky)"/>
  <circle cx="212" cy="150" r="80" fill="url(#h1sun)"/>
  <circle cx="212" cy="150" r="26" fill="#fff2d4"/>
  <rect y="182" width="400" height="118" fill="url(#h1sea)"/>
  <ellipse cx="212" cy="188" rx="34" ry="6" fill="#ffe4b0" opacity="0.75" filter="url(#h1blur)"/>
  <g fill="#ffdca0" opacity="0.5">
    <rect x="150" y="205" width="124" height="2.4" rx="1"/>
    <rect x="168" y="224" width="88" height="2" rx="1"/>
    <rect x="180" y="244" width="64" height="1.8" rx="1"/>
  </g>
  <path d="M0 300 L0 208 q40 -10 78 -2 q30 6 52 -4 q26 -12 60 -4 q40 10 74 2 q60 -14 136 -2 L400 300 Z" fill="#241d2e"/>
  <path d="M46 210 l10 -22 5 12 6 -8 4 18 z" fill="#1b1622"/>
  <path d="M330 208 l8 -18 6 14 5 -10 4 16 z" fill="#1b1622"/>
  <rect width="400" height="300" fill="url(#h1vig)"/>
</svg>`,
    tells: [
      "One consistent light source: the sun sits on the horizon and every highlight — the glowing band on the water, the rim of the hills — falls away from that single point.",
      "Soft atmospheric colour banding in the sky and a slightly irregular, asymmetric coastline, the way a real scene is never perfectly tidy.",
      "The sun’s reflection breaks into shorter and shorter dashes with distance, exactly how light scatters across moving water."
    ]
  },

  {
    id: "img-a1", type: "image", source: "ai",
    title: "Generated image",
    content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Portrait image of a person resting a hand near the chin">
  <defs>
    <radialGradient id="a1bg" cx="42%" cy="34%" r="80%">
      <stop offset="0%" stop-color="#c7b6d6"/>
      <stop offset="55%" stop-color="#8a6f9c"/>
      <stop offset="100%" stop-color="#4a3a58"/>
    </radialGradient>
    <linearGradient id="a1skin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f3cdaa"/>
      <stop offset="100%" stop-color="#d69a76"/>
    </linearGradient>
    <filter id="a1soft"><feGaussianBlur stdDeviation="0.6"/></filter>
    <radialGradient id="a1vig" cx="50%" cy="45%" r="72%">
      <stop offset="62%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.3"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#a1bg)"/>
  <!-- hair -->
  <path d="M120 150 q-14 -110 90 -112 q104 2 90 112 q6 70 -30 96 l-14 -70 -92 0 -14 70 q-36 -26 -30 -96z" fill="#3a2b3f"/>
  <!-- neck + face -->
  <rect x="176" y="196" width="48" height="46" fill="#d69a76"/>
  <path d="M150 150 q0 -78 50 -80 q50 2 50 80 q0 58 -50 74 q-50 -16 -50 -74z" fill="url(#a1skin)" filter="url(#a1soft)"/>
  <!-- eyes (slightly different sizes = asymmetry tell) -->
  <ellipse cx="178" cy="140" rx="9" ry="6" fill="#fff"/>
  <ellipse cx="178" cy="140" rx="4.2" ry="4.2" fill="#5a3b2a"/>
  <ellipse cx="222" cy="141" rx="7.5" ry="5" fill="#fff"/>
  <ellipse cx="222" cy="141" rx="3.4" ry="3.4" fill="#5a3b2a"/>
  <path d="M168 128 q10 -6 20 -1" stroke="#3a2b3f" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M212 128 q10 -5 20 0" stroke="#3a2b3f" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M200 148 l-3 20 6 0z" fill="#c98a66"/>
  <path d="M186 178 q14 10 28 0" stroke="#a85c4c" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- mismatched earrings: one round gold, one long silver -->
  <circle cx="152" cy="176" r="6" fill="#f5c542"/>
  <rect x="246" y="172" width="4" height="20" rx="2" fill="#c9d1d9"/>
  <circle cx="248" cy="196" r="5" fill="#c9d1d9"/>
  <!-- hand near chin with SIX fingers -->
  <path d="M196 236 q-6 -18 8 -22 q10 -3 14 4 q10 -2 16 6 q12 0 12 14 q2 18 -14 26 q-24 10 -40 -6 q-8 -10 4 -22z" fill="url(#a1skin)" filter="url(#a1soft)"/>
  <g fill="#e7ab84" stroke="#c98a66" stroke-width="0.8">
    <rect x="200" y="204" width="8" height="34" rx="4"/>
    <rect x="210" y="199" width="8" height="39" rx="4"/>
    <rect x="220" y="200" width="8" height="38" rx="4"/>
    <rect x="230" y="205" width="8" height="33" rx="4"/>
    <rect x="240" y="212" width="8" height="28" rx="4"/>
    <rect x="250" y="220" width="7" height="22" rx="3.5"/>
  </g>
  <rect width="400" height="300" fill="url(#a1vig)"/>
</svg>`,
    tells: [
      "The hand has six fingers — the classic generative-image anatomy failure that keeps surfacing around hands.",
      "The two earrings don’t match (round gold stud on one side, long silver drop on the other) and the eyes are subtly different sizes.",
      "Hair and background melt together with no clean edge, and the light on the face never commits to a direction."
    ]
  },

  {
    id: "img-h2", type: "image", source: "human",
    title: "Photograph",
    content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Photograph through a rainy window with blurred lights behind a coffee cup">
  <defs>
    <linearGradient id="h2bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#20242e"/>
      <stop offset="100%" stop-color="#3a2f2a"/>
    </linearGradient>
    <filter id="h2bokeh"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="h2soft"><feGaussianBlur stdDeviation="1.1"/></filter>
    <radialGradient id="h2cup" cx="40%" cy="35%" r="80%">
      <stop offset="0%" stop-color="#efe7dd"/>
      <stop offset="100%" stop-color="#b9aa9a"/>
    </radialGradient>
    <radialGradient id="h2vig" cx="50%" cy="50%" r="70%">
      <stop offset="60%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.4"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#h2bg)"/>
  <g filter="url(#h2bokeh)">
    <circle cx="70" cy="70" r="26" fill="#ffb347" opacity="0.75"/>
    <circle cx="150" cy="52" r="18" fill="#ffd27a" opacity="0.6"/>
    <circle cx="250" cy="64" r="30" fill="#ff8f6b" opacity="0.6"/>
    <circle cx="330" cy="90" r="22" fill="#ffd27a" opacity="0.7"/>
    <circle cx="300" cy="150" r="16" fill="#9ad0ff" opacity="0.5"/>
    <circle cx="110" cy="130" r="14" fill="#ffcf9e" opacity="0.55"/>
  </g>
  <!-- rain streaks on glass -->
  <g stroke="#cfe0ee" stroke-width="1.2" opacity="0.35" fill="none">
    <path d="M60 20 q4 40 -2 90"/>
    <path d="M130 10 q-3 60 3 120"/>
    <path d="M210 30 q5 50 -1 100"/>
    <path d="M290 16 q-4 70 2 130"/>
    <path d="M356 24 q3 44 -3 96"/>
  </g>
  <g fill="#dbe7f1" opacity="0.5">
    <circle cx="88" cy="60" r="2.1"/><circle cx="176" cy="44" r="1.6"/><circle cx="238" cy="96" r="2.4"/>
    <circle cx="312" cy="58" r="1.8"/><circle cx="126" cy="150" r="2"/><circle cx="270" cy="130" r="1.7"/>
  </g>
  <!-- table -->
  <rect y="228" width="400" height="72" fill="#5a4636"/>
  <ellipse cx="205" cy="232" rx="150" ry="12" fill="#6b5442" opacity="0.7" filter="url(#h2soft)"/>
  <!-- coffee cup, in focus -->
  <ellipse cx="200" cy="250" rx="52" ry="10" fill="#000" opacity="0.28" filter="url(#h2soft)"/>
  <path d="M164 210 q-2 44 36 46 q38 -2 36 -46z" fill="url(#h2cup)"/>
  <ellipse cx="200" cy="210" rx="36" ry="9" fill="#efe7dd"/>
  <ellipse cx="200" cy="210" rx="28" ry="6.5" fill="#5b3a24"/>
  <path d="M236 218 q22 -2 20 18 q-2 18 -22 14" fill="none" stroke="#cdbfae" stroke-width="6"/>
  <path d="M188 200 q-4 -14 6 -22 M204 200 q-4 -14 6 -22" stroke="#d9cabb" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round" filter="url(#h2soft)"/>
  <rect width="400" height="300" fill="url(#h2vig)"/>
</svg>`,
    tells: [
      "Shallow depth of field: the background lights blur into soft round bokeh while the cup stays sharp — a real-lens characteristic.",
      "Rain streaks and droplets on the glass refract consistently, and the steam rises in believable, uneven wisps.",
      "Every object is coherent and readable — cup, handle and saucer shadow all sit correctly in one perspective."
    ]
  },

  {
    id: "img-a2", type: "image", source: "ai",
    title: "Generated image",
    content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Image of a building with staircases and a sign with unreadable text">
  <defs>
    <linearGradient id="a2sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8fb7d6"/>
      <stop offset="100%" stop-color="#d9c7b0"/>
    </linearGradient>
    <linearGradient id="a2wall" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e6d3b3"/>
      <stop offset="100%" stop-color="#c8a97e"/>
    </linearGradient>
    <linearGradient id="a2wall2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#cdb491"/>
      <stop offset="100%" stop-color="#a8895f"/>
    </linearGradient>
    <radialGradient id="a2vig" cx="50%" cy="45%" r="72%">
      <stop offset="62%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.32"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#a2sky)"/>
  <!-- two wall faces with CONFLICTING shadow direction (tell) -->
  <polygon points="60,60 220,40 220,250 60,270" fill="url(#a2wall)"/>
  <polygon points="220,40 360,80 360,240 220,250" fill="url(#a2wall2)"/>
  <!-- windows: left face shadow on right side, right face shadow ALSO on right = impossible light -->
  <g>
    <rect x="86" y="92" width="34" height="46" fill="#7c8ba0"/><rect x="112" y="92" width="8" height="46" fill="#3f4a5a"/>
    <rect x="150" y="88" width="34" height="46" fill="#7c8ba0"/><rect x="176" y="88" width="8" height="46" fill="#3f4a5a"/>
    <rect x="250" y="104" width="34" height="46" fill="#8593a6"/><rect x="276" y="104" width="8" height="46" fill="#3f4a5a"/>
    <rect x="304" y="112" width="34" height="46" fill="#8593a6"/><rect x="330" y="112" width="8" height="46" fill="#3f4a5a"/>
  </g>
  <!-- impossible staircase: steps ascend then loop back into the wall -->
  <g fill="#b98f63" stroke="#8a6642" stroke-width="1.5">
    <polygon points="70,250 108,244 108,258 70,266"/>
    <polygon points="108,244 146,236 146,250 108,258"/>
    <polygon points="146,236 184,246 184,260 146,250"/>
    <polygon points="184,246 210,232 210,246 184,260"/>
    <polygon points="210,232 190,220 190,232 210,246"/>
  </g>
  <!-- hanging sign with garbled 'text' (random glyph-like strokes) -->
  <rect x="238" y="150" width="96" height="34" rx="4" fill="#2f3a2c"/>
  <g stroke="#e9e2c8" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M248 160 l0 14 M248 167 l7 0 M255 160 l0 14"/>
    <path d="M264 160 q8 -2 8 6 q0 8 -8 6 M264 174 l9 0"/>
    <path d="M282 160 l4 14 4 -14 M283 168 l6 0"/>
    <path d="M298 161 q7 0 7 6 q0 7 -8 5 l0 -11 M298 172 l0 4"/>
    <path d="M314 160 l0 14 M314 160 q9 0 8 6 q-1 4 -8 3"/>
  </g>
  <rect width="400" height="300" fill="url(#a2vig)"/>
</svg>`,
    tells: [
      "The staircase climbs and then loops straight back into the wall — geometry that cannot physically exist.",
      "The sign’s lettering is garbled pseudo-text: letter-like shapes that spell nothing, a hallmark of AI image generation.",
      "Shadows fall inconsistently across the two wall faces, as if the building were lit by two different suns."
    ]
  },

  /* ------------------------------ VOICE -------------------------------- */
  {
    id: 'voice-h1', type: 'voice', source: 'human',
    title: 'Voice clip (spoken)',
    content: `Okay so — funny story — I completely forgot we had that meeting today, right, \
so I'm sprinting across the car park with one shoe half on, coffee everywhere, and it turns \
out it got moved to Thursday. Nobody told me. Nobody ever tells me.`,
    tells: [
      'A messy real anecdote with filler ("Okay so —", "right") and a specific mishap (one shoe, spilled coffee).',
      'Ends on a wry, personal grievance ("Nobody ever tells me") rather than a neat conclusion.',
      'The words carry the stumble and timing of actual speech, not a written-then-read script.'
    ]
  },
  {
    id: 'voice-a1', type: 'voice', source: 'ai',
    title: 'Voice clip (spoken)',
    content: `Welcome, and thank you for joining us today. In this session, we will explore \
three key strategies for improving your productivity. By the end, you'll have practical \
tips you can apply immediately. Let's get started on this exciting journey together.`,
    tells: [
      'Announces its own structure ("three key strategies", "by the end") the way generated scripts love to.',
      'Frictionless, presenter-perfect phrasing with zero hesitation, aside, or personal detail.',
      'The closing "exciting journey together" is upbeat filler that signals a template, not a person.'
    ]
  },
  {
    id: 'voice-h2', type: 'voice', source: 'human',
    title: 'Voice clip (spoken)',
    content: `I don't know, I've been putting off calling the dentist for like three weeks now. \
It's not even that I'm scared, it's just — every time I remember, it's either too early or \
they're closed, and then I forget again. Classic.`,
    tells: [
      'Self-aware procrastination with a hedge ("I don\'t know") and a shrug of an ending ("Classic").',
      'Concrete, slightly embarrassing personal detail (three weeks, the dentist) with no lesson attached.',
      'Loose spoken syntax and a trailing dash mid-thought, the way people actually talk themselves in circles.'
    ]
  },
  {
    id: 'voice-a2', type: 'voice', source: 'ai',
    title: 'Voice clip (spoken)',
    content: `Regular dental checkups are an important part of maintaining your overall health. \
Experts recommend visiting your dentist every six months to prevent cavities and catch \
potential issues early. Remember, a healthy smile starts with good daily habits.`,
    tells: [
      'Delivers balanced public-health advice ("experts recommend", "every six months") with no personal stake.',
      'Wraps up with a tidy, quotable takeaway ("a healthy smile starts with good daily habits").',
      'Smooth, evenly-weighted sentences — informative and impersonal, like copy written to be narrated.'
    ]
  }
];

/* Convenience: which categories exist, for the start screen chips */
const CATEGORIES = [
  { key: 'text',  label: 'Text',    hint: 'prose, reviews, answers' },
  { key: 'code',  label: 'Code',    hint: 'snippets & functions'    },
  { key: 'art',   label: 'Artwork', hint: 'illustrations & patterns'},
  { key: 'image', label: 'Image',   hint: 'photos vs generated'     },
  { key: 'voice', label: 'Voice',   hint: 'spoken clips'            },
];

if (typeof window !== 'undefined') {
  window.CONTENT_BANK = CONTENT_BANK;
  window.CATEGORIES = CATEGORIES;
}
if (typeof module !== 'undefined') module.exports = { CONTENT_BANK, CATEGORIES };