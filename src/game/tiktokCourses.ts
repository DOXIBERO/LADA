/* ============================================================
   LADA — TIKTOK CREATOR MASTERCLASSES & STREET GERMAN
   Inspired by top TikTok creators: Easy German, germanwithsarahx,
   Doctor German, GermanInSeconds, LifeinGermany, malika.learns.german,
   Easy German with Bella, The German Class, germanology, and SlowGerman.
   ============================================================ */

export interface StreetComparison {
  textbook: string;
  textbookMeaning: string;
  street: string;
  streetMeaning: string;
  phoneticAr: string;
  contextDz: string;
}

export interface TikTokQuiz {
  questionDz: string;
  options: string[];
  answerIndex: number;
  explanationDz: string;
}

export interface TikTokLesson {
  id: string;
  titleDz: string;
  titleDe: string;
  creator: string;
  creatorHandle: string;
  creatorAvatar: string;
  hookDz: string;
  tutorScriptDz: string;
  comparisons: StreetComparison[];
  proTipDz: string;
  quiz: TikTokQuiz;
}

export interface TikTokTrack {
  id: string;
  titleDz: string;
  titleDe: string;
  creatorStyle: string;
  badge: string;
  color: 'cyan' | 'mag' | 'lime' | 'amber';
  descriptionDz: string;
  lessons: TikTokLesson[];
}

