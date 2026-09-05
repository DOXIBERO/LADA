import { useEffect, useRef, useState } from 'react';
import { audio } from '../game/audio';
import { askTutor, getApiKey, hasLiveKey, setApiKey } from '../game/gemini';
import { TRAPS, hashStr, mulberry32, type Track } from '../game/content';

/* ============================================================
   LEVEL 1 — THE A0 LESSON (dars b dars)
   Step-by-step teaching with a memorable 3o9ola per word, then
   a big-option checkpoint quiz, plus a LIVE Gemini AI tutor
   (paste your own AIza key). Falls back to on-device LADA CORE.
   ============================================================ */

interface Props { track: Track; onReady: () => void; onExit: () => void }
interface Round { de: string; options: string[]; correct: string; mnemonic: string }
interface Msg { role: 'user' | 'ai'; text: string }

export default function Studio({ track, onReady, onExit }: Props) {
  const [phase, setPhase] = useState<'learn' | 'quiz'>('learn');
  const [stepIdx, setStepIdx] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [ri, setRi] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  // AI tutor chat
  const [chatOpen, setChatOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [keyDraft, setKeyDraft] = useState(getApiKey());
  const [keySaved, setKeySaved] = useState(hasLiveKey());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch { /* noop */ } }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy, chatOpen]);

  // build quiz rounds (big options)
  useEffect(() => {
    const r = mulberry32(hashStr(track.id) + 99);
    const ws = [...track.words];
    for (let i = ws.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ws[i], ws[j]] = [ws[j], ws[i]]; }
    const rs: Round[] = ws.slice(0, 4).map((w) => {
      const others = track.words.filter((x) => x.dz !== w.dz);
      const opts = [w.dz];
      while (opts.length < 3) {
        const c = others[Math.floor(r() * others.length)].dz;
        if (!opts.includes(c)) opts.push(c);
      }
      for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
      return { de: w.de, options: opts, correct: w.dz, mnemonic: w.mnemonic };
    });
    setRounds(rs);
  }, [track]);

  const pick = (opt: string) => {
    if (right) return;
    const round = rounds[ri];
    if (!round) return;
    if (opt === round.correct) {
      setRight(opt); audio.grade(90);
      window.setTimeout(() => {
        setRight(null); setWrong(null);
        if (ri + 1 >= rounds.length) { setQuizDone(true); audio.win(); }
        else { setRi(ri + 1); audio.uiOpen(); }
      }, 700);
    } else {
      setWrong(opt); audio.miss();
      window.setTimeout(() => setWrong(null), 550);
    }
  };

  const onDeviceAnswer = (q: string): string => {
    const low = q.toLowerCase();
    const hit = track.words.find((w) => low.includes(w.de.toLowerCase()) || low.includes(w.dz));
    if (hit) {
      const t = TRAPS[hit.trap];
      return `${hit.de} = ${hit.dz}  ·  ${hit.mnemonic}\nالفخ: ${t.label} — ${t.tip}`;
    }
    return `سولني على شي كلمة من هاد الدرس: ${track.words.map((w) => w.de).join('، ')}.\nولا لصق API key باش يهدر معاك Gemini laif.`;
  };

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput('');
    setMsgs((m) => [...m, { role: 'user', text: q }]);
    setBusy(true);
    try {
      if (hasLiveKey()) {
        const ctx = `الدرس: ${track.title} (${track.titleDe}). الكلمات: ${track.words.map((w) => `${w.de} = ${w.dz}`).join('، ')}`;
        const ans = await askTutor(q, ctx);
        setMsgs((m) => [...m, { role: 'ai', text: ans }]);
      } else {
        await new Promise((r) => window.setTimeout(r, 300));
        setMsgs((m) => [...m, { role: 'ai', text: onDeviceAnswer(q) }]);
      }
    } catch (e) {
      setMsgs((m) => [...m, { role: 'ai', text: `LADA CORE: ما قدرتش نوصل ل Gemini (${(e as Error).message}). ها الجواب من الذاكرة:\n${onDeviceAnswer(q)}` }]);
    } finally {
      setBusy(false);
    }
  };

  const saveKey = () => {
    setApiKey(keyDraft);
    setKeySaved(hasLiveKey());
    audio.uiClick();
    setMsgs((m) => [...m, { role: 'ai', text: hasLiveKey() ? 'المفتاح تسجّل. دابا التuteur غادي يهدر معاك ب Gemini laif — سولو أي حاجة!' : 'المفتاح خاصو يبدا ب AIza… — جيبو من aistudio.google.com/apikey' }]);
  };

  const step = track.steps[stepIdx];
  const isLastStep = stepIdx === track.steps.length - 1;

  return (
    <div className="relative h-full w-full bg-void overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col max-w-5xl mx-auto px-4 md:px-6 py-3 md:py-5">
        {/* header */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onExit} aria-label="Exit to Command Deck" className="neon-btn chamfer-sm px-3 py-2 text-xs shrink-0">◀</button>
            <div className="min-w-0">
              <div className="panel-tag">{track.tier} · LEVEL 1</div>
              <div className="font-ar text-2xl md:text-3xl text-ink leading-tight truncate">
                {track.title} <span className="text-cyan text-glow-cyan font-display text-xl md:text-2xl align-middle">{track.titleDe}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setChatOpen((o) => !o); audio.uiClick(); }}
              className={`neon-btn ${hasLiveKey() ? 'neon-btn-lime' : ''} chamfer-sm px-3.5 py-2 text-xs font-mono`}
            >
              ✦ AI TUTOR {hasLiveKey() ? '· LIVE' : '· CORE'}
            </button>
            {quizDone ? (
              <button
                onClick={onReady}
                className="neon-btn neon-btn-mag chamfer px-5 py-2.5 text-sm pulse-mag font-ar font-bold"
              >
                ▶ دخل لـ HIGHWAY
              </button>
            ) : phase === 'learn' ? (
              <button
                onClick={() => { setPhase('quiz'); audio.uiOpen(); }}
                className="neon-btn neon-btn-cyan chamfer px-4 py-2 text-xs font-ar"
              >
                دوز للتشيكپوان ◀
              </button>
            ) : null}
          </div>
        </div>

        {/* goal line */}
        <div className="chamfer-sm border border-cyan/25 bg-cyan/5 px-4 py-2.5 mb-4 font-ar text-[15px] text-ink flex items-center justify-between gap-3" dir="rtl">
          <div className="flex items-center gap-2">
            <span className="panel-tag">الهدف:</span>
            <span>{track.goal}</span>
          </div>
          <span className="text-xs text-dim font-mono hidden sm:inline" dir="ltr">{track.words.length} WORDS · {track.bpm} BPM</span>
        </div>

        {/* body: learn or quiz */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {phase === 'learn' && step && (
            <div key={stepIdx} className="rise">
              {/* step header + progress */}
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-cyan text-sm tracking-widest">
                  STEP {stepIdx + 1}/{track.steps.length}
                </div>
                <div className="flex gap-1.5">
                  {track.steps.map((_, i) => (
                    <span key={i} className={`h-1.5 w-8 ${i < stepIdx ? 'bg-lime' : i === stepIdx ? 'bg-cyan' : 'bg-line'}`} />
                  ))}
                </div>
              </div>

              <h2 className="font-ar text-2xl md:text-3xl font-bold text-ink mb-2 text-right" dir="rtl">{step.title}</h2>
              <p className="font-ar text-base md:text-lg text-dim mb-5 leading-relaxed max-w-3xl text-right" dir="rtl">{step.explain}</p>

              {/* word cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {step.items.map((w, i) => (
                  <div key={w.de} className="panel chamfer p-4 md:p-5 rise flex flex-col justify-between" style={{ animationDelay: `${i * 70}ms` }}>
                    <div>
                      {/* German Header (LTR) */}
                      <div className="flex items-center justify-between gap-2 border-b border-line/50 pb-2 mb-3" dir="ltr">
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-display text-2xl md:text-3xl font-bold text-ink text-glow-cyan tracking-wide">{w.de}</span>
                          <span className="text-dim/80 font-mono text-xs px-2 py-0.5 rounded bg-panel2 border border-line/40">{w.ipa}</span>
                        </div>
                        <span className="chamfer-sm bg-cyan/10 border border-cyan/30 text-cyan px-2 py-0.5 text-[11px] font-ar shrink-0">
                          {TRAPS[w.trap].label}
                        </span>
                      </div>

                      {/* Darija Meaning & Transliteration (RTL) */}
                      <div className="flex items-center justify-between gap-2 mb-3" dir="rtl">
                        <div className="font-ar text-2xl font-bold text-cyan text-glow-cyan">{w.dz}</div>
                        <div className="flex items-center gap-1.5 bg-lime/10 border border-lime/30 px-2.5 py-1 chamfer-sm">
                          <span className="text-[11px] text-dim font-ar">النطق:</span>
                          <span className="font-ar text-base font-bold text-lime tracking-wide">{w.phoneticAr}</span>
                        </div>
                      </div>

                      {/* Mnemonic (3o9ola) with strict BiDi isolation */}
                      <div className="chamfer-sm bg-mag/10 border border-mag/30 px-3.5 py-2.5 font-ar text-[14px] text-ink leading-relaxed mb-3 text-right" dir="rtl">
                        <span className="text-mag font-bold ml-1.5 inline-block">العقلة:</span>
                        <bdi className="text-ink/95">{w.mnemonic}</bdi>
                      </div>

                      {/* Mouth-position phonetic coach tip */}
                      <div className="chamfer-sm bg-panel2/80 border border-line/40 px-3 py-2 text-[12px] font-ar text-dim leading-relaxed text-right" dir="rtl">
                        <span className="text-cyan font-semibold ml-1.5 inline-block">نصيحة النطق:</span>
                        <span>{TRAPS[w.trap].tip}</span>
                      </div>
                    </div>

                    {/* Audio Speed Controls */}
                    <div className="mt-4 pt-3 border-t border-line/40 flex items-center justify-end gap-2" dir="ltr">
                      <button
                        onClick={() => { audio.ensure(); audio.speak(w.de, 0.65); }}
                        title="نطق بطيء للتدقيق"
                        className="neon-btn chamfer-sm px-3 py-1.5 text-xs font-ar flex items-center gap-1 hover:border-amber hover:text-amber"
                      >
                        <span>🐢</span>
                        <span>بشوية (0.65x)</span>
                      </button>
                      <button
                        onClick={() => { audio.ensure(); audio.speak(w.de, 0.9); }}
                        title="نطق عادي"
                        className="neon-btn neon-btn-cyan chamfer-sm px-4 py-1.5 text-xs font-ar flex items-center gap-1"
                      >
                        <span>🔊</span>
                        <span>عادي (0.9x)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {step.grammar && (
                <div className="mt-4 chamfer-sm border border-amber/30 bg-amber/5 px-4 py-3 font-ar text-[15px] text-ink leading-relaxed text-right" dir="rtl">
                  <span className="text-amber font-bold ml-1.5 inline-block">قاعدة:</span>
                  <bdi>{step.grammar}</bdi>
                </div>
              )}

              {/* nav */}
              <div className="flex items-center justify-between mt-6 pb-4">
                <button
                  onClick={() => { if (stepIdx > 0) { setStepIdx(stepIdx - 1); audio.uiClick(); } }}
                  disabled={stepIdx === 0}
                  className="neon-btn chamfer-sm px-6 py-3 text-sm font-ar"
                >
                  ◀ اللي قبل
                </button>
                <button
                  onClick={() => { audio.uiOpen(); if (isLastStep) setPhase('quiz'); else setStepIdx(stepIdx + 1); }}
                  className="neon-btn neon-btn-lime chamfer px-10 py-3.5 text-lg pulse-glow font-ar font-bold"
                >
                  {isLastStep ? 'التشيكپوان ▶' : 'التالي ▶'}
                </button>
              </div>
            </div>
          )}

          {phase === 'quiz' && (
            <div className="rise max-w-2xl mx-auto w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="panel-tag">LEVEL 1 · CHECKPOINT QUIZ</div>
                <button
                  onClick={() => { setPhase('learn'); audio.uiClick(); }}
                  className="neon-btn chamfer-sm px-3 py-1 text-xs font-ar"
                >
                  ◀ رجوع للدرس
                </button>
              </div>

              {!quizDone && rounds[ri] ? (
                <div key={ri} className={`panel chamfer p-6 ${wrong ? 'shake' : ''}`}>
                  <div className="flex items-center justify-between text-dim text-sm mb-3">
                    <span className="font-ar text-base">السؤال {ri + 1} من {rounds.length}</span>
                    <span className="font-display tracking-widest text-cyan">PROGRESS {Math.round(((ri) / rounds.length) * 100)}%</span>
                  </div>

                  <h2 className="font-ar text-xl text-dim mb-2 text-right" dir="rtl">شنو كتعني هاد الكلمة بالألمانية؟</h2>

                  <div className="flex items-center justify-between bg-panel2/60 border border-line chamfer p-4 my-4" dir="ltr">
                    <div className="font-display text-4xl md:text-5xl font-bold text-ink text-glow-cyan tracking-wide">
                      {rounds[ri].de}
                    </div>
                    <button
                      onClick={() => { audio.ensure(); audio.speak(rounds[ri].de, 0.85); }}
                      className="neon-btn neon-btn-cyan chamfer-sm px-3 py-2 text-xs flex items-center gap-1 font-ar"
                      title="سمع النطق"
                    >
                      <span>🔊</span>
                      <span>سمع</span>
                    </button>
                  </div>

                  <div className="grid gap-3">
                    {rounds[ri].options.map((opt, optIdx) => {
                      const isR = right === opt, isW = wrong === opt;
                      const badgeLetters = ['أ', 'ب', 'ج'];
                      return (
                        <button
                          key={opt}
                          onClick={() => pick(opt)}
                          dir="rtl"
                          className={`chamfer border-2 px-5 py-4 flex items-center justify-between font-ar text-2xl transition-all duration-100 cursor-pointer
                            ${isR ? 'border-lime bg-lime/20 text-lime font-bold' : isW ? 'border-mag bg-mag/20 text-mag' : 'border-line bg-panel2/80 text-ink hover:border-cyan hover:bg-cyan/10'}`}
                        >
                          <span className="text-right flex-1">{opt}</span>
                          <span className="text-xs font-mono px-2 py-1 rounded bg-panel/60 border border-line/40 text-dim">
                            {badgeLetters[optIdx] || optIdx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {wrong && (
                    <div className="mt-4 chamfer-sm bg-mag/10 border border-mag/40 p-3 font-ar text-base text-mag text-right" dir="rtl">
                      <span className="font-bold ml-1">لا!</span>
                      <span className="text-ink ml-1">العقلة:</span>
                      <bdi className="text-mag">{rounds[ri].mnemonic}</bdi>
                    </div>
                  )}
                </div>
              ) : (
                <div className="panel chamfer p-8 text-center py-12">
                  <div className="text-5xl mb-3">🎯</div>
                  <div className="font-ar text-3xl md:text-4xl text-lime text-glow-lime mb-3 font-bold">التشيكپوان صافي بنجاح!</div>
                  <p className="font-ar text-lg text-dim mb-8 max-w-md mx-auto leading-relaxed" dir="rtl">
                    دابا ضبطتي الكلمات ديال الدرس. مستعد تدخل لـ Highway بريتم <span className="text-cyan font-mono">{track.bpm} BPM</span>؟
                  </p>
                  <button onClick={onReady} className="neon-btn neon-btn-mag chamfer px-10 py-4 text-xl pulse-mag font-ar font-bold">
                    ▶ دخل لـ HIGHWAY
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* floating tutor toggle (when closed) */}
      {!chatOpen && (
        <button
          onClick={() => { setChatOpen(true); audio.uiClick(); }}
          className="fixed md:absolute bottom-5 right-5 z-30 neon-btn neon-btn-lime chamfer px-5 py-3 text-sm pulse-glow font-ar shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-base">✦</span>
          <span>سول المساعد الذكي</span>
        </button>
      )}

      {/* AI tutor drawer */}
      {chatOpen && (
        <div className="absolute top-0 right-0 bottom-0 z-40 w-full sm:w-[420px] panel border-l border-cyan/30 flex flex-col rise">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <div>
              <div className="panel-tag">AI TUTOR</div>
              <div className={`font-ar text-lg ${hasLiveKey() ? 'text-lime' : 'text-amber'}`}>
                {hasLiveKey() ? 'Gemini · laif' : 'LADA CORE · offline'}
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} aria-label="Close tutor chat" className="neon-btn chamfer-sm px-3 py-1.5 text-xs">✕</button>
          </div>

          {!keySaved && (
            <div className="px-4 py-3 border-b border-line bg-amber/5">
              <p className="font-ar text-[13px] text-dim leading-relaxed mb-2">
                باش التuteur يهدر معاك ب <span className="text-lime">Gemini laif</span>، لصق الـ API key ديالك (كاتبدا ب AIza) من
                <span className="text-cyan"> aistudio.google.com/apikey</span>:
              </p>
              <div className="flex gap-2">
                <input
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder="AIza…"
                  className="flex-1 chamfer-sm bg-panel2 border border-line px-3 py-2 text-sm text-ink outline-none focus:border-cyan"
                />
                <button onClick={saveKey} className="neon-btn neon-btn-lime chamfer-sm px-4 py-2 text-xs">حفظ</button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3 grid content-start gap-2">
            {msgs.length === 0 && (
              <p className="font-ar text-dim text-[15px] leading-relaxed" dir="auto">
                السلام! سولني على أي كلمة ولا قاعدة فهاد الدرس — <span className="text-ink">{track.title}</span>.
                <br />مثلا: «كيفاش ننطق schön؟»
              </p>
            )}
            {msgs.map((m, i) => (
              <div key={i} dir="auto" className={`chamfer-sm px-3 py-2 font-ar text-[15px] leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-cyan/10 border border-cyan/30 text-ink self-end' : 'bg-panel2 border border-line text-ink'}`}>
                {m.text}
              </div>
            ))}
            {busy && <div className="text-cyan blink font-ar text-sm">كايكتب…</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-line flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder="سول هنا بالدارجة…"
              dir="auto"
              className="flex-1 chamfer-sm bg-panel2 border border-line px-3 py-2.5 font-ar text-[15px] text-ink outline-none focus:border-cyan"
            />
            <button onClick={send} disabled={busy} aria-label="Send message to AI tutor" className="neon-btn chamfer-sm px-5 py-2 text-sm">▶</button>
          </div>
        </div>
      )}
    </div>
  );
}
