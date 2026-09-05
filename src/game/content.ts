/* ============================================================
   LADA — LINGUISTIC PAYLOAD
   Darija ⟷ German specialization. Strict anti-MSA: every
   explanation is street Moroccan Darija, never الفصحى.
   Arcade surfaces use Latin Arabizi; Studio adds Arabic script.
   ============================================================ */

export type TrapKey =
  | 'ich' | 'ach' | 'umlaut_o' | 'umlaut_u' | 'w_v' | 'ei' | 'eu'
  | 'z_ts' | 's_sharp' | 'st_sp' | 'sch' | 'tsch' | 'j_y' | 'ng'
  | 'g_hard' | 'r_uv' | 'h_breath' | 'short_vowel' | 'pf';

export interface Trap { label: string; tip: string }

export const TRAPS: Record<TrapKey, Trap> = {
  ich:        { label: 'ICH-LAUT [ç]',   tip: "'ch' melli kayji mora i/e — hiya 'ش' و نتي كات-تبسّمي. 9oli 'ihihi' b tbessima, 3amrek 'kh'." },
  ach:        { label: 'ACH-LAUT [x]',   tip: "'ch' mora a/o/u — hadi hiya 'خ' خفيفة: Buch = بوخ. Hna tqder tched l-kha." },
  umlaut_o:   { label: 'UMLAUT Ö',       tip: "Dir fommek 'ou' w 9ol 'é' — haka katkhrej ö: schön = شون b fomm medowwer." },
  umlaut_u:   { label: 'UMLAUT Ü',       tip: "Fommek 'ou', lsanek kay9ol 'i' — müde = مودي. Jerrbha b tbessima." },
  w_v:        { label: 'W = ڤ',          tip: "l-w f l-Almaniya hiya 'ڤ': wo = ڤو, Wasser = ڤاسر. Snnek lfouq foug snnek lt7t." },
  ei:         { label: 'EI = آي',        tip: "'ei' dayman 'آي': nein = نَاي, heiß = هَايس. 3akس l-engliziya, safi?" },
  eu:         { label: 'EU = أوي',       tip: "'eu' kat9ra 'أوي': Freunde = فروينده. B7al 'oy' f 'boy'." },
  z_ts:       { label: 'Z = تس',         tip: "z hiya 'تس': zwei = تسفاي, Zeit = تسَايت. Lsanek 3la snnek lfou9." },
  s_sharp:    { label: 'SS / ß = س',     tip: "ß w 'ss' = س حادة طويلة: Straße = شتراسه. Ma tdirch 'z' hna!" },
  st_sp:      { label: 'ST/SP = شت/شپ',  tip: "f l-bda dyal l-kelma: st = 'شت', sp = 'شپ': Straße, sprechen. L-ch dyal الشيش." },
  sch:        { label: 'SCH = ش',        tip: "sch = ش نقية: schnell = شنيل. Sahl — walakin ma tkhelletch m3a 's'." },
  tsch:       { label: 'TSCH = تش',      tip: "tsch = 'تش' b7al f darija: tschüss = تشوس. Hna nti f darكم." },
  j_y:        { label: 'J = ي',          tip: "j f l-Almaniya hiya 'ي': ja = يا. Ma t9olch 'جا' — hadik hiya l-fakh!" },
  ng:         { label: 'NG = نغ',        tip: "'ng' = ن f l-khechm, bla g wa7da: danke = دَانْكْه, Hunger = هُونْغَر." },
  g_hard:     { label: 'G = گ',          tip: "g dayman 9as7a 'گ': gut = گوت, Geld = گيلد. 3emmerha ma katwelli 'j'." },
  r_uv:       { label: 'R L-7L9IYA',     tip: "r katkhrej mn l-7le9 b7al غ خفيفة: fahren = فَارْغَن. Ma tfje3ch l-rra." },
  h_breath:   { label: 'H MKHLOYTA',     tip: "h dayman kat-tnefes: hallo = هَالو. Ma تبلعch l-h b7al kayn merrat f darija." },
  short_vowel:{ label: 'VOYELLE QSIRA',  tip: "l-voyelle qsira w l-consonant li mora — had l-mix kaybaddel l-ma3na: bitte = 3afak." },
  pf:         { label: 'PF',             tip: "p+f f dfe3 wa7ed: Pferd. Sebb l-hwa w 9ol 'pf' bla ma tfereqhom." },
};

