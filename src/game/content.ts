/* ============================================================
   LADA — LINGUISTIC PAYLOAD
   Darija ⟷ German specialization. Strict anti-MSA: every
   explanation is street Moroccan Darija written in Arabic
   script (الدارجة بالحروف العربية), never الفصحى.
   ============================================================ */

export type TrapKey =
  | 'ich' | 'ach' | 'umlaut_o' | 'umlaut_u' | 'w_v' | 'ei' | 'eu'
  | 'z_ts' | 's_sharp' | 'st_sp' | 'sch' | 'tsch' | 'j_y' | 'ng'
  | 'g_hard' | 'r_uv' | 'h_breath' | 'short_vowel' | 'pf';

export interface Trap { label: string; tip: string }

export const TRAPS: Record<TrapKey, Trap> = {
  ich:        { label: 'ICH-LAUT [ç]',   tip: "الـ 'ch' ملي كيجي مور i/e — هو 'ش' خفيفة و نتي كات-تبسّمي. قولي 'ihihi' ب تبسيمة، عمّرك 'خ'." },
  ach:        { label: 'ACH-LAUT [x]',   tip: "الـ 'ch' مور a/o/u — هادي هي 'خ' خفيفة: Buch = بوخ. هنا تقدر تشدّ الخا." },
  umlaut_o:   { label: 'UMLAUT Ö',       tip: "دير فمّك 'ou' و قول 'é' — هاكا كاتخرج ö: schön = شون ب فمّ مدوّر." },
  umlaut_u:   { label: 'UMLAUT Ü',       tip: "فمّك 'ou'، لسانك كيقول 'i' — müde = مودي. جرّبها ب تبسيمة." },
  w_v:        { label: 'W = ڤ',          tip: "الـ w فالألمانيا هي 'ڤ': wo = ڤو، Wasser = ڤاسر. سنينك الفوق فوق سنينك التحت." },
  ei:         { label: 'EI = آي',        tip: "'ei' ديما 'آي': nein = نَاي، heiß = هَايس. عكس الإنجليزية، صافي؟" },
  eu:         { label: 'EU = أوي',       tip: "'eu' كاتقرا 'أوي': Freunde = فروينده. بحال 'oy' ف 'boy'." },
  z_ts:       { label: 'Z = تس',         tip: "z هي 'تس': zwei = تسفاي، Zeit = تسَايت. لسانك على سنينك الفوق." },
  s_sharp:    { label: 'SS / ß = س',     tip: "ß و 'ss' = س حادة طويلة: Straße = شتراسه. ما ديرش 'z' هنا!" },
  st_sp:      { label: 'ST/SP = شت/شپ',  tip: "فالبداية ديال الكلمة: st = 'شت'، sp = 'شپ': Straße، sprechen. الشين ديال الشيش." },
  sch:        { label: 'SCH = ش',        tip: "sch = ش نقية: schnell = شنيل. ساهل — ولكن ما تخلطش مع 's'." },
  tsch:       { label: 'TSCH = تش',      tip: "tsch = 'تش' بحال فالدارجة: tschüss = تشوس. هنا نتي ف داركم." },
  j_y:        { label: 'J = ي',          tip: "j فالألمانيا هي 'ي': ja = يا. ما تقولش 'جا' — هاديك هي الفخّ!" },
  ng:         { label: 'NG = نغ',        tip: "'ng' = ن فالخشيم، بلا g وحدة: danke = دَانْكْه، Hunger = هُونْغَر." },
  g_hard:     { label: 'G = گ',          tip: "g ديما قاسحة 'گ': gut = گوت، Geld = گيلد. عمّرها ما كاتولّي 'j'." },
  r_uv:       { label: 'R الحلقية',      tip: "r كاتخرج من الحلق بحال غ خفيفة: fahren = فَارْغَن. ما تفجعش الراء." },
  h_breath:   { label: 'H المهموسة',     tip: "h ديما كاتتنفّس: hallo = هَالو. ما تبلعش الـ h بحال كاين مرات فالدارجة." },
  short_vowel:{ label: 'فوايال قصيرة',   tip: "الفوايال قصيرة و الكونسون اللي مورها — هاد الميكس كيبدّل المعنى: bitte = عافاك." },
  pf:         { label: 'PF',             tip: "p+f فدفع واحد: Pferd. سبّ الهوا و قول 'pf' بلا ما تفرّقهم." },
};

export interface Word {
  de: string;      // German
  ipa: string;     // phonetic
  dz: string;      // Darija — Arabic script
  ar: string;      // Darija — Arabic script (display variant)
  trap: TrapKey;   // phonetic trap this word trains
}

export interface Track {
  id: string;
  tier: string;
  title: string;
  bpm: number;
  root: number;      // midi root for the synth engine
  tagline: string;
  ma3na: string;     // L-Ma3na — Darija punchline of the track
  qawa3id: string;   // Qawa3id — grammar hack in one Darija sentence
  words: Word[];
}

