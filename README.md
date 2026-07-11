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
| `index.html` | Structure + screens (start / game / results). |
| `styles.css` | The whole look — light dual-pole theme, animations, responsive. |
| `data.js` | The content bank: 22 hand-built rounds (text, code, artwork, image, voice), each tagged with its tells. |
| `game.js` | The engine — deck building, rendering, scoring, reveal meter, SFX, confetti, leaderboard. |

Load order is `data → game`; `index.html` already wires it correctly.

---

## How it plays

- Pick your round count (8 / 12 / 16) and hit **Start**.
- Each round shows one artifact. Read/look/listen, then press **Human** or **AI**.
- The **verdict meter** swings to the truth and 2–3 *tells* explain why.
- Scoring: **100** per correct answer **+ streak bonus** (each consecutive hit adds more). Miss and the streak resets.
- At the end: accuracy ring, stats, enter a name, land on the leaderboard. Top 10 persist in your browser (`localStorage`).

**Where the "human" samples come from:** every human round is real, sourced human work — not fabricated. Text is public-domain literature (Jerome K. Jerome, the Grossmiths, Mark Twain); code is real snippets from well-known open-source projects (`requests`, Express); artwork is public-domain paintings (Hokusai, Turner); and the photo rounds are real public-domain / CC0 photographs. The reveal names the exact source each time. The AI rounds are model-written text/code and real AI-generated images (Stable Diffusion outputs). Everything is attributed on reveal.

**On the voice rounds:** the browser reads a passage aloud with speech synthesis. The *voice* is always synthetic — you're judging whether the **writing** was authored by a human or an AI, which the round makes explicit.

**On the artwork rounds:** the "human" pieces are real public-domain paintings (Hokusai’s *Great Wave*, Turner’s *Shipwreck of the Minotaur*). The "AI" pieces are real generator outputs — a Stable Diffusion watercolour and a dreamlike landscape — embedded in the page. The point is to train your eye on the difference.

**On the image rounds:** the "real" ones are actual photographs (an espresso cup; astronaut Eileen Collins). The "AI" ones are real Stable Diffusion images — photorealistic-looking city renders that dissolve into impossible, incoherent detail when you look closely. Both are embedded in the page.

The human text, code, artwork and photo samples are real public-domain or permissively-licensed works. The AI text and code are model-written, and the AI images are real Stable Diffusion outputs. Everything is credited in full below; only the spoken audio is generated live in the browser.

---

## Tech

Vanilla HTML/CSS/JS, no dependencies and no backend. Web Audio for SFX, Canvas for confetti, SpeechSynthesis for the voice rounds, embedded images for the visual rounds, and `localStorage` for the leaderboard. Respects `prefers-reduced-motion` and has keyboard focus styles.

---

## Credits & licences

The **human** samples are real human work, included under their respective terms and attributed in-game on reveal:

**Text — public domain**
- Jerome K. Jerome, *Three Men in a Boat* (1889)
- George & Weedon Grossmith, *The Diary of a Nobody* (1892)
- Mark Twain, "The Awful German Language," from *A Tramp Abroad* (1880)

**Code — permissively licensed open source**
- `dotted_netmask()` from **psf/requests** — Apache License 2.0, © Kenneth Reitz and the requests contributors.
- `isAbsolute()` from **expressjs/express** (`lib/utils.js`) — MIT License, © the Express contributors (TJ Holowaychuk and others).

Both snippets are unmodified excerpts. Full licence texts: Apache-2.0 <https://www.apache.org/licenses/LICENSE-2.0>, MIT <https://opensource.org/license/mit>.

**Artwork — public domain**
- Katsushika Hokusai, *The Great Wave off Kanagawa* (c.1831).
- J. M. W. Turner, *The Shipwreck of the Minotaur* (c.1810).

**Photographs**
- Espresso cup — **CC0**, photographer Rachel Michetti.
- Astronaut Eileen Collins — **public domain**, NASA.

The painting and photo files are bundled (as embedded, downscaled images) via the **scikit-image** sample set (BSD-3-Clause) and public art collections; each is public-domain or CC0 as noted.

**AI images — genuine generator outputs**
- Two artworks (a watercolour, a dreamlike landscape) and two photorealistic city images are **Stable Diffusion** outputs from the **CompVis/stable-diffusion** demo assets. Purely AI-generated images carry no human authorship and are used here, with attribution, as authentic examples of machine-made imagery.

The **AI** text and code samples were model-generated for this project; the AI artwork and image samples are real Stable Diffusion outputs. Only the spoken audio is synthesized live in the browser.