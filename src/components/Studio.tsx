import { useEffect, useRef, useState } from 'react';
import { audio } from '../game/audio';
import { TRAPS, hashStr, mulberry32, type Track } from '../game/content';

/* ============================================================
   LEVEL 1 — STUDIO SESSION
   Futuristic mixer console: the AI professor breaks the track
   into L-Ma3na (Darija punchline), L-Fakh (phonetic trap) and
   Qawa3id (one-line grammar hack). Ends with a checkpoint quiz.
   ============================================================ */

interface Props { track: Track; onReady: () => void; onExit: () => void }

interface Round { de: string; options: string[]; correct: string }

export default function Studio({ track, onReady, onExit }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [ri, setRi] = useState(0);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [rightPick, setRightPick] = useState<string | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(false);
  const playStart = useRef(0);

  // cancel any queued speech when leaving the studio
  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch { /* noop */ } }, []);

  // build quiz rounds
  useEffect(() => {
    const r = mulberry32(hashStr(track.id) + 99);
    const ws = [...track.words];
    for (let i = ws.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ws[i], ws[j]] = [ws[j], ws[i]]; }
    const rs: Round[] = ws.slice(0, 3).map((w) => {
      const others = track.words.filter((x) => x.dz !== w.dz);
      const opts = [w.dz];
      while (opts.length < 3) {
        const c = others[Math.floor(r() * others.length)].dz;
        if (!opts.includes(c)) opts.push(c);
      }
      for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
      return { de: w.de, options: opts, correct: w.dz };
    });
    setRounds(rs);
  }, [track]);

  // waveform animation
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(c.clientWidth * dpr);
      c.height = Math.floor(c.clientHeight * dpr);
    };
    onResize();
    window.addEventListener('resize', onResize);
    const wr = mulberry32(hashStr(track.id) + 5);
    const bars = Array.from({ length: 72 }, () => 0.25 + wr() * 0.75);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (!c || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = c.clientWidth, H = c.clientHeight;
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() / 1000;
      const bw = W / bars.length;
      const elapsed = playingRef.current ? (performance.now() - playStart.current) / 1000 : 0;
      const dur = track.words.length * 1.05;
      const ph = playingRef.current ? Math.min(1, elapsed / dur) : 0;
      bars.forEach((b, i) => {
        const live = playingRef.current && i / bars.length <= ph;
        const amp = b * (live ? (0.5 + 0.5 * Math.abs(Math.sin(t * 7 + i * 0.7))) : 0.22);
        const h = amp * H * 0.8;
        ctx.fillStyle = live ? (i % 5 === 0 ? '#ff2d78' : '#00f0ff') : 'rgba(0,240,255,0.25)';
        ctx.fillRect(i * bw + 1, (H - h) / 2, bw - 2, h);
      });
      if (playingRef.current) {
        ctx.fillStyle = '#b6ff2e';
        ctx.fillRect(ph * W - 1, 0, 2, H);
        if (ph >= 1) { playingRef.current = false; setPlaying(false); }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [track]);

  const playAll = () => {
    if (playing) return;
    audio.ensure();
    playingRef.current = true;
    playStart.current = performance.now();
    setPlaying(true);
    audio.speakSequence(track.words.map((w) => w.de), 1050);
    audio.uiOpen();
  };

  const pick = (opt: string) => {
    if (rightPick) return;
    const round = rounds[ri];
    if (!round) return;
    if (opt === round.correct) {
      setRightPick(opt);
      audio.grade(90);
      window.setTimeout(() => {
        setRightPick(null);
        setWrongPick(null);
        if (ri + 1 >= rounds.length) { setQuizDone(true); audio.win(); }
        else { setRi(ri + 1); audio.uiOpen(); }
      }, 650);
    } else {
      setWrongPick(opt);
      audio.miss();
      window.setTimeout(() => setWrongPick(null), 500);
    }
  };

  const round = rounds[ri];

  return (
    <div className="relative h-full w-full bg-void overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col max-w-7xl mx-auto p-3 md:p-6">
        {/* header */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onExit} className="neon-btn chamfer-sm px-3 py-2 text-xs">◀ DECK</button>
            <div>
              <div className="panel-tag">LEVEL 1 — STUDIO SESSION</div>
              <div className="font-display text-2xl text-ink">{track.tier} <span className="text-cyan text-glow-cyan">{track.title}</span>
                <span className="ml-3 text-dim text-sm font-body">{track.tagline}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onReady}
            disabled={!quizDone}
            className="neon-btn neon-btn-lime chamfer px-6 py-3 text-sm pulse-glow"
          >
            {quizDone ? 'DEPLOY TO HIGHWAY ▶' : 'CLEAR THE CHECKPOINT'}
          </button>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* left: deck + checkpoint */}
          <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
            <div className="panel chamfer p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="panel-tag">MASTER DECK — {track.bpm} BPM</div>
                <button onClick={playAll} className="neon-btn chamfer-sm px-4 py-1.5 text-xs" disabled={playing}>
                  {playing ? '◉ PLAYING…' : '▶ AUDITION TRACK'}
                </button>
              </div>
              <canvas ref={canvasRef} className="w-full h-24 block" />
              <div className="mt-3 grid gap-2">
                <div className="chamfer-sm border border-cyan/25 bg-cyan/5 p-3">
                  <div className="panel-tag mb-1">L-MA3NA</div>
                  <p className="text-ink leading-snug">{track.ma3na}</p>
                </div>
                <div className="chamfer-sm border border-amber/30 bg-amber/5 p-3">
                  <div className="panel-tag !text-amber mb-1" style={{ color: '#ffb300', textShadow: '0 0 12px rgba(255,179,0,0.7)' }}>QAWA3ID — GRAMMAR HACK</div>
                  <p className="text-ink leading-snug">{track.qawa3id}</p>
                </div>
              </div>
            </div>

            {/* checkpoint quiz */}
            <div className={`panel chamfer p-4 flex-1 ${quizDone ? 'panel-lime' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="panel-tag">CHECKPOINT — MATCH THE MEANING</div>
                <div className="font-display text-xs text-dim">{Math.min(ri + 1, rounds.length)}/{rounds.length || 3}</div>
              </div>
              {!quizDone && round ? (
                <div key={ri} className={wrongPick ? 'shake' : 'rise'}>
                  <div className="font-display text-3xl text-ink text-glow-cyan mb-3">{round.de}</div>
                  <div className="grid gap-2">
                    {round.options.map((opt) => {
                      const isRight = rightPick === opt;
                      const isWrong = wrongPick === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => pick(opt)}
                          className={`chamfer-sm border px-4 py-2.5 text-left font-body text-lg tracking-wide transition-all duration-100
                            ${isRight ? 'border-lime bg-lime/20 text-lime' : isWrong ? 'border-mag bg-mag/20 text-mag' : 'border-line bg-panel2/60 text-ink hover:border-cyan/60 hover:bg-cyan/10'}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {wrongPick && (
                    <p className="mt-2 text-sm text-mag">
                      La! {TRAPS[track.words.find((w) => w.dz === round.correct)?.trap ?? 'ich'].label} — jerreb mra khra.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rise text-center py-6">
                  <div className="font-display text-3xl text-lime text-glow-lime mb-2">CHECKPOINT CLEAR</div>
                  <p className="text-dim">L-mkh sa9i. Daba l-highway — {track.words.length * 2} gates, {track.bpm} BPM.</p>
                </div>
              )}
            </div>
          </div>

          {/* right: word cards */}
          <div className="lg:col-span-7 min-h-0 overflow-y-auto pr-1 grid content-start gap-2 grid-cols-1 md:grid-cols-2">
            {track.words.map((w, i) => {
              const open = expanded === w.de;
              const trap = TRAPS[w.trap];
              return (
                <button
                  key={w.de}
                  onClick={() => { setExpanded(open ? null : w.de); audio.uiClick(); }}
                  className={`text-left panel chamfer-sm p-3 transition-all duration-150 rise ${open ? '!border-cyan/70 md:col-span-2' : 'hover:!border-cyan/40'}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-xl text-ink">{w.de}</span>
                    <span className="text-dim text-sm">{w.ipa}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-cyan font-semibold tracking-wide">{w.dz}</span>
                    <span className="font-arabic text-dim" dir="rtl">{w.ar}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="chamfer-sm bg-mag/10 border border-mag/40 text-mag px-2 py-0.5 text-[10px] font-display tracking-widest">
                      L-FAKH · {trap.label}
                    </span>
                    <span className="text-dim text-xs">{open ? '▲' : '▼'}</span>
                  </div>
                  {open && (
                    <div className="mt-3 grid gap-2 rise">
                      <p className="text-ink text-sm leading-snug">{trap.tip}</p>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); audio.speak(w.de); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); audio.speak(w.de); } }}
                        className="neon-btn chamfer-sm px-3 py-1.5 text-xs w-fit"
                      >
                        ◉ SME3 — {w.de}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 text-dim text-xs tracking-widest flex justify-between">
          <span>CLICK A CARD → L-FAKH BREAKDOWN</span>
          <span className="hidden md:inline">TTS: {audio.ttsReady ? 'DE-DE VOICE READY' : 'SYNTH FALLBACK'}</span>
        </div>
      </div>
    </div>
  );
}