export interface Word {
  de: string;      // German
  ipa: string;     // phonetic
  dz: string;      // Darija — Latin Arabizi (arcade speed)
  ar: string;      // Darija — Arabic script (studio)
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
    tagline: "L-bda — salam, shokran, bslama",
    ma3na: "L-bab dyal ay 7ditha: tsalma, tchker, w slek rasek b kelma wa7da.",
    qawa3id: "L-fi3l dayman f l-blaSa numru 2: 'Ich BIN mued', 'Ich HABE Zeit'. L-ordre mretb — ma tkhafch.",
    words: [
      { de: 'hallo',   ipa: '/haˈloː/',    dz: 'salam',   ar: 'سلام',    trap: 'h_breath' },
      { de: 'danke',   ipa: '/ˈdaŋkə/',    dz: 'shokran', ar: 'شكراً',   trap: 'ng' },
      { de: 'ich',     ipa: '/ɪç/',        dz: 'ana',     ar: 'أنا',     trap: 'ich' },
      { de: 'gut',     ipa: '/ɡuːt/',      dz: 'mzyan',   ar: 'مزيان',   trap: 'g_hard' },
      { de: 'ja',      ipa: '/jaː/',       dz: 'ah',      ar: 'آه',      trap: 'j_y' },
      { de: 'nein',    ipa: '/naɪn/',      dz: 'la',      ar: 'لا',      trap: 'ei' },
      { de: 'bitte',   ipa: '/ˈbɪtə/',     dz: '3afak',   ar: 'عفاك',    trap: 'short_vowel' },
      { de: 'tschüss', ipa: '/tʃʏs/',      dz: 'bslama',  ar: 'بسلامة',  trap: 'tsch' },
    ],
  },
  {
    id: 't2', tier: 'TIER 02', title: 'AUTOBAHN', bpm: 128, root: 31,
    tagline: "Zen9a — liser, limen, bzerba",
    ma3na: "Tl3 l-7uma: liser, limen, fin kayn l-bahnhof — l-Almaniya katkhdam b precision.",
    qawa3id: "Koul ism 3ando l-jender: DER, DIE, DAS. 7fedha M3A l-ism — der Mann, die Frau, das Auto. Ma kayn 9anun, kayn 3ada!",
    words: [
      { de: 'die Straße', ipa: '/ˈʃtʁaːsə/', dz: 'zen9a',     ar: 'الزنقة',    trap: 'st_sp' },
      { de: 'links',      ipa: '/lɪŋks/',    dz: 'liser',     ar: 'ليسر',     trap: 'short_vowel' },
      { de: 'rechts',     ipa: '/ʁɛçts/',    dz: 'limen',     ar: 'ليمن',     trap: 'ich' },
      { de: 'schnell',    ipa: '/ʃnɛl/',     dz: 'bzerba',    ar: 'بزربة',    trap: 'sch' },
      { de: 'langsam',    ipa: '/ˈlaŋzaːm/', dz: 'bshwiya',   ar: 'بشوية',    trap: 'ng' },
      { de: 'wo',         ipa: '/voː/',      dz: 'fin',       ar: 'فين',      trap: 'w_v' },
      { de: 'zwei',       ipa: '/tsvaɪ/',    dz: 'jouj',      ar: 'جوج',      trap: 'z_ts' },
      { de: 'fahren',     ipa: '/ˈfaːʁən/',  dz: 'sou9',      ar: 'سوق',      trap: 'r_uv' },
    ],
  },
  {
    id: 't3', tier: 'TIER 03', title: 'FREIHEIT', bpm: 140, root: 36,
    tagline: "L-9alb — ji3a, 3ya, s7ab",
    ma3na: "Ch7al rak 3yyan, ch7al rak ji3an, w chno kay3ni 'Freunde' — l-9alb dyal l-klam.",
    qawa3id: "Umlaut machi zina — katbaddel l-ma3na! 'schon' = deja, 'schön' = zwin. Nokta wa7da foug l-7ref kat9elleb l-kelma.",
    words: [
      { de: 'schön',     ipa: '/ʃøːn/',      dz: 'zwin',    ar: 'زوين',    trap: 'umlaut_o' },
      { de: 'müde',      ipa: '/ˈmyːdə/',    dz: '3yyan',   ar: 'عيّان',   trap: 'umlaut_u' },
      { de: 'Wasser',    ipa: '/ˈvasɐ/',     dz: 'lma',     ar: 'الما',    trap: 'w_v' },
      { de: 'Brot',      ipa: '/bʁoːt/',     dz: 'khobz',   ar: 'الخبز',   trap: 'r_uv' },
      { de: 'Hunger',    ipa: '/ˈhʊŋɐ/',     dz: 'ji3a',    ar: 'الجيعا',  trap: 'ng' },
      { de: 'heiß',      ipa: '/haɪs/',      dz: 'skhon',   ar: 'سخون',    trap: 'ei' },
      { de: 'Geld',      ipa: '/ɡɛlt/',      dz: 'flous',   ar: 'الفلوس',  trap: 'g_hard' },
      { de: 'Freunde',   ipa: '/ˈfʁɔʏndə/',  dz: 's7ab',    ar: 'الصحاب',  trap: 'eu' },
    ],
  },
];

