import { useEffect, useState } from 'react';
import { audio } from '../game/audio';
import { PASS_ACC, type Track, type Word } from '../game/content';
import type { HighwayResult } from './Highway';
import type { VocalResult } from './Vocal';
import type { RunVerdict } from '../game/srs';

/* ============================================================
   DEBRIEF — verdict, accuracy ring, word report, CORE feedback.
   ============================================================ */

interface Props {
  track: Track;
  mode: 'normal' | 'revenge';
  hw: HighwayResult | null;
  vocal: VocalResult | null;
  overall: number;
  verdict: RunVerdict;
  coachLines: string[];
  hasNext: boolean;
  allDone: boolean;
  onRetry: () => void;
  onRevenge: () => void;
  onNext: () => void;
  onHub: () => void;
}

export default function Results({ track, mode, hw, vocal, overall, verdict, coachLines, hasNext, allDone, onRetry, onRevenge, onNext, onHub }: Props) {
  const [ringOn, setRingOn] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setRingOn(true), 120);
    if (verdict.passed) audio.win(); else audio.lose();
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const C = 2 * Math.PI * 56;
  const wordRows: { de: string; hits: number; misses: number; vs?: number }[] = [];
  if (hw) {
    for (const [de, v] of Object.entries(hw.perWord)) wordRows.push({ de, hits: v.hit, misses: v.miss, vs: vocal?.perWord[de] });
  }
  if (vocal && hw) {
    for (const [de, sc] of Object.entries(vocal.perWord)) {
      if (!wordRows.some((r) => r.de === de)) wordRows.push({ de, hits: 0, misses: 0, vs: sc });
    }
  }

  const accColor = overall >= PASS_ACC ? '#b6ff2e' : overall >= 0.6 ? '#ffb300' : '#ff2d78';

  return (
    <div className="relative h-full w-full bg-void overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto p-3 md:p-6">
          {/* verdict header */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div>
              <div className="panel-tag">{mode === 'revenge' ? 'REVENGE PROTOCOL — DEBRIEF' : `DEBRIEF — ${track.tier} ${track.title}`}</div>
              <h2 className={`font-display text-4xl md:text-5xl rise ${verdict.passed ? 'text-lime text-glow-lime' : 'text-mag text-glow-mag'}`}>
                {verdict.passed ? (mode === 'revenge' ? 'REVENGE EXECUTED' : 'TRACK MASTERED') : 'SIGNAL LOST'}
              </h2>
              <p className="text-dim mt-1 font-ar text-right" dir="rtl">
                {verdict.passed
                  ? 'دوزتي الـ Mastery Law. الـ CORE زاد الـ stability ديال كل كلمة.'
                  : `خاص ≥85% — راك ف ${Math.round(overall * 100)}%. ${verdict.failedWords.length} كلم مشاو فالـ CRITICAL list.`}
              </p>
            </div>
            <div className="relative w-36 h-36 rise" style={{ animationDelay: '100ms' }}>
              <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#1b2b47" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={accColor} strokeWidth="8" strokeLinecap="butt"
                  strokeDasharray={C}
                  strokeDashoffset={ringOn ? C * (1 - overall) : C}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 8px ${accColor})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-3xl" style={{ color: accColor, textShadow: `0 0 14px ${accColor}` }}>{Math.round(overall * 100)}%</div>
                <div className="text-[10px] font-display tracking-widest text-dim">ACCURACY</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* stats */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="panel chamfer p-4 grid grid-cols-2 gap-3">
                {[
                  { k: 'SCORE', v: hw ? hw.score.toString() : '—', c: 'text-cyan' },
                  { k: 'MAX COMBO', v: hw ? `${hw.maxCombo}x` : '—', c: hw && hw.maxCombo >= 10 ? 'text-lime' : 'text-ink' },
                  { k: 'PERFECT', v: hw ? hw.perfect.toString() : '—', c: 'text-lime' },
                  { k: 'GOOD', v: hw ? hw.good.toString() : '—', c: 'text-cyan' },
                  { k: 'MISS', v: hw ? hw.miss.toString() : '—', c: 'text-mag' },
                  { k: 'VOCAL AVG', v: vocal ? `${Math.round(vocal.acc * 100)}%` : 'SKIPPED', c: 'text-ink' },
                ].map((s) => (
                  <div key={s.k} className="chamfer-sm border border-line bg-panel2/50 p-2.5">
                    <div className="text-[10px] font-display tracking-widest text-dim">{s.k}</div>
                    <div className={`font-display text-xl ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>
              {hw && hw.maxCombo < 10 && (
                <div className="panel chamfer p-4 text-[15px] text-dim font-ar leading-relaxed">
                  <span className="panel-tag !text-amber ml-2" style={{ color: '#ffb300' }}>COMBO LAW</span>
                  الـ Mastery كيتطلّب سلسلة كومبو 10x. الكومبو كيتبنى ملي كاتسدّ اللين الصحيحة قبل ما يوصل الـ gate.
                </div>
              )}
              <div className="panel chamfer p-4 flex-1">
                <div className="panel-tag mb-2">WORD REPORT</div>
                <div className="grid gap-1.5 max-h-64 overflow-y-auto pr-1">
                  {wordRows.map((r) => (
                    <div key={r.de} className="flex items-center justify-between gap-2 text-sm chamfer-sm border border-line/70 bg-panel2/40 px-2.5 py-1.5">
                      <span className="font-display text-ink">{r.de}</span>
                      <span className="flex items-center gap-2">
                        {r.vs !== undefined && <span className="text-dim text-xs">VOC {r.vs}</span>}
                        {r.misses === 0 && r.hits > 0 && <span className="text-lime font-display text-xs">CLEAN ×{r.hits}</span>}
                        {r.misses > 0 && <span className="text-mag font-display text-xs">✗ {r.misses}</span>}
                        {r.hits > 0 && r.misses > 0 && <span className="text-lime font-display text-xs">✓ {r.hits}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CORE feedback */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="panel chamfer p-4 md:p-5 flex-1">
                <div className="panel-tag mb-3">LADA CORE — POST-RUN ANALYSIS</div>
                <div className="grid gap-2.5">
                  {coachLines.length === 0 && <div className="text-dim blink">ANALYZING…</div>}
                  {coachLines.map((l, i) => (
                    <div key={i} className="rise chamfer-sm border border-cyan/25 bg-cyan/5 px-4 py-2.5 text-ink leading-relaxed font-ar text-[15px] text-right" dir="rtl" style={{ animationDelay: `${i * 160}ms` }}>
                      <span className="text-cyan ml-2">▸</span>{l}
                    </div>
                  ))}
                </div>
              </div>

              {allDone && (
                <div className="panel chamfer panel-lime p-5 rise text-center">
                  <div className="font-display text-3xl text-lime text-glow-lime mb-1">FLUENCY PROTOCOL COMPLETE</div>
                  <p className="text-ink font-ar text-lg" dir="rtl">مبروك أ شومبيون — كاملين mastered. دابا الألمانية كاتبدأ كاتريّڤ بالدارجة.</p>
                </div>
              )}

              {/* actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={onHub} className="neon-btn chamfer-sm px-4 py-3 text-xs">COMMAND DECK</button>
                <button onClick={onRetry} className="neon-btn chamfer-sm px-4 py-3 text-xs">RE-RUN</button>
                {verdict.revengeTriggered && mode === 'normal' && (
                  <button onClick={onRevenge} className="neon-btn neon-btn-mag chamfer-sm px-4 py-3 text-xs pulse-mag">☠ REVENGE LV</button>
                )}
                {verdict.passed && hasNext && (
                  <button onClick={onNext} className="neon-btn neon-btn-lime chamfer-sm px-4 py-3 text-xs pulse-glow">NEXT TIER ▶</button>
                )}
              </div>
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
