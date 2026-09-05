import { useState, useEffect } from 'react';
import { audio } from '../game/audio';
import { narrator } from '../game/narrator';
import LiveLessonTutor from './LiveLessonTutor';
import type { A1Unit } from '../game/a1Curriculum';

/* ============================================================
   LADA — GOETHE A1 UNIT VIEW
   Multi-modal learning environment:
   1. المفردات (Wortschatz)
   2. المحادثة (Dialog)
   3. القواعد (Grammatik)
   4. تركيب الجمل (Satzbau)
   5. الفهم الشفهي (Hörverstehen)
   ============================================================ */

interface Props {
  unit: A1Unit;
  onExit: () => void;
  onStartRoleplay: (scenarioId: string) => void;
}

type Tab = 'words' | 'dialog' | 'grammar' | 'sentence' | 'listening';

export default function A1UnitView({ unit, onExit, onStartRoleplay }: Props) {
  const [tab, setTab] = useState<Tab>('words');

  // Sentence Builder State
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [sentenceResult, setSentenceResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Listening State
  const [listeningIdx, setListeningIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [listeningResult, setListeningResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentExercise = unit.sentenceExercises[exerciseIdx];
  const currentListening = unit.listeningExercises[listeningIdx];

  // Initialize chips for sentence builder
  useEffect(() => {
    if (currentExercise) {
      const shuffled = [...currentExercise.chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
      setSelectedChips([]);
      setSentenceResult('idle');
    }
  }, [exerciseIdx, unit]);

  // Reset listening exercise
  useEffect(() => {
    setSelectedOption(null);
    setListeningResult('idle');
  }, [listeningIdx, unit]);

  // Voice welcome on tab entry
  useEffect(() => {
    if (tab === 'words') {
      narrator.narrate({
        text: `مرحبا بيك ف الوحدة رقم ${unit.number}: ${unit.titleDz}. هنا غادي تضبط الكلمات الأساسية والنطق ديالهم.`,
        subtitle: `الوحدة ${unit.number}: ${unit.titleDz} (${unit.titleDe})`,
        germanCue: unit.titleDe,
      });
    } else if (tab === 'sentence') {
      narrator.narrate({
        text: 'دابا تركيب الجمل! رتب الكلمات باش تكون جملة ألمانية صحيحة. ركّز ف بلاصة الفعل!',
        subtitle: 'تركيب الجمل: رتب الكلمات باش تكون جملة صحيحة!',
      });
    } else if (tab === 'listening') {
      narrator.narrate({
        text: 'دابا الفهم الشفهي! سمع التسجيل بالألمانية وجاوب على السؤال بالدارجة.',
        subtitle: 'الفهم الشفهي: سمع التسجيل وجاوب على السؤال!',
      });
    }
  }, [tab, unit]);

  const addChip = (chip: string, index: number) => {
    if (sentenceResult === 'correct') return;
    audio.uiClick();
    setSelectedChips((prev) => [...prev, chip]);
    setAvailableChips((prev) => prev.filter((_, i) => i !== index));
    setSentenceResult('idle');
  };

  const removeChip = (chip: string, index: number) => {
    if (sentenceResult === 'correct') return;
    audio.uiClick();
    setSelectedChips((prev) => prev.filter((_, i) => i !== index));
    setAvailableChips((prev) => [...prev, chip]);
    setSentenceResult('idle');
  };

  const checkSentence = () => {
    if (!currentExercise) return;
    const userSentence = selectedChips.join(' ');
    const isCorrect = userSentence.trim().toLowerCase() === currentExercise.targetDe.trim().toLowerCase();

    if (isCorrect) {
      setSentenceResult('correct');
      audio.grade(100);
      narrator.narrate({
        text: `برافو عليك! الجملة صحيحة 100%: ${currentExercise.targetDe}`,
        subtitle: `صحيح: ${currentExercise.targetDe}`,
        germanCue: currentExercise.targetDe,
      }, true);
    } else {
      setSentenceResult('wrong');
      audio.miss();
      narrator.narrate({
        text: 'لا، عاود حاول! ركّز ف الترتيب ديال الكلمات وفعل الجملة.',
        subtitle: 'عاود حاول! ركّز ف ترتيب الفعل.',
      }, true);
    }
  };

  const checkListening = (optionIdx: number) => {
    if (!currentListening) return;
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === currentListening.correctIdx;

    if (isCorrect) {
      setListeningResult('correct');
      audio.grade(100);
      narrator.narrate({
        text: 'جواب ممتاز وصحيح! فهمتي التسجيل مزيان.',
        subtitle: 'جواب صحيح! فهمتي التسجيل 100%',
      }, true);
    } else {
      setListeningResult('wrong');
      audio.miss();
      narrator.narrate({
        text: 'جواب غير صحيح. عاود سمع التسجيل مزيان وركز ف الكلمات.',
        subtitle: 'عاود سمع التسجيل وركّز مزيان.',
      }, true);
    }
  };

  return (
    <div className="relative h-full w-full bg-void overflow-hidden flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      {/* Top Header */}
      <header className="relative z-10 border-b border-line/60 bg-panel/80 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { audio.uiClick(); onExit(); }}
            aria-label="الرجوع للـ Hub"
            className="neon-btn chamfer-sm px-3 py-1.5 text-xs text-cyan border border-cyan/40 hover:border-cyan"
          >
            ◀ لوحة التحكم
          </button>
          <div>
            <div className="text-[11px] font-mono text-cyan tracking-wider flex items-center gap-1.5">
              <span>{unit.badge}</span>
              <span>·</span>
              <span>EINHEIT {unit.number}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-ar font-bold text-ink flex items-center gap-2">
              <span>{unit.titleDz}</span>
              <span className="text-sm md:text-base font-display text-cyan font-normal">({unit.titleDe})</span>
            </h1>
          </div>
        </div>

        {/* Action Button: Launch AI Roleplay */}
        <button
          onClick={() => {
            audio.uiOpen();
            const scenarioMap: Record<string, string> = {
              a1_01: 'freetalk',
              a1_02: 'restaurant',
              a1_03: 'bahn',
              a1_04: 'buergeramt',
              a1_05: 'ausbildung',
            };
            onStartRoleplay(scenarioMap[unit.id] ?? 'freetalk');
          }}
          className="neon-btn neon-btn-mag chamfer px-4 py-1.5 text-xs font-ar font-bold flex items-center gap-2 pulse-mag"
        >
          <span>🎙️</span>
          <span>محاكاة محادثة ذكية (AI Roleplay)</span>
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 flex border-b border-line/60 bg-void/90 overflow-x-auto px-4 gap-1">
        {[
          { id: 'words', label: 'المفردات', de: 'Wortschatz', icon: '📖' },
          { id: 'dialog', label: 'المحادثة', de: 'Dialog', icon: '💬' },
          { id: 'grammar', label: 'القواعد بالدارجة', de: 'Grammatik', icon: '⚖️' },
          { id: 'sentence', label: 'تركيب الجمل', de: 'Satzbau', icon: '🧩' },
          { id: 'listening', label: 'الفهم الشفهي', de: 'Hörverstehen', icon: '🎧' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { audio.uiClick(); setTab(t.id as Tab); }}
            className={`px-3.5 py-2.5 text-xs font-ar flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              tab === t.id
                ? 'border-cyan text-cyan font-bold bg-cyan/10'
                : 'border-transparent text-dim hover:text-ink hover:border-line'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span className="font-display text-[10px] text-dim/80">({t.de})</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto p-4 md:p-6 max-w-5xl mx-auto w-full">
        {/* Live Autonomous Personal AI Tutor (speaks on entry) */}
        <LiveLessonTutor unit={unit} activeTab={tab} />

        {/* Cultural Tip Pill */}
        <div className="chamfer-sm border border-amber/30 bg-amber/5 px-4 py-2.5 mb-5 flex items-start gap-3" dir="rtl">
          <span className="text-lg">💡</span>
          <div className="font-ar text-xs md:text-sm text-ink/90 leading-relaxed text-right">
            <span className="text-amber font-bold ml-1.5 inline-block">نصيحة ثقافية ف ألمانيا ({unit.culturalTip.title}):</span>
            <span>{unit.culturalTip.textDz}</span>
          </div>
        </div>

        {/* TAB 1: WORDS */}
        {tab === 'words' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
            {unit.words.map((w, idx) => (
              <div key={idx} className="panel chamfer p-4 md:p-5 flex flex-col justify-between border-line/60 hover:border-cyan/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between border-b border-line/40 pb-2.5 mb-3" dir="ltr">
                    <div className="flex items-baseline gap-2">
                      {w.article && (
                        <span className={`font-mono text-xs px-1.5 py-0.5 rounded font-bold ${
                          w.article === 'der' ? 'text-cyan bg-cyan/10 border border-cyan/30' :
                          w.article === 'die' ? 'text-mag bg-mag/10 border border-mag/30' :
                          'text-lime bg-lime/10 border border-lime/30'
                        }`}>
                          {w.article}
                        </span>
                      )}
                      <span className="font-display text-2xl md:text-3xl font-bold text-ink text-glow-cyan">{w.de}</span>
                      <span className="text-dim/80 font-mono text-xs px-2 py-0.5 rounded bg-panel2 border border-line/40">{w.ipa}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3" dir="rtl">
                    <div className="font-ar text-xl font-bold text-cyan text-glow-cyan">{w.dz}</div>
                    <div className="bg-lime/10 border border-lime/30 px-2.5 py-0.5 chamfer-sm">
                      <span className="text-[11px] text-dim font-ar ml-1">النطق:</span>
                      <span className="font-ar text-sm font-bold text-lime">{w.phoneticAr}</span>
                    </div>
                  </div>

                  <div className="chamfer-sm bg-mag/10 border border-mag/30 px-3 py-2 font-ar text-xs md:text-sm text-ink leading-relaxed mb-2 text-right" dir="rtl">
                    <span className="text-mag font-bold ml-1.5">العقلة:</span>
                    <span>{w.mnemonic}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-line/40 flex items-center justify-end gap-2" dir="ltr">
                  <button
                    onClick={() => { audio.ensure(); void audio.speakLive(w.de); }}
                    className="neon-btn chamfer-sm px-2.5 py-1 text-xs font-ar flex items-center gap-1 hover:text-amber"
                  >
                    <span>🐢</span>
                    <span>بشوية (0.7x)</span>
                  </button>
                  <button
                    onClick={() => { audio.ensure(); void audio.speakLive(w.de); }}
                    className="neon-btn neon-btn-cyan chamfer-sm px-3 py-1 text-xs font-ar flex items-center gap-1 font-bold"
                  >
                    <span>🔊</span>
                    <span>نطق عادي</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: DIALOGUE */}
        {tab === 'dialog' && (
          <div className="max-w-3xl mx-auto space-y-4 pb-16">
            <div className="panel chamfer p-4 bg-cyan/5 border-cyan/30 flex items-center justify-between gap-3" dir="rtl">
              <div className="font-ar text-sm text-ink">
                💬 <span className="font-bold text-cyan">حوار واقعي:</span> اسمع الحوار سطر بسطر باش تولف على ريتم المحادثة ف ألمانيا.
              </div>
              <button
                onClick={() => {
                  audio.ensure();
                  const lines = unit.dialogue.map((d) => d.de);
                  void audio.speakSequence(lines, 600);
                }}
                className="neon-btn neon-btn-lime chamfer-sm px-3.5 py-1.5 text-xs font-ar font-bold shrink-0 flex items-center gap-1.5"
              >
                <span>▶</span>
                <span>قرا الحوار كامل أوتوماتيك</span>
              </button>
            </div>

            {unit.dialogue.map((line, idx) => (
              <div
                key={idx}
                className="panel chamfer p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-line/60 hover:border-cyan/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5" dir="ltr">
                    <span className="font-display text-xs px-2 py-0.5 rounded bg-panel2 border border-line text-cyan font-bold">
                      {line.speaker}
                    </span>
                    <span className="font-display text-lg md:text-xl text-ink font-semibold">{line.de}</span>
                  </div>
                  <div className="font-ar text-base text-dim text-right pr-2" dir="rtl">
                    {line.dz}
                  </div>
                </div>

                <button
                  onClick={() => { audio.ensure(); void audio.speakLive(line.de); }}
                  aria-label={`Listen to ${line.speaker}`}
                  className="neon-btn neon-btn-cyan chamfer-sm px-3.5 py-2 text-xs font-ar flex items-center gap-1 shrink-0 self-end md:self-auto"
                >
                  <span>🔊</span>
                  <span>سمع النطق</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: GRAMMAR */}
        {tab === 'grammar' && (
          <div className="max-w-3xl mx-auto space-y-6 pb-16">
            {unit.grammar.map((lesson, idx) => (
              <div key={idx} className="panel chamfer p-5 md:p-6 border-line/70" dir="rtl">
                <h3 className="font-ar text-xl md:text-2xl font-bold text-cyan text-glow-cyan mb-3 text-right">
                  {lesson.title}
                </h3>
                <p className="font-ar text-base text-ink/90 leading-relaxed mb-4 text-right">
                  {lesson.ruleDz}
                </p>

                {lesson.tables && (
                  <div className="overflow-x-auto my-4 border border-line/60 rounded">
                    <table className="w-full text-right font-ar text-sm border-collapse">
                      <thead>
                        <tr className="bg-panel2/80 border-b border-line text-cyan">
                          {lesson.tables.headers.map((h, i) => (
                            <th key={i} className="p-2.5 font-bold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {lesson.tables.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-line/30 hover:bg-cyan/5">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5 text-ink font-mono">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <div className="font-ar text-xs font-bold text-dim mb-1">أمثلة تطبيقية:</div>
                  {lesson.examples.map((ex, i) => (
                    <div key={i} className="bg-panel2/60 border border-line/40 chamfer-sm p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="font-mono text-base text-lime text-glow-lime" dir="ltr">{ex.de}</div>
                      <div className="font-ar text-sm text-dim">{ex.dz}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SENTENCE BUILDER (SATZBAU) */}
        {tab === 'sentence' && currentExercise && (
          <div className="max-w-2xl mx-auto space-y-6 pb-16">
            <div className="panel chamfer p-6 text-center border-line/70">
              <div className="flex items-center justify-between text-dim text-xs font-mono mb-4">
                <span>SATZBAU EXERCISE {exerciseIdx + 1}/{unit.sentenceExercises.length}</span>
                <span className="text-cyan font-bold">GOETHE A1 SYNTAX</span>
              </div>

              <div className="font-ar text-lg md:text-xl text-ink font-bold mb-4" dir="rtl">
                {currentExercise.promptDz}
              </div>

              {/* Selected Chips Dropzone */}
              <div className="min-h-[4rem] p-3.5 chamfer-sm border-2 border-dashed border-cyan/40 bg-void/80 flex flex-wrap gap-2 items-center justify-center mb-6">
                {selectedChips.length === 0 ? (
                  <span className="font-ar text-xs text-dim">كليكي على الكلمات لتحت باش ترتب الجملة هنا</span>
                ) : (
                  selectedChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => removeChip(chip, i)}
                      className="px-3.5 py-1.5 chamfer-sm bg-cyan/20 border border-cyan text-cyan text-sm md:text-base font-mono font-bold hover:bg-mag/20 hover:border-mag hover:text-mag transition-colors"
                      title="حيد الكلمة"
                    >
                      {chip} ✕
                    </button>
                  ))
                )}
              </div>

              {/* Available Chips */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {availableChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => addChip(chip, i)}
                    className="px-3.5 py-2 chamfer-sm bg-panel2 border border-line/80 text-ink text-sm md:text-base font-mono font-semibold hover:border-cyan hover:text-cyan transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Check & Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={checkSentence}
                  disabled={selectedChips.length === 0}
                  className="neon-btn neon-btn-lime chamfer px-6 py-2.5 text-base font-ar font-bold disabled:opacity-40"
                >
                  تأكد من الجواب ◀
                </button>
                <button
                  onClick={() => {
                    const shuffled = [...currentExercise.chips].sort(() => Math.random() - 0.5);
                    setAvailableChips(shuffled);
                    setSelectedChips([]);
                    setSentenceResult('idle');
                    audio.uiClick();
                  }}
                  className="neon-btn chamfer-sm px-4 py-2.5 text-xs font-ar"
                >
                  🔄 إعادة الترتيب
                </button>
              </div>

              {/* Feedback Alert */}
              {sentenceResult === 'correct' && (
                <div className="mt-5 chamfer-sm bg-lime/15 border border-lime p-4 font-ar text-right rise" dir="rtl">
                  <div className="font-bold text-lime text-base mb-1">🎉 برافو! جواب صحيح 100%!</div>
                  <p className="text-ink text-sm">{currentExercise.explanation}</p>
                  {exerciseIdx < unit.sentenceExercises.length - 1 && (
                    <button
                      onClick={() => setExerciseIdx((i) => i + 1)}
                      className="mt-3 neon-btn neon-btn-cyan chamfer-sm px-4 py-1 text-xs font-ar font-bold"
                    >
                      دوز للجملة التالية ◀
                    </button>
                  )}
                </div>
              )}

              {sentenceResult === 'wrong' && (
                <div className="mt-5 chamfer-sm bg-mag/15 border border-mag p-4 font-ar text-right shake" dir="rtl">
                  <div className="font-bold text-mag text-base mb-1">❌ الجملة ما مفرزاش مزيان، عاود حاول!</div>
                  <p className="text-ink text-xs">تفكّر القاعدة: الفعل ديما كيجي هو رقم 2 ف الجملة العادية.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: LISTENING COMPREHENSION (HÖRVERSTEHEN) */}
        {tab === 'listening' && currentListening && (
          <div className="max-w-2xl mx-auto space-y-6 pb-16">
            <div className="panel chamfer p-6 border-line/70 text-center">
              <div className="flex items-center justify-between text-dim text-xs font-mono mb-4">
                <span>HÖRVERSTEHEN {listeningIdx + 1}/{unit.listeningExercises.length}</span>
                <span className="text-cyan font-bold">GOETHE A1 AUDIO TEST</span>
              </div>

              {/* Audio Play Trigger */}
              <div className="my-6">
                <button
                  onClick={() => {
                    audio.ensure();
                    void audio.speakLive(currentListening.audioText);
                  }}
                  className="neon-btn neon-btn-cyan chamfer px-8 py-4 text-lg font-ar font-bold flex items-center justify-center gap-2 mx-auto shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                  <span className="text-2xl">🔊</span>
                  <span>سمع التسجيل الصوتي</span>
                </button>
                <div className="text-xs text-dim font-ar mt-2">كليكي باش تسمع الصوت وعاودو شحال ما بغيتي</div>
              </div>

              {/* Question in Darija */}
              <div className="font-ar text-xl font-bold text-ink mb-6 text-right" dir="rtl">
                {currentListening.questionDz}
              </div>

              {/* Options */}
              <div className="grid gap-3 mb-6" dir="rtl">
                {currentListening.optionsDz.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentListening.correctIdx;
                  return (
                    <button
                      key={i}
                      onClick={() => checkListening(i)}
                      className={`p-4 chamfer border-2 text-right font-ar text-base transition-all ${
                        listeningResult !== 'idle' && isCorrect
                          ? 'border-lime bg-lime/20 text-lime font-bold'
                          : listeningResult !== 'idle' && isSelected && !isCorrect
                          ? 'border-mag bg-mag/20 text-mag'
                          : isSelected
                          ? 'border-cyan bg-cyan/10 text-cyan'
                          : 'border-line/70 bg-panel2/80 text-ink hover:border-cyan'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Listening Feedback */}
              {listeningResult === 'correct' && (
                <div className="chamfer-sm bg-lime/15 border border-lime p-4 font-ar text-right rise" dir="rtl">
                  <div className="font-bold text-lime text-base mb-1">🎉 ممتاز! فهمتي التسجيل بنجاح!</div>
                  <p className="text-ink text-sm">{currentListening.explanation}</p>
                  {listeningIdx < unit.listeningExercises.length - 1 && (
                    <button
                      onClick={() => setListeningIdx((i) => i + 1)}
                      className="mt-3 neon-btn neon-btn-cyan chamfer-sm px-4 py-1 text-xs font-ar font-bold"
                    >
                      دوز للسؤال الصوتي التالي ◀
                    </button>
                  )}
                </div>
              )}

              {listeningResult === 'wrong' && (
                <div className="chamfer-sm bg-mag/15 border border-mag p-4 font-ar text-right shake" dir="rtl">
                  <div className="font-bold text-mag text-base mb-1">❌ ما سمعتيش مزيان، عاود حاول!</div>
                  <p className="text-ink text-xs">كليكي على زر الاستماع الفوق وعاود ركز ف الكلمات الرئيسية.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