export const TRACKS: Track[] = [
  {
    id: 't1', tier: 'TIER 01', title: 'NACHTFAHRT', bpm: 112, root: 33,
    tagline: 'البداية — سلام، شكراً، بسلامة',
    ma3na: 'الباب ديال أي حديتة: تسلّم، تشكر، و تسلّك راسك بكلمة وحدة.',
    qawa3id: "الفعل ديما فالموضع رقم 2: 'Ich BIN mued'، 'Ich HABE Zeit'. الترتيب مرتّب — ما تخافش.",
    words: [
      { de: 'hallo',   ipa: '/haˈloː/',    dz: 'سلام',   ar: 'سلام',    trap: 'h_breath' },
      { de: 'danke',   ipa: '/ˈdaŋkə/',    dz: 'شكراً',  ar: 'شكراً',   trap: 'ng' },
      { de: 'ich',     ipa: '/ɪç/',        dz: 'أنا',    ar: 'أنا',     trap: 'ich' },
      { de: 'gut',     ipa: '/ɡuːt/',      dz: 'مزيان',  ar: 'مزيان',   trap: 'g_hard' },
      { de: 'ja',      ipa: '/jaː/',       dz: 'آه',     ar: 'آه',      trap: 'j_y' },
      { de: 'nein',    ipa: '/naɪn/',      dz: 'لا',     ar: 'لا',      trap: 'ei' },
      { de: 'bitte',   ipa: '/ˈbɪtə/',     dz: 'عافاك',  ar: 'عافاك',   trap: 'short_vowel' },
      { de: 'tschüss', ipa: '/tʃʏs/',      dz: 'بسلامة', ar: 'بسلامة',  trap: 'tsch' },
    ],
  },
  {
    id: 't2', tier: 'TIER 02', title: 'AUTOBAHN', bpm: 128, root: 31,
    tagline: 'الزنقة — لليسار، لليمين، بزربة',
    ma3na: 'طلع الحومة: لليسار، لليمين، فين كاينة الـ Bahnhof — ألمانيا كاتخدم بدقة.',
    qawa3id: 'كل اسم عندو الجندر: DER، DIE، DAS. حفظهم مع الاسم — der Mann، die Frau، das Auto. ما كاين قانون، كاين عادة!',
    words: [
      { de: 'die Straße', ipa: '/ˈʃtʁaːsə/', dz: 'الزنقة',  ar: 'الزنقة',  trap: 'st_sp' },
      { de: 'links',      ipa: '/lɪŋks/',    dz: 'لليسار',  ar: 'لليسار',  trap: 'short_vowel' },
      { de: 'rechts',     ipa: '/ʁɛçts/',    dz: 'لليمين',  ar: 'لليمين',  trap: 'ich' },
      { de: 'schnell',    ipa: '/ʃnɛl/',     dz: 'بزربة',   ar: 'بزربة',   trap: 'sch' },
      { de: 'langsam',    ipa: '/ˈlaŋzaːm/', dz: 'بشوية',   ar: 'بشوية',   trap: 'ng' },
      { de: 'wo',         ipa: '/voː/',      dz: 'فين',     ar: 'فين',     trap: 'w_v' },
      { de: 'zwei',       ipa: '/tsvaɪ/',    dz: 'جوج',     ar: 'جوج',     trap: 'z_ts' },
      { de: 'fahren',     ipa: '/ˈfaːʁən/',  dz: 'سوق',     ar: 'سوق',     trap: 'r_uv' },
    ],
  },
  {
    id: 't3', tier: 'TIER 03', title: 'FREIHEIT', bpm: 140, root: 36,
    tagline: 'القلب — الجيعا، العيا، الصحاب',
    ma3na: "شحال راك عيّان، شحال راك جيعان، و شنو كاتعني 'Freunde' — القلب ديال الكلام.",
    qawa3id: "الأوملاو ماشي زينة — كاتبدّل المعنى! 'schon' = ديجا، 'schön' = زوين. نقطة وحدة فوق الحرف كاتقلّب الكلمة.",
    words: [
      { de: 'schön',     ipa: '/ʃøːn/',      dz: 'زوين',   ar: 'زوين',   trap: 'umlaut_o' },
      { de: 'müde',      ipa: '/ˈmyːdə/',    dz: 'عيّان',  ar: 'عيّان',  trap: 'umlaut_u' },
      { de: 'Wasser',    ipa: '/ˈvasɐ/',     dz: 'الما',   ar: 'الما',   trap: 'w_v' },
      { de: 'Brot',      ipa: '/bʁoːt/',     dz: 'الخبز',  ar: 'الخبز',  trap: 'r_uv' },
      { de: 'Hunger',    ipa: '/ˈhʊŋɐ/',     dz: 'الجيعا', ar: 'الجيعا', trap: 'ng' },
      { de: 'heiß',      ipa: '/haɪs/',      dz: 'سخون',   ar: 'سخون',   trap: 'ei' },
      { de: 'Geld',      ipa: '/ɡɛlt/',      dz: 'الفلوس', ar: 'الفلوس', trap: 'g_hard' },
      { de: 'Freunde',   ipa: '/ˈfʁɔʏndə/',  dz: 'الصحاب', ar: 'الصحاب', trap: 'eu' },
    ],
  },
];

