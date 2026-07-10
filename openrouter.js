/* =========================================================================
   openrouter.js — optional live round generation
   -------------------------------------------------------------------------
   Everything here is OPTIONAL. The game plays fully from the curated bank in
   data.js with no key. If the player adds an OpenRouter key in Settings, we
   ask the model to write a *fresh* AI-authored sample (text or code) each
   round, so the pool never repeats and the challenge stays honest.

   The key is only ever stored in this browser's localStorage. It is never
   hard-coded and never sent anywhere except openrouter.ai.
   ========================================================================= */

const OpenRouter = (() => {
  const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

  // Prompts tuned so the output genuinely reads like fluent AI content —
  // that's the point: the player has to catch a *real* live-generated sample.
  const PROMPTS = {
    text: `Write a single short paragraph (55-80 words) of natural, general-audience \
writing on an everyday topic of your choice (a small observation, a mini review, a \
helpful tip). Do not mention that you are an AI. Return ONLY the paragraph, no quotes, \
no preamble, no title.`,
    code: `Write one small, self-contained function (12-22 lines) in either Python or \
JavaScript that does something ordinary (string/array/date utility). Include the kind \
of clear docstring/comments and tidy structure you would naturally produce. Return ONLY \
a fenced code block, nothing else.`
  };

  async function generate({ apiKey, model, type }) {
    if (!apiKey) throw new Error('No API key set.');
    const kind = (type === 'code') ? 'code' : 'text';

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': location.origin,
        'X-Title': 'Human or AI'
      },
      body: JSON.stringify({
        model: model || 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: PROMPTS[kind] }],
        temperature: 0.9,
        max_tokens: 400
      })
    });

    if (!res.ok) {
      let detail = '';
      try { detail = (await res.json())?.error?.message || ''; } catch (_) {}
      throw new Error(`OpenRouter ${res.status}${detail ? ': ' + detail : ''}`);
    }

    const data = await res.json();
    let out = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!out) throw new Error('Empty response from model.');

    let lang = 'python';
    if (kind === 'code') {
      const fence = out.match(/```(\w+)?\s*([\s\S]*?)```/);
      if (fence) {
        if (fence[1]) lang = fence[1].toLowerCase();
        out = fence[2].trim();
      }
      if (/function|=>|const |let |console\./.test(out) && lang === 'python') lang = 'javascript';
    } else {
      out = out.replace(/^["'\s]+|["'\s]+$/g, '');
    }

    return {
      id: 'live-' + Date.now(),
      type: kind,
      source: 'ai',
      live: true,
      title: kind === 'code' ? 'Code snippet' : 'Prose passage',
      content: out,
      lang,
      tells: [
        'This one was generated live by a model at OpenRouter for this very round.',
        kind === 'code'
          ? 'Look for the give-aways: even, tutorial-clean structure and comments that explain the obvious.'
          : 'Look for the give-aways: smooth balanced rhythm, hedging, and a tidy general conclusion.',
        'No lived-in specifics or rough edges — the fingerprints of machine-written content.'
      ]
    };
  }

  // Quick sanity check used by the Settings "Test key" button.
  async function test({ apiKey, model }) {
    const item = await generate({ apiKey, model, type: 'text' });
    return !!item.content;
  }

  return { generate, test };
})();

if (typeof window !== 'undefined') window.OpenRouter = OpenRouter;