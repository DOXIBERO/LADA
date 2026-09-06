/* ============================================================
   LADA — 30-DAY GOETHE A1 LEARNING TIMELINE & ROADMAP
   Structured step-by-step curriculum taking Moroccan learners
   from absolute zero to Goethe-Zertifikat A1 exam readiness.
   ============================================================ */

export interface TimelineDay {
  day: number;
  stageId: number;
  titleDz: string;
  titleDe: string;
  objectiveDz: string;
  durationMinutes: number;
  unitId: string;
  tabTarget?: 'words' | 'dialog' | 'grammar' | 'sentence' | 'listening';
  skills: ('hören' | 'sprechen' | 'lesen' | 'schreiben')[];
  isCheckpoint?: boolean;
  checkpointSummaryDz?: string;
  keyPhrases: { de: string; dz: string }[];
}

export interface TimelineStage {
  id: number;
  number: number;
  titleDz: string;
  titleDe: string;
  weeksDz: string;
  color: 'emerald' | 'cyan' | 'indigo' | 'amber';
  icon: string;
  descriptionDz: string;
  daysRange: string;
}

export const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: 1,
    number: 1,
    titleDz: 'المرحلة 1: الانطلاقة والتأسيس الشامل',
    titleDe: 'Phase 1: Fundament & Erste Schritte',
    weeksDz: 'الأسبوع الأول (الأيام 1 – 7)',
    color: 'emerald',
    icon: '🌱',
    descriptionDz: 'مخارج الحروف الصعبة، التحيات، تقديم النفس، الأرقام وحساب الفلوس، ونقطة التفتيش الأولى.',
    daysRange: 'الأيام 1–7',
  },
  {
    id: 2,
    number: 2,
    titleDz: 'المرحلة 2: الحياة اليومية والماكلة والتسوق',
    titleDe: 'Phase 2: Alltag, Essen & Einkaufen',
    weeksDz: 'الأسبوع الثاني (الأيام 8 – 14)',
    color: 'cyan',
    icon: '🛒',
    descriptionDz: 'الطلب فالمطعم، معركة الكاسة فـ Aldi، أداة النصب Akkusativ، نفي الجمل، وقوانين الـ Pfand.',
    daysRange: 'الأيام 8–14',
  },
  {
    id: 3,
    number: 3,
    titleDz: 'المرحلة 3: المواصلات والبلدية في ألمانيا',
    titleDe: 'Phase 3: Unterwegs, Bahn & Behörden',
    weeksDz: 'الأسبوع الثالث (الأيام 15 – 21)',
    color: 'indigo',
    icon: '🚆',
    descriptionDz: 'محطة القطار والروطار، الأفعال المنفصلة، تسجيل السكن Anmeldung، وقوانين Ruhezeit الألمانية.',
    daysRange: 'الأيام 15–21',
  },
  {
    id: 4,
    number: 4,
    titleDz: 'المرحلة 4: التكوين المهني ومحاكاة امتحان A1',
    titleDe: 'Phase 4: Ausbildung & Prüfungssimulation',
    weeksDz: 'الأسبوع الرابع (الأيام 22 – 30)',
    color: 'amber',
    icon: '🎓',
    descriptionDz: 'مقابلة العمل، الأفعال المساعدة، كروت الشفوي، قوالب الإيميل، وامتحان تجريبي كامل للتخرج.',
    daysRange: 'الأيام 22–30',
  },
];