export const TIKTOK_TRACKS: TikTokTrack[] = [
  /* ------------------------------------------------------------
     TRACK 1: STREET GERMAN VS TEXTBOOK GERMAN
     Inspired by @easygerman & @germanwithsarahx
     ------------------------------------------------------------ */
  {
    id: 'street_vs_textbook',
    titleDz: 'ألماني الزنقة vs ألماني الكتوبة',
    titleDe: 'Street German vs. Lehrbuch',
    creatorStyle: 'Easy German & germanwithsarahx',
    badge: 'VIRAL REELS ⚡',
    color: 'cyan',
    descriptionDz: 'شنو كيقريوك فالكتوبة وشنو كيقولو الألمان بصح فالشارع دابا. عبارات حية باش ما تبانش كتهضر بحال الروبوت.',
    lessons: [
      {
        id: 'tt_1_1',
        titleDz: 'التحيات الحقيقية: كيفاش تسول على بنادم',
        titleDe: 'Echte Begrüßungen',
        creator: 'germanwithsarahx',
        creatorHandle: '@germanwithsarahx',
        creatorAvatar: '👩‍🏫',
        hookDz: 'ما تبقاش تقول "Wie geht es Ihnen?" فالمقهى ولا مع صحابك، راها رسمية بزاف بحال يلا جالس فالمحكمة!',
        tutorScriptDz: 'أهلاً بيك! فـ هاد الدرس المستوحى من سارة، غادي نصلحو طريقة التحية ديالك. فالكتوبة كيعلموك جمل معقدة، ولكن الألمان فالشارع كيختصرو كلشي بكلمات ساهلة بحال "Na?" و "Wie läuft\'s?". تبع معايا المقارنة دابا!',
        comparisons: [
          {
            textbook: 'Wie geht es Ihnen?',
            textbookMeaning: 'كيف حال حضرتك؟ (رسمية جداً)',
            street: 'Na, alles fit?',
            streetMeaning: 'كي راك؟ كولشي مزيان؟',
            phoneticAr: 'نا، أليس فيت؟',
            contextDz: 'الألمان كيقولوها بين الأصدقاء والزملاء فالخدمة وحتى فالصالات ديال الرياضة.',
          },
          {
            textbook: 'Auf Wiedersehen!',
            textbookMeaning: 'إلى اللقاء (كلاسيكية)',
            street: 'Bis dann! / Mach\'s gut!',
            streetMeaning: 'تهلا! تشاو نشوفك من بعد.',
            phoneticAr: 'بيس دان! / ماخْسْ غُوت!',
            contextDz: 'أكثر عبارة كتسمعها ملي كيتفارقو الناس فالزنقة أو فالتران.',
          },
          {
            textbook: 'Es freut mich, Sie kennenzulernen.',
            textbookMeaning: 'يسرني التعرف على حضرتك.',
            street: 'Freut mich!',
            streetMeaning: 'متشرفين! (سريعة وطبيعية)',
            phoneticAr: 'فرويت ميش!',
            contextDz: 'ملي كيقدمو ليك شي شخص، كلمة وحدة كافية وكتعطي انطباع بلي راك ناطق متمكن.',
          },
        ],
        proTipDz: 'الكلمة الأسطورية فـ ألمانيا هي "Na?". الألمان كيستعملوها كتحية، كسؤال، وكتأكيد. يلا قال ليك شي ألماني "Na?"، تقدر تجاوبو ببساطة: "Na, alles gut!".',
        quiz: {
          questionDz: 'تلاقيتي بصاحبك الألماني فمحطة القطار، شنو أحسن عبارة تقول ليه؟',
          options: [
            'Sehr geehrter Herr, wie geht es Ihnen?',
            'Na, wie läuft\'s? Alles fit?',
            'Auf Wiedersehen mein Freund!',
            'Guten Tag Frau Müller.',
          ],
          answerIndex: 1,
          explanationDz: '"Na, wie läuft\'s? Alles fit?" هي العبارة الشبابية والطبيعية اليومية بين المعارف والصحاب.',
        },
      },
      {
        id: 'tt_1_2',
        titleDz: 'الكلمة السحرية "Doch!": كيفاش تنفي النفي',
        titleDe: 'Das Zauberwort: Doch!',
        creator: 'Easy German',
        creatorHandle: '@easygerman',
        creatorAvatar: '🎤',
        hookDz: 'أصعب كلمة على الأجانب فـ ألمانيا هي "Doch". كلمة وحدة كتعوض جملة كاملة!',
        tutorScriptDz: 'من أشهر فيديوهات إيزي جيرمان فـ برلين هي على كلمة "Doch". يلا سولك شي واحد بسؤال فيه نفي بحال "ما جايش؟"، ما تقولش "Ja"، قول "Doch!" يعني "بلا، راني جاي!".',
        comparisons: [
          {
            textbook: 'Kommst du nicht mit? - Ja, ich komme mit.',
            textbookMeaning: 'واش ما جايش معنا؟ - نعم، أنا آتٍ.',
            street: 'Kommst du nicht mit? - Doch!',
            streetMeaning: 'ما جايش؟ - بلا، راني جاي ونص!',
            phoneticAr: 'كُومْسْتْ دُو نِيشْتْ مِيت؟ - دُوخْ!',
            contextDz: 'الألمان ما كيقولوش "Ja" لسؤال منفي، "Doch" هي الجواب السحري المعاكس.',
          },
          {
            textbook: 'Du hast keine Zeit? - Nein, ich habe Zeit.',
            textbookMeaning: 'ما عندكش الوقت؟ - لا، عندي الوقت.',
            street: 'Hast du keine Zeit? - Doch, na klar!',
            streetMeaning: 'ما مساليش؟ - بلا، أكيد مسالي!',
            phoneticAr: 'هاسْتْ دُو كَايْنَه تسَايْت؟ - دُوخْ، نَا كْلَارْ!',
            contextDz: 'كتزيد "na klar" مع "doch" باش تأكد أنك واجد 100%.',
          },
        ],
        proTipDz: 'القاعدة الذهبية: سؤال عادي بلا نفي = Ja / Nein. سؤال فيه نفي (nicht / kein) وبغيتي تعكسو = DOCH دائماً!',
        quiz: {
          questionDz: 'الأستاذ سولك: "Hast du die Hausaufgaben nicht gemacht?" (ما درتيش التمارين؟) ونتا راك درتيهم. شنو تجاوب؟',
          options: ['Ja!', 'Nein!', 'Doch, ich habe sie gemacht!', 'Bitte schön!'],
          answerIndex: 2,
          explanationDz: 'بما أن السؤال فيه نفي (nicht)، يلا كنتي درتيهم لازم تبدا بـ "Doch!" باش تلغي النفي.',
        },
      },
      {
        id: 'tt_1_3',
        titleDz: 'كلمات الحشو الألمانية (Fillers): هضر بحال الناتيف',
        titleDe: 'Typische Füllwörter',
        creator: 'Easy German',
        creatorHandle: '@easygerman',
        creatorAvatar: '🎤',
        hookDz: 'الألمان ما كيسكتوش، ديما كيستعملو كلمات حشو صغيرة بحال "halt" و "mal" و "quasi". ها كيفاش توظفهم!',
        tutorScriptDz: 'باش ما تبقاش تفكر بزاف فالهضرة، تعلم تستعمل هاد الكلمات اللي كيستعملوها الألمان كـ Fillers. كتعطيك ثواني تفكر فالكلمة الجاية وكتخلي كلامك ينساب طبيعي.',
        comparisons: [
          {
            textbook: 'Das ist nun einmal so.',
            textbookMeaning: 'هذا هو الواقع الحالي.',
            street: 'Das ist halt so!',
            streetMeaning: 'هادشي اللي كاين، ما عندنا ما نديرو!',
            phoneticAr: 'دَاسْ إيسْتْ هَالْتْ زُو!',
            contextDz: '"halt" كلمة كتعني "هكا دايرة الأمور" وكتسمعها فـ 90% من حوارات الشارع.',
          },
          {
            textbook: 'Helfen Sie mir bitte.',
            textbookMeaning: 'ساعدني من فضلك.',
            street: 'Hilf mir mal kurz!',
            streetMeaning: 'عاوني عفاك واحد الدقيقة!',
            phoneticAr: 'هِيلْفْ مِيرْ مَال كُورْتْسْ!',
            contextDz: 'إضافة "mal" كتخلي الطلب مهذب وسلس وخفيف على الودن.',
          },
          {
            textbook: 'Ich bin nicht sicher.',
            textbookMeaning: 'لست متأكداً.',
            street: 'Na ja, eigentlich schon, aber...',
            streetMeaning: 'إيوا صراحة راه كاين ولكن...',
            phoneticAr: 'نَا يَا، أَيْغِنْتْلِيشْ شُون، آبَرْ...',
            contextDz: 'أحسن طريقة تبدا بيها جملة ملي تكون كتفكر فـ الرأي ديالك.',
          },
        ],
        proTipDz: 'كلمة "Genau!" (بمعنى: بالضبط / نيشان) هي أكثر كلمة كيقولها الألماني ملي كيكون كيسمع ليك. يلا قالها عرفو راه متبع معاك وفاهمك مزيان.',
        quiz: {
          questionDz: 'شنو الكلمة اللي كيضيفوها الألمان للطلب باش يبان خفيف وماشي أمر قاصح؟',
          options: ['halt', 'mal', 'nie', 'sehr'],
          answerIndex: 1,
          explanationDz: '"mal" (مثلاً: Sag mal, Schau mal, Hilf mir mal) كترطب الطلب وكتخليه يبان ودي وخفيف.',
        },
      },
      {
        id: 'tt_1_4',
        titleDz: 'اختصارات الشارع: كيفاش كياكلو الألمان الكلمات',
        titleDe: 'Umgangssprachliche Abkürzungen',
        creator: 'germanwithsarahx',
        creatorHandle: '@germanwithsarahx',
        creatorAvatar: '👩‍🏫',
        hookDz: 'راه ما كاينش شي ألماني كيقول "Hast du ein...". فالشارع كيقولو "Haste \'n...". شوف الاختصارات!',
        tutorScriptDz: 'فـ هاد الفيديو، كنشوفو كيفاش الألمان كيدمجو الكلمات مع بعضياتها. هادشي علاش فاللول كيجيك الألمان كيهضرو بالزربة وما كتفهم والو، راهم غير كياكلو الحروف بحالنا فالدارجة!',
        comparisons: [
          {
            textbook: 'Hast du ein Auto?',
            textbookMeaning: 'هل تملك سيارة؟',
            street: 'Haste \'n Auto?',
            streetMeaning: 'عندك شي طوموبيل؟',
            phoneticAr: 'هَاسْتِه نْ أُوتُو؟',
            contextDz: 'دمج "hast du" لـ "haste" و "ein" لـ "\'n".',
          },
          {
            textbook: 'Ich habe eine Frage.',
            textbookMeaning: 'لدي سؤال.',
            street: 'Ich hab \'ne Frage.',
            streetMeaning: 'عندي واحد السؤال دغيا.',
            phoneticAr: 'إِيشْ هَابْ نِه فْغَاغِه.',
            contextDz: 'حذف حرف e من habe واختصار eine لـ \'ne.',
          },
          {
            textbook: 'Gibt es hier einen Supermarkt?',
            textbookMeaning: 'هل يوجد هنا سوبرماركت؟',
            street: 'Gibt\'s hier \'nen Supermarkt?',
            streetMeaning: 'واش كاين هنا شي سوبرمارشي؟',
            phoneticAr: 'غِيبْتْسْ هِيرْ نِنْ زُوبَرْمَارْكْتْ؟',
            contextDz: 'einen كتولي دايماً \'nen فالمذكر فالنصب (Akkusativ).',
          },
        ],
        proTipDz: 'القاعدة فالمحادثة: ein = \'n | eine = \'ne | einen = \'nen. ملي تدرب وذنك عليهم، غادي تولي تفهم الناس فالشارع بسهولة فائقة!',
        quiz: {
          questionDz: 'كيفاش كيقول ألماني فالزنقة جملة: "Hast du einen Euro?"',
          options: [
            'Haben Sie einen Euro bitte?',
            'Haste \'nen Euro?',
            'Du hast der Euro?',
            'Ist das ein Euro?',
          ],
          answerIndex: 1,
          explanationDz: '"Haste \'nen Euro?" هي الصيغة المحكية السريعة في شوارع ألمانيا.',
        },
      },
      {
        id: 'tt_1_5',
        titleDz: 'التعبير عن المزاج: من "Kein Bock" لـ "Passt schon"',
        titleDe: 'Laune ausdrücken',
        creator: 'Easy German',
        creatorHandle: '@easygerman',
        creatorAvatar: '🎤',
        hookDz: 'يلا بغيتي تعبر على أنك ممعولش ولا معندكش الموود، هاد العبارات هما المفضلين عند الشباب فالمانيا!',
        tutorScriptDz: 'أشهر تعبير فالشباب الألماني هو "Kein Bock" (يعني معنديش الخاطر / معنديش الموود). وعبارة "Passt schon" اللي كتعني "صافي مزيان مكاين مشكل". تدرب عليهم دابا!',
        comparisons: [
          {
            textbook: 'Ich habe keine Lust darauf.',
            textbookMeaning: 'لا رغبة لدي في ذلك.',
            street: 'Null Bock! / Kein Bock!',
            streetMeaning: 'معنديش الكانة گاع / زيرو موود!',
            phoneticAr: 'نُول بُوكْ! / كَايْنْ بُوكْ!',
            contextDz: 'كيستعملوها ديما ملي ميكونو مباغيينش يمشيو يقراو ولا يخدمو Overtime.',
          },
          {
            textbook: 'Das ist für mich in Ordnung.',
            textbookMeaning: 'هذا مناسب بالنسبة لي.',
            street: 'Passt schon! / Geht klar!',
            streetMeaning: 'مزيان، مكاين حتى مشكل، دايزة!',
            phoneticAr: 'بَاسْتْ شُون! / غِيتْ كْلَارْ!',
            contextDz: 'كتتقال حتى ملي كتخلص فالمطعم وما بغيتيش الصرف الصغير (Trinkgeld).',
          },
          {
            textbook: 'Das ist erstaunlich.',
            textbookMeaning: 'هذا أمر مدهش.',
            street: 'Echt jetzt? Krass!',
            streetMeaning: 'بصح نيت؟ واعرة بزاف!',
            phoneticAr: 'إِيشْتْ يِتْسْتْ؟ كْرَاسْ!',
            contextDz: '"Krass" هي أكثر كلمة كتسمعها للتعبير عن الصدمة أو الإعجاب الشديد.',
          },
        ],
        proTipDz: 'فالمطعم ملي تبغي تعطي pourboire ومترجعش الصرف، قول للسرباي ببساطة: "Stimmt so!" أو "Passt schon!".',
        quiz: {
          questionDz: 'صاحبك عرض عليك تمشيو تجريو فالبرد ونتا معندكش الموود، شنو تقول بالعامية الألمانية؟',
          options: [
            'Ich habe leider keine Lust.',
            'Boah, gar kein Bock!',
            'Sehr schön, danke!',
            'Guten Appetit!',
          ],
          answerIndex: 1,
          explanationDz: '"Boah, gar kein Bock!" كتعبر على انعدام الرغبة بطريقة حيوية جداً.',
        },
      },
    ],
  },

  /* ------------------------------------------------------------
     TRACK 2: 10-SECOND GRAMMAR SURGERY
     Inspired by @doctor.german & @germaninseconds
     ------------------------------------------------------------ */
  {
    id: 'grammar_surgery',
    titleDz: 'عيادة القواعد السريعة (Grammar Surgery)',
    titleDe: 'Grammatik-Notaufnahme',
    creatorStyle: 'Doctor German & GermanInSeconds',
    badge: '10s HACKS 🩺',
    color: 'mag',
    descriptionDz: 'تشخيص فوري وعلاج لأصعب عقد القواعد الألمانية. حيل سريعة بلا تفلسيف ديال أساتذة النحو.',
    lessons: [
      {
        id: 'tt_2_1',
        titleDz: 'تشخيص kennen vs. wissen: فين كاين الفرق؟',
        titleDe: 'kennen vs. wissen',
        creator: 'GermanInSeconds',
        creatorHandle: '@germaninseconds',
        creatorAvatar: '⏱️',
        hookDz: 'كلشي كيخلط بين kennen و wissen! فـ 10 ثواني غادي تضبطها وما عمرك تغلط فيها.',
        tutorScriptDz: 'مرحبا بيك فعيادة القواعد مع دكتور جيرمان! القاعدة ساهلة بحال شريب الما: kennen كتستعملها للأشخاص والمدن والحوايج اللي كتعرفهم شخصياً. و wissen كتستعملها للمعلومات والحقائق اللي فالراس!',
        comparisons: [
          {
            textbook: 'Ich kenne den Weg / Ich weiß die Antwort.',
            textbookMeaning: 'أعرف الطريق / أعلم الجواب.',
            street: 'Kennst du Bilal? - Ja, aber ich weiß nicht, wo er wohnt.',
            streetMeaning: 'كتعرف بلال؟ - آه، ولكن ما عرفتش فين ساكن.',
            phoneticAr: 'كِينْسْتْ دُو بِلَال؟ - يَا، آبَرْ إِيشْ فايْسْ نِيشْتْ، فُو إِيرْ فُونْتْ.',
            contextDz: 'Bilal = شخص (kennen) | wo er wohnt = معلومة/جملة فرعية (wissen).',
          },
          {
            textbook: 'Wir wissen das nicht.',
            textbookMeaning: 'نحن لا نعلم ذلك.',
            street: 'Keine Ahnung, ich weiß es echt nicht!',
            streetMeaning: 'معندي حتى فكرة، والله ما عارف!',
            phoneticAr: 'كَايْنِه آنُونغْ، إِيشْ فايْسْ إِسْ إِيشْتْ نِيشْتْ!',
            contextDz: 'تعبير يومي مشهور جداً لنفي المعرفة بالمعلومة.',
          },
        ],
        proTipDz: 'الحيلة السحرية: يلا مورا الفعل كاين اسم شخص أو بلاصة = kennen. يلا كاين جملة فيها dass ولا w-Frage (wann, wo, wie) = wissen!',
        quiz: {
          questionDz: 'شنو الفعل المناسب هنا: "Ich _____ die Stadt Frankfurt sehr gut."',
          options: ['weiß', 'kenne', 'kann', 'habe'],
          answerIndex: 1,
          explanationDz: 'بما أن "Frankfurt" هي مدينة (مكان كتعرفو شخصياً)، كنستعملو دايماً فعل kennen.',
        },
      },
      {
        id: 'tt_2_2',
        titleDz: 'خدعة الأكوزاتيف والداتيف فـ 30 ثانية',
        titleDe: 'Akkusativ vs. Dativ Hack',
        creator: 'Doctor German',
        creatorHandle: '@doctor.german',
        creatorAvatar: '👨‍⚕️',
        hookDz: 'أكبر رعب عند متعلمي الألمانية: وقتاش Akkusativ وقتاش Dativ؟ الحل فـ جوج أسئلة فقط!',
        tutorScriptDz: 'جلس وسمع الوصفة الطبية من دكتور جيرمان: واش كتحرك من بلاصة لبلاصة؟ سول بـ Wohin? الجواب دايماً Akkusativ! واش راك جالس فبلاصتك وثابت؟ سول بـ Wo? الجواب دايماً Dativ!',
        comparisons: [
          {
            textbook: 'Akkusativ = Bewegung / Dativ = Stillstand',
            textbookMeaning: 'النصب للحركة / الجر للثبات',
            street: 'Ich gehe in DEN Park (Akkusativ - Wohin?)',
            streetMeaning: 'أنا غادي للبارك (حركة وانتقال)',
            phoneticAr: 'إِيشْ غِيهِه إِنْ دِينْ بَارْكْ',
            contextDz: 'der Park ولات den Park حيت كاين تحرك وتوجه نحو المكان.',
          },
          {
            textbook: 'In dem Park spazieren.',
            textbookMeaning: 'التنزه داخل الحديقة.',
            street: 'Ich chille in DEM Park (Dativ - Wo?)',
            streetMeaning: 'أنا مريح فالبارك (ثابت فنفس المكان)',
            phoneticAr: 'إِيشْ شِيلِه إِنْ دِيمْ بَارْكْ',
            contextDz: 'in dem كدمجوها فالشارع لـ "im Park". ثبات = Dativ.',
          },
        ],
        proTipDz: 'الحركة = Akkusativ (der كتولي den). الثبات فالموقع = Dativ (der و das كيوليو dem، و die كتولي der).',
        quiz: {
          questionDz: 'أنت غادي للمكتب ديالك دابا بالسيارة: "Ich fahre in _____ Büro (das Büro)."',
          options: ['das', 'dem', 'den', 'der'],
          answerIndex: 0,
          explanationDz: 'حركة وانتقال نحو المكان (Wohin?) = Akkusativ. و das كتبقى das فـ Akkusativ.',
        },
      },
      {
        id: 'tt_2_3',
        titleDz: 'الأفعال المنفصلة (Trennbare Verben): كيفاش كيطيرو للآخر',
        titleDe: 'Trennbare Verben',
        creator: 'GermanInSeconds',
        creatorHandle: '@germaninseconds',
        creatorAvatar: '⏱️',
        hookDz: 'علاش الألمان كينطقو نص الفعل دابا، وكيخبيو النص الثاني حتى لآخر الجملة؟',
        tutorScriptDz: 'الأفعال المنفصلة كتشبه الفلقة فالدارجة! الفعل كيتقسم على جوج: الجدر كيبقى فالموقع 2، والبادئة (auf, ab, mit, an, ein) كطير حتى لآخر كلمة فـ الجملة. تبع معايا!',
        comparisons: [
          {
            textbook: 'Ich stehe um 7 Uhr auf.',
            textbookMeaning: 'أستيقظ على الساعة السابعة.',
            street: 'Ich penne aus und stehe erst um 12 auf!',
            streetMeaning: 'كنشبع نعاس وما كنفيق حتى للـ 12!',
            phoneticAr: 'إِيشْ بِينِه آوْسْ أُونْد شْتِيهِه إِيرْسْت أُومْ 12 آوْف!',
            contextDz: 'فعل aufstehen: stehe فالموقع الثاني، و auf فآخر الجملة.',
          },
          {
            textbook: 'Er ruft mich heute an.',
            textbookMeaning: 'هو يتصل بي اليوم.',
            street: 'Ruf mich später an, ich bin im Stress!',
            streetMeaning: 'صوني عليا من بعد، راني فستريس دابا!',
            phoneticAr: 'رُوفْ مِيشْ شْبِيتَرْ آنْ!',
            contextDz: 'فعل anrufen: فصيغة الأمر Ruf فالبداية، و an فـ النهاية.',
          },
        ],
        proTipDz: 'أشهر البوادئ المنفصلة اللي دايماً كطير لـ اللخر: ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-. عقل عليهم بحال الكود بين!',
        quiz: {
          questionDz: 'كيفاش نركبو جملة "هو كيدير الشوبينغ نهار السبت" بفعل einkaufen؟',
          options: [
            'Er einkauft am Samstag.',
            'Er kauft am Samstag ein.',
            'Er ist am Samstag gekaufen.',
            'Am Samstag er einkauft.',
          ],
          answerIndex: 1,
          explanationDz: 'الفعل einkaufen منفصل: kauft فالمرتبة 2، والبادئة ein كتمشي لآخر الجملة.',
        },
      },
      {
        id: 'tt_2_4',
        titleDz: 'قاعدة النفي الذهبية: nicht vs. kein',
        titleDe: 'nicht oder kein?',
        creator: 'Doctor German',
        creatorHandle: '@doctor.german',
        creatorAvatar: '👨‍⚕️',
        hookDz: 'واش تقول "Ich habe nicht Geld" ولا "Ich habe kein Geld"؟ الفرق بسيط بزاف!',
        tutorScriptDz: 'طريقة التشخيص عند دكتور جيرمان: واش باغي تنفي اسم نكرة (Noun) كتقدر دير ليه ein؟ استعمل KEIN! واش باغي تنفي فعل، صفة، اسم علم، أو جملة؟ استعمل NICHT!',
        comparisons: [
          {
            textbook: 'Ich habe kein Auto / Ich schlafe nicht.',
            textbookMeaning: 'ليس لدي سيارة / أنا لا أنام.',
            street: 'Kein Geld, kein Job, aber kein Problem!',
            streetMeaning: 'ما كاين فلوس، ما كاين خدمة، ولكن هانية مكاين مشكل!',
            phoneticAr: 'كَايْنْ غِيلْد، كَايْنْ جُوب، آبَرْ كَايْنْ بْرُوبْلِيم!',
            contextDz: 'كلها أسماء (Geld, Job, Problem) لذلك تم نفيها بـ kein.',
          },
          {
            textbook: 'Das schmeckt mir nicht.',
            textbookMeaning: 'هذا لا يعجبني طعمه.',
            street: 'Das ist echt nicht lecker.',
            streetMeaning: 'صراحة هادشي ماشي بنين گاع.',
            phoneticAr: 'دَاسْ إِيسْتْ إِيشْتْ نِيشْتْ لِيكَرْ.',
            contextDz: 'lecker هي صفة، لذلك تنفى دائماً بـ nicht.',
          },
        ],
        proTipDz: 'العكس ديال ein هو kein. والعكس ديال كلشي لاخر (أفعال، صفات، ظروف، ضمائر) هو nicht.',
        quiz: {
          questionDz: 'بغيتي تقول "أنا لا أفهم": "Ich verstehe _____."',
          options: ['kein', 'nicht', 'keine', 'nichts mehr'],
          answerIndex: 1,
          explanationDz: 'فعل verstehen يتم نفيه بـ nicht لأننا ننفي الفعل وليس اسماً نكرة.',
        },
      },
      {
        id: 'tt_2_5',
        titleDz: 'ترتيب الجملة السحري (Satzbau): الفعل الملك',
        titleDe: 'Verb auf Position 2',
        creator: 'GermanInSeconds',
        creatorHandle: '@germaninseconds',
        creatorAvatar: '⏱️',
        hookDz: 'القاعدة اللي يلا ضبطتيها، ضمنتي 80% من النقط فـ أي امتحان ألماني!',
        tutorScriptDz: 'فالألمانية كاين قانون مقدس ما كيتغيرش: الفعل المصرف هو الملك، وديما كيجلس فالكرسي رقم 2! واخا تبدا بالوقت، بالمكان، أو بالفاعل، الفعل لازم يكون هو الثاني.',
        comparisons: [
          {
            textbook: 'Heute lerne ich Deutsch.',
            textbookMeaning: 'اليوم أتعلم الألمانية.',
            street: 'Morgen fahre ich nach Berlin.',
            streetMeaning: 'غدا غادي نسافر لـ برلين.',
            phoneticAr: 'مُورْغِنْ فَارِه إِيشْ نَاخْ بِيرْلِين.',
            contextDz: 'بدينا بالزمان (Morgen = 1)، مباشرة موراه الفعل (fahre = 2)، ثم الفاعل (ich = 3).',
          },
          {
            textbook: 'Ich lerne heute Deutsch.',
            textbookMeaning: 'أنا أتعلم اليوم الألمانية.',
            street: 'Jetzt brauche ich einen Kaffee!',
            streetMeaning: 'دابا دابا خاصني واحد القهيوة!',
            phoneticAr: 'يِتْسْتْ بْرَاوْخِه إِيشْ أَيْنِنْ كَافِي!',
            contextDz: 'Jetzt (1) -> brauche (2) -> ich (3). الفعل ما كيتزحزحش من الرتبة الثانية.',
          },
        ],
        proTipDz: 'إياك تقول "Morgen ich فahre" بحال الإنجليزية أو الدارجة! الألمان كيعتابروها أكبر خطأ. ديما: Morgen FAHRE ich.',
        quiz: {
          questionDz: 'أي جملة من هادو صحيحة نحوياً فـ اللغة الألمانية؟',
          options: [
            'Gestern ich habe gearbeitet.',
            'Gestern habe ich gearbeitet.',
            'Ich gestern habe gearbeitet.',
            'Habe gestern ich gearbeitet.',
          ],
          answerIndex: 1,
          explanationDz: 'Gestern (الرتبة 1)، habe (الفعل المساعد في الرتبة 2)، ثم ich (الفاعل في الرتبة 3).',
        },
      },
    ],
  },

  /* ------------------------------------------------------------
     TRACK 3: SURVIVAL IN GERMANY & BUREAUCRACY
     Inspired by @deutschlernen02 & @malika.learns.german
     ------------------------------------------------------------ */
  {
    id: 'survival_germany',
    titleDz: 'دليل النجاة في ألمانيا والبيروقراطية',
    titleDe: 'Überleben in Deutschland',
    creatorStyle: 'LifeinGermany & malika.learns.german',
    badge: 'EXPATS GUIDE 🇩🇪',
    color: 'lime',
    descriptionDz: 'معركة السوبرماركت، تسجيل السكن، روطار قطارات DB، والقوانين اللي كيتفاجأو بيها المغاربة ملي كيوصلو لألمانيا.',
    lessons: [
      {
        id: 'tt_3_1',
        titleDz: 'معركة الكاسة فـ Aldi و Lidl: كيفاش تسلك راسك',
        titleDe: 'Kassen-Stress im Supermarkt',
        creator: 'LifeinGermany',
        creatorHandle: '@deutschlernen02',
        creatorAvatar: '🛒',
        hookDz: 'الكاشير فـ ألمانيا كيضرب السلعة بالزربة بحال يلا فمسابقة فورمولا 1! كيفاش تجاوبو بلا ما تتبلوكا؟',
        tutorScriptDz: 'فيديوهات ماليكا ولايف إن جيرماني ديما كيهضرو على هاد الصدمة الثقافية: الكاشير كيصيفط السلعة تطير، وكتسمع غير "Mit Karte bitte!". ها العبارات اللي كتحتاج باش تسلك راسك وتخرج راجل.',
        comparisons: [
          {
            textbook: 'Möchten Sie mit Karte oder bar bezahlen?',
            textbookMeaning: 'هل تود الدفع بالبطاقة أم نقداً؟',
            street: 'Mit Karte, bitte! / Zusammen, bitte.',
            streetMeaning: 'لاكارت عفاك! / مجموعين عفاك.',
            phoneticAr: 'مِيتْ كَارْتِه، بِيتِه!',
            contextDz: 'الألمان دابا كيدفعو بـ الـ Karte ولا بـ Apple Pay بسرعة فائقة.',
          },
          {
            textbook: 'Brauchen Sie den Kassenbon?',
            textbookMeaning: 'هل تحتاج وصل الصندوق؟',
            street: 'Brauchen Sie den Bon? - Nein danke, stimmt so!',
            streetMeaning: 'محتاج التوصيل؟ - لا شكراً، خليه عندك!',
            phoneticAr: 'بْرَاوْخِنْ زِي دِينْ بُون؟ - نَايْن دَانْكِه، شْتِيمْتْ زُو!',
            contextDz: 'كلمة Bon كينطقوها ديما بلا "Kassenbon" للاختصار.',
          },
          {
            textbook: 'Der Flaschenpfandautomat.',
            textbookMeaning: 'آلة استرجاع الوديعة.',
            street: 'Wo ist die Pfandabgabe?',
            streetMeaning: 'فين كاينة الماكينة ديال قراعي الـ Pfand؟',
            phoneticAr: 'فُو إِيسْتْ دِي بفَانْدْ آبْغَابِه؟',
            contextDz: 'فألمانيا أي قرعة د المونادا كترجع ليك 0.25 يورو، إياك تلوحها فـ الزبل!',
          },
        ],
        proTipDz: 'قاعدة ذهبية: رد البال تعطل وتجلس تعمر فالميكة عند الكاسة، الألمان اللي موراك كيبداو يتنفسو بالغدايد! حط السلعة فالشاريو حتى تمشي لطبلة التستيف وعمر على خاطرك.',
        quiz: {
          questionDz: 'الكاشيرة سولاتك: "Brauchen Sie den Bon?" وبغيتي تقول ليها ما محتاجوش، شنو تقولي؟',
          options: [
            'Nein, danke, passt schon!',
            'Ja, ich heiße Mohammed.',
            'Ich habe kein Auto.',
            'Auf Wiedersehen Frau Müller.',
          ],
          answerIndex: 0,
          explanationDz: '"Nein danke, passt schon!" (أو stimmt so) هي العبارة المحترمة والسريعة للرفض.',
        },
      },
      {
        id: 'tt_3_2',
        titleDz: 'تسجيل السكن (Anmeldung) والمواعيد فالبلدية',
        titleDe: 'Bürgeramt & Anmeldung',
        creator: 'malika.learns.german',
        creatorHandle: '@malika.learns.german',
        creatorAvatar: '🏢',
        hookDz: 'بلا "Anmeldung" ما كاينش حساب بنكي، ما كاينش رقم ضريبي، وما كاينش عقد عمل! ها كيفاش تهضر مع موظف البلدية.',
        tutorScriptDz: 'أول خطوة كيديرها أي مهاجر أو طالب ملي كيوصل لألمانيا هي التسجيل فـ Bürgeramt. الموظفين تما أغلبيتهم كيهضرو غير بالألمانية الصارمة. ها الجمل اللي لازم تحفظهم بحال سميتك!',
        comparisons: [
          {
            textbook: 'Ich möchte meinen Wohnsitz anmelden.',
            textbookMeaning: 'أود تسجيل مقر إقامتي.',
            street: 'Guten Tag, ich habe einen Termin zur Anmeldung.',
            streetMeaning: 'السلام، عندي رونديفو باش ندير لانميلدونغ.',
            phoneticAr: 'غُوتِنْ تَاغ، إِيشْ هَابِه أَيْنِنْ تِيرْمِينْ تسُورْ آنْمِيلْدُونغ.',
            contextDz: 'الـ Termin ضروري، وبلا بيه كيرجعوك فـ الباب.',
          },
          {
            textbook: 'Hier ist die Bestätigung des Vermieters.',
            textbookMeaning: 'هذا تأكيد المؤجر.',
            street: 'Hier ist meine Wohnungsgeberbestätigung und mein Pass.',
            streetMeaning: 'ها هي ورقة الكرا من عند المالك والپاسبور ديالي.',
            phoneticAr: 'فُونُونغْسْ غِيبَرْ بِي شْتِيتِيغُونغ',
            contextDz: 'أطول كلمة ولكن أهم ورقة، كيسنيها مول الدار باش يسجلوك.',
          },
        ],
        proTipDz: 'الحصول على Termin فـ برلين أو فرانكفورت صعيب بزاف. الحيلة اللي كينصحو بيها فـ تيك توك: دخل للسيت مع 8:00 صباحاً كيطيحو مواعيد مكنسلة خاوية!',
        quiz: {
          questionDz: 'شنو هي الوثيقة اللي لازم يسنيها ليك مول الدار باش دير Anmeldung؟',
          options: [
            'Wohnungsgeberbestätigung',
            'Fahrkarte der Bahn',
            'Speisekarte',
            'Krankenmeldung',
          ],
          answerIndex: 0,
          explanationDz: 'Wohnungsgeberbestätigung هي الشهادة الإلزامية لتسجيل السكن بالبلدية.',
        },
      },
      {
        id: 'tt_3_3',
        titleDz: 'قطارات ألمانيا Deutsche Bahn: الروطار والتبدال',
        titleDe: 'Deutsche Bahn & Verspätungen',
        creator: 'LifeinGermany',
        creatorHandle: '@deutschlernen02',
        creatorAvatar: '🚆',
        hookDz: 'أسطورة دقة المواعيد الألمانية كتموت فمحطة القطار! كيفاش تفهم الإعلانات الصوتية ملي يتعطل التران.',
        tutorScriptDz: 'كلنا كنسحابلنا الألمان ما كيتعطلوش، حتى كتركب فـ Deutsche Bahn وكتسمع "Der Zug hat heute leider 45 Minuten Verspätung". ها المصطلحات الحيوية باش ما تضيعش فـ المحطة.',
        comparisons: [
          {
            textbook: 'Der Zug verspätet sich um zwanzig Minuten.',
            textbookMeaning: 'القطار يتأخر بعشرين دقيقة.',
            street: 'Heute ca. 25 Minuten später. Grund: Verzögerungen im Betriebsablauf.',
            streetMeaning: 'معطل شي 25 دقيقة، والسبب مجهول كالعادة!',
            phoneticAr: 'سِيرْكَا 25 مِينُوتِنْ شْبِيتَرْ',
            contextDz: 'الجملة الكلاسيكية اللي كيقراها المكبر فـ محطات ألمانيا.',
          },
          {
            textbook: 'Der Zug verkehrt nicht heute.',
            textbookMeaning: 'القطار لا يعمل اليوم.',
            street: 'Dieser Zug fällt heute komplett aus!',
            streetMeaning: 'هاد التران تكنسلا ومغاديش يدوز گاع اليوم!',
            phoneticAr: 'دِيزَرْ تسُوغ فِيلْتْ هُويْتِه كُومْبْلِيتْ آوْسْ!',
            contextDz: 'فعل ausfallen كيعني الإلغاء التام للرحلة.',
          },
          {
            textbook: 'Auf welchem Bahnsteig fährt der Zug?',
            textbookMeaning: 'على أي رصيف يغادر القطار؟',
            street: 'Gleiswechsel! Heute von Gleis 4 statt Gleis 2.',
            streetMeaning: 'تبدال الرصيف! جري لرصيف 4 بلاصة 2.',
            phoneticAr: 'غْلَايْسْ فِيكْسِلْ! هُويْتِه فُون غْلَايْسْ 4',
            contextDz: 'ملي كتسمع "Gleiswechsel" خاصك تهز صاكك وتجري للرصيف الجديد.',
          },
        ],
        proTipDz: 'حمّل تطبيق "DB Navigator" فتيليفونك ضروري. كيعلمك بالروطار وتبدال الرصيف قبل ما ينطق الميكروفون فالمحطة!',
        quiz: {
          questionDz: 'سمعتي فالمحطة: "ICE 572 fällt heute aus!" شنو كتعني؟',
          options: [
            'القطار وصل دابا للرصيف.',
            'القطار ملغي تماماً ومغاديش يجي.',
            'التذاكر مجانية اليوم.',
            'القطار فيه أكل مجاني.',
          ],
          answerIndex: 1,
          explanationDz: 'fällt aus = تم إلغاؤه (ausfallen).',
        },
      },
      {
        id: 'tt_3_4',
        titleDz: 'قوانين الألمان المقدسة: Ruhezeit وفرز الزبل',
        titleDe: 'Ruhezeit & Mülltrennung',
        creator: 'malika.learns.german',
        creatorHandle: '@malika.learns.german',
        creatorAvatar: '🔇',
        hookDz: 'إياك تخدم لاسبيراتور نهار الأحد، را الجيران يعيطو عليك للبوليس! ها القوانين العجيبة فـ ألمانيا.',
        tutorScriptDz: 'فألمانيا، كاين مفهوم اسمو "Ruhezeit" (وقت الهدوء). نهار الأحد كامل ومن 22:00 للصباح فوسط السيمانة، ممنوع الصداع والتقرقيب. وزيد عليها فرز النفايات اللي عندو 4 د البيدونات!',
        comparisons: [
          {
            textbook: 'Bitte halten Sie die Ruhezeit ein.',
            textbookMeaning: 'يرجى احترام أوقات الراحة.',
            street: 'Sonntags ist absolute Ruhezeit, bitte leise sein!',
            streetMeaning: 'نهار الأحد هدوء تام، حدر الصوت عفاك!',
            phoneticAr: 'زُونْتَاغْس إِيسْتْ آبْزُولُوتِه رُوهِه تسَايْت',
            contextDz: 'الجيران الألمان حساسين بزاف للضجيج وأصوات الموزيكة.',
          },
          {
            textbook: 'Sortieren Sie den Abfall sorgfältig.',
            textbookMeaning: 'افرز النفايات بعناية.',
            street: 'Plastik in den Gelben Sack, Papier in die blaue Tonne!',
            streetMeaning: 'الميكات فـ الصاك الصفر، والوراق فالپوبيل الزرقاء!',
            phoneticAr: 'بْلَاسْتِيكْ إِنْ دِينْ غِيلْبِنْ زَاكْ',
            contextDz: 'فرز الزبل فـ ألمانيا ثقافة صارمة يلا خالفتيها تقدر تجيك غرامة فـ الكرا.',
          },
        ],
        proTipDz: 'المحلات والسوبرماركتات كاملة كتسد نهار الأحد فـ ألمانيا. شري ماكلتك وسلعتك نهار السبت قبل 20:00 وإلا غتبقى بلا خبز نهار الأحد!',
        quiz: {
          questionDz: 'واش مسموح دير الحفلة ولا تثقب الحيط بالشورينول نهار الأحد فـ دارك فـ ألمانيا؟',
          options: [
            'نعم، فالدار ديالي ندير اللي عجبني.',
            'لا نهائياً، حيت نهار الأحد كامل Ruhezeit وإلا يشتكيو الجيران.',
            'مسموح غير يلا عطيتي للجيران الشكلاط.',
            'مسموح غير مع 12 د الليل.',
          ],
          answerIndex: 1,
          explanationDz: 'الأحد هو يوم هدوء قانوني مطلق (Ruhezeit) في جميع أرجاء ألمانيا.',
        },
      },
      {
        id: 'tt_3_5',
        titleDz: 'التأمين الصحي (Krankenkasse) والطبيب والشهادة الطبية',
        titleDe: 'Arztbesuch & Krankmeldung',
        creator: 'LifeinGermany',
        creatorHandle: '@deutschlernen02',
        creatorAvatar: '🩺',
        hookDz: 'مرضتي فالخدمة أو التكوين المهني؟ إياك تغيب بلا ورقة الطبيب (AU)! ها كيفاش تطلبها.',
        tutorScriptDz: 'فألمانيا، الصحة خط أحمر. أول ما كتحس براسك مريض، كتمشي عند Hausarzt (طبيب العائلة)، كتدوز لاكارت ديال التأمين (Versichertenkarte)، وكيصيفط الشهادة الطبية نيشان للخدمة والتأمين الكترونياً (eAU).',
        comparisons: [
          {
            textbook: 'Ich fühle mich unwohl und benötige ein Attest.',
            textbookMeaning: 'أشعر بوعكة وأحتاج شهادة.',
            street: 'Ich brauche eine Krankschreibung für die Arbeit.',
            streetMeaning: 'خاصني شهادة طبية (كرونكشرايبونغ) للخدمة.',
            phoneticAr: 'إِيشْ بْرَاوْخِه أَيْنِه كْرَانْكْ شْرَايْبُونغ فِيرْ دِي آرْبَايْت.',
            contextDz: 'الشهادة الطبية كتسمى عامياً Krankschreibung أو AU.',
          },
          {
            textbook: 'Haben Sie Ihre Krankenversicherungskarte dabei?',
            textbookMeaning: 'هل بطاقة التأمين الصحي بحوزتك؟',
            street: 'Einmal die Versichertenkarte, bitte!',
            streetMeaning: 'عطيني لاكارت د لاسيرونس دغيا ندوزها!',
            phoneticAr: 'آيْنْمَال دِي فِيرْزِيشِيرْتِنْ كَارْتِه، بِيتِه!',
            contextDz: 'أول حاجة كتطلبها الممرضة فـ الاستقبال فالطبيب.',
          },
        ],
        proTipDz: 'خاصك تصيفط إيميل للخدمة ولا تعيط ليهم مع الصباح بكري (قبل بداية وقت العمل) وتقول: "Ich bin krank und gehe heute zum Arzt".',
        quiz: {
          questionDz: 'شنو هي العبارة اللي كتقولها للطبيب باش يعطيك عطلة مرضية للخدمة؟',
          options: [
            'Ich brauche eine Krankschreibung.',
            'Geben Sie mir ein Auto bitte.',
            'Ich möchte einen Döner essen.',
            'Auf Wiedersehen im Kino.',
          ],
          answerIndex: 0,
          explanationDz: '"Ich brauche eine Krankschreibung" تعني أحتاج شهادة مرضية للعمل أو التكوين.',
        },
      },
    ],
  },

  /* ------------------------------------------------------------
     TRACK 4: SITUATIONAL MICRO-ROLEPLAYS (60s DIALOGUES)
     Inspired by @easygermanwithbella & @jermoj
     ------------------------------------------------------------ */
  {
    id: 'situational_roleplays',
    titleDz: 'مواقف الحياة اليومية السريعة (60s Roleplays)',
    titleDe: 'Alltagssituationen in 60 Sekunden',
    creatorStyle: 'Easy German with Bella & GermanTok',
    badge: 'ANIMATED SKITS 🎭',
    color: 'amber',
    descriptionDz: 'سيناريوهات قصيرة فالمخبزة، الصيدلية، والمطعم. كيفاش تطلب وتجاوب بسرعة وبثقة تامة.',
    lessons: [
      {
        id: 'tt_4_1',
        titleDz: 'فالمخبزة الألمانية (Beim Bäcker): كيفاش تطلب بحال البرو',
        titleDe: 'Beim Bäcker bestellen',
        creator: 'Easy German with Bella',
        creatorHandle: '@easygermanwithbella',
        creatorAvatar: '🥐',
        hookDz: 'المخبزة فـ ألمانيا عالم بوحدو! مئات أنواع الخبز. كيفاش تطلب بلا ما تحشم؟',
        tutorScriptDz: 'فالمخبزة الألمانية، الطلب عندو ريتم خاص. كتدخل، كتقول شنو بغيتي بـ "Ich hätte gern..."، والبائعة كتسولك "Darf\'s sonst noch was sein?" وأنت كتختم بـ "Das wär\'s, danke!". ساهلة وماهلة!',
        comparisons: [
          {
            textbook: 'Geben Sie mir bitte zwei Brötchen.',
            textbookMeaning: 'أعطني من فضلك قطعتي خبز.',
            street: 'Ich hätte gern zwei normale Brötchen und ein Croissant.',
            streetMeaning: 'بغيت عفاك جوج خبزات عاديين وكرواصة.',
            phoneticAr: 'إِيشْ هِيتِه غِيرْنْ تسْفَايْ نُورْمَالِه بْرُوتْشِنْ',
            contextDz: '"Ich hätte gern..." هي أرقى وأحسن صيغة للطلب فـ المانيا.',
          },
          {
            textbook: 'Möchten Sie noch etwas anderes?',
            textbookMeaning: 'هل تود شيئاً آخر؟',
            street: 'Darf\'s sonst noch was sein? - Nein, das wär\'s!',
            streetMeaning: 'نزيدك شي حاجة أخرى؟ - لا، صافي هادشي اللي كاين شكراً!',
            phoneticAr: 'دَارْفْسْ زُونْسْتْ نُوخْ فَاسْ زَايْن؟ - دَاسْ فِيرْسْ!',
            contextDz: 'جملة النهاية الرسمية فالمخبزة: "Das wär\'s, danke!".',
          },
        ],
        proTipDz: 'يلا بغيتي خبزة مقطعة، قول للبائعة: "Können Sie das bitte schneiden?". كيقطعوها فـ ماكينة مجاناً!',
        quiz: {
          questionDz: 'البائعة فالمخبزة قالت ليك: "Sonst noch etwas?" وساليتي طلباتك، شنو تجاوب؟',
          options: [
            'Nein danke, das wär\'s!',
            'Ja, ich heiße Ahmed.',
            'Ich wohne in Rabat.',
            'Guten Morgen mein Herr.',
          ],
          answerIndex: 0,
          explanationDz: '"Nein danke, das wär\'s!" (لا شكراً، هذا كل شيء) هي الجواب المثالي لإنهاء الطلب.',
        },
      },
      {
        id: 'tt_4_2',
        titleDz: 'فالفارماسي (In der Apotheke): الوصفة والدوا',
        titleDe: 'In der Apotheke',
        creator: 'GermanTok',
        creatorHandle: '@jermoj',
        creatorAvatar: '💊',
        hookDz: 'كتضرّك الراس ولا الكرش وما عارفش واش الدوا بالوصفة (Rezept) ولا بلا بيها؟ ها كيفاش تشرح حالتك.',
        tutorScriptDz: 'فالصيدلية فـ ألمانيا، كاين دوا كيتعطى عادي (Rezeptfrei) وكاين دوا ضروري بورقة الطبيب (Rezeptpflichtig). كتدخل وتقول العضو اللي كيضرك وكتسول على مسكن الألم.',
        comparisons: [
          {
            textbook: 'Mein Kopf schmerzt sehr.',
            textbookMeaning: 'رأسي يؤلمني كثيراً.',
            street: 'Ich habe starke Kopfschmerzen. Haben Sie etwas dagegen?',
            streetMeaning: 'راسي كيفرعني بالصداع، واش كاين شي دوا مزيان ليه؟',
            phoneticAr: 'إِيشْ هَابِه شْتَارْكِه كُوبْفْ شْمِيرْتْسِنْ. هَابِنْ زِي إِتْفَاسْ دَاغِيغِنْ؟',
            contextDz: 'صيغة "Haben Sie etwas gegen...?" هي الطريقة الأنسب للسؤال عن دواء لمرض معين.',
          },
          {
            textbook: 'Ist dieses Medikament rezeptpflichtig?',
            textbookMeaning: 'هل هذا الدواء يتطلب وصفة؟',
            street: 'Brauche ich dafür ein Rezept? - Nein, das ist rezeptfrei.',
            streetMeaning: 'واش خاصني ورقة الطبيب لهادا؟ - لا، راه كيتباع عادي بلا ورقة.',
            phoneticAr: 'بْرَاوْخِه إِيشْ دَافِيرْ أَيْن رِيتْسِبْت؟',
            contextDz: 'الأدوية مثل الباراسيتامول والإيبوبروفين 400 ملغ تباع بلا ريسپت.',
          },
        ],
        proTipDz: 'رد البال بين "Drogerie" (بحال dm و Rossmann) اللي كتبيع الشامبوان والمكياج، وبين "Apotheke" (العلامة الحمراء A) اللي كتبيع الدوا الحقيقي.',
        quiz: {
          questionDz: 'بغيتي تسول فالفارماسي على شحال من حبة تاخذ فالنهار: شنو تقول؟',
          options: [
            'Wie oft soll ich das einnehmen?',
            'Wo ist der Bahnhof?',
            'Wie viel Uhr ist das Auto?',
            'Ich möchte ein Brötchen essen.',
          ],
          answerIndex: 0,
          explanationDz: '"Wie oft soll ich das einnehmen?" تعني كم مرة عليّ تناول هذا الدواء؟',
        },
      },
      {
        id: 'tt_4_3',
        titleDz: 'فالمطعم والدونير: كيفاش تكوموندي بالدارجة الألمانية',
        titleDe: 'Im Dönerladen bestellen',
        creator: 'GermanTok',
        creatorHandle: '@jermoj',
        creatorAvatar: '🥙',
        hookDz: 'الدونير هو الأكلة الوطنية غير الرسمية فـ ألمانيا! ها الكلمات السرية باش تطلب دونير ناضي.',
        tutorScriptDz: 'فـ محلات الدونير فـ ألمانيا، كاين حوار سريع كيدور فـ 10 ثواني: "Mit allem?" (بكلشي؟)، "Scharf?" (حار؟)، و "Zum Mitnehmen oder hier essen?" (تاكلو هنا ولا تديه معك؟). شوف كيفاش تجاوب بحال ولد الحومة فـ برلين!',
        comparisons: [
          {
            textbook: 'Ich möchte einen Döner Kebab bitte.',
            textbookMeaning: 'أود كباب دونر من فضلك.',
            street: 'Einmal Döner mit allem, bitte! Aber ohne Zwiebeln.',
            streetMeaning: 'واحد الدونير بكلشي عفاك، ولكن بلاش بصلة!',
            phoneticAr: 'آيْنْمَال دُونِرْ مِيتْ أَلِمْ، بِيتِه! آبَرْ أُوهْنِه تسْفِيبِلْنْ.',
            contextDz: '"mit allem" كتعني الشلاظة كاملة مع لاصوص.',
          },
          {
            textbook: 'Möchten Sie es hier verzehren?',
            textbookMeaning: 'هل تود تناوله هنا؟',
            street: 'Zum Mitnehmen oder für hier? - Zum Mitnehmen, bitte!',
            streetMeaning: 'نديه معايا ولا هنا؟ - امبورتي عفاك (نديه معايا)!',
            phoneticAr: 'تسُومْ مِيتْنِيمِنْ، بِيتِه!',
            contextDz: 'دائماً يطرح هذا السؤال عند نهاية الطلب.',
          },
        ],
        proTipDz: 'يلا بغيتي لاصوص الحارة والبيضاء بالثومة: قول "Mit Knoblauchsoße und ein bisschen scharf!".',
        quiz: {
          questionDz: 'مول الدونير سولك: "Hier essen oder zum Mitnehmen?" وبغيتي تاكلو فـ الدار، شنو تجاوب؟',
          options: [
            'Zum Mitnehmen, bitte!',
            'Hier essen, danke!',
            'Ich habe kein Geld.',
            'Gute Nacht!',
          ],
          answerIndex: 0,
          explanationDz: 'Zum Mitnehmen تعني للأخذ في الطريق / سفري.',
        },
      },
      {
        id: 'tt_4_4',
        titleDz: 'كتسول على العنوان فالشارع (Nach dem Weg fragen)',
        titleDe: 'Nach dem Weg fragen',
        creator: 'Easy German with Bella',
        creatorHandle: '@easygermanwithbella',
        creatorAvatar: '🗺️',
        hookDz: 'تسالات ليك لاشارج د التيليفون وغلتي فـ فرانكفورت؟ ها كيفاش تسول أي ألماني فالشارع ويفهمك فـ ثانية!',
        tutorScriptDz: 'باش توقف شي ألماني فالزنقة، كتبدا دايماً بكلمة الاعتذار المهذبة "Entschuldigung!" ثم السؤال المباشر: "Wie komme ich zu...?". والألماني غادي يجاوبك بالاتجاهات: Geradeaus (نيشان)، Links (يسار)، Rechts (يمين).',
        comparisons: [
          {
            textbook: 'Können Sie mir den Weg erklären?',
            textbookMeaning: 'هل بإمكانك شرح الطريق لي؟',
            street: 'Entschuldigung, wissen Sie, wo die U-Bahn ist?',
            streetMeaning: 'سمح ليا عفاك، واش عارف فين كاين الميطرو؟',
            phoneticAr: 'إِنْتْشُولْدِيغُونغ، فِيسْنْ زِي، فُو دِي أُو-بَان إِيسْتْ؟',
            contextDz: 'طريقة مهذبة ومباشرة كيبدا بيها أي واحد فالشارع.',
          },
          {
            textbook: 'Gehen Sie geradeaus und biegen Sie links ab.',
            textbookMeaning: 'سر إلى الأمام وانعطف يساراً.',
            street: 'Immer geradeaus, dann die zweite Straße rechts!',
            streetMeaning: 'نيشان نيشان، ومن بعد الدورة الثانية على اليمين!',
            phoneticAr: 'إِيمَرْ غِيغَادِه آوْسْ، دَان دِي تسْفَايْتِه شْتْرَاسِه غِيشْتْسْ!',
            contextDz: 'الوصف الشائع للاتجاهات بين الناس.',
          },
        ],
        proTipDz: 'U-Bahn = مترو الأنفاق تحت الأرض | S-Bahn = قطار الضواحي السريع فوق الأرض | Tram/Straßenbahn = الترامواي.',
        quiz: {
          questionDz: 'شي واحد قال ليك فالطريق: "Gehen Sie immer geradeaus!" شنو خاصك دير؟',
          options: [
            'ندور على الليسر دغيا.',
            'نكمل نيشان قدامي.',
            'نرجع اللور.',
            'نركب فـ الطاكسي.',
          ],
          answerIndex: 1,
          explanationDz: 'geradeaus تعني إلى الأمام مباشرة (نيشان).',
        },
      },
    ],
  },

  /* ------------------------------------------------------------
     TRACK 5: EXAM HACKS & SCORE BOOSTERS
     Inspired by @thegermanclass & @germanbeginner
     ------------------------------------------------------------ */
  {
    id: 'exam_hacks',
    titleDz: 'حيل امتحانات Goethe A1 و Telc (Score Boosters)',
    titleDe: 'Prüfungs-Hacks für Goethe A1',
    creatorStyle: 'The German Class & Réka',
    badge: 'EXAM HACKS 🎯',
    color: 'cyan',
    descriptionDz: 'كيفاش تجيب النقطة كاملة فـ الشفوي والكتابي. حيل البطاقات وقوالب الإيميل الجاهزة اللي كينجحو بيها الطلبة.',
    lessons: [
      {
        id: 'tt_5_1',
        titleDz: 'حيلة Teil 1 و Teil 2 فالشفوي: سؤال البطاقات السحري',
        titleDe: 'Sprechen Teil 2: Wortkarten-Hack',
        creator: 'The German Class',
        creatorHandle: '@thegermanclass',
        creatorAvatar: '🎓',
        hookDz: 'فامتحان الشفوي كيعطيوك كارت فيها كلمة وخاصك تسول صاحبك. ها القالب الجاهز اللي كينطبق على أي كلمة!',
        tutorScriptDz: 'فامتحان Goethe A1، كيتحطو ليك كروت فيهم مواضيع بحال (Essen, Freizeit, Beruf). ما تحتاجش تخترع جمل معقدة وتغلط فالقواعد. كاين جوج أسئلة جاهزة كيركبو على أي كلمة وكيجيبو 100% د النقط!',
        comparisons: [
          {
            textbook: 'Formulieren Sie eine Frage mit dem Wort "Zeitung".',
            textbookMeaning: 'صغ سؤالاً بالكلمة المعطاة.',
            street: 'Lesen Sie gern die Zeitung? / Haben Sie eine Zeitung?',
            streetMeaning: 'واش كيعجبك تقرا الجريدة؟ / واش عندك جريدة؟',
            phoneticAr: 'لِيزِنْ زِي غِيرْنْ دِي تسَايْتُونغ؟',
            contextDz: 'قالب "Verben + Sie gern...?" يركب على أي كلمة ويضمن العلامة الكاملة.',
          },
          {
            textbook: 'Formulieren Sie eine Bitte mit der Karte "Wasser".',
            textbookMeaning: 'صغ طلباً مهذباً بالكلمة.',
            street: 'Können Sie mir bitte das Wasser geben?',
            streetMeaning: 'واش تقدر تعطيني الما عفاك؟',
            phoneticAr: 'كُونِّنْ زِي مِيرْ بِيتِه دَاسْ فَاسِرْ غِيبِنْ؟',
            contextDz: 'قالب "Können Sie mir bitte [Wort] geben?" ينقذك في Teil 3 مع بطاقات الصور!',
          },
        ],
        proTipDz: 'لأي طلب بصورة: "Können Sie bitte... machen?". لأي سؤال بكلمة: "Wie viel kostet...?" أو "Möchten Sie...?". ساهلين وما فيهم حتى ريسك د الخطأ!',
        quiz: {
          questionDz: 'عطاوك فامتحان A1 Sprechen كارت فيها كلمة "Sport" والموضوع "Freizeit". شنو أحسن سؤال تطرح؟',
          options: [
            'Machen Sie gern Sport in der Freizeit?',
            'Der Sport ist gut.',
            'Sport Sport Sport?',
            'Ich bin kein Sportler.',
          ],
          answerIndex: 0,
          explanationDz: '"Machen Sie gern Sport in der Freizeit?" سؤال مثالي بقواعد صحيحة ومحترمة (Sie-Form).',
        },
      },
      {
        id: 'tt_5_2',
        titleDz: 'قالب الإيميل الجاهز للـ Schreiben: 10/10 مضمونة',
        titleDe: 'Schreiben E-Mail Vorlage',
        creator: 'The German Class',
        creatorHandle: '@thegermanclass',
        creatorAvatar: '🎓',
        hookDz: 'فامتحان الكتابي خاصك تكتب إيميل من 30 كلمة. احفظ هاد القالب الجاهز وعمر غير الفراغات!',
        tutorScriptDz: 'فامتحان Goethe A1، الإيميل عندو بنية ثابتة: التحية (Anrede)، السبب، والنهاية (Gruß). غير هاد الهيكل بوحدو كيجيب نص النقطة واخا تكون ضعيف فالتعبير!',
        comparisons: [
          {
            textbook: 'Formelle E-Mail Struktur',
            textbookMeaning: 'هيكل الرسالة الرسمية',
            street: 'Sehr geehrte Damen und Herren, / Lieber [Name],',
            streetMeaning: 'سيداتي سادتي المحترمين، / عزيزي فلان،',
            phoneticAr: 'زِيرْ غِيهِيرْتِه دَامِنْ أُوند هِيرِنْ',
            contextDz: 'رد البال: مورا التحية كاين فاصلة (,) وأول كلمة موراها كتبدا بحرف صغير (klein)!',
          },
          {
            textbook: 'Ich kann leider nicht kommen.',
            textbookMeaning: 'للأسف لا أستطيع القدوم.',
            street: 'Ich kann leider nicht kommen, weil ich krank bin.',
            streetMeaning: 'للأسف ما نقدرش نجي حيت راني مريض.',
            phoneticAr: 'إِيشْ كَانْ لَايْدَرْ نِيشْتْ كُومِنْ، فَايْل إِيشْ كْرَانْكْ بِينْ.',
            contextDz: 'أشهر جملة كتحط فامتحانات A1 للاعتذار عن موعد.',
          },
        ],
        proTipDz: 'النهاية الرسمية دائماً: "Mit freundlichen Grüßen". النهاية لصحابك: "Viele Grüße" أو "Liebe Grüße".',
        quiz: {
          questionDz: 'كتبتي فبداية الإيميل: "Liebe Sarah," شنو الحرف اللي كتبدا بيه أول كلمة فالسطر الموالي؟',
          options: [
            'حرف صغير (klein) حيت كاين فاصلة قبل منو.',
            'حرف كبير (Groß) دائماً.',
            'رقم فقط.',
            'حرف باليونانية.',
          ],
          answerIndex: 0,
          explanationDz: 'في الألمانية بعد الفاصلة في التحية تبدأ السطر الموالي بحرف صغير (kleingeschrieben) إلا إذا كان اسماً.',
        },
      },
      {
        id: 'tt_5_3',
        titleDz: 'مصايد الفهم الشفهي (Hörverstehen Traps): كيفاش كيزلقوك',
        titleDe: 'Hörverstehen Fallen',
        creator: 'Réka',
        creatorHandle: '@germanbeginner',
        creatorAvatar: '🎧',
        hookDz: 'فأوديو الامتحان كيقولو جوج تواريخ أو جوج أثمنة باش يدوخوك! ها السر باش تعزل الجواب الصح.',
        tutorScriptDz: 'فامتحان الـ Hörverstehen، واياك تفرح وتكوشي على أول رقم تسمعو! فـ 90% من الحالات، المتحدث كيقول: "أنا كنت باغي نجي مع 15:00، ولكن عندي رونديفو، داكشي علاش غنجي حتى لـ 17:00". الجواب الصح هو 17:00 ماشي 15:00!',
        comparisons: [
          {
            textbook: 'Wann kommt der Zug an?',
            textbookMeaning: 'متى يصل القطار؟',
            street: 'Er sollte um 14 Uhr kommen, aber er kommt erst um 16 Uhr!',
            streetMeaning: 'كان خاصو يجي مع الـ 2، ولكن ما غيوصل حتى لـ الـ 4!',
            phoneticAr: 'إِيرْ زُولْتِه أُومْ 14 كُومِنْ، آبَرْ إِيرْ كُومْتْ إِيرْسْتْ أُومْ 16!',
            contextDz: 'كلمة "erst" كتعني "ليس قبل / حتى لـ"، وهي مفتاح الجواب الصحيح.',
          },
          {
            textbook: 'Wie viel kostet die Fahrkarte?',
            textbookMeaning: 'كم يبلغ سعر التذكرة؟',
            street: 'Normalerweise 40 Euro, aber heute im Angebot nur 25 Euro!',
            streetMeaning: 'فالعادة 40 يورو، ولكن اليوم فـ البرومو غير بـ 25 يورو!',
            phoneticAr: 'نُورْمَالِرْفَايْزِه 40، آبَرْ هُويْتِه نُورْ 25!',
            contextDz: 'الجواب هو 25 وليس 40. ركز على كلمة "im Angebot" أو "nur".',
          },
        ],
        proTipDz: 'قرا الأسئلة قبل ما يبدا الأوديو وستر على الكلمات المفتاحية (wann, wo, wie viel). هكا كتركز وذنك غير على المعلومة اللي باغي.',
        quiz: {
          questionDz: 'سمعتي فالأوديو: "Der Kurs sollte um 9:00 Uhr beginnen, aber der Lehrer kommt erst um 9:30 Uhr." فوقاش غيبدا الدرس؟',
          options: ['9:00', '9:30', '10:00', '8:30'],
          answerIndex: 1,
          explanationDz: 'كلمة "erst um 9:30" توضح أن البداية الحقيقية تأجلت إلى 9:30.',
        },
      },
    ],
  },

  /* ------------------------------------------------------------
     TRACK 6: GERMAN MINDSET & UNTRANSLATABLE WORDS
     Inspired by @germa_nology & @slowgerman
     ------------------------------------------------------------ */
  {
    id: 'mindset_words',
    titleDz: 'العقلية الألمانية والكلمات العجيبة',
    titleDe: 'Deutsche Mentalität & Unübersetzbare Wörter',
    creatorStyle: 'germanology & SlowGerman',
    badge: 'CULTURE & SLOW 🧠',
    color: 'mag',
    descriptionDz: 'كلمات ألمانية غريبة ما كايناش فـ حتى لغة أخرى (Feierabend, Kummerspeck)، ونطق بطيء متقن للأصوات الصعبة.',
    lessons: [
      {
        id: 'tt_6_1',
        titleDz: 'كلمات ألمانية ما كايناش فـ حتى لغة فـ العالم',
        titleDe: 'Unübersetzbare deutsche Wörter',
        creator: 'germanology',
        creatorHandle: '@germa_nology',
        creatorAvatar: '🇩🇪',
        hookDz: 'الألمانية معروفة بتركيب الكلمات العجيبة. كاين كلمات كتختصر مشاعر ومواقف فكلمة وحدة!',
        tutorScriptDz: 'مرحبا بيك فـ كبسولة الثقافة مع جيرمانولوجي! الألمان عباقرة فـ دمج الكلمات. مثلاً "Feierabend" هي اللحظة المقدسة اللي كتسالي فيها الخدمة وممنوع شي حد يصدعك، و "Kummerspeck" هو الوزن الزايد اللي كتاكلو ملي تكون مقلق ومكتئب!',
        comparisons: [
          {
            textbook: 'Das Ende der Arbeitszeit.',
            textbookMeaning: 'نهاية وقت العمل.',
            street: 'Schönen Feierabend! Ich bin jetzt im Feierabendmodus.',
            streetMeaning: 'فاير آبند سعيد! سالات الخدمة ودبا وقت الراحة والحرية.',
            phoneticAr: 'شُونِنْ فَايْرْ آبِنْد!',
            contextDz: 'أجمل كلمة كيقولوها الزملاء لبعضياتهم مع 17:00 ملي كيسدو البيسيات.',
          },
          {
            textbook: 'Ein Ohrwurm ist ein Lied, das man nicht vergisst.',
            textbookMeaning: 'أغنية تعلق في الرأس.',
            street: 'Ich habe einen totalen Ohrwurm von diesem Song!',
            streetMeaning: 'هاد الأغنية لاصقة ليا فودني ومبغاتش تخرج من راسي گاع!',
            phoneticAr: 'إِيشْ هَابِه أَيْنِنْ تُوتَالِنْ أُوهْرْ فُورْمْ!',
            contextDz: 'حرفياً "دودة الأذن"، ولكن معناها المجازي أغنية عالقة في الدماغ.',
          },
          {
            textbook: 'Schadenfreude.',
            textbookMeaning: 'الفرح بمصيبة الآخرين (الشماتة).',
            street: 'Das ist reine Schadenfreude!',
            streetMeaning: 'هادي شماتة خالصة!',
            phoneticAr: 'شَادِنْ فْرُويْدِه!',
            contextDz: 'كلمة ألمانية مشهورة عالمياً دخلت حتى للغة الإنجليزية والفرنسية.',
          },
        ],
        proTipDz: 'يلا شي ألماني سد البيسي وقالك "Ich mache jetzt Feierabend"، إياك تصوني عليه ولا تصيفط ليه إيميل د الخدمة، راه يغبر ليك لافير!',
        quiz: {
          questionDz: 'شنو كيعني مصطلح "Feierabend" فـ الثقافة الألمانية؟',
          options: [
            'عيد ميلاد الباطرون.',
            'لحظة انتهاء العمل وبداية وقت الراحة المقدس.',
            'حفلة رأس السنة.',
            'يوم الذهاب للمستشفى.',
          ],
          answerIndex: 1,
          explanationDz: 'Feierabend هي نهاية يوم العمل ووقت الاسترخاء التام.',
        },
      },
      {
        id: 'tt_6_2',
        titleDz: 'عقلية الوقت: Pünktlichkeit (5 دقائق قبل الوقت هي الوقت)',
        titleDe: 'Deutsche Pünktlichkeit',
        creator: 'germanology',
        creatorHandle: '@germa_nology',
        creatorAvatar: '🇩🇪',
        hookDz: 'فألمانيا، يلا جيتي فالوقت بالضبط راك تعطلتي! ها كيفاش كيشوفو الألمان الدقيقة والثانية.',
        tutorScriptDz: 'المثل الألماني الشهير كيقول: "Fünf Minuten vor der Zeit ist des Deutschen Pünktlichkeit" (خمس دقائق قبل الموعد هي الدقة الألمانية). يلا عندك موعد مع 10:00، خاصك تكون واقف قدام الباب مع 09:55!',
        comparisons: [
          {
            textbook: 'Pünktlichkeit ist eine wichtige Tugend.',
            textbookMeaning: 'الدقة في المواعيد فضيلة مهمة.',
            street: 'Sei bitte pünktlich! Lieber 5 Minuten zu früh als 1 Minute zu spät.',
            streetMeaning: 'كن فـ الوقت عفاك! 5 دقائق بكري ولا دقيقة وحدة معطل.',
            phoneticAr: 'زَايْ بِيتِه بُونكْتْلِيشْ!',
            contextDz: 'التعطال فـ المانيا كيتعتابر قلة احترام فادحة للمواعيد.',
          },
          {
            textbook: 'Ich verspäte mich leider um zehn Minuten.',
            textbookMeaning: 'سأتأخر للأسف عشر دقائق.',
            street: 'Es tut mir leid, ich stehe im Stau und schaffe es erst um 10:15.',
            streetMeaning: 'كنعتذر بزاف، راني فـ لومبوتياج وما غنوصل حتى لـ 10:15.',
            phoneticAr: 'إِسْ تُوتْ مِيرْ لَايْد، إِيشْ شْتِيهِه إِيمْ شْتَاوْ',
            contextDz: 'يلا شفتي راسك غتعطل حتى بـ 3 دقائق، خاصك تعيط وتعتذر وتخبرهم مسبقاً.',
          },
        ],
        proTipDz: 'فمقابلات العمل (Vorstellungsgespräch) أو مواعيد السفارة، وصل قبل بنصف ساعة للمنطقة باش ما يفاجئك حتى طارئ فـ المواصلات.',
        quiz: {
          questionDz: 'عندك موعد عمل مع 14:00 فـ ألمانيا، إمتى أحسن وقت تكون فيه فـ عين المكان؟',
          options: [
            '13:55 (خمس دقائق قبل الوقت).',
            '14:20 (معطل عادي بحال المغرب).',
            '14:00 بالثانية.',
            '15:00 بعد الغداء.',
          ],
          answerIndex: 0,
          explanationDz: '13:55 هي القاعدة الذهبية للدقة في المواعيد الألمانية (Pünktlichkeit).',
        },
      },
      {
        id: 'tt_6_3',
        titleDz: 'النطق البطيء للأصوات الصعبة (Umlaute & ch-Laut)',
        titleDe: 'Aussprache-Training (Slow & Clear)',
        creator: 'SlowGerman',
        creatorHandle: '@slowgerman',
        creatorAvatar: '🎧',
        hookDz: 'عقدة الـ ä, ö, ü وصوت الـ ch اللي كينطقوه بزاف د الناس غلط! تدريب بطيء وعميق للودنين.',
        tutorScriptDz: 'فهاد التمرين من سلو جيرمان، غادي نطقو بشوية وبوضوح تام. صوت الـ ch اللين (ich-Laut) كيتنطق بوسط اللسان بحال ابتسامة، ماشي خاء خشنة! والأوملاوت ü كتدور شنايفك بحال التصفار وكتنطق إي.',
        comparisons: [
          {
            textbook: 'ich / mich / dich / nicht',
            textbookMeaning: 'أنا / إياي / إياك / ليس',
            street: 'Ich möchte nicht... (mit weichem ch)',
            streetMeaning: 'أنا لا أريد... (بنطق خفيف وناعم ماشي خاء عربية قاصحة)',
            phoneticAr: 'إِيشْ مُوشْتِه نِيشْتْ...',
            contextDz: 'حرف ch بعد الحروف e و i يكون دائماً رقيقاً وناعماً (ich-Laut).',
          },
          {
            textbook: 'Buch / Kuchen / machen',
            textbookMeaning: 'كتاب / كعكة / يفعل',
            street: 'Ich mache einen Kuchen (mit hartem ach-Laut)',
            streetMeaning: 'أنا أصنع كعكة (هنا خاء واضحة بحال الخاء المغربية)',
            phoneticAr: 'إِيشْ مَاخِه أَيْنِنْ كُوخِنْ',
            contextDz: 'حرف ch بعد الحروف a, o, u يكون مفخماً مثل الخاء المغربية (ach-Laut).',
          },
        ],
        proTipDz: 'القاعدة: مورا e, i, ä, ö, ü = شين خفيفة ناعمة (ich). مورا a, o, u = خاء صريحة (ach).',
        quiz: {
          questionDz: 'كيفاش كيتنطق حرف ch فكلمة "Küche" (مطبخ)؟',
          options: [
            'رقيق وناعم (ich-Laut) لأن قبله حرف ü.',
            'خاء قاصحة ومفخمة بحال "خويا".',
            'كاف صريحة بحال كاس.',
            'لا ينطق نهائياً.',
          ],
          answerIndex: 0,
          explanationDz: 'بعد حروف الأوملاوت مثل ü، ينطق صوت ch ناعماً ورقيقاً (weicher ich-Laut).',
        },
      },
    ],
  },
];
