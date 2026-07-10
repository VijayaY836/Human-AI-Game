# HUMAN // AI — the detection game

An interactive guessing game: you're shown a piece of **text, code, artwork, an image, or a voice passage** and you have to decide — was it made by a *human* or an *AI*? Guess, then get the truth plus a short explanation of the tells that gave it away. Score, streaks, and a local leaderboard included.

Pure front-end. No build step, no backend, no dependencies. Just open it.

---

## Run it

**Option A — just open it**
Double-click `index.html`. That's the whole thing.

**Option B — local server** (nicer for voice/TTS on some browsers)
```bash
# from this folder
python -m http.server 8000
# then visit http://localhost:8000
```

**Option C — deploy (GitHub Pages)**
1. Push these files to a repo.
2. Settings → Pages → Branch: `main`, folder: `/root`.
3. Your game is live at `https://<user>.github.io/<repo>/`.

Works the same on Vercel/Netlify — it's a static site, point it at the folder and go.

---

## Files

| File | What it is |
|------|-----------|
| `index.html` | Structure + screens (start / game / results / settings). |
| `styles.css` | The whole look — light dual-pole theme, animations, responsive. |
| `data.js` | The content bank: 22 hand-built rounds (text, code, artwork, image, voice), each tagged with its tells. |
| `openrouter.js` | Optional live-generation module (see below). |
| `game.js` | The engine — deck building, rendering, scoring, reveal meter, SFX, confetti, leaderboard. |

Load order matters (`data → openrouter → game`); `index.html` already wires it correctly.

---

## How it plays

- Pick your round count (8 / 12 / 16) and hit **Start**.
- Each round shows one artifact. Read/look/listen, then press **Human** or **AI**.
- The **verdict meter** swings to the truth and 2–3 *tells* explain why.
- Scoring: **100** per correct answer **+ streak bonus** (each consecutive hit adds more). Miss and the streak resets.
- At the end: accuracy ring, stats, enter a name, land on the leaderboard. Top 10 persist in your browser (`localStorage`).

**On the voice rounds:** the browser reads a passage aloud with speech synthesis. The *voice* is always synthetic — you're judging whether the **writing** was authored by a human or an AI, which the round makes explicit.

**On the artwork rounds:** the images are original SVGs built for the game. "Human" pieces are intentional illustrations with a subject; "AI" pieces are procedural/rule-based patterns — the point is to train your eye on the difference.

**On the image rounds:** photographic scenes rendered for the game. The "AI" ones carry the tells generative image models are known for — a six-fingered hand, mismatched details, garbled sign text, impossible geometry — while the "real" ones hold together with one consistent light source and natural imperfection.

All sample content is original to this project, so there are no copyright strings attached.

---

## Optional: live AI rounds (OpenRouter)

The game is fully playable offline from the built-in bank. If you want **fresh, never-seen AI samples** generated on the fly, plug in an OpenRouter key:

1. Click the **⚙ Settings** button (top right).
2. Paste your OpenRouter API key.
3. (Optional) change the model — default is `google/gemini-2.0-flash-001`. Any OpenRouter chat model works.
4. Flip **Live rounds** on. Hit **Test key** to confirm it's valid.

When live mode is on, roughly 40% of AI rounds are generated fresh at play time; the rest come from the bank. If a request ever fails (offline, bad key, rate limit), the game silently falls back to the bank and keeps going — it never breaks the run.

**Your key stays in your browser** (`localStorage` only). It is never hardcoded, never sent anywhere except directly to OpenRouter's API from your own browser.

---

## Tech

Vanilla HTML/CSS/JS. Web Audio for SFX, Canvas for confetti, SpeechSynthesis for voice, SVG for artwork, `localStorage` for the leaderboard and settings. Respects `prefers-reduced-motion` and has keyboard focus styles.

Type `google/gemini-2.0-flash-001`, `anthropic/claude-3.5-sonnet`, or whatever you like into the model field — it's just passed through to OpenRouter.