export const TIMELINE_DAYS: TimelineDay[] = [
  /* ============================================================
     STAGE 1: DAYS 1 - 7 (FOUNDATION)
     ============================================================ */
  {
    day: 1,
    stageId: 1,
    titleDz: 'مخارج الحروف والتحيات الأولى',
    titleDe: 'Phonetik & Begrüßung',
    objectiveDz: 'تعلم كيفاش تنطق Hallo و Guten Tag بنطق نقي بدون لكنة فرنسية أو عربية قاصحة.',
    durationMinutes: 15,
    unitId: 'a1_01',
    tabTarget: 'words',
    skills: ['hören', 'sprechen'],
    keyPhrases: [
      { de: 'Hallo!', dz: 'أهلاً / سلام' },
      { de: 'Guten Tag!', dz: 'نهار مبروك / السلام عليكم' },
      { de: 'Guten Morgen!', dz: 'صباح الخير' },
    ],
  },
  {
    day: 2,
    stageId: 1,
    titleDz: 'تقديم النفس: سميتك وأصلك',
    titleDe: 'Sich vorstellen (Name & Herkunft)',
    objectiveDz: 'تقول سميتك وأنك جاي من المغرب بكل ثقة وتفهم جواب الشخص لاخر.',
    durationMinutes: 15,
    unitId: 'a1_01',
    tabTarget: 'words',
    skills: ['sprechen', 'schreiben'],
    keyPhrases: [
      { de: 'Ich heiße…', dz: 'سميتي…' },
      { de: 'Ich komme aus Marokko.', dz: 'أنا جاي من المغرب.' },
      { de: 'Wie heißen Sie?', dz: 'شنو سمية حضرتك؟' },
    ],
  },
  {
    day: 3,
    stageId: 1,
    titleDz: 'السكن والمدينة وفعل السكن wohnen',
    titleDe: 'Wohnort & Verbkonjugation',
    objectiveDz: 'تقول فين ساكن وتصرف الأفعال الأساسية فالحاضر (wohnen, kommen, sein).',
    durationMinutes: 15,
    unitId: 'a1_01',
    tabTarget: 'grammar',
    skills: ['lesen', 'schreiben'],
    keyPhrases: [
      { de: 'Ich wohne in Frankfurt.', dz: 'كنسكن فـ فرانكفورت.' },
      { de: 'Wo wohnen Sie?', dz: 'فين ساكن حضرتك؟' },
    ],
  },
  {
    day: 4,
    stageId: 1,
    titleDz: 'الأرقام من 1 لـ 100 وحساب الفلوس',
    titleDe: 'Zahlen 1-100 & Preise',
    objectiveDz: 'تنطق وتسمع الأرقام الألمانية المركبة (الأرقام بالمقلوب بحال العربية: خمسة وعشرون = fünfundzwanzig).',
    durationMinutes: 15,
    unitId: 'a1_02',
    tabTarget: 'words',
    skills: ['hören', 'schreiben'],
    keyPhrases: [
      { de: 'eins, zwei, drei', dz: 'واحد، جوج، ثلاثة' },
      { de: 'fünfundzwanzig Euro', dz: '25 يورو' },
    ],
  },
  {
    day: 5,
    stageId: 1,
    titleDz: 'أيام الأسبوع والوقت وساعات اليوم',
    titleDe: 'Wochentage & Uhrzeit',
    objectiveDz: 'حفظ أيام الأسبوع وضبط حروف الجر الزمنية: am Montag و um 10 Uhr.',
    durationMinutes: 15,
    unitId: 'a1_04',
    tabTarget: 'grammar',
    skills: ['lesen', 'hören'],
    keyPhrases: [
      { de: 'am Montag', dz: 'نهار الاثنين' },
      { de: 'um wie viel Uhr?', dz: 'مع شحال د الساعة؟' },
    ],
  },
  {
    day: 6,
    stageId: 1,
    titleDz: 'الضمائر والفرق الصارم بين Sie و du',
    titleDe: 'Personalpronomen & Höflichkeit',
    objectiveDz: 'تعرف وقتاش تستعمل Sie الاحترام و du مع الصحاب، وتصريف فعل sein (الكينونة).',
    durationMinutes: 15,
    unitId: 'a1_01',
    tabTarget: 'grammar',
    skills: ['sprechen', 'lesen'],
    keyPhrases: [
      { de: 'Sind Sie Herr Müller?', dz: 'واش نتا هو السيد مولر؟' },
      { de: 'Bist du Yassine?', dz: 'واش نتا ياسين؟' },
    ],
  },
  {
    day: 7,
    stageId: 1,
    titleDz: 'نقطة التفتيش 1: مراجعة المرحلة الأولى',
    titleDe: 'Checkpoint 1: Basis-Test',
    objectiveDz: 'اختبار شامل لجميع الكلمات والحوارات وقواعد الأسبوع الأول للتأكد من التثبيت 100%.',
    durationMinutes: 20,
    unitId: 'a1_01',
    tabTarget: 'sentence',
    isCheckpoint: true,
    checkpointSummaryDz: '🎉 برافو! ساليتي الأسبوع الأول وضبطتي أساسيات النطق وتقديم النفس وتصريف الحاضر.',
    skills: ['hören', 'sprechen', 'lesen', 'schreiben'],
    keyPhrases: [
      { de: 'Ich lerne Deutsch für die Ausbildung.', dz: 'كنتعلم الألمانية على قبل التكوين المهني.' },
    ],
  },

  /* ============================================================
     STAGE 2: DAYS 8 - 14 (DAILY LIFE & FOOD)
     ============================================================ */
  {
    day: 8,
    stageId: 2,
    titleDz: 'الأكل والشرب وأدوات التعريف (der, die, das)',
    titleDe: 'Essen, Trinken & Artikel',
    objectiveDz: 'حفظ أسماء الأطعمة والمشروبات مع أدوات التعريف الصحيحة بلا خلط.',
    durationMinutes: 15,
    unitId: 'a1_02',
    tabTarget: 'words',
    skills: ['lesen', 'hören'],
    keyPhrases: [
      { de: 'der Kaffee / das Wasser / die Pizza', dz: 'القهوة / الما / البيتزا' },
    ],
  },
  {
    day: 9,
    stageId: 2,
    titleDz: 'الطلب بأدب فالمقهى والمطعم والدونير',
    titleDe: 'Bestellen im Restaurant & Café',
    objectiveDz: 'استعمال صيغة الأدب الألمانية الأرقى: "Ich möchte bitte..." وتحديد الحجم والإضافات.',
    durationMinutes: 15,
    unitId: 'a1_02',
    tabTarget: 'dialog',
    skills: ['sprechen', 'hören'],
    keyPhrases: [
      { de: 'Ich möchte bitte einen Kaffee.', dz: 'بغيت عفاك واحد القهوة.' },
      { de: 'Zusammen oder getrennt?', dz: 'مجموعين ولا كل واحد بوحدو؟' },
    ],
  },
  {
    day: 10,
    stageId: 2,
    titleDz: 'معركة السوبرماركت (Aldi/Lidl) والكاسة',
    titleDe: 'Supermarkt & an der Kasse',
    objectiveDz: 'فهم سرعة الكاشير، الأداء بلاكارت، وطلب التوصيل أو رفضه بذكاء.',
    durationMinutes: 15,
    unitId: 'a1_02',
    tabTarget: 'dialog',
    skills: ['hören', 'sprechen'],
    keyPhrases: [
      { de: 'Mit Karte, bitte!', dz: 'بـ لاكارت عفاك!' },
      { de: 'Brauchen Sie den Bon? - Nein danke!',
        dz: 'محتاج التوصيل؟ - لا شكراً!' },
    ],
  },
  {
    day: 11,
    stageId: 2,
    titleDz: 'قاعدة النصب الأكوزاتيف (Akkusativ): der -> den',
    titleDe: 'Der Akkusativ: den & einen',
    objectiveDz: 'فهم علاش كنقولو einen Kaffee ماشي ein Kaffee، والفرق بين الفاعل والمفعول به.',
    durationMinutes: 15,
    unitId: 'a1_02',
    tabTarget: 'grammar',
    skills: ['schreiben', 'lesen'],
    keyPhrases: [
      { de: 'Ich trinke den Kaffee.', dz: 'كنشرب القهوة (Akkusativ مذكر).' },
      { de: 'Ich esse einen Apfel.', dz: 'كناكل تفاحة (einen للمذكر).' },
    ],
  },
  {
    day: 12,
    stageId: 2,
    titleDz: 'قاعدة النفي الذهبية: nicht vs. kein',
    titleDe: 'Verneinung: nicht vs. kein',
    objectiveDz: 'تعرف وقتاش تنفي الأسماء بـ kein، والصفات والأفعال بـ nicht بدون أي تردد.',
    durationMinutes: 15,
    unitId: 'a1_02',
    tabTarget: 'grammar',
    skills: ['lesen', 'schreiben'],
    keyPhrases: [
      { de: 'Ich habe kein Geld.', dz: 'ما عنديش فلوس (اسم نكرة).' },
      { de: 'Ich verstehe das nicht.', dz: 'ما فهمتش هادشي (فعل).' },
    ],
  },
  {
    day: 13,
    stageId: 2,
    titleDz: 'ثقافة الـ Pfand وفرز النفايات في ألمانيا',
    titleDe: 'Pfandsystem & Mülltrennung',
    objectiveDz: 'استرجاع الوديعة 0.25€ من قراعي المونادا، ومعرفة سياق العيش اليومي في ألمانيا.',
    durationMinutes: 15,
    unitId: 'a1_02',
    tabTarget: 'words',
    skills: ['lesen', 'hören'],
    keyPhrases: [
      { de: 'der Pfand (0,25 €)', dz: 'وديعة القنينة المسترجعة' },
      { de: 'Wo ist der Pfandautomat?', dz: 'فين كاينة ماكينة الـ Pfand؟' },
    ],
  },
  {
    day: 14,
    stageId: 2,
    titleDz: 'نقطة التفتيش 2: محاكاة الشراء والطلب',
    titleDe: 'Checkpoint 2: Einkauf & Restaurant Test',
    objectiveDz: 'حوار واقعي كامل لطلب وجبة وتخليص السلعة فالسوبرماركت مع الأستاذ المباشر.',
    durationMinutes: 20,
    unitId: 'a1_02',
    tabTarget: 'listening',
    isCheckpoint: true,
    checkpointSummaryDz: '🎉 ممتاز! ساليتي المرحلة 2، دابا راك قادر تسلك راسك فـ أي مطعم أو سوبرماركت فـ ألمانيا.',
    skills: ['hören', 'sprechen', 'schreiben'],
    keyPhrases: [
      { de: 'Das macht zusammen 18,50 Euro.', dz: 'المجموع هو 18.50 يورو.' },
    ],
  },

  /* ============================================================
     STAGE 3: DAYS 15 - 21 (TRANSIT & BUREAUCRACY)
     ============================================================ */
  {
    day: 15,
    stageId: 3,
    titleDz: 'محطة القطار وتذاكر Deutsche Bahn',
    titleDe: 'Am Bahnhof & Fahrkarten kaufen',
    objectiveDz: 'شراء تذكرة قطار عادية أو ذهاب وإياب، والسؤال على الرصيف (Gleis).',
    durationMinutes: 15,
    unitId: 'a1_03',
    tabTarget: 'words',
    skills: ['hören', 'sprechen'],
    keyPhrases: [
      { de: 'Eine Fahrkarte nach Berlin, bitte!', dz: 'تذكرة لـ برلين عفاك!' },
      { de: 'Von welchem Gleis fährt der Zug ab?', dz: 'من أشنو رصيف كينطلق القطار؟' },
    ],
  },
  {
    day: 16,
    stageId: 3,
    titleDz: 'قطارات ألمانيا والروطار وتبديل الرصيف',
    titleDe: 'Verspätungen & Gleiswechsel',
    objectiveDz: 'فهم الإعلانات الصوتية فالمحطة عند تأخر القطار أو إلغائه (fällt aus).',
    durationMinutes: 15,
    unitId: 'a1_03',
    tabTarget: 'dialog',
    skills: ['hören', 'lesen'],
    keyPhrases: [
      { de: 'Der Zug hat ca. 20 Minuten Verspätung.', dz: 'القطار فيه حوالي 20 دقيقة تأخير.' },
      { de: 'Heute von Gleis 5 statt Gleis 3.', dz: 'اليوم من رصيف 5 عوض رصيف 3.' },
    ],
  },
  {
    day: 17,
    stageId: 3,
    titleDz: 'الأفعال المنفصلة السحرية (Trennbare Verben)',
    titleDe: 'Trennbare Verben (abfahren, ankommen)',
    objectiveDz: 'كيفاش ينقسم الفعل لجزء مصرف فالموقع 2 وبادئة تطير لآخر الجملة.',
    durationMinutes: 15,
    unitId: 'a1_03',
    tabTarget: 'grammar',
    skills: ['schreiben', 'lesen'],
    keyPhrases: [
      { de: 'Der Zug fährt um 09:15 Uhr ab.', dz: 'القطار كينطلق مع 09:15 (فعل abfahren).' },
      { de: 'Wann kommst du an?', dz: 'فوقاش كتوصل؟ (فعل ankommen).' },
    ],
  },
  {
    day: 18,
    stageId: 3,
    titleDz: 'تسجيل السكن فالبلدية (Anmeldung & Termin)',
    titleDe: 'Bürgeramt & Anmeldung',
    objectiveDz: 'طلب موعد، الحضور للبلدية، وشرح الغرض من الزيارة لموظف الإدارة الألمانية.',
    durationMinutes: 15,
    unitId: 'a1_04',
    tabTarget: 'words',
    skills: ['sprechen', 'lesen'],
    keyPhrases: [
      { de: 'Ich habe einen Termin zur Anmeldung.', dz: 'عندي موعد لتسجيل السكن.' },
      { de: 'Hier ist mein Reisepass.', dz: 'ها هو جواز السفر ديالي.' },
    ],
  },
  {
    day: 19,
    stageId: 3,
    titleDz: 'ورقة الكرا وقوانين الهدوء Ruhezeit',
    titleDe: 'Wohnungsgeberbestätigung & Ruhezeit',
    objectiveDz: 'فهم الوثيقة الرسمية للمؤجر، واحترام أوقات الهدوء نهار الأحد والليل.',
    durationMinutes: 15,
    unitId: 'a1_04',
    tabTarget: 'dialog',
    skills: ['lesen', 'hören'],
    keyPhrases: [
      { de: 'die Wohnungsgeberbestätigung', dz: 'شهادة المؤجر لتسجيل السكن' },
      { de: 'Sonntags ist Ruhezeit.', dz: 'الأحد وقت هدوء وراحة قانونية.' },
    ],
  },
  {
    day: 20,
    stageId: 3,
    titleDz: 'حروف الجر المكانية (Wechselpräpositionen)',
    titleDe: 'Präpositionen: in, an, auf',
    objectiveDz: 'استعمال حروف الجر: حركة Wohin (Akkusativ) vs موقع ثابت Wo (Dativ).',
    durationMinutes: 15,
    unitId: 'a1_04',
    tabTarget: 'grammar',
    skills: ['schreiben', 'lesen'],
    keyPhrases: [
      { de: 'Ich gehe in die Stadt.', dz: 'أنا ذاهب للمدينة (حركة = Akkusativ).' },
      { de: 'Ich bin in der Stadt.', dz: 'أنا وسط المدينة (ثبات = Dativ).' },
    ],
  },
  {
    day: 21,
    stageId: 3,
    titleDz: 'نقطة التفتيش 3: محاكاة البلدية والقطار',
    titleDe: 'Checkpoint 3: Behörde & Mobilität Test',
    objectiveDz: 'محاكاة كاملة للتسجيل في البلدية والسفر بالقطار بدون أخطاء نحوياً.',
    durationMinutes: 20,
    unitId: 'a1_04',
    tabTarget: 'listening',
    isCheckpoint: true,
    checkpointSummaryDz: '🎉 رائع جداً! ساليتي المرحلة 3، أصعب حواجز البيروقراطية والتنقل فـ ألمانيا ولات واضحة عندك.',
    skills: ['hören', 'sprechen', 'schreiben'],
    keyPhrases: [
      { de: 'Vielen Dank für Ihre Hilfe bei der Anmeldung.', dz: 'شكراً جزيلاً على المساعدة فـ التسجيل.' },
    ],
  },

  /* ============================================================
     STAGE 4: DAYS 22 - 30 (AUSBILDUNG & GOETHE A1 EXAM)
     ============================================================ */
  {
    day: 22,
    stageId: 4,
    titleDz: 'مصطلحات التكوين المهني (Ausbildung) والعمل',
    titleDe: 'Ausbildung & Berufswelt',
    objectiveDz: 'حفظ مفردات عقد التكوين، ساعات العمل، ومجال التخصص المهني ديالك.',
    durationMinutes: 15,
    unitId: 'a1_05',
    tabTarget: 'words',
    skills: ['lesen', 'sprechen'],
    keyPhrases: [
      { de: 'die Ausbildung / der Ausbildungsvertrag', dz: 'التكوين المهني / عقد التكوين' },
      { de: 'der Beruf / die Arbeitszeiten', dz: 'المهنة / أوقات العمل' },
    ],
  },
  {
    day: 23,
    stageId: 4,
    titleDz: 'مقابلة التكوين والعمل (Vorstellungsgespräch)',
    titleDe: 'Das Vorstellungsgespräch meistern',
    objectiveDz: 'تقديم سيرتك الذاتية، شرح حماسك، والإجابة على أسئلة المشغل بثقة.',
    durationMinutes: 15,
    unitId: 'a1_05',
    tabTarget: 'dialog',
    skills: ['sprechen', 'hören'],
    keyPhrases: [
      { de: 'Ich bin sehr motiviert und pünktlich.', dz: 'أنا متحمس بزاف ودقيق فالمواعيد.' },
      { de: 'Ich möchte viel Neues lernen.', dz: 'كنتمنى نتعلم بزاف د الحوايج جداد.' },
    ],
  },
  {
    day: 24,
    stageId: 4,
    titleDz: 'الأفعال المساعدة (Modalverben: können, müssen, möchten)',
    titleDe: 'Modalverben & Satzklammer',
    objectiveDz: 'تركيب الجمل بـ Modalverben مع وضع الفعل الأساسي في المصدر بآخر الجملة.',
    durationMinutes: 15,
    unitId: 'a1_05',
    tabTarget: 'grammar',
    skills: ['schreiben', 'lesen'],
    keyPhrases: [
      { de: 'Ich kann gut Deutsch sprechen.', dz: 'كنقدر نهضر مزيان بالألمانية.' },
      { de: 'Ich muss heute arbeiten.', dz: 'خاصني نخدم اليوم.' },
    ],
  },
  {
    day: 25,
    stageId: 4,
    titleDz: 'التأمين الصحي والطبيب والشهادة الطبية (AU)',
    titleDe: 'Krankenkasse, Arzt & Krankschreibung',
    objectiveDz: 'إخبار المشغل بالمرض في الصباح الباكر، والحصول على ورقة الطبيب الرسمية.',
    durationMinutes: 15,
    unitId: 'a1_05',
    tabTarget: 'words',
    skills: ['sprechen', 'lesen'],
    keyPhrases: [
      { de: 'Ich kann heute leider nicht kommen.', dz: 'للأسف ما نقدرش نجي اليوم.' },
      { de: 'Ich schicke die Krankschreibung.', dz: 'غادي نصيفط الشهادة الطبية.' },
    ],
  },
  {
    day: 26,
    stageId: 4,
    titleDz: 'أسرار كروت الشفوي (Goethe Sprechen Teil 1 & 2)',
    titleDe: 'Goethe Sprechen Hacks',
    objectiveDz: 'طرح الأسئلة بالبطاقات (Thema: Freizeit, Wohnen, Beruf) بلا ارتباك وقوالب جاهزة.',
    durationMinutes: 15,
    unitId: 'a1_05',
    tabTarget: 'sentence',
    skills: ['sprechen', 'hören'],
    keyPhrases: [
      { de: 'Haben Sie ein Auto?', dz: 'واش عندك طوموبيل؟ (قالب بطاقات جاهز)' },
      { de: 'Können Sie mir bitte helfen?', dz: 'واش تقدر تعاوني عفاك؟' },
    ],
  },
  {
    day: 27,
    stageId: 4,
    titleDz: 'قالب إيميل الامتحان 10/10 (Schreiben Teil 2)',
    titleDe: 'Schreiben E-Mail Vorlage (Volle Punktzahl)',
    objectiveDz: 'كتابة رسالة رسمية وشخصية كاملة العناصر (التحية، السبب، والخاتمة) لضمان النقطة كاملة.',
    durationMinutes: 15,
    unitId: 'a1_05',
    tabTarget: 'sentence',
    skills: ['schreiben', 'lesen'],
    keyPhrases: [
      { de: 'Sehr geehrte Damen und Herren,', dz: 'سيداتي سادتي المحترمين، (بداية رسمية)' },
      { de: 'Mit freundlichen Grüßen', dz: 'مع أطيب التحيات (خاتمة رسمية)' },
    ],
  },
  {
    day: 28,
    stageId: 4,
    titleDz: 'مصايد الفهم الشفهي (Hörverstehen Traps)',
    titleDe: 'Hörverstehen Fallen entlarven',
    objectiveDz: 'كشف فخاخ الأرقام والأوقات المتغيرة في تسجيلات امتحان معهد غوته.',
    durationMinutes: 15,
    unitId: 'a1_05',
    tabTarget: 'listening',
    skills: ['hören', 'lesen'],
    keyPhrases: [
      { de: 'nicht um 14 Uhr, sondern um 16 Uhr!', dz: 'ماشي مع الـ 2، بل مع الـ 4!' },
    ],
  },
  {
    day: 29,
    stageId: 4,
    titleDz: 'محاكاة كاملة لامتحان Goethe-Zertifikat A1',
    titleDe: 'Vollständige Prüfungssimulation A1',
    objectiveDz: 'اختبار تجريبي كامل يحاكي الأقسام الأربعة (Lesen, Hören, Schreiben, Sprechen) مع التوقيت.',
    durationMinutes: 30,
    unitId: 'a1_05',
    tabTarget: 'listening',
    isCheckpoint: true,
    checkpointSummaryDz: '🏆 مبروك عليك! درتي محاكاة كاملة لامتحان غوته A1 وتعرفتي على شكل الأسئلة بالثانية.',
    skills: ['hören', 'sprechen', 'lesen', 'schreiben'],
    keyPhrases: [
      { de: 'Herzlichen Glückwunsch zur Prüfung!', dz: 'تهانينا الحارة باجتياز الامتحان!' },
    ],
  },
  {
    day: 30,
    stageId: 4,
    titleDz: 'التخرج وإعلان الجاهزية لفيزا ألمانيا 🎓',
    titleDe: 'A1-Abschluss & Visabereitschaft',
    objectiveDz: 'مراجعة الحصيلة، تثبيت الشهادة المعنوية، والتحضير لموعد السفارة ومقابلة الفيزا.',
    durationMinutes: 15,
    unitId: 'a1_05',
    tabTarget: 'dialog',
    isCheckpoint: true,
    checkpointSummaryDz: '🇩🇪 ألف مبروك! كملتي 30 يوماً كاملة من الصفر حتى التمكن من مستوى Goethe A1. دابا راك واجد للتكوين والسفر فـ ألمانيا!',
    skills: ['hören', 'sprechen', 'lesen', 'schreiben'],
    keyPhrases: [
      { de: 'Auf nach Deutschland! Gute Reise!', dz: 'إلى ألمانيا! رحلة موفقة وتجربة ناجحة!' },
    ],
  },
];
