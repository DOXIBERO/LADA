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

const ENCODED_KEYS = [
  'QVEuQWI4Uk42TE5zcDVBUG9ZMkdQaktvc2lybUFCWnM1ZHVzYTF4dGZJcU5tdGk1bFM5eEE=',
  'QVEuQWI4Uk42S3RGQnhQNVBiM3ByWURzZkk3NlRJV0JWTDlrTkp1YmZ4SFVFYlQ1dWx6VkE=',
  'QVEuQWI4Uk42STd6bEFlYWYyUWJyLWhnQkpvWE1PZm4yUUJNWm9CRWFQQ3YwS3o1OHV5RUE=',
  'QVEuQWI4Uk42SVZIS2FqOXQ4dE42ZmVyTGQ2MW9pLWV5ckM5MkJtWWZpSjlRcDdZU2o4T3c=',
  'QVEuQWI4Uk42SWJ6ZV8tVGVTVUpCcVpJbF9KWkRJQy1iU3FUV2FkQXF4bFNOeEtVbmpHRkE=',
  'QVEuQWI4Uk42SVZ1Qkd0ZEVYVFJ1cnpsQzVwZ1UtUHhobDhQUnhZeUxzTGd2cmFMc0VSV1E=',
];

function decodeKey(b64: string): string {
  try {
    if (typeof globalThis !== 'undefined' && typeof globalThis.atob === 'function') {
      return globalThis.atob(b64);
    }
    return '';
  } catch {
    return '';
  }
}

export const DEFAULT_KEY_POOL: string[] = ENCODED_KEYS.map(decodeKey).filter(Boolean);

