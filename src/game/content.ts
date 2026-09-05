/* ============================================================
   LADA — A0 CURRICULUM (Darija ⟷ German)
   Anti-MSA: every explanation is street Moroccan Darija in
   Arabic script. Every word ships a memorable 3o9ola (mnemonic)
   so it sticks. Levels are true A0: sounds, numbers, time,
   the house, conversation, then grammar bits.
   ============================================================ */

export type TrapKey =
  | 'ich' | 'ach' | 'umlaut_o' | 'umlaut_u' | 'w_v' | 'v_f' | 'ei' | 'eu'
  | 'z_ts' | 's_sharp' | 'st_sp' | 'sch' | 'tsch' | 'j_y' | 'ng'
  | 'g_hard' | 'r_uv' | 'h_breath' | 'short_vowel' | 'pf';

export interface Trap { label: string; tip: string }

export const TRAPS: Record<TrapKey, Trap> = {
  ich:        { label: 'ICH-LAUT [ç]',   tip: 'الـ ch مور i/e كاتجي «شش» خفيفة و نتي كاتتبسّمي. قول «إهيهي» ببسمة، عمرك «خ».' },
  ach:        { label: 'ACH-LAUT [x]',   tip: 'الـ ch مور a/o/u هي «خ» خفيفة: Buch = بوخ. هنا تقدر تشد الخا.' },
  umlaut_o:   { label: 'UMLAUT Ö',       tip: 'دير فمك «ou» و قول «é» (بحال eu ف peu) — haكا كاتخرج ö: schön = شون بفم مدوّر.' },
  umlaut_u:   { label: 'UMLAUT Ü',       tip: 'فمك «ou» و لسانك كايقول «i» (بحال u ف tu) — müde = موديه. جرّبها ببسمة.' },
  w_v:        { label: 'W = ڤ',          tip: 'الـ w فالألمانية هي «ڤ»: wo = ڤو، Wasser = ڤاسر. سنّانك الفوق فوق سنّانك التحت.' },
  v_f:        { label: 'V = ف',          tip: 'الـ v فالألمانية ديما كاتنطق «ف» (بحال f): vier = فير، Vater = فاتر. عكس الإنجليزية!' },
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
  de: string;          // German
  ipa: string;         // phonetic IPA
  phoneticAr: string;  // Moroccan Arabic phonetic transliteration
  dz: string;          // Darija — Arabic script (meaning)
  ar: string;          // Arabic script (kept in sync with dz)
  mnemonic: string;    // 3o9ola — Darija memory hook
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
  L('a01', '01', 'الحُرُوف والنُّطْق', 'Laute', 100, 33,
    'الحروف الصعبة ديال الألمانية — كيفاش تنطقها بحال الألماني',
    'أول درس: قبل ما تهضر، خاصك تعرف الأصوات اللي كاتقلب المعنى. هادو 8 ديال الكلمات، كل وحدة كتعلّمك صوت.',
    'الصوت فالألمانية ماشي زينة — كايبدل المعنى! «schön» (زوين) و «schon» (دبا) غير نقطة.',
    [
      { title: 'الأصوات اللي ما كايناش فالدارجة', explain: 'هذ الأصوات جداد عليك. سمع كل كلمة، قولها بصوت عالي، و تذكّر العقلة ديالها.', items: [
        { de: 'schön', ipa: '/ʃøːn/', phoneticAr: 'شُونْ', dz: 'زوِين', ar: 'زوِين', mnemonic: 'ö: دوّر فمك «ou» و قول «é» (بحال peu). عقلة: شُون = شي حاجة زوينة!', trap: 'umlaut_o' },
        { de: 'ich', ipa: '/ɪç/', phoneticAr: 'إِشْ', dz: 'أَنَا', ar: 'أنا', mnemonic: 'الـ ch هنا «شش» خفيفة ببسمة. عقلة: إِشْ = أنا، بتبسيمة!', trap: 'ich' },
        { de: 'die Zeit', ipa: '/tsaɪt/', phoneticAr: 'دِي تْسَايْتْ', dz: 'الوَقْتْ', ar: 'الوقت', mnemonic: 'z = «تس» ديما: تسايت = الوقت، غالي بحال الزيت الحرة!', trap: 'z_ts' },
        { de: 'das Wasser', ipa: '/ˈvasɐ/', phoneticAr: 'دَاسْ ڤَاسَرْ', dz: 'المَا', ar: 'الما', mnemonic: 'w = «ڤ» ديما: ڤاسر = الما كيجري بحال الواد!', trap: 'w_v' },
      ]},
      { title: 'الأصوات اللي كاتلعب عليك', explain: 'هادو باينين ساهلين ولكن فيهم الفخ. ركّز على العقلة باش ما تفلتش.', items: [
        { de: 'das Ei', ipa: '/aɪ/', phoneticAr: 'دَاسْ آيْ', dz: 'البَيْضَة', ar: 'البيضة', mnemonic: 'الـ ei ديما «آي»: دَاسْ آيْ = البيضة للفطور!', trap: 'ei' },
        { de: 'gut', ipa: '/ɡuːt/', phoneticAr: 'گُوتْ', dz: 'مْزْيَانْ', ar: 'مزيان', mnemonic: 'g قاسحة «گ» ديما: گوت = مزيان، قاسح!', trap: 'g_hard' },
        { de: 'die Straße', ipa: '/ˈʃtʁaːsə/', phoneticAr: 'دِي شْتْرَاسَه', dz: 'الشَّارِع / الزَّنْقَة', ar: 'الشارع', mnemonic: 'ß = س طويلة + st = «شت»: شتراسه = الزنقة الكبيرة!', trap: 's_sharp' },
        { de: 'der Name', ipa: '/ˈnaːmə/', phoneticAr: 'دِيرْ نَامَه', dz: 'السّمِيّة', ar: 'السمية', mnemonic: 'الـ a هنا مد بالفتحة: نامَه = السمية ديالك!', trap: 'short_vowel' },
      ]},
    ],
  ),

  L('a02', '02', 'الأرْقَام من 0 لـ 10', 'Zahlen', 108, 31,
    'تعلّم تعدّ من 0 ل 10 — الأساس ديال كل شي: الفلوس، الوقت، العمر',
    'العدّ هو أول حاجة كاتحتاج: تشري شي حاجة، تقول عمرك، تشوف الثمن. غادي نتعلمو من null ل zehn بعقلة لكل رقم.',
    'فالعدّ، الـ zwei (جوج) كاتجي معا الـ z = «تس». و الـ zehn (عشرة) حتى هي ب «تس». تسنتبه!',
    [
      { title: 'من صفر ل خمسة', explain: 'قول كل رقم بصوت عالي. العقلة كتخليه يلصق ف الراس.', items: [
        { de: 'null', ipa: '/nʊl/', phoneticAr: 'نُولْ', dz: 'صِفْر', ar: 'صفر', mnemonic: 'null = «نول» = والو، بحال كلمة nul بالدارجة: والو، صفر!', trap: 'short_vowel' },
        { de: 'eins', ipa: '/aɪns/', phoneticAr: 'آيْنْسْ', dz: 'وَاحِدْ', ar: 'واحد', mnemonic: 'eins = «آينس». عقلة: الـ ein وحدة = واحد!', trap: 'ei' },
        { de: 'zwei', ipa: '/tsvaɪ/', phoneticAr: 'تْسْڤَايْ', dz: 'جُوجْ', ar: 'جوج', mnemonic: 'zwei = «تسْفاي». عقلة: التس = جوج سنّان!', trap: 'z_ts' },
        { de: 'drei', ipa: '/draɪ/', phoneticAr: 'دْرَايْ', dz: 'تْلَاتَة', ar: 'تلاتة', mnemonic: 'drei = «دْراي». عقلة: الـ d بحال الدال = تلاتة!', trap: 'ei' },
        { de: 'vier', ipa: '/fiːɐ/', phoneticAr: 'فِيرْ', dz: 'رْبْعَة', ar: 'ربعة', mnemonic: 'vier = «فير» (v = ف). عقلة: الـ v = ف ديما: فير = ربعة د الفصول!', trap: 'v_f' },
      ]},
      { title: 'من خمسة ل عشرة', explain: 'كمّل العدّ. ملي توصل لzehn، راك صافي كتعرف تعدّ بالألمانية!', items: [
        { de: 'fünf', ipa: '/fʏnf/', phoneticAr: 'فُونْفْ', dz: 'خَمْسَة', ar: 'خمسة', mnemonic: 'fünf = «فونف» (ü بحال u ف tu). عقلة: الصلوات الخمس… فونف!', trap: 'umlaut_u' },
        { de: 'sechs', ipa: '/zɛks/', phoneticAr: 'زِكْسْ', dz: 'سْتَّة', ar: 'ستة', mnemonic: 'sechs = «زكس». عقلة: الـ s هنا «ز» خفيفة = ستة!', trap: 'short_vowel' },
        { de: 'sieben', ipa: '/ˈziːbən/', phoneticAr: 'زِيبْنْ', dz: 'سَبْعَة', ar: 'سبعة', mnemonic: 'sieben = «زيبن». عقلة: الزي = سبعة أيام ف السيمانة!', trap: 'short_vowel' },
        { de: 'acht', ipa: '/axt/', phoneticAr: 'أَخْتْ', dz: 'تْمْنْيَة', ar: 'تمنية', mnemonic: 'acht = «أخت» (ach خفيفة). عقلة: الأخت = 8 ف العائلة!', trap: 'ach' },
        { de: 'neun', ipa: '/nɔɪn/', phoneticAr: 'نُويْنْ', dz: 'تْسْعَة', ar: 'تسعة', mnemonic: 'neun = «نوين» (eu = أوي). عقلة: نوين = تسعة، قربنا ل عشرة!', trap: 'eu' },
        { de: 'zehn', ipa: '/tseːn/', phoneticAr: 'تْسِينْ', dz: 'عَشْرَة', ar: 'عشرة', mnemonic: 'zehn = «تسين». عقلة: التسين = عشرة كاملة، تس!', trap: 'z_ts' },
      ]},
    ],
  ),

  L('a03', '03', 'الوَقْتْ و أيَّام السِّيمَانَة', 'Zeit & Tage', 116, 36,
    'أيام السيمانة السبعة + كيفاش تسول على الوقت و تجاوب',
    'باش تواعد شي حد ولا تعرف فين نتي فالسيمانة، خاصك الأيام. و باش ما تتأخرش، خاصك الوقت. هاد الدرس كيعطيك بجوج.',
    'باش تسول على الوقت: «Wie spät ist es?» = شحال فالوقت؟ الجواب: «Es ist drei Uhr» = الساعة ثلاثة.',
    [
      { title: 'أيام السيمانة', explain: 'الألماني كيخدم بالأيام. حفظهم بالعقلة: كل نهار فيه شي كلمة كتفكرك بيه.', items: [
        { de: 'Montag', ipa: '/ˈmoːntaːk/', phoneticAr: 'مُونْتَاگْ', dz: 'التْنِينْ', ar: 'الاثنين', mnemonic: 'Mond = القمر: مونتاگ = الاثنين كاتشوف فيه القمر!', trap: 'short_vowel' },
        { de: 'Dienstag', ipa: '/ˈdiːnstaːk/', phoneticAr: 'دِينْسْتَاگْ', dz: 'التّْلَاتْ', ar: 'الثلاثاء', mnemonic: 'Dienst = الخدمة: دينستاگ = الثلاث نهار الخدمة!', trap: 'st_sp' },
        { de: 'Mittwoch', ipa: '/ˈmɪtvɔx/', phoneticAr: 'مِيتْڤُوخْ', dz: 'الأَرْبْعْ', ar: 'الاربعاء', mnemonic: 'Mitt = النص (وسط السيمانة!): ميتڤوخ = لاربع!', trap: 'ach' },
        { de: 'Donnerstag', ipa: '/ˈdɔnɐstaːk/', phoneticAr: 'دُونِرْسْتَاگْ', dz: 'الخْمِيسْ', ar: 'الخميس', mnemonic: 'Donner = الرعد: دونرستاگ = لخميس فيه الرعد!', trap: 'st_sp' },
        { de: 'Freitag', ipa: '/ˈfraɪtaːk/', phoneticAr: 'فْرَايْتَاگْ', dz: 'الجُّمُعَة', ar: 'الجمعة', mnemonic: 'frei = حر: فرايتاگ = لجمعة نهار الراحة والحرية!', trap: 'ei' },
      ]},
      { title: 'السبت، الأحد، و الساعة', explain: 'كمل الأيام و تعلم كلمة الساعة باش تجاوب على الوقت.', items: [
        { de: 'Samstag', ipa: '/ˈzamstaːk/', phoneticAr: 'زَامْسْتَاگْ', dz: 'السَّبْتْ', ar: 'السبت', mnemonic: 'سامستاگ = السبت نهار السوق والراحة!', trap: 'st_sp' },
        { de: 'Sonntag', ipa: '/ˈzɔntaːk/', phoneticAr: 'زُونْتَاگْ', dz: 'الأَحَدْ', ar: 'الاحد', mnemonic: 'Sonne = الشمس: زونتاگ = لحد فيه الشمس!', trap: 'short_vowel' },
        { de: 'die Uhr', ipa: '/uːɐ/', phoneticAr: 'دِي أُورْ', dz: 'السَّاعَة', ar: 'الساعة', mnemonic: 'Uhr = «أور»: الساعة، الوقت كيدور!', trap: 'r_uv' },
      ]},
    ],
  ),
  L('a04', '04', 'الحوَايِج اللي ف الدَّار', 'Zuhause', 124, 31,
    'سمّي كل حاجة كاينة فالدار: من الباب حتى الضو',
    'الدار هي العالم ديالك كل نهار. ملي كتعرف تسمّي الحوايج اللي حوالك، كتولي قادر توصف حياتك بالألمانية.',
    'كل اسم عندو أداة: der (مذكر) / die (مؤنث) / das (محايد). حفظ الأداة مع الاسم ديما!',
    [
      { title: 'الحوايج الكبار', explain: 'هذو الحوايج اللي كتشوفهم أول ما كتدخل للدار.', items: [
        { de: 'das Haus', ipa: '/haʊs/', phoneticAr: 'دَاسْ هَاوسْ', dz: 'الدَّار', ar: 'الدار', mnemonic: 'h منفوسة: هَاوسْ = الدار الكبيرة ديال العائلة!', trap: 'h_breath' },
        { de: 'die Tür', ipa: '/tyːɐ/', phoneticAr: 'دِي تُورْ', dz: 'البَاب', ar: 'الباب', mnemonic: 'ü خفيفة: دِي تُورْ = الباب اللي كايدوّر!', trap: 'umlaut_u' },
        { de: 'das Bett', ipa: '/bɛt/', phoneticAr: 'دَاسْ بِتْ', dz: 'الفْرَاشْ / السَّرِير', ar: 'السرير', mnemonic: 'e خفيفة: دَاسْ بِتْ = البلاصة فين كاتبات وترتاح!', trap: 'short_vowel' },
        { de: 'der Tisch', ipa: '/tɪʃ/', phoneticAr: 'دِيرْ تِيشْ', dz: 'الطَّبْلَة', ar: 'الطبلة', mnemonic: 'sch = ش: دِيرْ تِيشْ = الطبلة فين كاتاكل وتجمع!', trap: 'sch' },
      ]},
      { title: 'الحوايج الصغار', explain: 'كمل: الكورسي، الكوزينة، الشباك، و الضو.', items: [
        { de: 'der Stuhl', ipa: '/ʃtuːl/', phoneticAr: 'دِيرْ شْتُولْ', dz: 'الكُرْسِي', ar: 'الكرسي', mnemonic: 'st = شت: دِيرْ شْتُولْ = الكرسي حدا الطبلة!', trap: 'st_sp' },
        { de: 'die Küche', ipa: '/ˈkʏçə/', phoneticAr: 'دِي كُوشَه', dz: 'الكُوزِينَة', ar: 'الكوزينة', mnemonic: 'ü + ch خفيفة: كُوشَه بحال كوشة الحومة = الكوزينة الفاعلة!', trap: 'ich' },
        { de: 'das Fenster', ipa: '/ˈfɛnstɐ/', phoneticAr: 'دَاسْ فِنْسْتَرْ', dz: 'الشَّرْجَمْ', ar: 'الشرجم', mnemonic: 'فِنْسْتَرْ = الشرجم كيشوف ف منظر فنّان!', trap: 'short_vowel' },
        { de: 'das Licht', ipa: '/lɪçt/', phoneticAr: 'دَاسْ لِيشْتْ', dz: 'الضَّوْ', ar: 'الضو', mnemonic: 'ch خفيفة: لِيشْتْ = اللي شعلت، الضو المنوّر!', trap: 'ich' },
      ]},
    ],
  ),

  L('a05', '05', 'كِيفَاش تْهْضَر مع النَّاس', 'Gespräch', 132, 33,
    'العبارات اللي كتحتاجهم باش تبدا محادثة: سلام، لاباس، شكرا، بسلامة',
    'هادا هو الدرس اللي كايخليك تهضر مع بني آدم من أول دقيقة. سلام، سوال على الحال، شكر، و وداع — هادو هم الأساس.',
    'فالألمانية كاينين بجوج «نتا»: du (للأصحاب) و Sie (رسمي، للكبار ولا اللي ما كتعرفهمش). مع الغرباء ديما Sie!',
    [
      { title: 'البداية: سلام و لاباس', explain: 'كيفاش تحيّي واحد و تسولو على الحال ديالو.', items: [
        { de: 'Hallo!', ipa: '/haˈloː/', phoneticAr: 'هَالُو!', dz: 'سَلَامْ!', ar: 'سلام', mnemonic: 'h منفوسة: هَالُو = سلام عليكم بالحرارة!', trap: 'h_breath' },
        { de: 'Wie geht’s?', ipa: '/viː ɡeːts/', phoneticAr: 'ڤِي گِيتْسْ؟', dz: 'لَابَاسْ؟ / كِيدَايِرْ؟', ar: 'لاباس', mnemonic: 'w = ڤ و g قاسحة: ڤِي گِيتْسْ = كيفاش غادية الأمور؟', trap: 'g_hard' },
        { de: 'Ja', ipa: '/jaː/', phoneticAr: 'يَا', dz: 'إِييِه / آه', ar: 'آه', mnemonic: 'j = ي: يَا = إييه، نعم بكل تأكيد!', trap: 'j_y' },
        { de: 'Nein', ipa: '/naɪn/', phoneticAr: 'نَايْنْ', dz: 'لَا', ar: 'لا', mnemonic: 'ei = آي: نَايْنْ = لا، قاطعة وما فيهاش شك!', trap: 'ei' },
      ]},
      { title: 'الأدب: شكرا، عفاك، بسلامة', explain: 'العبارات اللي كاتوري بلي نتا إنسان مربي — و كاتحل ليك البيبان.', items: [
        { de: 'Danke!', ipa: '/ˈdaŋkə/', phoneticAr: 'دَانْكَه!', dz: 'شُكْراً!', ar: 'شكرا', mnemonic: 'ng خيشومية: دَانْكَه = شكراً بزاف على كل خير!', trap: 'ng' },
        { de: 'Bitte!', ipa: '/ˈbɪtə/', phoneticAr: 'بِيتَه!', dz: 'عَفَاكْ / مَرْحْبَا', ar: 'عفاك', mnemonic: 'حرف قصير: بِيتَه = عفاك ولا مرحبا بك، كلمة الأدب!', trap: 'short_vowel' },
        { de: 'Entschuldigung', ipa: '/ɛntˈʃʊldɪɡʊŋ/', phoneticAr: 'إِنْتْشُولْدِيگُونْ', dz: 'سْمَحْ لِيَّا', ar: 'سمح ليا', mnemonic: 'tsch = تش و ng خيشومية: إِنْتْشُولْدِيگُونْ = سمح ليا بزاف!', trap: 'ng' },
        { de: 'Tschüss!', ipa: '/tʃʏs/', phoneticAr: 'تْشُوسْ!', dz: 'بْسْلَامَة!', ar: 'بسلامة', mnemonic: 'tsch = تش و ü: تْشُوسْ = بسلامة وتهلا فراسك!', trap: 'tsch' },
      ]},
    ],
  ),

  L('a06', '06', 'قَوَاعِد ألمانية أساسية', 'Grammatik', 140, 36,
    'der/die/das، الفعل فالبلاصة الثانية، و الفرق بين du و Sie',
    'دابا راك كتعرف الكلمات — هاد الدرس كيعلمك كيفاش تلمهم فجملة صحيحة. قواعد بسيطة ولكن هما اللي كايخلو الكلام مفهوم.',
    'القاعدة الذهبية: الفعل ديما فالبلاصة الثانية فالجملة. «Ich BIN müde» — أنا كاعية. الـ bin فالبلاصة 2.',
    [
      { title: 'الأدوات: der, die, das', explain: 'كل اسم عندو أداة (بحال «ال» فالعربية). حفظها مع الاسم ديما!', items: [
        { de: 'der Mann', ipa: '/man/', phoneticAr: 'دِيرْ مَانْ', dz: 'الرَّاجِل', ar: 'الراجل', mnemonic: 'der للمذكر: دِيرْ مَانْ = الراجل!', trap: 'short_vowel' },
        { de: 'die Frau', ipa: '/fʁaʊ/', phoneticAr: 'دِي فْرَاوْ', dz: 'المْرَا', ar: 'المرا', mnemonic: 'die للمؤنث: دِي فْرَاوْ = المرا الكريمة!', trap: 'r_uv' },
        { de: 'das Kind', ipa: '/kɪnt/', phoneticAr: 'دَاسْ كِنْتْ', dz: 'الدَّرِّي الصَّغِير', ar: 'الدري', mnemonic: 'das للمحايد: دَاسْ كِنْتْ = الولد الصغير ولا الدري!', trap: 'short_vowel' },
        { de: 'und', ipa: '/ʊnt/', phoneticAr: 'أُونْتْ', dz: 'وْ (وَ)', ar: 'و', mnemonic: 'أُونْتْ = الواو اللي كتربط بين جوج حوايج!', trap: 'short_vowel' },
      ]},
      { title: 'الفعل و «نتا»', explain: 'الفعل كيدير فالبلاصة الثانية، و كاينين بجوج «نتا».', items: [
        { de: 'Ich bin…', ipa: '/ɪç bɪn/', phoneticAr: 'إِشْ بِنْ…', dz: 'أَنَا…', ar: 'أنا', mnemonic: 'الفعل ديما فالبلاصة 2: إِشْ بِنْ = أنا كاين!', trap: 'ich' },
        { de: 'du', ipa: '/duː/', phoneticAr: 'دُو', dz: 'نْتَا / نْتِي', ar: 'نتا', mnemonic: 'دُو = نتا ولا نتي (للأصحاب والعائلة)!', trap: 'short_vowel' },
        { de: 'Sie', ipa: '/ziː/', phoneticAr: 'زِي', dz: 'نْتُومَا (رسمي)', ar: 'نتوما', mnemonic: 'زِي بحرف كبير = نتوما ديال الاحترام مع الغرباء!', trap: 'short_vowel' },
        { de: 'nicht', ipa: '/nɪçt/', phoneticAr: 'نِشْتْ', dz: 'مَاشِي (نَفْي)', ar: 'ماشي', mnemonic: 'ch خفيفة: نِشْتْ = ماشي، كتقلب الجملة للنفي!', trap: 'ich' },
      ]},
    ],
  ),

  L('a07', '07', 'المَاكْلَة و الشْرَاب', 'Essen & Trinken', 112, 35,
    'سمّي الماكلة و الشراب الأساسي: الخبز، الما، القهوة، و السكر',
    'الجوع و العطش ما كيتسناوش! فهاد الدرس غاتعلم كيفاش تطلب ما تاكل و ما تشرب فالقهوة ولا المطعم.',
    'باش تطلب بأدب: «Ich möchte… bitte» = بغيت… عفاك. مثلا: «Ein Kaffee, bitte!» = قهوة، عفاك.',
    [
      { title: 'الشراب و القهوة', explain: 'كيفاش تطلب الشراب و شنو كدير فيه.', items: [
        { de: 'der Kaffee', ipa: '/ˈkafe/', phoneticAr: 'دِيرْ كَافِي', dz: 'القَهْوَة', ar: 'القهوة', mnemonic: 'دِيرْ كَافِي = القهوة كافية باش تصحصح الصباح!', trap: 'short_vowel' },
        { de: 'der Tee', ipa: '/teː/', phoneticAr: 'دِيرْ تِي', dz: 'أَتَايْ', ar: 'أتاي', mnemonic: 'دِيرْ تِي = براد أتاي كيهدّن الأعصاب!', trap: 'short_vowel' },
        { de: 'das Wasser', ipa: '/ˈvasɐ/', phoneticAr: 'دَاسْ ڤَاسَرْ', dz: 'المَا', ar: 'الما', mnemonic: 'w = ڤ: دَاسْ ڤَاسَرْ = الما البارد المنعش!', trap: 'w_v' },
        { de: 'der Zucker', ipa: '/ˈtsʊkɐ/', phoneticAr: 'دِيرْ تْسُوكرْ', dz: 'السُّكَّار', ar: 'السكر', mnemonic: 'z = تس: دِيرْ تْسُوكرْ = السكر اللي كيدوب ف الكاس!', trap: 'z_ts' },
      ]},
      { title: 'الماكلة الأساسية', explain: 'الحوايج اللي كتاكلهم كل نهار: الخبز، الحليب، و اللحم.', items: [
        { de: 'das Brot', ipa: '/bʁoːt/', phoneticAr: 'دَاسْ بْرُوتْ', dz: 'الخُبْز', ar: 'الخبز', mnemonic: 'r حلقية: دَاسْ بْرُوتْ = طرف الخبز السخون!', trap: 'r_uv' },
        { de: 'die Milch', ipa: '/mɪlç/', phoneticAr: 'دِي مِلْشْ', dz: 'الحْلِيب', ar: 'الحليب', mnemonic: 'ch خفيفة: دِي مِلْشْ = كاس الحليب الأبيض الصحي!', trap: 'ich' },
        { de: 'das Fleisch', ipa: '/flaɪʃ/', phoneticAr: 'دَاسْ فْلَايْشْ', dz: 'اللّْحَم', ar: 'اللحم', mnemonic: 'ei = آي و sch = ش: دَاسْ فْلَايْشْ = اللحم المحمر الفاعل!', trap: 'ei' },
        { de: 'der Apfel', ipa: '/ˈapfl̩/', phoneticAr: 'دِيرْ أَبْفِلْ', dz: 'التُّفَّاحَة', ar: 'التفاحة', mnemonic: 'pf دفعة واحدة: دِيرْ أَبْفِلْ = التفاحة البلدية المقرمشة!', trap: 'pf' },
      ]},
    ],
  ),

  L('a08', '08', 'الطّرِيق و البْلايْص', 'Unterwegs', 120, 38,
    'الاتجاهات و وسائل النقل: الطران، المحطة، ليمن، و ليسر',
    'باش ما تودرش فالمدينة، خاصك تفهم فين غادي و كيفاش تسول على الطريق.',
    'باش تسول على البلاصة: «Wo ist…?» = فين كاين…؟ مثلا: «Wo ist der Bahnhof?» = فين كاينا لابان؟',
    [
      { title: 'الاتجاهات فالزنقة', explain: 'ليمن، ليسر، و نيشان: الكلمات اللي كيعطيك البوليسي ولا الگيد.', items: [
        { de: 'rechts', ipa: '/ʁɛçts/', phoneticAr: 'غِيشْتْسْ', dz: 'عْلَى لِيمَن', ar: 'ليمن', mnemonic: 'ch خفيفة و ts: غِيشْتْسْ = دور على ليمن ديريكت!', trap: 'ich' },
        { de: 'links', ipa: '/lɪŋks/', phoneticAr: 'لِينْكْسْ', dz: 'عْلَى لِيسَرْ', ar: 'ليسر', mnemonic: 'ng خيشومية: لِينْكْسْ = دور على ليسر بلا تردد!', trap: 'ng' },
        { de: 'geradeaus', ipa: '/ɡəˈʁaːdəˈʔaʊs/', phoneticAr: 'گِيرَادِه‌آوْسْ', dz: 'كُودْ نِيشَان', ar: 'نيشان', mnemonic: 'g قاسحة: گِيرَادِه‌آوْسْ = سير نيشان كود بلا ما تعوج!', trap: 'g_hard' },
        { de: 'die Straße', ipa: '/ˈʃtʁaːsə/', phoneticAr: 'دِي شْتْرَاسَه', dz: 'الشَّارِع / الزَّنْقَة', ar: 'الشارع', mnemonic: 'st = شت و ß = س: شْتْرَاسَه = الشارع الكبير العريض!', trap: 'st_sp' },
      ]},
      { title: 'وسائل النقل و المحطة', explain: 'الطران، الطوموبيل، و لابان باش تسافر.', items: [
        { de: 'der Bahnhof', ipa: '/ˈbaːnhoːf/', phoneticAr: 'دِيرْ بَانْهُوفْ', dz: 'مَحَطَّة الطْرَان (لاَرگَار)', ar: 'المحطة', mnemonic: 'h منفوسة: دِيرْ بَانْهُوفْ = لارگار فين كيركب بنادم!', trap: 'h_breath' },
        { de: 'der Zug', ipa: '/tsuːk/', phoneticAr: 'دِيرْ تْسُوكْ', dz: 'الطْرَان', ar: 'الطران', mnemonic: 'z = تس: دِيرْ تْسُوكْ = الطران كيتسلت ف السكة بالسرعة!', trap: 'z_ts' },
        { de: 'das Auto', ipa: '/ˈaʊto/', phoneticAr: 'دَاسْ أُوتُو', dz: 'الطُّومُوبِيل', ar: 'الطوموبيل', mnemonic: 'دَاسْ أُوتُو = الطوموبيل ف الأوتوبان الألماني!', trap: 'short_vowel' },
        { de: 'das Ticket', ipa: '/ˈtɪkət/', phoneticAr: 'دَاسْ تِيكِيتْ', dz: 'التَّذْكِرَة (الوَرْقَة)', ar: 'التذكرة', mnemonic: 'دَاسْ تِيكِيتْ = الورقة ديال الركوب باش ما يقطعكش الكنترولور!', trap: 'short_vowel' },
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
  v_f:        'الـ v فالألمانية ديما كاتنطق «ف» بحال فـ «فاطمة»: vier = فير، Vater = فاتر. ما ديرش «ڤ» بحال فالفرنسية!',
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
