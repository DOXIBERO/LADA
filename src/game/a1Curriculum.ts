/* ============================================================
   LADA — GOETHE A1 CURRICULUM & PEDAGOGICAL ENGINE
   Structured CEFR A1 units specifically tailored for Moroccan
   learners aiming for Goethe-Zertifikat A1, Visa, Ausbildung,
   Studium, and daily integration in Germany.
   ============================================================ */

export interface A1Word {
  de: string;
  ipa: string;
  phoneticAr: string;
  dz: string;
  mnemonic: string;
  trapTip?: string;
  article?: 'der' | 'die' | 'das' | 'none';
}

export interface DialogueLine {
  speaker: string;
  de: string;
  dz: string;
  audioKey?: string;
}

export interface GrammarLesson {
  title: string;
  ruleDz: string;
  examples: { de: string; dz: string; highlight?: string }[];
  tables?: { headers: string[]; rows: string[][] };
}

export interface SentenceExercise {
  targetDe: string;
  promptDz: string;
  chips: string[];
  explanation: string;
}

export interface ListeningExercise {
  audioText: string;
  questionDz: string;
  optionsDz: string[];
  correctIdx: number;
  explanation: string;
}

export interface A1Unit {
  id: string;
  number: number;
  titleDe: string;
  titleDz: string;
  descDz: string;
  badge: string;
  culturalTip: { title: string; textDz: string };
  words: A1Word[];
  dialogue: DialogueLine[];
  grammar: GrammarLesson[];
  sentenceExercises: SentenceExercise[];
  listeningExercises: ListeningExercise[];
}

