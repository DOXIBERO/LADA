/* ============================================================
   LADA — A0 CURRICULUM (Darija ⟷ German)
   Anti-MSA: every explanation is street Moroccan Darija in
   Arabic script. Every word ships a memorable 3o9ola (mnemonic)
   so it sticks. Levels are true A0: sounds, numbers, time,
   the house, conversation, then grammar bits.
   ============================================================ */

export type TrapKey =
  | 'ich' | 'ach' | 'umlaut_o' | 'umlaut_u' | 'w_v' | 'ei' | 'eu'
  | 'z_ts' | 's_sharp' | 'st_sp' | 'sch' | 'tsch' | 'j_y' | 'ng'
  | 'g_hard' | 'r_uv' | 'h_breath' | 'short_vowel' | 'pf';

export interface Trap { label: string; tip: string }

export const TRAPS: Record<TrapKey, Trap> = {
  ich:        { label: 'ICH-LAUT [ç]',   tip: 'الـ ch مور i/e كاتجي «شش» خفيفة و نتي كاتتبسّمي. قول «إهيهي» ببسمة، عمرك «خ».' },
  ach:        { label: 'ACH-LAUT [x]',   tip: 'الـ ch مور a/o/u هي «خ» خفيفة: Buch = بوخ. هنا تقدر تشد الخا.' },
  umlaut_o:   { label: 'UMLAUT Ö',       tip: 'دير فمك «ou» و قول «é» — هاكا كاتخرج ö: schön = شون بفم مدوّر.' },
  umlaut_u:   { label: 'UMLAUT Ü',       tip: 'فمك «ou» و لسانك كايقول «i» — müde = موديه. جرّبها ببسمة.' },
  w_v:        { label: 'W = ڤ',          tip: 'الـ w فالألمانية هي «ڤ»: wo = ڤو، Wasser = ڤاسر. سنّانك الفوق فوق سنّانك التحت.' },
  ei:         { label: 'EI = آي',        tip: 'الـ ei ديما «آي»: nein = نَاين، heiß = هايس. عكس الإنجليزية!' },
  eu:         { label: 'EU = أوي',       tip: 'الـ eu كاتقرا «أوي»: Freunde = فروينده. بحال «oy» ف «boy».' },
  z_ts:       { label: 'Z = تس',         tip: 'الـ z هي «تس»: zwei = تسفاي، Zeit = تسايت. لسانك على سنّانك الفوق.' },
  s_sharp:    { label: 'SS / ß = س',     tip: 'الـ ß و ss = س حادة طويلة: Straße = شتراسه. ما ديرش «ز» هنا!' },
  st_sp:      { label: 'ST/SP = شت/شپ',  tip: 'فالبدا ديال الكلمة: st = «شت»، sp = «شپ»: Straße, sprechen. الشين ديال الشيش.' },
  sch:        { label: 'SCH = ش',        tip: 'الـ sch = ش نقية: schnell = شنيل. ساهل — ولكن ما تخلطهاش مع s.' },
  tsch:       { label: 'TSCH = تش',      tip: 'الـ tsch = «تش» بحال فالدارجة: tschüss = تشوس. هنا نتا فداركم!' },
  j_y:        { label: 'J = ي',          tip: 'الـ j فالألمانية هي «ي»: ja = يا. ما تقولش «جا» — هاديك هي الفخ!' },
  ng:         { label: 'NG = نغ',        tip: 'الـ ng = ن فالخيشوم، بلا g: danke = دانكه، Hunger = هونغر.' },
  g_hard:     { label: 'G = گ',          tip: 'الـ g ديما قاسحة «گ»: gut = گوت، Geld = گيلد. عمّرها ما كاتولي «j».' },
  r_uv:       { label: 'R الْحَلْقِيَّة', tip: 'الـ r كاتخرج من الحلق بحال غ خفيفة: fahren = فارغن. ما تفجعش الراء.' },
  h_breath:   { label: 'H منفوسة',       tip: 'الـ h ديما كاتنفّس: hallo = هالو. ما تبلعش الـ h.' },
  short_vowel:{ label: 'حرف قصير',       tip: 'الحرف القصير و الكونسون اللي موراه — هاد الميكس كايبدل المعنى: bitte = عفاك.' },
  pf:         { label: 'PF',             tip: 'الـ p+f فدفع واحد: Pferd. سبّ الهواء و قول «pf» بلا ما تفرقهم.' },
};

