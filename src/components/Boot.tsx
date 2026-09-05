import { useEffect, useState } from 'react';
import { audio } from '../game/audio';
import { ALL_WORDS } from '../game/content';

/* ============================================================
   BOOT — cold start of the LADA rig.
   ============================================================ */

const BOOT_LINES = [
  { label: 'LADA CORE v2.6', status: 'ONLINE', color: '#b6ff2e' },
  { label: 'DARIJA LEXICON — 24 MORPHEMES', status: 'LOADED', color: '#00f0ff' },
  { label: 'PHONETIC TRAP ENGINE — 19 TRAPS', status: 'ARMED', color: '#ff2d78' },
  { label: 'WEB AUDIO DSP — 0MS LATENCY', status: 'SYNCED', color: '#00f0ff' },
  { label: 'BEAT CLOCK — DETERMINISTIC', status: 'LOCKED', color: '#b6ff2e' },
  { label: 'SENTIENT MEMORY — SRS DECAY', status: 'WATCHING', color: '#ffb300' },
  { label: 'CLOUD UPLINK', status: 'BYPASSED → CORE ON-DEVICE', color: '#6d87ad' },
];

export default function Boot({ onStart }: { onStart: () => void }) {
  const [lines, setLines] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLines((n) => {
        if (n >= BOOT_LINES.length) { window.clearInterval(id); return n; }
        audio.init();
        if (audio.ready) audio.uiClick();
        return n + 1;
      });
    }, 320);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { audio.ensure(); audio.uiOpen(); onStart(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.clearInterval(id); window.removeEventListener('keydown', onKey); };
  }, [onStart]);

  const ticker = ALL_WORDS.map((w) => `${w.de.toUpperCase()} = ${w.dz.toUpperCase()}`).join('   ▪   ');

  return (
    <div className="relative h-full w-full bg-void overflow-hidden select-none">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="absolute inset-x-0 top-1/3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,45,120,0.8), transparent)', boxShadow: '0 0 24px rgba(255,45,120,0.5)' }}
      />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          {/* wordmark */}
          <div className="lg:col-span-7">
            <div className="panel-tag mb-3 flicker">◢ MOROCCAN GERMAN PROTOCOL // BUILD 2.6.0</div>
            <h1
              className="glitch-word font-display text-[22vw] sm:text-9xl lg:text-[10rem] leading-[0.9] text-ink text-glow-cyan"
              data-text="LADA"
            >
              LADA
            </h1>
            <p className="font-display text-lg md:text-2xl text-cyan tracking-[0.2em] mt-4">
              DARIJA <span className="text-mag">⟶</span> DEUTSCH
            </p>
            <p className="text-dim text-lg md:text-xl mt-2 max-w-xl leading-snug">
              T3allem l-Almaniya b darija — <span className="text-ink">rhythm, phonetics, w reflex</span>.
              Studio → Highway → Vocal Arena. Ghalta dyalek l-youm hiya l-boss level dyal ghedda.
            </p>
            <button
              onClick={() => { audio.ensure(); audio.uiOpen(); onStart(); }}
              className="neon-btn neon-btn-lime chamfer mt-8 px-10 py-4 text-lg pulse-glow"
            >
              ▶ INITIALIZE <span className="blink ml-2">_</span>
            </button>
            <p className="text-dim text-sm mt-3 tracking-widest">PRESS ENTER TO BOOT</p>
          </div>

          {/* diagnostics */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="panel chamfer p-5">
              <div className="panel-tag mb-3">SYSTEM DIAGNOSTICS</div>
              <div className="grid gap-2 font-body text-sm">
                {BOOT_LINES.slice(0, lines).map((l) => (
                  <div key={l.label} className="flex items-center justify-between gap-3 rise">
                    <span className="text-dim">{l.label}</span>
                    <span className="font-display text-xs tracking-widest whitespace-nowrap" style={{ color: l.color, textShadow: `0 0 10px ${l.color}` }}>
                      ● {l.status}
                    </span>
                  </div>
                ))}
                {lines < BOOT_LINES.length && <div className="text-cyan blink">▮</div>}
              </div>
            </div>

            <div className="panel chamfer p-5">
              <div className="panel-tag mb-3">CONTROL SCHEME</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-dim">Steer lanes</div><div className="text-ink font-semibold">◀ ▶ / A D</div>
                <div className="text-dim">Vocal tap</div><div className="text-ink font-semibold">SPACE</div>
                <div className="text-dim">Pause</div><div className="text-ink font-semibold">ESC / P</div>
                <div className="text-dim">Mastery law</div><div className="text-lime font-semibold">≥85% + 10x COMBO</div>
              </div>
            </div>
          </div>
        </div>

        {/* vocab ticker */}
        <div className="relative border-t border-line py-2 overflow-hidden mb-2">
          <div className="ticker-track whitespace-nowrap font-display text-sm text-dim tracking-[0.25em] w-max">
            <span className="pr-10">{ticker}</span>
            <span className="pr-10">{ticker}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