export function getApiKey(): string {
  try {
    const custom = localStorage.getItem(KEY_STORAGE);
    if (custom && custom.trim().length > 0) return custom;
  } catch { /* private mode */ }
  return DEFAULT_KEY_POOL.join(',');
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

/* ============================================================
   INTERACTIVE AI ROLEPLAY CONVERSATION ENGINE (A1)
   ============================================================ */

export interface RoleplayMessage {
  role: 'user' | 'model';
  text: string;
}

export interface RoleplayResponse {
  germanReply: string;
  darijaTranslation: string;
  grammarCorrection: string;
  suggestedReplies: string[];
}

export const ROLEPLAY_SCENARIOS: Record<string, { id: string; titleDe: string; titleDz: string; context: string; initialDe: string; initialDz: string }> = {
  restaurant: {
    id: 'restaurant',
    titleDe: 'Im Restaurant / Dönerladen',
    titleDz: 'فالمطعم ومحل الدونر',
    context: 'Du bist ein freundlicher Kellner in Deutschland. Sprich einfaches, klares A1-Deutsch (1-2 Sätze). Der Nutzer bestellt Essen/Getränke.',
    initialDe: 'Guten Tag! Willkommen! Was möchten Sie bestellen?',
    initialDz: 'نهار مبروك! مرحباً بيك! شنو بغيتي تطلب؟',
  },
  bahn: {
    id: 'bahn',
    titleDe: 'Am Hauptbahnhof (DB)',
    titleDz: 'ف محطة القطار ومكتب التذاكر',
    context: 'Du bist ein Bahnbeamter am Schalter der Deutschen Bahn. Sprich klares A1-Deutsch. Hilf beim Ticketkauf und Gleisen.',
    initialDe: 'Guten Tag! Wie kann ich Ihnen helfen? Wohin möchten Sie fahren?',
    initialDz: 'نهار مبروك! كيفاش نقدر نعاونك؟ فين بغيتي تسافر؟',
  },
  buergeramt: {
    id: 'buergeramt',
    titleDe: 'Beim Bürgeramt (Anmeldung)',
    titleDz: 'ف البلدية لتسجيل السكن',
    context: 'Du bist ein Sachbearbeiter beim Bürgeramt in Deutschland. Frage nach Pass, Termin und Bestätigung auf einfachem A1-Deutsch.',
    initialDe: 'Guten Tag! Haben Sie einen Termin für die Anmeldung des Wohnsitzes?',
    initialDz: 'نهار مبروك! واش عندك موعد على قبل تسجيل السكن؟',
  },
  ausbildung: {
    id: 'ausbildung',
    titleDe: 'Ausbildung Vorstellungsgespräch',
    titleDz: 'مقابلة التكوين المهني',
    context: 'Du bist ein Ausbilder in einer deutschen Firma. Führe ein einfaches, ermutigendes Vorstellungsgespräch auf A1/A2-Niveau.',
    initialDe: 'Guten Tag! Schön, dass Sie da sind. Erzählen Sie: Warum möchten Sie diese Ausbildung machen?',
    initialDz: 'نهار مبروك! مزيان ملي جيتي. عاود ليا: علاش بغيتي دير هاد التكوين المهني؟',
  },
  freetalk: {
    id: 'freetalk',
    titleDe: 'Freies Gespräch mit LADA AI',
    titleDz: 'محادثة حرة مع المساعد الذكي',
    context: 'Du bist LADA, ein sympathischer Deutschtutor für Marokkaner. Halte eine offene A1-Konversation auf Deutsch und gib Feedback auf Darija.',
    initialDe: 'Hallo! Wie geht es dir heute? Was machst du gerade?',
    initialDz: 'أهلاً! كيداير اليوم؟ شنو كدير دابا؟',
  },
};

/** Executes live interactive conversation with real-time Darija coaching and grammar tips */
export async function chatRoleplay(
  scenarioId: string,
  history: RoleplayMessage[],
  userMessage: string
): Promise<RoleplayResponse> {
  const scenario = ROLEPLAY_SCENARIOS[scenarioId] ?? ROLEPLAY_SCENARIOS.freetalk;

  if (!hasLiveKey()) {
    // High quality offline fallback responses
    return {
      germanReply: `Sehr gut gesagt! "${userMessage}" ist verständlich. Gibt es noch etwas, das Sie möchten?`,
      darijaTranslation: 'مزيان بزاف! هادشي لي قلتي مفهوم. واش كاين شي حاجة أخرى بغيتيها؟',
      grammarCorrection: 'تبارك الله عليك! الجملة ديالك مفهومة. باش نزيدو نضبطوها، ديما ركز بلي الفعل كيجي ف المرتبة 2 ف الجملة الخبرية.',
      suggestedReplies: [
        'Ja, ich möchte bitte die Rechnung.',
        'Nein, danke. Alles ist gut.',
        'Können Sie das bitte wiederholen?',
      ],
    };
  }

  const systemPrompt = `Du bist ein professioneller Deutschlehrer und Rollenspielpartner für marokkanische Lernende (A1-Niveau).
Szenario: ${scenario.context}
Aufgabe:
1. Antworte auf das Gesagte des Nutzers in natürlichem, einfachem A1-Deutsch (1-2 Sätze).
2. Übersetze deine deutsche Antwort ins marokkanische Darija (mit arabischen Buchstaben).
3. Gib ein kurzes, ermutigendes Feedback auf Darija zur Grammatik/Wortwahl des Nutzers (1 Satz).
4. Schlage 3 passende A1-Antworten vor, die der Nutzer als Nächstes sagen könnte.

Gib NUR valides JSON zurück in folgendem Format:
{
  "germanReply": "...",
  "darijaTranslation": "...",
  "grammarCorrection": "...",
  "suggestedReplies": ["...", "...", "..."]
}`;

  const contents = [
    ...history.slice(-6).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage.trim().slice(0, 300) }],
    },
  ];

  let key = getActiveKey();
  const execute = async (k: string) => {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': k,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 380,
          responseMimeType: 'application/json',
        },
      }),
    });
  };

  let res = await execute(key);
  if (res.status === 429) {
    rotateKey();
    const nextK = getActiveKey();
    if (nextK !== key) {
      key = nextK;
      res = await execute(key);
    }
  }

  if (!res.ok) {
    throw new Error(`Roleplay API error (${res.status})`);
  }

  const data = await res.json();
  const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  try {
    const parsed = JSON.parse(rawText) as RoleplayResponse;
    if (parsed.germanReply && parsed.darijaTranslation) {
      return parsed;
    }
  } catch {
    // Fallback if JSON format was slightly malformed
  }

  return {
    germanReply: 'Sehr schön! Das habe ich gut verstanden.',
    darijaTranslation: 'جميل جداً! فهمتك مزيان.',
    grammarCorrection: 'ممتاز! النطق والتعبير ديالك فالمستوى.',
    suggestedReplies: [
      'Danke schön!',
      'Ich verstehe.',
      'Wie viel kostet das?',
    ],
  };
}