export interface Word {
  de: string;       // German
  ipa: string;      // phonetic
  dz: string;       // Darija — Arabic script (shown everywhere)
  ar: string;       // Arabic script (kept in sync with dz)
  mnemonic: string; // 3o9ola — Darija memory hook
  trap: TrapKey;
}

export interface LessonStep {
  title: string;    // Darija step title
  explain: string;  // Darija step-by-step explanation
  items: Word[];
  grammar?: string; // optional grammar injection
}

export interface Track {
  id: string;
  num: string;      // A0·01
  tier: string;
  title: string;    // Darija title
  titleDe: string;  // German title
  tagline: string;  // short hook
  bpm: number;
  root: number;
  goal: string;     // what you learn, Darija
  ma3na: string;
  qawa3id: string;
  steps: LessonStep[];
  words: Word[];    // flattened from steps
}

/* ---------- A0 lesson definitions ---------- */

const L = (
  id: string, num: string, title: string, titleDe: string, bpm: number, root: number,
  goal: string, ma3na: string, qawa3id: string, steps: LessonStep[],
): Track => ({ id, num, tier: `A0·${num}`, title, titleDe, tagline: titleDe, bpm, root, goal, ma3na, qawa3id, steps, words: steps.flatMap((s) => s.items) });

export const TRACKS: Track[] = [
  L('a01', '01', 'الحوُف والنُّطق', 'Laute', 100, 33,
    'الحروف الصعبة ديال الألمانية — كيفاش تنطقها بحال الألماني',
    'أول درس: قبل ما تهضر، خاصك تعرف الأصوات اللي كاتقلب المعنى. هادو 8 ديال الكلمات، كل وحدة كتعلّمك صوت.',
    'الصوت فالألمانية ماشي زينة — كايبدل المعنى! «schön» (زوين) و «schon» (دبا) غير نقطة.',
    [
      { title: 'الأصوات اللي ما كايناش فالدارجة', explain: 'هذ الأصوات جداد عليك. سمع كل كلمة، قولها بصوت عالي، و تذكّر العقلة ديالها.', items: [
        { de: 'schön', ipa: '/ʃøːn/', dz: 'زوِين', ar: 'زوِين', mnemonic: 'ö: دوّر فمك «ou» و قول «é» → «شُون». عقلة: شُون = شي حاجة زوينة!', trap: 'umlaut_o' },
        { de: 'ich', ipa: '/ɪç/', dz: 'أنا', ar: 'أنا', mnemonic: 'الـ ch هنا «شش» خفيفة ببسمة → «إِش». عقلة: إِش = أنا، و نتي كاتبتسم.', trap: 'ich' },
        { de: 'die Zeit', ipa: '/tsaɪt/', dz: 'الوقت', ar: 'الوقت', mnemonic: 'z = «تس» → «تْسايت». عقلة: التس كايجي فالوقت!', trap: 'z_ts' },
        { de: 'das Wasser', ipa: '/ˈvasɐ/', dz: 'الما', ar: 'الما', mnemonic: 'w = «ڤ» → «ڤاسَر». عقلة: الڤ كاتجري بحال الما.', trap: 'w_v' },
      ]},
      { title: 'الأصوات اللي كاتلعب عليك', explain: 'هادو باينين ساهلين ولكن فيهم الفخ. ركّز على العقلة باش ما تفلتش.', items: [
        { de: 'ei', ipa: '/aɪ/', dz: 'آي', ar: 'آي', mnemonic: 'الـ ei ديما «آي» (عكس الإنجليزية!). عقلة: nEIn = «نَاين» = لا… آي!', trap: 'ei' },
        { de: 'gut', ipa: '/ɡuːt/', dz: 'مزِيَان', ar: 'مزِيَان', mnemonic: 'g قاسحة «گ» → «گوت». عقلة: الگوت = المزيان، قاسح!', trap: 'g_hard' },
        { de: 'die Straße', ipa: '/ˈʃtʁaːsə/', dz: 'الزنقة', ar: 'الزنقة', mnemonic: 'ß = س طويلة + st = «شت» → «شتراسه». عقلة: الزنقة طويلة بحال الـ ß.', trap: 's_sharp' },
        { de: 'der Name', ipa: '/ˈnaːmə/', dz: 'السمية', ar: 'السمية', mnemonic: 'الـ a هنا «آ» واضحة → «نامَه». عقلة: السمية ديالك، قولها ب «آ».', trap: 'short_vowel' },
      ]},
    ],
  ),

  L('a02', '02', 'الأرقُم من صفر ل عشرة', 'Zahlen', 108, 31,
    'تعلّم تعدّ من 0 ل 10 — الأساس ديال كل شي: الفلوس، الوقت، العمر',
    'العدّ هو أول حاجة كاتحتاج: تشري شي حاجة، تقول عمرك، تشوف الثمن. غادي نتعلمو من null ل zehn بعقلة لكل رقم.',
    'فالعدّ، الـ zwei (جوج) كاتجي معا الـ z = «تس». و الـ zehn (عشرة) حتى هي ب «تس». تسنتبه!',
    [
      { title: 'من صفر ل خمسة', explain: 'قول كل رقم بصوت عالي. العقلة كتخليه يلصق ف الراس.', items: [
        { de: 'null', ipa: '/nʊl/', dz: 'صفر', ar: 'صفر', mnemonic: 'null = «نول» = والو، صفر. عقلة: النول = بلا والو.', trap: 'short_vowel' },
        { de: 'eins', ipa: '/aɪns/', dz: 'واحد', ar: 'واحد', mnemonic: 'eins = «آينس». عقلة: الـ ein وحدة = واحد.', trap: 'ei' },
        { de: 'zwei', ipa: '/tsvaɪ/', dz: 'جوُج', ar: 'جوُج', mnemonic: 'zwei = «تسْفاي». عقلة: التس = جوج سنّان.', trap: 'z_ts' },
        { de: 'drei', ipa: '/draɪ/', dz: 'ثلاثة', ar: 'تلاتة', mnemonic: 'drei = «دْراي». عقلة: الـ d بحال الدال = تلاتة.', trap: 'ei' },
        { de: 'vier', ipa: '/fiːɐ/', dz: 'ربعة', ar: 'ربعة', mnemonic: 'vier = «فير» (v = ف). عقلة: الفيَر = ربعة د الفصول.', trap: 'w_v' },
      ]},
      { title: 'من خمسة ل عشرة', explain: 'كمّل العدّ. ملي توصل لzehn، راك صافي كتعرف تعدّ بالألمانية!', items: [
        { de: 'fünf', ipa: '/fʏnf/', dz: 'خمسة', ar: 'خمسة', mnemonic: 'fünf = «فونف» (ü خفيفة). عقلة: الخمسة ديال الصلوات… فونف!', trap: 'umlaut_u' },
        { de: 'sechs', ipa: '/zɛks/', dz: 'ستة', ar: 'ستة', mnemonic: 'sechs = «زكس». عقلة: الـ s هنا «ز» خفيفة = ستة.', trap: 'short_vowel' },
        { de: 'sieben', ipa: '/ˈziːbən/', dz: 'سبعة', ar: 'سبعة', mnemonic: 'sieben = «زيبن». عقلة: الزي = سبعة أيام ف السيمانة.', trap: 'short_vowel' },
        { de: 'zehn', ipa: '/tseːn/', dz: 'عشرة', ar: 'عشرة', mnemonic: 'zehn = «تسين». عقلة: التسين = عشرة كاملة، تس!', trap: 'z_ts' },
      ]},
    ],
  ),

  L('a03', '03', 'الوقت و أيام السيمانة', 'Zeit & Tage', 116, 36,
    'أيام السيمانة السبعة + كيفاش تسول على الوقت و تجاوب',
    'باش تواعد شي حد ولا تعرف فين نتي فالسيمانة، خاصك الأيام. و باش ما تتأخرش، خاصك الوقت. هاد الدرس كيعطيك بجوج.',
    'باش تسول على الوقت: «Wie spät ist es?» = شحال فالوقت؟ الجواب: «Es ist drei Uhr» = الساعة ثلاثة.',
    [
      { title: 'أيام السيمانة', explain: 'الألماني كيخدم بالأيام. حفظهم بالعقلة: كل نهار فيه شي كلمة كتفكرك بيه.', items: [
        { de: 'Montag', ipa: '/ˈmoːntaːk/', dz: 'الاثنين', ar: 'الاثنين', mnemonic: 'Mond = القمر → مونتاگ. عقلة: الاثنين كاتشوف فيه القمر.', trap: 'short_vowel' },
        { de: 'Dienstag', ipa: '/ˈdiːnstaːk/', dz: 'الثلاثاء', ar: 'التلات', mnemonic: 'دينستاگ. عقلة: الـ Dienst = الخدمة، الثلاثاء نهار الخدمة.', trap: 'st_sp' },
        { de: 'Mittwoch', ipa: '/ˈmɪtvɔx/', dz: 'لاربع', ar: 'لاربع', mnemonic: 'Mitt = النص (وسط السيمانة!) → ميتڤوخ. عقلة: لاربع هي النص.', trap: 'ach' },
        { de: 'Donnerstag', ipa: '/ˈdɔnɐstaːk/', dz: 'لخميس', ar: 'لخميس', mnemonic: 'Donner = الرعد → دونرستاگ. عقلة: لخميس فيه الرعد.', trap: 'st_sp' },
        { de: 'Freitag', ipa: '/ˈfraɪtaːk/', dz: 'لجمعة', ar: 'لجمعة', mnemonic: 'frei = حر → فرايتاگ. عقلة: لجمعة نهار الحرية!', trap: 'ei' },
      ]},
      { title: 'السبت، الأحد، و الساعة', explain: 'كمل الأيام و تعلم كلمة الساعة باش تجاوب على الوقت.', items: [
        { de: 'Samstag', ipa: '/ˈzamstaːk/', dz: 'السبت', ar: 'السبت', mnemonic: 'سامستاگ. عقلة: السبت = السوق (سام)!', trap: 'st_sp' },
        { de: 'Sonntag', ipa: '/ˈzɔntaːk/', dz: 'لحد', ar: 'لحد', mnemonic: 'Sonne = الشمس → زونتاگ. عقلة: لحد فيه الشمس.', trap: 'short_vowel' },
        { de: 'die Uhr', ipa: '/uːɐ/', dz: 'الساعة', ar: 'الساعة', mnemonic: 'Uhr = «أور». عقلة: الأور = الساعة، الوقت كادور.', trap: 'r_uv' },
      ]},
    ],
  ),

  L('a04', '04', 'الحوايج اللي ف الدار', 'Zuhause', 124, 31,
    'سمّي كل حاجة كاينة فالدار: من الباب حتى الضو',
    'الدار هي العالم ديالك كل نهار. ملي كتعرف تسمّي الحوايج اللي حوالك، كتولي قادر توصف حياتك بالألمانية.',
    'كل اسم عندو أداة: der (مذكر) / die (مؤنث) / das (محايد). حفظ الأداة مع الاسم ديما!',
    [
      { title: 'الحوايج الكبار', explain: 'هذو الحوايج اللي كتشوفهم أول ما كتدخل للدار.', items: [
        { de: 'das Haus', ipa: '/haʊs/', dz: 'الدار', ar: 'الدار', mnemonic: 'Haus = «هاوس» (h منفوسة). عقلة: الهاوس = داركم.', trap: 'h_breath' },
        { de: 'die Tür', ipa: '/tyːɐ/', dz: 'الباب', ar: 'الباب', mnemonic: 'Tür = «تور» (ü خفيفة). عقلة: الباب كيدور.', trap: 'umlaut_u' },
        { de: 'das Bett', ipa: '/bɛt/', dz: 'السرير', ar: 'السرير', mnemonic: 'Bett = «بِت». عقلة: البت = البلاصة فين كاتبيت.', trap: 'short_vowel' },
        { de: 'der Tisch', ipa: '/tɪʃ/', dz: 'الطبلة', ar: 'الطبلة', mnemonic: 'Tisch = «تيش» (sch = ش). عقلة: التيش = الطبلة.', trap: 'sch' },
      ]},
      { title: 'الحوايج الصغار', explain: 'كمل: الكورسي، الكوزينة، الشباك، و الضو.', items: [
        { de: 'der Stuhl', ipa: '/ʃtuːl/', dz: 'الكورسي', ar: 'الكورسي', mnemonic: 'Stuhl = «شتول» (st = شت). عقلة: الشتول = الكورسي.', trap: 'st_sp' },
        { de: 'die Küche', ipa: '/ˈkʏçə/', dz: 'الكوزينة', ar: 'الكوزينة', mnemonic: 'Küche = «كوشه» (ch خفيفة + ü). عقلة: الكوزينة فين كيطيبو الكوش.', trap: 'ich' },
        { de: 'das Fenster', ipa: '/ˈfɛnstɐ/', dz: 'الشباك', ar: 'الشباك', mnemonic: 'Fenster = «فنستر». عقلة: الشباك كيشرف على الفن (المنظر).', trap: 'short_vowel' },
        { de: 'das Licht', ipa: '/lɪçt/', dz: 'الضو', ar: 'الضو', mnemonic: 'Licht = «ليشت» (ch خفيفة). عقلة: الليشت = الضو كيضي.', trap: 'ich' },
      ]},
    ],
  ),

  L('a05', '05', 'كيفاش تهدر مع الناس', 'Gespräch', 132, 33,
    'العبارات اللي كتحتاجهم باش تبدا محادثة: سلام، لاباس، شكرا، بسلامة',
    'هادا هو الدرس اللي كايخليك تهضر مع بني آدم من أول دقيقة. سلام، سوال على الحال، شكر، و وداع — هادو هم الأساس.',
    'فالألمانية كاينين بجوج «نتا»: du (للأصحاب) و Sie (رسمي، للكبار ولا اللي ما كتعرفهمش). مع الغرباء ديما Sie!',
    [
      { title: 'البداية: سلام و لاباس', explain: 'كيفاش تحيّي واحد و تسولو على الحال ديالو.', items: [
        { de: 'Hallo!', ipa: '/haˈloː/', dz: 'سلام!', ar: 'سلام', mnemonic: 'Hallo = «هالو». عقلة: بحال الـ hello ولكن بحرف واحد أقل.', trap: 'h_breath' },
        { de: 'Wie geht’s?', ipa: '/viː ɡeːts/', dz: 'لاباس؟', ar: 'لاباس', mnemonic: 'Wie geht’s = «ڤي گيتس». عقلة: ڤي گيتس = كيفاش الحال؟', trap: 'g_hard' },
        { de: 'Ja', ipa: '/jaː/', dz: 'آه', ar: 'آه', mnemonic: 'ja = «يا» (j = ي). عقلة: يا! = آه، موافق.', trap: 'j_y' },
        { de: 'Nein', ipa: '/naɪn/', dz: 'لا', ar: 'لا', mnemonic: 'nein = «نَاين» (ei = آي). عقلة: الناين = لا، عكس الإنجليزية!', trap: 'ei' },
      ]},
      { title: 'الأدب: شكرا، عفاك، بسلامة', explain: 'العبارات اللي كاتوري بلي نتا إنسان مربي — و كاتحل ليك البيبان.', items: [
        { de: 'Danke!', ipa: '/ˈdaŋkə/', dz: 'شكراً!', ar: 'شكرا', mnemonic: 'Danke = «دانكه» (ng فالخيشوم). عقلة: الشكر بالدانك.', trap: 'ng' },
        { de: 'Bitte!', ipa: '/ˈbɪtə/', dz: 'عفاك!', ar: 'عفاك', mnemonic: 'Bitte = «بيته». عقلة: البيت = عفاك / على حسابك.', trap: 'short_vowel' },
        { de: 'Entschuldigung', ipa: '/ɛntˈʃʊldɪɡʊŋ/', dz: 'سمح ليا', ar: 'سمح ليا', mnemonic: 'Entschuldigung = «إنتشولديگونغ». عقلة: طويلة ولكن تعني غير «سمح ليا».', trap: 'ng' },
        { de: 'Tschüss!', ipa: '/tʃʏs/', dz: 'بسلامة!', ar: 'بسلامة', mnemonic: 'Tschüss = «تشوس» (tsch = تش). عقلة: التشوس = بسلامة، بحال التش ديالنا.', trap: 'tsch' },
      ]},
    ],
  ),

  L('a06', '06', 'شوية ديال القواعد', 'Grammatik', 140, 36,
    'der/die/das، الفعل فالبلاصة الثانية، و الفرق بين du و Sie',
    'دابا راك كتعرف الكلمات — هاد الدرس كيعلمك كيفاش تلمهم فجملة صحيحة. قواعد بسيطة ولكن هما اللي كايخلو الكلام مفهوم.',
    'القاعدة الذهبية: الفعل ديما فالبلاصة الثانية فالجملة. «Ich BIN müde» — أنا كاعية. الـ bin فالبلاصة 2.',
    [
      { title: 'الأدوات: der, die, das', explain: 'كل اسم عندو أداة (بحال «ال» فالعربية). حفظها مع الاسم ديما!', items: [
        { de: 'der Mann', ipa: '/man/', dz: 'الراجل', ar: 'الراجل', mnemonic: 'der = للمذكر. عقلة: der Mann = الراجل، der بحال الـ «د».', trap: 'short_vowel' },
        { de: 'die Frau', ipa: '/fʁaʊ/', dz: 'المرا', ar: 'المرا', mnemonic: 'die = للمؤنث. عقلة: die Frau = المرا.', trap: 'r_uv' },
        { de: 'das Kind', ipa: '/kɪnt/', dz: 'الدرّي', ar: 'الدري', mnemonic: 'das = للمحايد. عقلة: das Kind = الدرّي الصغير.', trap: 'short_vowel' },
        { de: 'und', ipa: '/ʊnt/', dz: 'و', ar: 'و', mnemonic: 'und = «أونت» = و. عقلة: الأونت كاتربط بجوج حوايج.', trap: 'short_vowel' },
      ]},
      { title: 'الفعل و «نتا»', explain: 'الفعل كيدير فالبلاصة الثانية، و كاينين بجوج «نتا».', items: [
        { de: 'Ich bin…', ipa: '/ɪç bɪn/', dz: 'أنا…', ar: 'أنا', mnemonic: 'Ich bin = «إش بين». عقلة: الفعل bin فالبلاصة 2.', trap: 'ich' },
        { de: 'du', ipa: '/duː/', dz: 'نتا/نتي', ar: 'نتا', mnemonic: 'du = «دو» = نتا (للأحاب). عقلة: الدو = صاحبك.', trap: 'short_vowel' },
        { de: 'Sie', ipa: '/ziː/', dz: 'نتوما (رسمي)', ar: 'نتوما', mnemonic: 'Sie = «زي» = نتوما الرسمي. عقلة: الزي = الاحترام.', trap: 'short_vowel' },
        { de: 'nicht', ipa: '/nɪçt/', dz: 'ماشي', ar: 'ماشي', mnemonic: 'nicht = «نيشت» = ماشي/لا. عقلة: النيشت = النفي.', trap: 'ich' },
      ]},
    ],
  ),
];

