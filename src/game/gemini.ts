/* ============================================================
   LADA — GEMINI LIVE CLIENT
   Real Google AI Studio (Gemini Flash) calls straight from the
   browser. The user pastes their OWN API key (starts with AIza)
   from https://aistudio.google.com/apikey — it is stored only in
   this browser's localStorage and never bundled or shipped.

   When a key is present the Level-1 tutor is LIVE Gemini.
   With no key it gracefully falls back to the on-device LADA CORE.
   ============================================================ */

const KEY_STORAGE = 'lada_gemini_key';
const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const TTS_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent`;

export function getApiKey(): string {
  try { return localStorage.getItem(KEY_STORAGE) ?? ''; } catch { return ''; }
}

export function isValidKeyFormat(k: string): boolean {
  const trimmed = k.trim();
  return /^AIza[0-9A-Za-z_-]{30,50}$/.test(trimmed) || /^AQ\.[0-9A-Za-z_.-]{35,85}$/.test(trimmed);
}

export function setApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (trimmed === '') {
      localStorage.setItem(KEY_STORAGE, '');
      return;
    }
    // Support single key or comma/space separated key pool
    const keys = trimmed.split(/[\s,;]+/).filter(Boolean);
    const validKeys = keys.filter(isValidKeyFormat);
    if (validKeys.length > 0) {
      localStorage.setItem(KEY_STORAGE, validKeys.join(','));
    }
  } catch { /* private mode */ }
}

export function clearApiKey(): void {
  try { localStorage.removeItem(KEY_STORAGE); } catch { /* noop */ }
}

let keyIdx = 0;

/** Returns the active key from the pool, or next on rotation */
export function getActiveKey(): string {
  const stored = getApiKey();
  if (!stored) return '';
  const pool = stored.split(',').map((s) => s.trim()).filter(Boolean);
  if (pool.length === 0) return '';
  return pool[keyIdx % pool.length];
}

export function rotateKey(): void {
  const stored = getApiKey();
  const pool = stored.split(',').filter(Boolean);
  if (pool.length > 1) {
    keyIdx = (keyIdx + 1) % pool.length;
  }
}

/** A usable Google AI Studio key starts with AIza or modern 2026 AQ. */
export function hasLiveKey(): boolean {
  const k = getActiveKey();
  return (k.startsWith('AIza') || k.startsWith('AQ.')) && k.length >= 30;
}

export const TUTOR_SYSTEM = `Nta hiya LADA — tuteur dyal l-Almaniya l l-Mgharba li kaybdaw mn SIFR (A0).
- Jawb DA2IMAN b darija maghribiya b l-7orof l-3arabiya (machi l-fos7a, 3emmerha).
- 3ti l-kelma l-Almaniya, kif katnTe9 (b 7orof 3arabiya), w l-ma3na dyalha.
- Khalli l-jawb 9sir: max 3 jomal. Koun drôl, street-smart, w khelli l-3o9ola (mnemonic) wa7da bach yt7fed.
- Ila so2lo 3la grammaire, chra7ha b darija f jomla wa7da basita.
- Ma thderch b l-engliziya wla l-fransiya — ghir darija + l-kelm l-Almaniya.`;

/** One-shot live tutor call. Throws on missing key / network / quota. Supports multi-key failover. */
export async function askTutor(userPrompt: string, extraContext = ''): Promise<string> {
  let key = getActiveKey();
  if (!key || !hasLiveKey()) throw new Error('no-key');

  const cleanPrompt = userPrompt.trim().slice(0, 300);
  if (!cleanPrompt) throw new Error('so2al khawi');

  const cleanContext = extraContext.trim().slice(0, 500);

  const executeCall = async (apiKey: string) => {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: TUTOR_SYSTEM + (cleanContext ? `\n\nCONTEXT DYAL DARS:\n${cleanContext}` : '') }] },
        contents: [{ role: 'user', parts: [{ text: cleanPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 220 },
      }),
    });
  };

  let res = await executeCall(key);

  // If rate-limited (429), try rotating to the next key in the pool
  if (res.status === 429) {
    rotateKey();
    const nextKey = getActiveKey();
    if (nextKey !== key) {
      key = nextKey;
      res = await executeCall(key);
    }
  }

  if (!res.ok) {
    if (res.status === 429) throw new Error('quota — l-mifta7 wsel l-limit, tsenna chwiya');
    if (res.status === 400 || res.status === 401 || res.status === 403) throw new Error('mifta7 machi sa7i7 — check API key...');
    throw new Error(`API error (${res.status})`);
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  if (!text.trim()) throw new Error('jawb khawi');
  return text.trim();
}

const pcmAudioCache = new Map<string, string>();

/** Synthesizes speech using Google AI Studio Gemini TTS (24kHz linear PCM). Caches responses. */
export async function synthesizeGeminiVoice(text: string, voiceName = 'Puck'): Promise<string> {
  const cleanText = text.trim().slice(0, 450);
  if (!cleanText) throw new Error('empty-text');

  const cacheKey = `${voiceName}:${cleanText}`;
  if (pcmAudioCache.has(cacheKey)) {
    return pcmAudioCache.get(cacheKey)!;
  }

  let key = getActiveKey();
  if (!key || !hasLiveKey()) throw new Error('no-key');

  const executeCall = async (apiKey: string) => {
    return fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: cleanText }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      }),
    });
  };

  let res = await executeCall(key);

  if (res.status === 429) {
    rotateKey();
    const nextKey = getActiveKey();
    if (nextKey !== key) {
      key = nextKey;
      res = await executeCall(key);
    }
  }

  if (!res.ok) {
    throw new Error(`TTS API error (${res.status})`);
  }

  const data = await res.json();
  const part = data?.candidates?.[0]?.content?.parts?.[0];
  const pcmBase64: string = part?.inlineData?.data ?? '';
  if (!pcmBase64) throw new Error('no-audio-data');

  // Cache up to 80 voice clips
  if (pcmAudioCache.size >= 80) {
    const firstKey = pcmAudioCache.keys().next().value;
    if (firstKey) pcmAudioCache.delete(firstKey);
  }
  pcmAudioCache.set(cacheKey, pcmBase64);

  return pcmBase64;
}