export const ALL_WORDS: Word[] = TRACKS.flatMap((t) => t.words);
export const findWord = (de: string): Word | undefined => ALL_WORDS.find((w) => w.de === de);
export const DZ_TO_WORD: Record<string, Word> = Object.fromEntries(ALL_WORDS.map((w) => [w.dz, w]));
export const PASS_ACC = 0.85;   // Mastery Law I
export const PASS_COMBO = 10;   // Mastery Law II — 10x streak

/* ---------- LADA CORE coaching lines (on-device, Darija) ---------- */

export const COACH: Record<TrapKey, string> = {
  ich:        "الـ 'ch' ديالك خرجات 'خ' قوية بزاف. دير تبسيمة و قول 'ششش' خفيفة — ich، ich، ich. الهوا كاتخرج بلا ما تهز الحلق.",
  ach:        "هنا الـ 'ch' خاصها تكون 'خ' خفيفة — Buch = بوخ. راك قريب، غير رخّز الهوا فالحلق.",
  umlaut_o:   "الـ ö: دوّر فمّك بحال 'ou' و قول 'é' فنفس الوقت. schön... schön... أيوا، هاكا دابا!",
  umlaut_u:   "الـ ü صعيبة شوية، ولكن نتي قدّها: فمّك 'ou'، لسانك 'i'. müde — جرّبها دابا.",
  w_v:        "فالألمانيا 'w' هي 'ڤ': wo = ڤو. در سنينك الفوق فوق سنينك التحت و فيبري شوية.",
  ei:         "تفكّر: 'ei' = 'آي' ديما. nein = ناي. الإنجليزية كاتخلط المخّ — هنا كنقولو 'آي' و صافي.",
  eu:         "'eu' = 'أوي': Freunde = فروينده. بحال ما كاتقول 'boy' — دخّل الـ w فالوسط.",
  z_ts:       "z = 'تس': zwei = تسفاي. لسانك خاصو يلقى سنينك قبل ما يخرج الصوت.",
  s_sharp:    "ß ماشي 'z' — هي 'س' حادة و طويلة: Straße = شتراسه. سبّ الهوا مع السنون.",
  st_sp:      "فالبداية ديال الكلمة، 'st' كاتولّي 'شت': Straße. الألماني كيبدّل الـ s ب شين، مشيتي معاه.",
  sch:        "sch = 'ش' نقية، بلا زربة: schnell = شنيل. ساهل — كمّل هاكا.",
  tsch:       "tsch هي 'تش' ديالنا: tschüss = تشوس. هنا نتي فدارك، غير كمّل.",
  j_y:        "'j' فالألمانيا = 'ي': ja = يا! إلا قلتي 'جا' غادي يفهموك 'g' — رجع ل 'يا'.",
  ng:         "'ng' فالآخر = ن فالخشيم، بلا g: danke، Hunger. سدّ الهوا فالخشيم و خلّيها ترنّ.",
  g_hard:     "g ديما قاسحة 'گ': gut = گوت. ما تخلّيهاش توصل ل 'j' — الألماني ما كيقولش 'jut'.",
  r_uv:       "الراء ديال الألماني كاتخرج من الحلق بحال 'غ' خفيفة: fahren. ما تفجعش الراء بحال فالدارجة.",
  h_breath:   "الـ h ديما كاتتنفّس فالألمانيا: hallo = هالو. أعطيها شوية ديال الهوا.",
  short_vowel:"الفوايال قصيرة هنا — bitte ب ت وحدة خفيفة. ما تمدّش الـ i، خلّيها تدق و تمشي.",
  pf:         "'pf' فدفع واحد: Pferd. بلا ما تفرّق p و f — دفع واحد و صافي.",
};

export const QUIPS = [
  'مشيتي مزيان! المخّ ديالك كيدخل فالريتم.',
  'واخا الفخّ، نتي بقيتي واقفا. هادا هو الحساب.',
  'كل غلطة = داطا جديدة فالـ LADA CORE. كمّل.',
  'الألمانيا ماشي صعيبة — غير خاصها نتيقة و شوية ديال الجنون.',
  'الكومبو ديالك بان كثر مزيان من الأوتوبان فعشيات الجمعة.',
  'سمع الكلمة بالودن، ماشي غير بالعين. اللغة هي ريتم.',
  'عندك فهاد الكلمة — الـ CORE شافها فالبروفيل ديالك.',
  'شوية بشوية كاتعمّر الميموار ديال البعيد.',
];

export const PRAISE = [
  'يا ساطار! هادا صوت ديال الشومبيون.',
  'دابا 100% — الألماني غادي يقولو نتي من برلين.',
  'الفونيتيك ديالك بدا كيشين بحال الماشينة.',
];

/* deterministic seeded rng — beatmaps must be reproducible */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