export const ALL_WORDS: Word[] = TRACKS.flatMap((t) => t.words);
export const findWord = (de: string): Word | undefined => ALL_WORDS.find((w) => w.de === de);
export const PASS_ACC = 0.85;   // Mastery Law I
export const PASS_COMBO = 10;   // Mastery Law II — 10x streak

/* ---------- LADA CORE coaching lines (on-device, Darija) ---------- */

export const COACH: Record<TrapKey, string> = {
  ich:        "L-'ch' dyalek khrejat 'kh' qwiya bzaf. Dir tbessima w 9ol 'ششش' khfifa — ich, ich, ich. L-hwa katkhrej bla ma thz l-7le9.",
  ach:        "Hna l-'ch' khassha tkon 'خ' خفيفة — Buch = بوخ. Rak 9rib, ghir rkhez l-hwa f l-7le9.",
  umlaut_o:   "L-ö: dowwer fommek b7al 'ou' w 9ol 'é' f nefs l-we9t. schön... schön... ayywa, haka dabt!",
  umlaut_u:   "L-ü s3iba chwiya, walakin nti 9daha: fommek 'ou', lsanek 'i'. müde — jerrbha daba.",
  w_v:        "F l-Almaniya 'w' hiya 'ڤ': wo = ڤو. Dir snnek lfouq foug snnek lt7t w vibri chwiya.",
  ei:         "Tfakker: 'ei' = 'آي' dayman. nein = ناي. L-engliziya katkhleط l-mkh — hna kan9lo 'آي' w safi.",
  eu:         "'eu' = 'أوي': Freunde = فروينده. B7al ma kat9ol 'boy' — dkhel l-w f l-west.",
  z_ts:       "z = 'تس': zwei = تسفاي. Lsanek khasso yl9a snnek 9bel ma ykhrej s-sot.",
  s_sharp:    "ß machi 'z' — hiya 'س' حادة w twila: Straße = شتراسه. Sebb l-hwa m3a s-snun.",
  st_sp:      "F l-bda dyal l-kelma, 'st' katwelli 'شت': Straße. L-Alman kaybeddel l-s b ch, mchiti m3ah.",
  sch:        "sch = 'ش' نقية, بلا زربة: schnell = شنيل. Sahl — kmmel hakka.",
  tsch:       "tsch hiya 'تش' dyalna: tschüss = تشوس. Hna nti f darek, ghir kemmel.",
  j_y:        "'j' f l-Almaniya = 'ي': ja = يا! Ila 9elti 'جا' ghadi yfhmok 'g' — rje3 l 'يا'.",
  ng:         "'ng' f l-akher = ن f l-khechm, bla g: danke، Hunger. Sedd l-hwa f l-khechm w khelliha trn.",
  g_hard:     "g dayman 9as7a 'گ': gut = گوت. Ma tkhallihach tsel l 'j' — l-Alman ma kay9olch 'jut'.",
  r_uv:       "Rr dyal l-Alman katkhrej mn l-7le9 b7al 'غ' خفيفة: fahren. Ma tfje3ch l-rra b7al f darija.",
  h_breath:   "H dayman kat-tnefes f l-Almaniya: hallo = هالو. 3tiha chwiya dyal l-hwa.",
  short_vowel:"L-voyelle qsira hna — bitte b ت وحدة خفيفة. Ma tmdeech l-i, khalih ydo9 w yemchi.",
  pf:         "'pf' f dfe3 wa7ed: Pferd. Bla ma tfere9 p w f — dfe3 wa7ed w safi.",
};

export const QUIPS = [
  "Mchiti mzyan! L-mkh dyalek kaydkhel l-rhythm.",
  "Wakha l-fakh, nti b9iti wa9fa. Hada howa l-7sab.",
  "Kol ghalta = data jdida f l-LADA CORE. Kemmel.",
  "L-Almaniya machi s3iba — ghir khassha nti9a w chwiya dyal l-jonun.",
  "Combo dyalek ban ktr mzyan mn l-autobahn f 3achiyat l-jem3a.",
  "Sme3 l-kelma b l-oden, machi ghir b l-3in. L-logha hiya rhythm.",
  "3andek fhad l-kelma — l-CORE chafha f l-profile dyalek.",
  "Bzerba bzerba kat-remplir l-mémoire dyal l-b3id.",
];

export const PRAISE = [
  "YA SATTAR! Hada sot dyal l-champion.",
  "Dabt 100% — l-Alman ra7 y9olo nti mn Berlin.",
  "L-phonétique dyalek bdat kat-chine b7al l-machine.",
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
