import { useEffect, useState } from 'react';
import { narrator, type NarratorState } from '../game/narrator';
import { audio } from '../game/audio';

/* ============================================================
   LADA — AI VOICE COMPANION HUD
   Floating cyber visualizer displaying live Darija subtitles,
   animated neon audio waves, auto-voice toggle, and replay button.
   ============================================================ */

export default function AiVoiceCompanion() {
  const [state, setState] = useState<NarratorState>(narrator.getState());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    return narrator.subscribe(setState);
  }, []);

  if (!state.subtitle && !state.speaking && !state.loading && collapsed) {
    return (
      <button
        onClick={() => { setCollapsed(false); audio.uiClick(); }}
        aria-label="Open AI Voice Companion"
        className="fixed bottom-3 right-3 z-40 neon-btn chamfer-sm px-3 py-1.5 text-xs bg-void/90 backdrop-blur-md border border-cyan/40 text-cyan flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
      >
        <span className="text-sm">🎙️</span>
        <span className="font-ar">المساعد الصوتي</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="AI Voice Companion"
      className="fixed bottom-2.5 inset-x-2.5 sm:inset-x-auto sm:right-4 sm:max-w-md z-40 select-none"
    >
      <div className="panel chamfer p-2.5 sm:p-3 bg-void/95 backdrop-blur-md border border-cyan/40 shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all duration-300">
        {/* Top bar: Status, Soundwaves, Controls */}
        <div className="flex items-center justify-between gap-2 border-b border-line/50 pb-2 mb-2">
          <div className="flex items-center gap-2">
            {/* Animated Cyber Soundwave */}
            <div className="flex items-center gap-0.5 h-4 px-1" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => {
                const isSpeaking = state.speaking;
                const isLoading = state.loading;
                const heightClass = isSpeaking
                  ? i === 2 ? 'h-4 bg-lime animate-pulse' : (i === 1 || i === 3) ? 'h-3 bg-cyan' : 'h-2 bg-cyan/70'
                  : isLoading
                  ? 'h-2 bg-amber/70 animate-bounce'
                  : 'h-1 bg-line';
                return (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${heightClass}`}
                    style={isSpeaking ? { animationDelay: `${i * 90}ms` } : undefined}
                  />
                );
              })}
            </div>

            {/* Live Voice Badge */}
            <span
              className={`text-[10px] font-mono px-2 py-0.5 chamfer-sm border ${
                state.source === 'gemini'
                  ? 'text-cyan border-cyan/50 bg-cyan/10'
                  : 'text-dim border-line/40 bg-panel2/40'
              }`}
            >
              {state.loading
                ? '✦ LOADING GEMINI VOICE...'
                : state.source === 'gemini'
                ? '✦ GEMINI LIVE 24k'
                : '✦ AI COMPANION'}
            </span>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1.5">
            {/* Auto-Voice Toggle */}
            <button
              onClick={() => {
                const next = narrator.toggleAutoVoice();
                audio.uiClick();
                if (next) narrator.replay();
              }}
              title="تفعيل أو توقيف الصوت التلقائي"
              className={`chamfer-sm px-2 py-1 text-[11px] font-ar flex items-center gap-1 border transition-colors ${
                state.autoVoice
                  ? 'border-lime/60 bg-lime/10 text-lime font-bold'
                  : 'border-line text-dim hover:text-ink'
              }`}
            >
              <span>{state.autoVoice ? '🎙️ كيهدر: شغال' : '🔇 ساكت'}</span>
            </button>

            {/* Replay Button */}
            <button
              onClick={() => {
                audio.ensure();
                narrator.replay();
                audio.uiClick();
              }}
              title="عاود سمع الشرح"
              aria-label="عاود سمع الشرح"
              className="neon-btn chamfer-sm px-2 py-1 text-[11px] font-ar flex items-center gap-1 hover:border-cyan text-ink"
            >
              <span>🔄</span>
              <span>عاود</span>
            </button>

            {/* Minimize */}
            <button
              onClick={() => { setCollapsed(true); audio.uiClick(); }}
              aria-label="تصغير المساعد"
              className="text-dim hover:text-ink text-xs px-1.5 py-0.5 rounded"
            >
              ▾
            </button>
          </div>
        </div>

        {/* Live Subtitle Area (Moroccan Darija with RTL) */}
        <div
          dir="rtl"
          className="font-ar text-xs sm:text-sm text-ink/90 leading-relaxed text-right min-h-[1.5rem] flex items-center justify-between gap-2"
        >
          <div className="flex-1">
            {state.subtitle ? (
              <span className={state.speaking ? 'text-cyan text-glow-cyan' : ''}>
                {state.subtitle}
              </span>
            ) : (
              <span className="text-dim text-[11px]">
                المساعد الصوتي واجد باش يرافقك ويشرح ليك كل خطوة بالدارجة.
              </span>
            )}
          </div>
          {state.speaking && (
            <span className="text-[10px] text-lime font-mono shrink-0 animate-pulse" dir="ltr">
              ● SPEAKING
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
