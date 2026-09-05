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
            <button onClick={onExit} className="neon-btn chamfer-sm px-3 py-2 text-xs shrink-0">◀</button>
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
              className={`neon-btn ${hasLiveKey() ? 'neon-btn-lime' : ''} chamfer-sm px-4 py-2 text-xs`}
            >
              ✦ AI TUTOR {hasLiveKey() ? '· LIVE' : '· CORE'}
            </button>
            <button
              onClick={onReady}
              disabled={!quizDone}
              className="neon-btn neon-btn-mag chamfer px-5 py-2.5 text-sm pulse-mag"
            >
              {quizDone ? '▶ HIGHWAY' : 'دوز التشيكپوان'}
            </button>
          </div>
        </div>

        {/* goal line */}
        <div className="chamfer-sm border border-cyan/25 bg-cyan/5 px-4 py-2 mb-4 font-ar text-[15px] text-ink">
          <span className="panel-tag ml-2">الهدف</span> {track.goal}
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

              <h2 className="font-ar text-3xl md:text-4xl text-ink mb-1">{step.title}</h2>
              <p className="font-ar text-lg text-dim mb-5 leading-relaxed max-w-3xl">{step.explain}</p>

              {/* word cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {step.items.map((w, i) => (
                  <div key={w.de} className="panel chamfer p-5 rise" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-3xl text-ink text-glow-cyan">{w.de}</span>
                      <span className="text-dim text-sm">{w.ipa}</span>
                    </div>
                    <div className="font-ar text-2xl text-cyan mt-1" dir="rtl">{w.dz}</div>
                    <div className="mt-3 chamfer-sm bg-mag/8 border border-mag/30 px-3 py-2 font-ar text-[15px] text-ink leading-relaxed">
                      <span className="text-mag font-semibold">العقلة:</span> {w.mnemonic}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="chamfer-sm bg-cyan/8 border border-cyan/30 text-cyan px-2 py-0.5 text-[11px] font-ar">
                        {TRAPS[w.trap].label}
                      </span>
                      <button onClick={() => { audio.ensure(); audio.speak(w.de); }} className="neon-btn chamfer-sm px-4 py-1.5 text-xs font-ar">
                        ◉ سمع
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {step.grammar && (
                <div className="mt-4 chamfer-sm border border-amber/30 bg-amber/5 px-4 py-3 font-ar text-[15px] text-ink leading-relaxed">
                  <span className="text-amber font-semibold">قاعدة:</span> {step.grammar}
                </div>
              )}

              {/* nav */}
              <div className="flex items-center justify-between mt-6 pb-2">
                <button
                  onClick={() => { if (stepIdx > 0) { setStepIdx(stepIdx - 1); audio.uiClick(); } }}
                  disabled={stepIdx === 0}
                  className="neon-btn chamfer-sm px-6 py-3 text-sm"
                >
                  ◀ اللي قبل
                </button>
                <button
                  onClick={() => { audio.uiOpen(); if (isLastStep) setPhase('quiz'); else setStepIdx(stepIdx + 1); }}
                  className="neon-btn neon-btn-lime chamfer px-10 py-3.5 text-lg pulse-glow font-ar"
                >
                  {isLastStep ? 'التشيكپوان ▶' : 'التالي ▶'}
                </button>
              </div>
            </div>
          )}

          {phase === 'quiz' && (
            <div className="rise max-w-2xl">
              <div className="panel-tag mb-2">LEVEL 1 · CHECKPOINT</div>
              {!quizDone && rounds[ri] ? (
                <div key={ri} className={wrong ? 'shake' : ''}>
                  <h2 className="font-ar text-2xl text-dim mb-1">شنو كتعني هاد الكلمة؟</h2>
                  <div className="font-display text-5xl md:text-6xl text-ink text-glow-cyan my-4">{rounds[ri].de}</div>
                  <div className="grid gap-3">
                    {rounds[ri].options.map((opt) => {
                      const isR = right === opt, isW = wrong === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => pick(opt)}
                          dir="rtl"
                          className={`chamfer border-2 px-6 py-5 text-right font-ar text-3xl leading-none transition-all duration-100 cursor-pointer
                            ${isR ? 'border-lime bg-lime/20 text-lime' : isW ? 'border-mag bg-mag/20 text-mag' : 'border-line bg-panel2/70 text-ink hover:border-cyan hover:bg-cyan/10'}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {wrong && (
                    <p className="mt-3 font-ar text-lg text-mag">لا! العقلة: {rounds[ri].mnemonic}</p>
                  )}
                  <div className="mt-4 text-dim font-display text-sm">{ri + 1} / {rounds.length}</div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="font-ar text-4xl text-lime text-glow-lime mb-3">التشيكپوان صافي!</div>
                  <p className="font-ar text-lg text-dim mb-8">دابا غادي تدخل لـ Highway — {track.words.length} كلمات، {track.bpm} BPM.</p>
                  <button onClick={onReady} className="neon-btn neon-btn-mag chamfer px-12 py-4 text-xl pulse-mag font-ar">
                    ▶ دخل ل Highway
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
          className="absolute bottom-5 right-5 z-30 neon-btn neon-btn-lime chamfer px-5 py-3 text-sm pulse-glow font-ar"
        >
          ✦ سول التuteur
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
            <button onClick={() => setChatOpen(false)} className="neon-btn chamfer-sm px-3 py-1.5 text-xs">✕</button>
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
              <p className="font-ar text-dim text-[15px] leading-relaxed">
                السلام! سولني على أي كلمة ولا قاعدة فهاد الدرس — <span className="text-ink">{track.title}</span>.
                <br />مثلا: «كيفاش ننطق schön؟»
              </p>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`chamfer-sm px-3 py-2 font-ar text-[15px] leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-cyan/10 border border-cyan/30 text-ink self-end' : 'bg-panel2 border border-line text-ink'}`}>
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
              className="flex-1 chamfer-sm bg-panel2 border border-line px-3 py-2.5 font-ar text-[15px] text-ink outline-none focus:border-cyan"
            />
            <button onClick={send} disabled={busy} className="neon-btn chamfer-sm px-5 py-2 text-sm">▶</button>
          </div>
        </div>
      )}
    </div>
  );
}
