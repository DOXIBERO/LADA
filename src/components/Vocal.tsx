import { useCallback, useEffect, useRef, useState } from 'react';
import { audio } from '../game/audio';
import { TRAPS, type Track, type Word } from '../game/content';
import { vocalFeedback } from '../game/ladaCore';
import { narrator } from '../game/narrator';

/* ============================================================
   LEVEL 3 — THE VOCAL ARENA
   Sing/speak the German line. Local Web Audio pitch tracking
   (autocorrelation, zero network). If the mic is offline the
   arena falls back to syllable rhythm-tap mode.
   ============================================================ */

export interface VocalResult {
  acc: number;
  perWord: Record<string, number>;
}

interface Props {
  track: Track;
  weakWords: Word[];
  onFinish: (r: VocalResult) => void;
}

type Phase = 'intro' | 'live' | 'grade';
const DUR: Record<Phase, number> = { intro: 2.7, live: 3.0, grade: 2.0 };

interface Sample { f: number | null }

function syllables(de: string): number {
  const m = de.toLowerCase().match(/[aeiouäöü]+/g);
  return Math.max(1, Math.min(4, m ? m.length : 1));
}

/** evenly spaced tap targets inside the 3s live window */
function tapMarks(de: string): number[] {
  const n = syllables(de);
  return Array.from({ length: n }, (_, i) => (i + 1) * (2.6 / (n + 1)));
}

function autoCorrelate(buf: Float32Array, sr: number): number | null {
  const SIZE = Math.min(1024, buf.length);
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.012) return null;
  const c = new Float32Array(SIZE);
  for (let lag = 0; lag < SIZE; lag++) {
    let sum = 0;
    for (let j = 0; j < SIZE - lag; j++) sum += buf[j] * buf[j + lag];
    c[lag] = sum;
  }
  let d = 0;
  while (d < SIZE - 1 && c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  if (maxpos <= 0) return null;
  let T0 = maxpos;
  const x1 = c[T0 - 1] ?? 0, x2 = c[T0], x3 = c[T0 + 1] ?? 0;
  const a = (x1 + x3 - 2 * x2) / 2, b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);
  const f = sr / T0;
  return f > 60 && f < 700 ? f : null;
}

