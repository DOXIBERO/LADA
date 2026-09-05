import { audio } from '../game/audio';
import { TRACKS, type Track } from '../game/content';
import { hasLiveKey } from '../game/gemini';
import { decaySnapshot, isMastered, isUnlocked, type Profile } from '../game/srs';

/* ============================================================
   COMMAND DECK — a clean A0 learning path.
   One lesson at a time, big obvious actions, live AI status.
   ============================================================ */

interface Props {
  profile: Profile;
  muted: boolean;
  onToggleMute: () => void;
  onDeploy: (t: Track) => void;
  onRevenge: (t: Track) => void;
}

export default function Hub({ profile, muted, onToggleMute, onDeploy, onRevenge }: Props) {
  const snap = decaySnapshot(profile, Date.now());
  const masteredCount = TRACKS.filter((t) => isMastered(profile, t)).length;
  const nextIdx = TRACKS.findIndex((t) => isUnlocked(profile, t) && !isMastered(profile, t));
  const live = hasLiveKey();

  return (
    <div className="relative h-full w-full bg-void overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* header */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <div className="font-display text-4xl text-ink text-glow-cyan glitch-word" data-text="LADA">LADA</div>
            <div className="font-ar text-dim text-sm">تعلّم الألمانية بالدارجة — من الصفر</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`chamfer-sm px-3 py-1.5 font-ar text-sm border ${live ? 'text-lime border-lime/50 bg-lime/10' : 'text-amber border-amber/50 bg-amber/10'}`}>
              ✦ AI {live ? 'LIVE' : 'CORE'}
            </div>
            <div className="chamfer-sm px-3 py-1.5 font-display text-amber border border-line text-sm" style={{ textShadow: '0 0 10px rgba(255,179,0,0.7)' }}>
              {profile.xp} XP
            </div>
            <button onClick={() => { onToggleMute(); audio.uiClick(); }} className="neon-btn chamfer-sm px-3 py-1.5 text-xs">
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* progress strip */}
        <div className="chamfer panel px-5 py-3 mb-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="font-ar text-lg text-ink" dir="rtl">
            التقدّم: <span className="text-cyan font-bold">{masteredCount}</span> من <span className="text-ink font-bold">{TRACKS.length}</span> دروس
            <span className="text-xs text-dim font-mono mr-2">({Math.round((masteredCount / TRACKS.length) * 100)}%)</span>
          </div>
          <div className="flex-1 min-w-[160px] h-2.5 bg-line/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan to-lime transition-all duration-700"
              style={{ width: `${(masteredCount / TRACKS.length) * 100}%`, boxShadow: '0 0 10px rgba(0,240,255,0.6)' }}
            />
          </div>
          {snap.critical > 0 && (
            <div className="font-ar text-mag critical-blink text-sm" dir="rtl">
              ⚠ <span className="font-bold">{snap.critical}</span> فالـ decay
            </div>
          )}
        </div>

        {/* learning path */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid content-start gap-3.5 pb-4">
          {TRACKS.map((t, i) => {
            const unlocked = isUnlocked(profile, t);
            const mastered = isMastered(profile, t);
            const best = profile.tracks[t.id]?.best ?? 0;
            const revenge = profile.revenge.includes(t.id);
            const isNext = i === nextIdx;
            return (
              <div
                key={t.id}
                className={`panel chamfer p-4 md:p-5 rise flex items-center justify-between gap-4 flex-wrap md:flex-nowrap transition-all duration-200
                  ${revenge ? 'panel-mag border-mag/50' : mastered ? 'panel-lime border-lime/50' : 'border-line'}
                  ${isNext ? 'ring-1 ring-cyan/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : ''} ${!unlocked ? 'opacity-50' : ''}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* number & tier */}
                <div className="flex flex-col items-center justify-center w-14 shrink-0 text-center border-r border-line/40 pr-3">
                  <span className={`font-display text-2xl font-bold ${mastered ? 'text-lime' : unlocked ? 'text-cyan' : 'text-dim'}`}>
                    {t.num}
                  </span>
                  <span className="text-[10px] font-mono text-dim tracking-wider">A0</span>
                </div>

                {/* main content */}
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <span className="font-ar text-2xl font-bold text-ink" dir="rtl">{t.title}</span>
                    <bdi className="font-display text-cyan text-sm px-2 py-0.5 rounded bg-cyan/10 border border-cyan/25 font-semibold tracking-wider">
                      {t.titleDe}
                    </bdi>
                    {mastered && (
                      <span className="chamfer-sm bg-lime/15 border border-lime/60 text-lime px-2 py-0.5 text-[11px] font-ar font-semibold">
                        متقن ✓
                      </span>
                    )}
                    {revenge && (
                      <span className="chamfer-sm bg-mag/20 border border-mag/70 text-mag px-2 py-0.5 text-[11px] font-ar pulse-mag font-semibold">
                        Revenge ☠
                      </span>
                    )}
                    {isNext && !mastered && (
                      <span className="chamfer-sm bg-cyan/15 border border-cyan/60 text-cyan px-2 py-0.5 text-[11px] font-ar font-semibold">
                        كمّل من هنا
                      </span>
                    )}
                  </div>
                  <div className="font-ar text-dim text-sm line-clamp-1" dir="rtl">{t.goal}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-dim/80 font-mono">
                    <span>{t.words.length} WORDS</span>
                    <span>·</span>
                    <span>{t.bpm} BPM</span>
                  </div>
                </div>

                {/* action & best */}
                <div className="flex items-center gap-3 shrink-0 ml-auto">
                  {best > 0 && (
                    <div className="text-right pr-2">
                      <div className="font-display text-[10px] text-dim tracking-wider">BEST</div>
                      <div className={`font-display text-xl font-bold ${best >= 0.85 ? 'text-lime text-glow-lime' : 'text-amber'}`}>
                        {Math.round(best * 100)}%
                      </div>
                    </div>
                  )}
                  {unlocked ? (
                    revenge ? (
                      <button
                        onClick={() => { audio.ensure(); audio.alarm(); onRevenge(t); }}
                        className="neon-btn neon-btn-mag chamfer px-6 py-3 text-base font-ar font-bold flex items-center gap-1.5"
                      >
                        <span>☠</span>
                        <span>Revenge</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => { audio.ensure(); audio.uiOpen(); onDeploy(t); }}
                        className="neon-btn neon-btn-lime chamfer px-7 py-3 text-lg font-ar font-bold pulse-glow flex items-center gap-1.5"
                      >
                        <span>▶</span>
                        <span>ابدأ</span>
                      </button>
                    )
                  ) : (
                    <div className="chamfer-sm border border-line/60 bg-panel2/60 px-3.5 py-2 flex items-center gap-2 font-ar text-xs text-dim">
                      <span className="text-sm">🔒</span>
                      <span>مقفول</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* weakest words (compact) */}
        {snap.weakest.length > 0 && (
          <div className="border-t border-line pt-3 flex items-center gap-3 flex-wrap">
            <span className="font-ar text-dim text-sm shrink-0">الذاكرة الحية:</span>
            {snap.weakest.slice(0, 6).map((e) => (
              <span key={e.de} className={`chamfer-sm px-2.5 py-1 font-ar text-sm border ${e.critical ? 'text-mag border-mag/50 bg-mag/10' : 'text-dim border-line'}`}>
                {e.de} · {Math.round(e.R * 100)}%
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