export const A1_UNITS: A1Unit[] = [
  // ============================================================
  // UNIT 1: Erste Schritte & Vorstellung (التعارف والتقديم)
  // ============================================================
  {
    id: 'a1_01',
    number: 1,
    titleDe: 'Erste Schritte & Vorstellung',
    titleDz: 'التعارف والتقديم من الصفر',
    descDz: 'كيفاش تقدم راسك، تقول سميتك، الأصل ديالك، والهدف ديالك ف ألمانيا.',
    badge: 'A1.1 · BASIS',
    culturalTip: {
      title: 'Sie ولا du؟',
      textDz: 'ف ألمانيا مع الناس لي ما كتعرفهمش، ف الإدارة، ولا ف مقابلة العمل، ديما استعمل «Sie» (بحال vous بالفرنسية). مع صحابك والشباب كتستعمل «du».',
    },
    words: [
      { de: 'Hallo', ipa: '/ˈhaloː/', phoneticAr: 'هَالُو', dz: 'أهلاً / سلام', mnemonic: 'Hallo = ألو، بحال ألو ف التلفون.' },
      { de: 'Guten Tag', ipa: '/ˌɡuːtn̩ ˈtaːk/', phoneticAr: 'گُوتْنْ تَاكْ', dz: 'نهار مبروك / السلام عليكم', mnemonic: 'Guten = زوين، Tag = نهار. نهارك مبروك.' },
      { de: 'Ich heiße…', ipa: '/ɪç ˈhaɪsə/', phoneticAr: 'إِشْ هَايْسَه', dz: 'سميتي…', mnemonic: 'heiße بحال «عيط لي». أنا كيعيطو لي...' },
      { de: 'Ich komme aus Marokko', ipa: '/ɪç ˈkɔmə aʊs maˈʁɔko/', phoneticAr: 'إِشْ كُومَه أَوْس مَارُوكُو', dz: 'أنا جاي من المغرب', mnemonic: 'aus = بحال خارج من (من المغرب).' },
      { de: 'Ich wohne in…', ipa: '/ɪç ˈvoːnə ɪn/', phoneticAr: 'إِشْ ڤُونَه إِنْ', dz: 'كنسكن فـ…', mnemonic: 'wohne بحال «الوطن» — البلاصة فين ساكن.' },
      { de: 'die Ausbildung', ipa: '/diː ˈaʊsˌbɪldʊŋ/', phoneticAr: 'دِي أَوْسْبِيلْدُونْگ', dz: 'التكوين المهني', mnemonic: 'Ausbildung = التكوين المهني لي كيمشيو عليه المغاربة لألمانيا.' },
      { de: 'Auf Wiedersehen', ipa: '/aʊf ˈviːdɐˌzeːən/', phoneticAr: 'أَوْفْ ڤِيدَرْزِينْ', dz: 'بالسلامة (رسمية)', mnemonic: 'wieder = عاوتاني، sehen = نشوفك. يعني حتى نتلاقاو عاوتاني!' },
      { de: 'Tschüss', ipa: '/tʃʏs/', phoneticAr: 'تْشُوسْ', dz: 'باي باي (غير رسمية)', mnemonic: 'Tschüss = بحال «تشاو» بين الصحاب.' },
    ],
    dialogue: [
      { speaker: 'Frau Schmidt', de: 'Guten Tag! Wie heißen Sie?', dz: 'نهار مبروك! شنو سمية حضرتك؟' },
      { speaker: 'Yassine', de: 'Guten Tag! Ich heiße Yassine. Ich komme aus Marokko.', dz: 'نهار مبروك! سميتي ياسين، وأنا جاي من المغرب.' },
      { speaker: 'Frau Schmidt', de: 'Freut mich, Yassine! Wo wohnen Sie jetzt?', dz: 'متشرفين يا ياسين! فين ساكن دابا؟' },
      { speaker: 'Yassine', de: 'Ich wohne in Frankfurt. Ich lerne Deutsch für die Ausbildung.', dz: 'كنسكن ف فرانكفورت، وكنتعلم الألمانية على قبل التكوين المهني.' },
      { speaker: 'Frau Schmidt', de: 'Sehr gut! Viel Erfolg und auf Wiedersehen!', dz: 'ممتاز بزاف! بالتوفيق وبالسلامة!' },
      { speaker: 'Yassine', de: 'Vielen Dank! Auf Wiedersehen!', dz: 'شكراً بزاف! بالسلامة!' },
    ],
    grammar: [
      {
        title: 'القاعدة الذهبية: الفعل ديما ف البلاصة الثانية (Position 2)',
        ruleDz: 'ف الجملة الخبرية العادية ف الألمانية، الفعل كيجي ديما هو الكلمة الثانية، وخا تبدا ب أنا (Ich) ولا ب البارح ولا ب ف المغرب.',
        examples: [
          { de: 'Ich lerne Deutsch.', dz: 'أنا كنتعلم الألمانية. (lerne هو رقم 2)', highlight: 'lerne' },
          { de: 'Jetzt lerne ich Deutsch.', dz: 'دابا كنتعلم الألمانية. (lerne بقى هو رقم 2!)', highlight: 'lerne' },
        ],
      },
      {
        title: 'تصريف الأفعال مع الضمائر (Konjugation)',
        ruleDz: 'كنحيدو الـ -en من الفعل وكنزيدو النهايات: Ich (-e)، du (-st)، er/sie (-t)، wir/Sie (-en).',
        examples: [
          { de: 'Ich komm-e aus Rabat.', dz: 'أنا جاي من الرباط.' },
          { de: 'Du wohn-st in Berlin.', dz: 'نتا ساكن ف برلين.' },
        ],
        tables: {
          headers: ['الضمير', 'الفعل: kommen (جاء)', 'الفعل: wohnen (سكن)', 'الفعل: sein (يكون)'],
          rows: [
            ['Ich (أنا)', 'komme', 'wohne', 'bin'],
            ['Du (نتا/نتي)', 'kommst', 'wohnst', 'bist'],
            ['Er / Sie (هو / هي)', 'kommt', 'wohnt', 'ist'],
            ['Wir (حنا)', 'kommen', 'wohnen', 'sind'],
            ['Sie (حضرتك)', 'kommen', 'wohnen', 'sind'],
          ],
        },
      },
    ],
    sentenceExercises: [
      {
        targetDe: 'Ich heiße Yassine und komme aus Marokko',
        promptDz: 'ركب الجملة: سميتي ياسين وجاي من المغرب',
        chips: ['Ich', 'heiße', 'Yassine', 'und', 'komme', 'aus', 'Marokko'],
        explanation: 'الفعل heiße ف البلاصة 2، و und كتربط بين الجملتين.',
      },
      {
        targetDe: 'Ich lerne Deutsch für die Ausbildung',
        promptDz: 'ركب الجملة: كنتعلم الألمانية على قبل التكوين المهني',
        chips: ['Ich', 'lerne', 'Deutsch', 'für', 'die', 'Ausbildung'],
        explanation: 'الفعل lerne ف البلاصة 2، و für كتطلب الأكوزاتيف (die Ausbildung).',
      },
      {
        targetDe: 'Wo wohnen Sie in Deutschland',
        promptDz: 'ركب السؤال: فين ساكن حضرتك ف ألمانيا؟',
        chips: ['Wo', 'wohnen', 'Sie', 'in', 'Deutschland'],
        explanation: 'ف السؤال بـ W-Frage، كلمة السؤال (Wo) هي 1 والفعل (wohnen) هو 2.',
      },
    ],
    listeningExercises: [
      {
        audioText: 'Guten Tag, mein Name ist Karim und ich komme aus Casablanca.',
        questionDz: 'شنو قال المتكلم على راسو؟',
        optionsDz: ['سميتو كريم وجاي من الدار البيضاء', 'سميتو كريم وساكن ف فرانكفورت', 'كيقلب على تكوين مهني'],
        correctIdx: 0,
        explanation: 'قال "mein Name ist Karim" و "komme aus Casablanca".',
      },
      {
        audioText: 'Ich wohne in Berlin und ich lerne Deutsch.',
        questionDz: 'فين ساكن هاد الشخص وشنو كيدير؟',
        optionsDz: ['ساكن ف برلين وكيخدم', 'ساكن ف ميونيخ وكيقرا', 'ساكن ف برلين وكيتعلم الألمانية'],
        correctIdx: 2,
        explanation: 'wohne in Berlin = ساكن ف برلين، lerne Deutsch = كيتعلم الألمانية.',
      },
    ],
  },

  // ============================================================
  // UNIT 2: Essen & Trinken (الماكلة والمطعم والسوبرماركت)
  // ============================================================
  {
    id: 'a1_02',
    number: 2,
    titleDe: 'Essen & Trinken',
    titleDz: 'الماكلة والطلب فالمطعم',
    descDz: 'كيفاش تطلب ماكلة وقهوة، تسول على الثمن، وتفهم المينيو والحساب.',
    badge: 'A1.1 · GASTRONOMIE',
    culturalTip: {
      title: 'قضية الـ Pfand (الكونصين ديال القرعات)',
      textDz: 'ف ألمانيا أي قرعة د الما ولا المونادا كتشريها كيكون زايد عليها 0.25€ ديال الـ Pfand. كترجع القرعة لماكينة السوبرماركت وكيردو ليك فلوسك!',
    },
    words: [
      { de: 'Ich möchte bitte…', ipa: '/ɪç ˈmœçtə ˈbɪtə/', phoneticAr: 'إِشْ مُوشْتَه بِيتَه', dz: 'بغيت عفاك… (طلب بأدب)', mnemonic: 'möchte = العبارة السحرية للطلب ف ألمانيا!' },
      { de: 'der Kaffee', ipa: '/deːɐ̯ ˈkafe/', phoneticAr: 'دِيرْ كَافِي', dz: 'القهوة', article: 'der', mnemonic: 'der Kaffee مذكر ف الألمانية.' },
      { de: 'das Wasser', ipa: '/das ˈvasɐ/', phoneticAr: 'دَاسْ ڤَاسَرْ', dz: 'الماء', article: 'das', mnemonic: 'das Wasser محايد. w كاتنطق ڤ.' },
      { de: 'das Brot', ipa: '/das bʁoːt/', phoneticAr: 'دَاسْ بُرُوتْ', dz: 'الخبز', article: 'das', mnemonic: 'das Brot بحال pain بالألمانية.' },
      { de: 'die Rechnung', ipa: '/diː ˈʁɛçnʊŋ/', phoneticAr: 'دِي رِيشْنُونْگ', dz: 'الحساب / لاضيسيون', article: 'die', mnemonic: 'rechnen = حسب، die Rechnung = الحساب.' },
      { de: 'Wie viel kostet das?', ipa: '/viː fiːl ˈkɔstət das/', phoneticAr: 'ڤِي فِيل كُوسْتَتْ دَاسْ', dz: 'شحال كيسوى هادا؟', mnemonic: 'Wie viel = شحال، kostet = كيسوى.' },
      { de: 'Zusammen oder getrennt?', ipa: '/tsuˈzamən oːdɐ ɡəˈtʁɛnt/', phoneticAr: 'تْسُوزَامْنْ أُودَرْ گَتْرِنْتْ', dz: 'مجموعين ولا كل واحد بوحدو؟', mnemonic: 'أشهر سؤال ف المطاعم الألمانية ملي كتبغي تخلص!' },
    ],
    dialogue: [
      { speaker: 'Kellner', de: 'Hallo! Was möchten Sie bestellen?', dz: 'سلام! شنو بغيتي تطلب؟' },
      { speaker: 'Amine', de: 'Ich möchte bitte einen Döner und ein Wasser.', dz: 'بغيت عفاك واحد الدونر وواحد القريعة د الما.' },
      { speaker: 'Kellner', de: 'Sehr gern! Mit Schafskäse und scharf?', dz: 'بكل سرور! مع الجبن الحار؟' },
      { speaker: 'Amine', de: 'Ja bitte, mit Sauce aber nicht zu scharf.', dz: 'ياه عفاك، بالصوص ولكن ماشي حار بزاف.' },
      { speaker: 'Kellner', de: 'Kommt sofort! Das macht zusammen 8 Euro.', dz: 'واخا دابا يوجد! هادشي كيعمل مجموع 8 أورو.' },
      { speaker: 'Amine', de: 'Hier bitte, 10 Euro. Stimmt so!', dz: 'هاك عفاك 10 أورو، خلي الصرف عندك (Pourboire)!' },
    ],
    grammar: [
      {
        title: 'الأكوزاتيف ف الماكلة والشراب (Der كترجع Den / Einen)',
        ruleDz: 'ملي كتطلب شي حاجة بـ Ich möchte...، المذكر (der) كيتبدل كيرجع den ولا einen. المؤنث والمحايد ما كيتبدلوش!',
        examples: [
          { de: 'der Kaffee ➔ Ich möchte einen Kaffee.', dz: 'القهوة (مذكر) كترجع einen Kaffee!', highlight: 'einen' },
          { de: 'das Wasser ➔ Ich möchte ein Wasser.', dz: 'الما (محايد) كيبقى ein Wasser.', highlight: 'ein' },
          { de: 'die Pizza ➔ Ich möchte eine Pizza.', dz: 'البيتزا (مؤنث) كتبقى eine Pizza.', highlight: 'eine' },
        ],
      },
    ],
    sentenceExercises: [
      {
        targetDe: 'Ich möchte bitte einen Kaffee und ein Wasser',
        promptDz: 'ركب الجملة: بغيت عفاك قهوة وما',
        chips: ['Ich', 'möchte', 'bitte', 'einen', 'Kaffee', 'und', 'ein', 'Wasser'],
        explanation: 'Kaffee مذكر ف الأكوزاتيف كياخد einen، و Wasser محايد كياخد ein.',
      },
      {
        targetDe: 'Wie viel kostet das Brot bitte',
        promptDz: 'ركب السؤال: شحال كيسوى الخبز عفاك؟',
        chips: ['Wie', 'viel', 'kostet', 'das', 'Brot', 'bitte'],
        explanation: 'Wie viel كتعني شحال، والفعل kostet ف المرتبة الثانية.',
      },
    ],
    listeningExercises: [
      {
        audioText: 'Das macht zusammen sieben Euro und fünfzig Cent.',
        questionDz: 'شحال المجموع ديال الحساب؟',
        optionsDz: ['7.50 Euro', '5.70 Euro', '8.00 Euro'],
        correctIdx: 0,
        explanation: 'sieben Euro und fünfzig Cent = 7.50 أورو.',
      },
    ],
  },

  // ============================================================
  // UNIT 3: Unterwegs & Bahnhof (السفر والمواصلات والقطار)
  // ============================================================
  {
    id: 'a1_03',
    number: 3,
    titleDe: 'Unterwegs & Bahnhof',
    titleDz: 'السفر والمواصلات ومحطة القطار',
    descDz: 'كيفاش تشري تذكرة ف الـ DB، تسول على الرصيف، وتفهم مواعيد القطار والمطار.',
    badge: 'A1.1 · MOBILITÄT',
    culturalTip: {
      title: 'القطارات ف ألمانيا (Deutsche Bahn)',
      textDz: 'ف محطة القطار ف ألمانيا، كلمة «Gleis» كتعني الرصيف (بحال Quai). رد البال لـ Gleiswechsel (تبدال الرصيف) لي كيوقع ديما!',
    },
    words: [
      { de: 'der Bahnhof', ipa: '/deːɐ̯ ˈbaːnˌhoːf/', phoneticAr: 'دِيرْ بَانْهُوفْ', dz: 'محطة القطار', article: 'der', mnemonic: 'Bahn = سكة الحديد، Hof = الباحة. المحطة الرئيسية هي Hauptbahnhof (Hbf).' },
      { de: 'der Zug', ipa: '/deːɐ̯ tsuːk/', phoneticAr: 'دِيرْ تْسُوكْ', dz: 'القطار / التران', article: 'der', mnemonic: 'z كاتنطق ts. Zug = التران.' },
      { de: 'das Gleis', ipa: '/das ɡlaɪs/', phoneticAr: 'دَاسْ گْلَايْسْ', dz: 'الرصيف (Quai)', article: 'das', mnemonic: 'Gleis 4 = الرصيف رقم 4.' },
      { de: 'die Fahrkarte', ipa: '/diː ˈfaːɐ̯ˌkaʁtə/', phoneticAr: 'دِي فَارْكَارْتَه', dz: 'تذكرة السفر (التيكي)', article: 'die', mnemonic: 'fahren = سافر، Karte = بطاقة / تيكي.' },
      { de: 'Einfach oder hin und zurück?', ipa: '/ˈaɪnfax oːdɐ hɪn ʊnt tsuˈʁʏk/', phoneticAr: 'أَيْنْفَاخْ أُودَرْ هِينْ أُونْتْ تْسُورُوكْ', dz: 'غير مشية ولا مشية وجية (Aller-retour)؟', mnemonic: 'einfach = مشية فقط، hin und zurück = مشية ورجوع.' },
      { de: 'Entschuldigung, wo ist…?', ipa: '/ɛntˈʃʊldɪɡʊŋ voː ɪst/', phoneticAr: 'إِنْتْشُولْدِيگُونْگ، ڤُو إِسْتْ', dz: 'سمح ليا، فين كاين…؟', mnemonic: 'أدب طلب الإرشاد ف الشارع.' },
    ],
    dialogue: [
      { speaker: 'Reisender', de: 'Guten Tag! Eine Fahrkarte nach Frankfurt bitte.', dz: 'نهار مبروك! تذكرة ل فرانكفورت عفاك.' },
      { speaker: 'DB Beamter', de: 'Einfach oder hin und zurück?', dz: 'مشية بوحدها ولا مشية وجية؟' },
      { speaker: 'Reisender', de: 'Nur einfach bitte. Wann fährt der nächste Zug ab?', dz: 'غير مشية عفاك. فوقاش كيتحرك التران الجاي؟' },
      { speaker: 'DB Beamter', de: 'Der Zug fährt um 14:15 Uhr von Gleis 7 ab.', dz: 'التران كيقلع مع الجوج وقسمين من الرصيف رقم 7.' },
      { speaker: 'Reisender', de: 'Vielen Dank für die Information!', dz: 'شكراً بزاف على المعلومة!' },
    ],
    grammar: [
      {
        title: 'الأفعال المنفصلة (Trennbare Verben: abfahren)',
        ruleDz: 'كاينين أفعال ف الألمانية كيتقسمو لجوج: الفعل الرئيسي كيمشي للمرتبة 2 والسابقة (Prefix) كتمشي لآخر الجملة!',
        examples: [
          { de: 'abfahren ➔ Der Zug fährt um 10 Uhr ab.', dz: 'التران كيتحرك مع العشرة. (ab مشات للخر!)', highlight: 'fährt ... ab' },
          { de: 'einsteigen ➔ Bitte steigen Sie ein.', dz: 'عفاكم ركبو فالتران. (ein مشات للخر!)', highlight: 'steigen ... ein' },
        ],
      },
    ],
    sentenceExercises: [
      {
        targetDe: 'Der Zug nach Frankfurt fährt von Gleis vier ab',
        promptDz: 'ركب الجملة: التران ل فرانكفورت كيتحرك من الرصيف 4',
        chips: ['Der', 'Zug', 'nach', 'Frankfurt', 'fährt', 'von', 'Gleis', 'vier', 'ab'],
        explanation: 'fährt كيكون ف البلاصة 2 و ab كتجي ف آخر الجملة (فعل منفصل).',
      },
    ],
    listeningExercises: [
      {
        audioText: 'Achtung an Gleis drei: Der ICE nach München fährt jetzt ein.',
        questionDz: 'أينا رصيف وأينا وجهة علن عليها مكبر الصوت؟',
        optionsDz: ['الرصيف 3 متوجه ل ميونيخ', 'الرصيف 4 متوجه ل فرانكفورت', 'الرصيف 2 متوجه ل برلين'],
        correctIdx: 0,
        explanation: 'Gleis drei = الرصيف 3، nach München = ل ميونيخ.',
      },
    ],
  },

  // ============================================================
  // UNIT 4: Bürgeramt & Termine (المواعيد والتسجيل والإدارة)
  // ============================================================
  {
    id: 'a1_04',
    number: 4,
    titleDe: 'Bürgeramt & Termine',
    titleDz: 'المواعيد والتسجيل فالبلدية والسفارة',
    descDz: 'كيفاش تشد رونديفو، تسجل السكنة ديالك (Anmeldung)، وتهدر مع الإدارة.',
    badge: 'A1.2 · BEHÖRDE',
    culturalTip: {
      title: 'الـ Anmeldung (شهادة السكنى الألمانية)',
      textDz: 'أول حاجة كيديرها أي واحد كيوصل لألمانيا هي التسجيل ف الـ Bürgeramt خلال 14 يوم باش ياخد الـ Meldebestätigung والـ Steuer-ID للخدمة.',
    },
    words: [
      { de: 'der Termin', ipa: '/deːɐ̯ tɛʁˈmiːn/', phoneticAr: 'دِيرْ تِرْمِينْ', dz: 'الموعد (Rendez-vous)', article: 'der', mnemonic: 'Termin = رونديفو. بلا موعد ما كتقضي والو ف ألمانيا!' },
      { de: 'die Anmeldung', ipa: '/diː ˈanˌmɛldʊŋ/', phoneticAr: 'دِي أَنْمِلْدُونْگ', dz: 'تسجيل السكن / العنوان', article: 'die', mnemonic: 'melden = صرح، Anmeldung = التصريح بالسكنى.' },
      { de: 'der Reisepass', ipa: '/deːɐ̯ ˈʁaɪzəˌpas/', phoneticAr: 'دِيرْ رَايْزَبَاسْ', dz: 'جواز السفر (الباسبور)', article: 'der', mnemonic: 'Reise = سفر، Pass = باسبور.' },
      { de: 'Ich habe einen Termin um…', ipa: '/ɪç ˈhaːbə ˈaɪnən tɛʁˈmiːn ʊm/', phoneticAr: 'إِشْ هَابَه أَيْنَنْ تِرْمِينْ أُومْ', dz: 'عندي موعد مع الساعة…', mnemonic: 'um كتستعمل ديما مع الساعة الدقيقة (um 10 Uhr).' },
      { de: 'der Montag', ipa: '/deːɐ̯ ˈmoːntaːk/', phoneticAr: 'دِيرْ مُونْتَاكْ', dz: 'نهار الإثنين', article: 'der', mnemonic: 'أيام الأسبوع كلها مذكر ف الألمانية (der).' },
    ],
    dialogue: [
      { speaker: 'Sachbearbeiter', de: 'Guten Tag! Wie kann ich Ihnen helfen?', dz: 'نهار مبروك! كيفاش نقدر نعاون حضرتك؟' },
      { speaker: 'Meryem', de: 'Guten Tag. Ich habe einen Termin für die Anmeldung.', dz: 'نهار مبروك. عندي موعد على قبل تسجيل السكن.' },
      { speaker: 'Sachbearbeiter', de: 'Haben Sie Ihren Reisepass und die Wohnungsgeberbestätigung dabei?', dz: 'واش معاك الباسبور والورقة ديال مول الدار؟' },
      { speaker: 'Meryem', de: 'Ja, hier sind alle Dokumente.', dz: 'ياه، هاهما كاع الوثائق واجدين.' },
      { speaker: 'Sachbearbeiter', de: 'Perfekt. Bitte unterschreiben Sie hier.', dz: 'ممتاز. عفاك سيني هنايا.' },
    ],
    grammar: [
      {
        title: 'حروف الجر مع الوقت: um (للساعة) و am (للأيام)',
        ruleDz: 'مع السوايع كنستعملو «um» (مثلا: um 9 Uhr). ومع أيام الأسبوع والصباح/العشية كنستعملو «am» (مثلا: am Montag).',
        examples: [
          { de: 'Der Termin ist um 11 Uhr.', dz: 'الموعد كاين مع الـ 11 نيشان.', highlight: 'um' },
          { de: 'Ich komme am Dienstag.', dz: 'أنا جاي نهار الثلاثاء.', highlight: 'am' },
        ],
      },
    ],
    sentenceExercises: [
      {
        targetDe: 'Ich habe einen Termin am Montag um zehn Uhr',
        promptDz: 'ركب الجملة: عندي موعد نهار الاثنين مع العشرة',
        chips: ['Ich', 'habe', 'einen', 'Termin', 'am', 'Montag', 'um', 'zehn', 'Uhr'],
        explanation: 'am مع الاثنين و um مع العشرة.',
      },
    ],
    listeningExercises: [
      {
        audioText: 'Ihr Termin im Bürgeramt ist am Mittwoch um neun Uhr dreißig.',
        questionDz: 'فوقاش الموعد ف البلدية؟',
        optionsDz: ['الأربعاء مع 9:30', 'الخميس مع 10:00', 'الثلاثاء مع 9:30'],
        correctIdx: 0,
        explanation: 'Mittwoch = الأربعاء، neun Uhr dreißig = 9:30.',
      },
    ],
  },

  // ============================================================
  // UNIT 5: Ausbildung & Arbeit (التكوين المهني ومقابلة العمل)
  // ============================================================
  {
    id: 'a1_05',
    number: 5,
    titleDe: 'Ausbildung & Arbeit',
    titleDz: 'التكوين المهني ومقابلة العمل والفيزا',
    descDz: 'كيفاش تهدر على مهنتك، تجربتك، وتجاوب ف مقابلة الـ Vorstellungsgespräch.',
    badge: 'A1.2 · BERUF & KARRIERE',
    culturalTip: {
      title: 'المقابلة ف ألمانيا (Vorstellungsgespräch)',
      textDz: 'الألمان كيقيمو بزاف الصدق، الالتزام بالوقت (Pünktlichkeit)، والحماس للتعلم ف التكوين المهني (Motivation).',
    },
    words: [
      { de: 'der Beruf', ipa: '/deːɐ̯ bəˈʁuːf/', phoneticAr: 'دِيرْ بَرُوفْ', dz: 'المهنة / الحرفة', article: 'der', mnemonic: 'Beruf = الخدمة لي كتحترفها.' },
      { de: 'das Vorstellungsgespräch', ipa: '/das ˈfoːɐ̯ˌʃtɛlʊŋsɡəˌʃpʁɛːç/', phoneticAr: 'دَاسْ فُورْشْتِلُونْگْسْ گَشْبْرِيشْ', dz: 'مقابلة العمل (Entretien)', article: 'das', mnemonic: 'vorstellen = قدم نفسك، Gespräch = حوار.' },
      { de: 'die Erfahrung', ipa: '/diː ɛɐ̯ˈfaːʁʊŋ/', phoneticAr: 'دِي إِرْفَارُونْگ', dz: 'التجربة والخبرة', article: 'die', mnemonic: 'Erfahrung = التجربة المهنية ف CV.' },
      { de: 'Ich bin pünktlich und motiviert', ipa: '/ɪç bɪn ˈpʏŋktlɪç ʊnt motiˈviːɐ̯t/', phoneticAr: 'إِشْ بِنْ بِيونكْتْلِيشْ أُونْتْ مُوتِيڤِيرْتْ', dz: 'أنا منضبط فالوقت ومتحمس', mnemonic: 'أهم جملة ذهبية ف مقابلات العمل ف ألمانيا!' },
      { de: 'der Vertrag', ipa: '/deːɐ̯ fɛɐ̯ˈtʁaːk/', phoneticAr: 'دِيرْ فِيرْتْرَاكْ', dz: 'العقد (الكونطرا ديال التكوين)', article: 'der', mnemonic: 'Ausbildungsvertrag = كونطرا التكوين المهني لدفع الفيزا!' },
    ],
    dialogue: [
      { speaker: 'Chef', de: 'Guten Tag! Warum möchten Sie diese Ausbildung machen?', dz: 'نهار مبروك! علاش بغيتي دير هاد التكوين المهني بالذات؟' },
      { speaker: 'Hamza', de: 'Ich interessiere mich sehr für diesen Beruf. Ich lerne schnell und bin sehr motiviert.', dz: 'كنهتم بزاف بهاد المهنة. كنتعلم دغيا وعندي حماس كبير.' },
      { speaker: 'Chef', de: 'Haben Sie schon Erfahrung in Marokko gesammelt?', dz: 'واش ديجا جمعتي تجربة ف المغرب؟' },
      { speaker: 'Hamza', de: 'Ja, ich habe zwei Jahre als Praktikant gearbeitet.', dz: 'ياه، خدمت عامين كمتدرب.' },
      { speaker: 'Chef', de: 'Das klingt wunderbar. Willkommen im Team!', dz: 'هادشي ممتاز بزاف. مرحباً بيك ف الفريق!' },
    ],
    grammar: [
      {
        title: 'أفعال المودال: können (الاستطاعة) و möchten (الرغبة)',
        ruleDz: 'ملي كتستعمل فعل مساعد بحال können ولا möchten، الفعل الثاني كيمشي حتى لأخير الجملة ف المصدر (Infinitiv)!',
        examples: [
          { de: 'Ich kann gut Deutsch sprechen.', dz: 'كنقدر نهدر بالألمانية مزيان. (sprechen مشات للخر كاع ف الأصل ديالها)', highlight: 'kann ... sprechen' },
          { de: 'Ich möchte eine Ausbildung machen.', dz: 'بغيت ندير تكوين مهني. (machen مشات للخر ف الأصل ديالها)', highlight: 'möchte ... machen' },
        ],
      },
    ],
    sentenceExercises: [
      {
        targetDe: 'Ich möchte eine Ausbildung in Deutschland machen',
        promptDz: 'ركب الجملة: بغيت ندير تكوين مهني ف ألمانيا',
        chips: ['Ich', 'möchte', 'eine', 'Ausbildung', 'in', 'Deutschland', 'machen'],
        explanation: 'möchte ف المرتبة 2 و الفعل machen جا ف آخر الجملة ف المصدر.',
      },
      {
        targetDe: 'Ich bin sehr motiviert und pünktlich',
        promptDz: 'ركب الجملة: أنا متحمس بزاف ومنضبط ف الوقت',
        chips: ['Ich', 'bin', 'sehr', 'motiviert', 'und', 'pünktlich'],
        explanation: 'جملة أساسية للمقابلات المهنية مع فعل sein (bin).',
      },
    ],
    listeningExercises: [
      {
        audioText: 'Wir freuen uns auf Ihre Bewerbung für die Ausbildung.',
        questionDz: 'شنو قال مسؤول الشركة للمترشح؟',
        optionsDz: ['كنفرحو بالطلب ديالك للتكوين المهني', 'ما قبلوش الطلب ديالك', 'كيطلبو منو يرجع للمغرب'],
        correctIdx: 0,
        explanation: 'Wir freuen uns auf Ihre Bewerbung = كنتسناو وكنفرحو بالطلب ديالك.',
      },
    ],
  },
];