export default function Vocal({ track, weakWords, onFinish }: Props) {
  const inTrackWeak = weakWords.filter((w) => track.words.some((x) => x.de === w.de)).slice(0, 2);
  const wordsRef = useRef<Word[]>(
    (() => {
      const list: Word[] = [...inTrackWeak];
      for (const w of track.words) { if (list.length >= 4) break; if (!list.some((x) => x.de === w.de)) list.push(w); }
      return list;
    })(),
  );
  const words = wordsRef.current;

  const [wi, setWi] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [score, setScore] = useState<number | null>(null);
  const [coach, setCoach] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [mic, setMic] = useState<'pending' | 'on' | 'off'>('pending');
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufRef = useRef<Float32Array | null>(null);
  const phaseT = useRef(0);
  const pausedRef = useRef(false);
  const samplesRef = useRef<Sample[]>([]);
  const tapsRef = useRef<number[]>([]);
  const traceRef = useRef<{ t: number; f: number | null }[]>([]);
  const phaseRef = useRef<Phase>('intro');
  const wiRef = useRef(0);
  const scoreRef = useRef<Record<string, number>>({});
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const word = words[wi];
  const base = 165 + (wi % 3) * 32;
  const bandLo = base * 0.85, bandHi = base * 1.28;

  useEffect(() => {
    narrator.narrateVocal(track, words[0]);
    return () => { narrator.stop(); };
  }, [track, words]);

  const enterPhase = useCallback((p: Phase, wIdx: number) => {
    phaseRef.current = p;
    phaseT.current = 0;
    setPhase(p);
    const w = wordsRef.current[wIdx];
    if (p === 'intro') {
      samplesRef.current = [];
      tapsRef.current = [];
      traceRef.current = [];
      audio.countTick(false);
      audio.speak(w.de, 0.8);
    } else if (p === 'live') {
      audio.countTick(true);
    } else {
      // grade
      let sc: number;
      const ss = samplesRef.current;
      const voiced = ss.filter((s) => s.f !== null) as { f: number }[];
      if (analyserRef.current && voiced.length > 0) {
        const vfrac = Math.min(1, voiced.length / Math.max(1, ss.length) * 1.6);
        const mean = voiced.reduce((a, s) => a + s.f, 0) / voiced.length;
        const std = Math.sqrt(voiced.reduce((a, s) => a + (s.f - mean) ** 2, 0) / voiced.length);
        const stability = 1 - Math.min(1, std / (mean * 0.3));
        const inBand = voiced.filter((s) => s.f >= bandLo && s.f <= bandHi).length / voiced.length;
        sc = Math.round(100 * (0.45 * vfrac + 0.25 * stability + 0.3 * inBand));
      } else if (analyserRef.current) {
        sc = 8; // mic on but silent
      } else {
        // tap mode scoring
        const marks = tapMarks(w.de);
        const taps = tapsRef.current;
        let tot = 0;
        for (const m of marks) {
          const best = taps.reduce((acc2, tp) => Math.min(acc2, Math.abs(tp - m)), 99);
          tot += best <= 0.13 ? 1 : best <= 0.28 ? 0.6 : 0;
        }
        sc = Math.round((tot / marks.length) * 100);
      }
      sc = Math.max(0, Math.min(100, sc));
      setScore(sc);
      scoreRef.current[w.de] = sc;
      setScores({ ...scoreRef.current });
      audio.grade(sc);
      void vocalFeedback(w, sc).then(setCoach);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bandLo, bandHi]);

  // mic setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    let micCtx: AudioContext | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        audio.ensure();
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        micCtx = new Ctx();
        const src = micCtx.createMediaStreamSource(stream);
        const an = micCtx.createAnalyser();
        an.fftSize = 2048;
        src.connect(an);
        analyserRef.current = an;
        bufRef.current = new Float32Array(an.fftSize);
        setMic('on');
      } catch {
        analyserRef.current = null;
        setMic('off');
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (micCtx && micCtx.state !== 'closed') {
        void micCtx.close().catch(() => undefined);
      }
    };
  }, []);

  // start
  useEffect(() => {
    const id = window.setTimeout(() => enterPhase('intro', 0), 400);
    return () => window.clearTimeout(id);
  }, [enterPhase]);

  // main loop
  useEffect(() => {
    let raf = 0, last = performance.now();
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      if (!pausedRef.current && !finishedRef.current) {
        phaseT.current += dt;
        const p = phaseRef.current;

        if (p === 'live') {
          const an = analyserRef.current;
          if (an && bufRef.current) {
            an.getFloatTimeDomainData(bufRef.current as Float32Array<ArrayBuffer>);
            const f = autoCorrelate(bufRef.current as Float32Array<ArrayBuffer>, an.context.sampleRate);
            samplesRef.current.push({ f });
            traceRef.current.push({ t: phaseT.current, f });
            if (traceRef.current.length > 400) traceRef.current.shift();
          }
          if (phaseT.current >= DUR.live) enterPhase('grade', wiRef.current);
        } else if (phaseT.current >= DUR[p]) {
          if (p === 'intro') enterPhase('live', wiRef.current);
          else {
            // end of grade → next word or finish
            const next = wiRef.current + 1;
            if (next >= wordsRef.current.length) {
              finishedRef.current = true;
              setFinished(true);
              const vals = Object.values(scoreRef.current);
              const acc = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length / 100 : 0;
              audio.win();
              window.setTimeout(() => onFinishRef.current({ acc, perWord: { ...scoreRef.current } }), 1300);
            } else {
              wiRef.current = next;
              setWi(next);
              setScore(null);
              setCoach('');
              enterPhase('intro', next);
            }
          }
        }
      }
      drawVis();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterPhase]);

  const tap = useCallback(() => {
    if (pausedRef.current) return;
    if (phaseRef.current === 'live') {
      tapsRef.current.push(phaseT.current);
      audio.uiClick();
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); if (!e.repeat) tap(); }
      else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        setPaused((pp) => { pausedRef.current = !pp; if (!pp) audio.suspend(); else audio.resume(); return !pp; });
      }
    };
    window.addEventListener('keydown', onKey);
    const onResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(c.clientWidth * dpr);
      c.height = Math.floor(c.clientHeight * dpr);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [tap]);

  /* -------- visualizer -------- */
  function drawVis() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = c.clientWidth, H = c.clientHeight;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060a16';
    ctx.fillRect(0, 0, W, H);

    const hzY = (f: number) => {
      const lo = Math.log(80), hi = Math.log(520);
      const r = (Math.log(Math.max(80, Math.min(520, f))) - lo) / (hi - lo);
      return H * 0.86 - r * H * 0.72;
    };

    // grid
    ctx.strokeStyle = 'rgba(27,43,71,0.8)';
    ctx.lineWidth = 1;
    [100, 150, 220, 330, 480].forEach((f) => {
      const y = hzY(f);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      ctx.fillStyle = 'rgba(109,135,173,0.6)';
      ctx.font = '600 10px Rajdhani, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${f}Hz`, 6, y - 3);
    });

    // target band
    const yHi = hzY(bandHi), yLo = hzY(bandLo);
    ctx.fillStyle = phaseRef.current === 'live' ? 'rgba(182,255,46,0.12)' : 'rgba(0,240,255,0.08)';
    ctx.fillRect(0, yHi, W, yLo - yHi);
    ctx.strokeStyle = phaseRef.current === 'live' ? 'rgba(182,255,46,0.7)' : 'rgba(0,240,255,0.4)';
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(0, yHi); ctx.lineTo(W, yHi); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, yLo); ctx.lineTo(W, yLo); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = phaseRef.current === 'live' ? '#b6ff2e' : '#00f0ff';
    ctx.font = '700 11px Rajdhani, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('TARGET PITCH BAND', W - 8, yHi - 5);

    const p = phaseRef.current;
    const t = phaseT.current;

    if (analyserRef.current) {
      // pitch trace (scrolling)
      const span = 2.4;
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ff2d78';
      ctx.shadowColor = '#ff2d78';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      let started = false;
      for (const s of traceRef.current) {
        if (s.f === null) { started = false; continue; }
        const x = W - (t - s.t) * (W / span);
        if (x < -10) continue;
        const y = hzY(s.f);
        if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      // live dot
      const lastS = traceRef.current[traceRef.current.length - 1];
      if (lastS && lastS.f && p === 'live') {
        ctx.fillStyle = lastS.f >= bandLo && lastS.f <= bandHi ? '#b6ff2e' : '#ff2d78';
        ctx.beginPath();
        ctx.arc(W - 6, hzY(lastS.f), 5, 0, Math.PI * 2);
        ctx.fill();
      }
      // waveform strip
      if (bufRef.current) {
        ctx.strokeStyle = 'rgba(0,240,255,0.75)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        const n = bufRef.current.length;
        for (let i = 0; i < n; i += 8) {
          const x = (i / n) * W;
          const y = H * 0.93 + bufRef.current[i] * H * 0.05;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } else {
      // tap mode — falling syllable markers
      const marks = tapMarks(word.de);
      const lineY = H * 0.78;
      ctx.strokeStyle = 'rgba(0,240,255,0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, lineY); ctx.lineTo(W, lineY); ctx.stroke();
      ctx.fillStyle = '#6d87ad';
      ctx.font = '600 13px "Noto Kufi Arabic", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('خط الدق — دق SPACE ملي كايوصل الماركر', 8, lineY + 18);
      marks.forEach((m, i) => {
        const dtm = m - t;
        const y = lineY - dtm * (H * 0.22);
        if (y < -20 || y > H + 20) return;
        const hit = tapsRef.current.some((tp) => Math.abs(tp - m) < 0.28);
        ctx.fillStyle = hit ? '#b6ff2e' : Math.abs(dtm) < 0.13 ? '#ffffff' : '#ff2d78';
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(W * (0.2 + 0.6 * (i / Math.max(1, marks.length - 1 || 1))), y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // phase timer arc
    const frac = Math.min(1, t / DUR[p]);
    ctx.strokeStyle = p === 'live' ? '#b6ff2e' : '#00f0ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(W - 34, 34, 18, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#d9ecff';
    ctx.font = '400 11px Audiowide, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p === 'live' ? 'REC' : p === 'intro' ? 'RDY' : 'OK', W - 34, 38);
  }

  const togglePause = () => {
    setPaused((pp) => { pausedRef.current = !pp; if (!pp) audio.suspend(); else audio.resume(); return !pp; });
  };

  const gradeLetter = (s: number) => (s >= 85 ? 'S' : s >= 70 ? 'A' : s >= 55 ? 'B' : s >= 35 ? 'C' : 'D');
  const gradeColor = (s: number) => (s >= 85 ? 'text-lime' : s >= 55 ? 'text-cyan' : s >= 35 ? 'text-amber' : 'text-mag');

  return (
    <div className="relative h-full w-full bg-void overflow-hidden select-none">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col p-3 md:p-6 max-w-6xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="panel chamfer-sm px-4 py-2">
            <span className="panel-tag">LEVEL 3 — VOCAL ARENA</span>
            <span className="ml-3 font-display text-ink">{track.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`chamfer-sm px-3 py-1 font-ar text-sm border ${mic === 'on' ? 'text-lime border-lime/50 bg-lime/10' : mic === 'off' ? 'text-amber border-amber/50 bg-amber/10' : 'text-dim border-line'}`}>
              {mic === 'on' ? '● المايك خدّام' : mic === 'off' ? '● المايك طايح — مود الطاب' : '● كانطلبو المايك'}
            </div>
            <div className="panel chamfer-sm px-3 py-1 font-display text-sm text-cyan">{wi + 1}/{words.length}</div>
            <button onClick={togglePause} className="neon-btn chamfer-sm px-3 py-1 text-xs">{paused ? 'RESUME' : 'PAUSE'}</button>
          </div>
        </div>

        {/* word card */}
        <div key={wi} className="panel chamfer px-6 py-4 mb-3 rise flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="panel-tag">SPEAK THIS — {TRAPS[word.trap].label}</div>
            <div className="font-display text-4xl md:text-5xl text-ink text-glow-cyan leading-tight">{word.de}</div>
            <div className="text-dim">{word.ipa}</div>
          </div>
          <div className="text-right flex flex-col items-end gap-1.5" dir="rtl">
            <div className="font-ar text-3xl text-cyan leading-tight font-bold">{word.dz}</div>
            <div className="flex items-center gap-1.5 bg-lime/10 border border-lime/30 px-2.5 py-0.5 chamfer-sm">
              <span className="text-[11px] text-dim font-ar">النطق:</span>
              <span className="font-ar text-sm font-semibold text-lime">{word.phoneticAr}</span>
            </div>
          </div>
          {phase === 'grade' && score !== null && (
            <div className="text-center rise">
              <div className={`font-display text-5xl ${gradeColor(score)}`}>{gradeLetter(score)}</div>
              <div className={`font-display text-xl ${gradeColor(score)}`}>{score}</div>
            </div>
          )}
        </div>

        {/* visualizer */}
        <div className="relative flex-1 min-h-[220px] panel chamfer overflow-hidden" onPointerDown={tap}>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          {phase === 'intro' && (
            <div className="absolute inset-0 flex items-center justify-center bg-void/40">
              <div className="text-center rise">
                <div className="font-ar text-2xl text-cyan">سمع… حسّ بالپيتش</div>
                <div className="text-dim mt-1 font-ar">{analyserRef.current ? 'غنّيها فالزون الخضرا' : 'دق SPACE مع كل سيلاب كيطيح'}</div>
              </div>
            </div>
          )}
          {phase === 'live' && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 font-ar text-lg text-lime blink">
              {analyserRef.current ? '● كاتسجيل — غنّي!' : '● دق الدروب!'}
            </div>
          )}
          {phase === 'grade' && coach && (
            <div className="absolute bottom-3 left-3 right-3 rise">
              <div className="chamfer-sm bg-panel2/95 border border-cyan/30 px-4 py-2 text-[15px] md:text-base text-ink font-ar leading-relaxed text-right" dir="rtl">
                <span className="panel-tag ml-2">LADA CORE</span>{coach}
              </div>
            </div>
          )}
        </div>

        {/* mobile & click tap button */}
        <div className="mt-3">
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); tap(); }}
            disabled={phase !== 'live'}
            aria-label="دق السيلابات"
            className={`w-full py-3 px-4 chamfer-sm font-ar text-base md:text-lg font-bold transition-all flex items-center justify-center gap-2 border ${
              phase === 'live'
                ? 'bg-lime/20 border-lime text-lime shadow-[0_0_15px_rgba(182,255,46,0.35)] cursor-pointer active:scale-95'
                : 'bg-panel2/40 border-line text-dim cursor-not-allowed'
            }`}
          >
            <span>{phase === 'live' ? '⚡ دق الإيقاع دابا (TAP / SPACE)' : phase === 'intro' ? 'سْمع النُّطق أولاً...' : 'تحليل الصوت...'}</span>
          </button>
        </div>

        {/* progress + hint */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-line/60 chamfer-sm overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan to-lime transition-all duration-500"
              style={{ width: `${((wi + (phase === 'grade' ? 1 : phase === 'live' ? 0.5 : 0)) / words.length) * 100}%` }} />
          </div>
          <div className="font-display text-xs text-dim tracking-widest whitespace-nowrap">
            AVG {Object.keys(scores).length ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length) : '—'}
          </div>
        </div>
      </div>

      {finished && (
        <div className="absolute inset-0 z-40 bg-void/70 flex flex-col items-center justify-center gap-2">
          <div className="font-display text-4xl text-lime text-glow-lime rise">VOCAL RUN COMPLETE</div>
          <div className="font-ar text-xl text-dim rise">الجولة الصوتية صافية — دابا التحليل</div>
        </div>
      )}

      {paused && !finished && (
        <div className="absolute inset-0 z-50 bg-void/80 backdrop-blur-sm flex items-center justify-center">
          <div className="panel chamfer p-8 w-[min(92vw,420px)] rise text-center">
            <div className="font-display text-3xl text-cyan text-glow-cyan mb-4">PAUSED</div>
            <button onClick={togglePause} className="neon-btn chamfer-sm px-6 py-3 w-full">RESUME ARENA</button>
            <p className="text-dim text-sm mt-4 font-ar" dir="rtl">ESC / P — كمّل · SPACE — دق السيلابات</p>
          </div>
        </div>
      )}
    </div>
  );
}
