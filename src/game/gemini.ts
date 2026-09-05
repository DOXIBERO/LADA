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

export function getApiKey(): string {
  try { return localStorage.getItem(KEY_STORAGE) ?? ''; } catch { return ''; }
}

export function setApiKey(key: string): void {
  try { localStorage.setItem(KEY_STORAGE, key.trim()); } catch { /* private mode */ }
}

export function clearApiKey(): void {
  try { localStorage.removeItem(KEY_STORAGE); } catch { /* noop */ }
}

/** A usable Google AI Studio key starts with AIza */
export function hasLiveKey(): boolean {
  return getApiKey().startsWith('AIza');
}

export const TUTOR_SYSTEM = `Nta hiya LADA — tuteur dyal l-Almaniya l l-Mgharba li kaybdaw mn SIFR (A0).
- Jawb DA2IMAN b darija maghribiya b l-7orof l-3arabiya (machi l-fos7a, 3emmerha).
- 3ti l-kelma l-Almaniya, kif katnTe9 (b 7orof 3arabiya), w l-ma3na dyalha.
- Khalli l-jawb 9sir: max 3 jomal. Koun drôl, street-smart, w khelli l-3o9ola (mnemonic) wa7da bach yt7fed.
- Ila so2lo 3la grammaire, chra7ha b darija f jomla wa7da basita.
- Ma thderch b l-engliziya wla l-fransiya — ghir darija + l-kelm l-Almaniya.`;

/** One-shot live tutor call. Throws on missing key / network / quota. */
export async function askTutor(userPrompt: string, extraContext = ''): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error('no-key');

  const res = await fetch(`${ENDPOINT}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: TUTOR_SYSTEM + (extraContext ? `\n\nCONTEXT DYAL DARS:\n${extraContext}` : '') }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 220 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    if (res.status === 429) throw new Error('quota — l-mifta7 wsel l-limit, tsenna chwiya');
    if (res.status === 400 || res.status === 401 || res.status === 403) throw new Error('mifta7 machi sa7i7 — check AIza...');
    throw new Error(`API ${res.status}: ${detail.slice(0, 90)}`);
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  if (!text.trim()) throw new Error('jawb khawi');
  return text.trim();
}