export const ALL_WORDS: Word[] = TRACKS.flatMap((t) => t.words);
export const findWord = (de: string): Word | undefined => ALL_WORDS.find((w) => w.de.toLowerCase() === de.toLowerCase());
/** dz → Word lookup (used by the highway gate hint) */
export const DZ_TO_WORD: Record<string, Word> = Object.fromEntries(ALL_WORDS.map((w) => [w.dz, w]));
export const PASS_ACC = 0.85;   // Mastery Law I
export const PASS_COMBO = 10;   // Mastery Law II — 10x streak

/* ---------- LADA CORE coaching lines (on-device fallback, Darija) ---------- */

export const COACH: Record<TrapKey, string> = {
  ich:        'الـ ch ديالك خرجات «خ» قوية بزاف. دير تبسيمة و قول «ششش» خفيفة — ich, ich, ich.',
  ach:        'هنا الـ ch خاصها تكون «خ» خفيفة — Buch = بوخ. راك قريب، غير ركز الهواء فالحلق.',
  umlaut_o:   'الـ ö: دوّر فمك بحال «ou» و قول «é» فنفس الوقت. schön… schön… أيوا، هاكا دابا!',
  umlaut_u:   'الـ ü صعيبة شوية، ولكن نتا قدها: فمك «ou»، لسانك «i». müde — جرّبها دابا.',
  w_v:        'فالألمانية «w» هي «ڤ»: wo = ڤو. دير سنّانك الفوق فوق سنّانك التحت و فيبري شوية.',
  ei:         'تفكّر: «ei» = «آي» ديما. nein = ناين. الإنجليزية كاتخلط المخ — هنا كنقولو «آي» و صافي.',
  eu:         'الـ «eu» = «أوي»: Freunde = فروينده. بحال ما كاتقول «boy».',
  z_ts:       'الـ z = «تس»: zwei = تسفاي. لسانك خاصو يلقى سنّانك قبل ما يخرج الصوت.',
  s_sharp:    'الـ ß ماشي «ز» — هي «س» حادة و طويلة: Straße = شتراسه.',
  st_sp:      'فالبدا ديال الكلمة، «st» كاتولي «شت»: Straße. الألماني كيبدل الـ s بالشين.',
  sch:        'الـ sch = «ش» نقية، بلا زربة: schnell = شنيل. ساهل — كمّل هاكا.',
  tsch:       'الـ tsch هي «تش» ديالنا: tschüss = تشوس. هنا نتا فدارك، غير كمّل.',
  j_y:        'الـ j فالألمانية = «ي»: ja = يا! إلا قولتي «جا» غادي يفهموك «g» — رجع ل «يا».',
  ng:         'الـ ng فالآخر = ن فالخيشوم، بلا g: danke، Hunger. سدّ الهواء فالخيشوم و خليها ترن.',
  g_hard:     'الـ g ديما قاسحة «گ»: gut = گوت. ما تخليهاش توصل ل «j».',
  r_uv:       'الراء ديال الألماني كاتخرج من الحلق بحال «غ» خفيفة: fahren. ما تفجعش الراء.',
  h_breath:   'الـ h ديما كاتنفّس فالألمانية: hallo = هالو. عطيها شوية ديال الهواء.',
  short_vowel:'الحرف القصير هنا — bitte بت خفيفة. ما تمدش الـ i، خليه يدق و يمشي.',
  pf:         'الـ pf فدفع واحد: Pferd. بلا ما تفرق p و f — دفع واحد و صافي.',
};

export const QUIPS = [
  'مشيتي مزيان! المخ ديالك كيدخل الريتم.',
  'واخا الفخ، نتي بقيتي واقفة. هادا هو الحساب.',
  'كل غلطة = داطا جديدة فالـ LADA CORE. كمّل.',
  'الألمانية ماشي صعيبة — غير خاصها نيقة و شوية ديال الجونون.',
  'الكومبو ديالك بان كتر مزيان من الأوتوبان فعشيات الجمعة.',
  'سمع الكلمة بالأذن، ماشي غير بالعين. اللغة هي ريتم.',
  'عندك فهاد الكلمة — الـ CORE شافها فالـ profile ديالك.',
  'بالعقلة و الريتم، الكلمة غادي تلصق ف الراس ديالك.',
];

export const PRAISE = [
  'يا ستّار! هادا الصوت ديال الشامبيون.',
  'دابا 100% — الألماني غادي يقولو نتي من برلين.',
  'الفونيتيك ديالك بدا كاتشين بحال الماكينة.',
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
