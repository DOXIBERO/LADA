import { audio } from '../game/audio';
import { TRACKS, type Track } from '../game/content';
import { decaySnapshot, isMastered, isUnlocked, type Profile } from '../game/srs';

/* ============================================================
   COMMAND DECK — track roster, sentient memory status,
   revenge protocol banners.
   ============================================================ */

interface Props {
  profile: Profile;
  muted: boolean;
  onToggleMute: () => void;
  onDeploy: (t: Track) => void;
  onRevenge: (t: Track) => void;
}

export default function Hub({ profile, muted, onToggleMute, onDeploy, onRevenge }: Props) {
  const now = Date.now();
  const snap = decaySnapshot(profile, now);

  return (
    <div className="relative h-full w-full bg-void overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col max-w-7xl mx-auto p-3 md:p-6">
        {/* top strip */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="font-display text-3xl text-ink text-glow-cyan glitch-word" data-text="LADA">LADA</div>
            <div className="panel-tag hidden sm:block">COMMAND DECK</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="panel chamfer-sm px-3 py-1.5">
              <span className="panel-tag mr-2">XP</span>
              <span className="font-display text-amber" style={{ textShadow: '0 0 10px rgba(255,179,0,0.7)' }}>{profile.xp}</span>
            </div>
            <div className="panel chamfer-sm px-3 py-1.5">
              <span className="panel-tag mr-2">RUNS</span>
              <span className="font-display text-ink">{profile.runs}</span>
            </div>
            <div className="panel chamfer-sm px-3 py-1.5">
              <span className="panel-tag mr-2">CORE</span>
              <span className="font-display text-lime text-xs">ON-DEVICE</span>
            </div>
            <button onClick={() => { onToggleMute(); audio.uiClick(); }} className="neon-btn chamfer-sm px-3 py-1.5 text-xs">
              {muted ? 'SOUND OFF' : 'SOUND ON'}
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* memory bank */}
          <div className="lg:col-span-5 flex flex-col min-h-0 gap-4">
            <div className="panel chamfer p-4 flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="panel-tag">SENTIENT MEMORY — SRS DECAY</div>
                <div className="text-xs font-display tracking-widest">
                  <span className="text-dim">{snap.total} WORDS</span>
                  {snap.critical > 0 && <span className="text-mag ml-2 critical-blink">● {snap.critical} CRITICAL</span>}
                </div>
              </div>
              {snap.weakest.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border border-cyan/40" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-cyan radar-sweep" />
                  </div>
                  <p className="text-dim max-w-[280px] font-ar leading-relaxed">
                    الميموار خاوية. دوز على شي طراك — كل إصابة و كل غلطة كاتخزّن هنا، و كات-ديكاي بـ <span className="text-cyan" dir="ltr">R = e^(−Δt/S)</span>.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-1 grid content-start gap-2">
                  {snap.weakest.map((e) => (
                    <div key={e.de} className={`chamfer-sm border px-3 py-2 ${e.critical ? 'border-mag/50 bg-mag/5' : 'border-line bg-panel2/50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-ink text-sm">{e.de}</span>
                        <span className="flex items-center gap-2">
                          {e.critical && <span className="text-[10px] font-display tracking-widest text-mag critical-blink">CRITICAL_DECAY</span>}
                          <span className={`font-display text-sm ${e.R >= 0.7 ? 'text-lime' : e.R >= 0.4 ? 'text-amber' : 'text-mag'}`}>
                            {Math.round(e.R * 100)}%
                          </span>
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 bg-line/60">
                        <div
                          className="h-full transition-all duration-700"
                          style={{
                            width: `${Math.max(3, e.R * 100)}%`,
                            background: e.R >= 0.7 ? '#b6ff2e' : e.R >= 0.4 ? '#ffb300' : '#ff2d78',
                            boxShadow: `0 0 8px ${e.R >= 0.7 ? '#b6ff2e' : e.R >= 0.4 ? '#ffb300' : '#ff2d78'}`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-dim mt-1">
                        <span>{e.st.ok}✓ / {e.st.fail}✗</span>
                        <span>S = {(e.st.S / 3600000).toFixed(1)}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="panel chamfer p-4">
              <div className="panel-tag mb-2">CONTROL SCHEME</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm font-ar">
                <div className="text-dim">القيادة فالأوتوبان</div><div className="text-ink font-semibold" dir="ltr">◀ ▶ / A D</div>
                <div className="text-dim">الطاب ديال الصوت</div><div className="text-ink font-semibold">SPACE</div>
                <div className="text-dim">الوقفة</div><div className="text-ink font-semibold">ESC / P</div>
                <div className="text-dim">قانون الفتح</div><div className="text-lime font-semibold" dir="ltr">≥85% ACC</div>
              </div>
            </div>
          </div>

          {/* track roster */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
            {TRACKS.map((t, i) => {
              const unlocked = isUnlocked(profile, t);
              const mastered = isMastered(profile, t);
              const best = profile.tracks[t.id]?.best ?? 0;
              const revenge = profile.revenge.includes(t.id);
              return (
                <div key={t.id} className={`panel chamfer p-4 md:p-5 rise ${revenge ? 'panel-mag' : mastered ? 'panel-lime' : ''}`} style={{ animationDelay: `${i * 90}ms` }}>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-display text-xs tracking-widest text-dim">{t.tier}</span>
                        {mastered && <span className="chamfer-sm bg-lime/10 border border-lime/50 text-lime px-2 py-0.5 text-[10px] font-display tracking-widest">MASTERED</span>}
                        {revenge && <span className="chamfer-sm bg-mag/15 border border-mag/60 text-mag px-2 py-0.5 text-[10px] font-display tracking-widest pulse-mag">REVENGE WAITING</span>}
                      </div>
                      <div className="font-display text-2xl md:text-3xl text-ink leading-tight">
                        {t.title}
                        <span className="ml-3 font-ar text-dim text-base">{t.tagline}</span>
                      </div>
                      <div className="text-dim text-sm mt-0.5 font-ar">{t.words.length} كلمات · {t.bpm} BPM · الفخاخ: {t.words.filter((w, ix) => t.words.findIndex((x) => x.trap === w.trap) === ix).length} أنواع</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="w-36">
                        <div className="flex justify-between text-[11px] font-display tracking-widest mb-1">
                          <span className="text-dim">BEST</span>
                          <span className={best >= 0.85 ? 'text-lime' : best > 0 ? 'text-amber' : 'text-dim'}>{best ? `${Math.round(best * 100)}%` : '—'}</span>
                        </div>
                        <div className="h-1.5 bg-line/60">
                          <div className="h-full bg-cyan transition-all duration-700" style={{ width: `${best * 100}%`, boxShadow: '0 0 8px rgba(0,240,255,0.6)' }} />
                        </div>
                      </div>
                      {unlocked ? (
                        <div className="flex gap-2">
                          {revenge && (
                            <button onClick={() => { audio.ensure(); audio.alarm(); onRevenge(t); }} className="neon-btn neon-btn-mag chamfer-sm px-4 py-2 text-xs">
                              ☠ REVENGE
                            </button>
                          )}
                          <button onClick={() => { audio.ensure(); audio.uiOpen(); onDeploy(t); }} className="neon-btn chamfer-sm px-5 py-2 text-xs">
                            DEPLOY ▶
                          </button>
                        </div>
                      ) : (
                        <div className="text-dim text-sm font-ar border border-line px-4 py-2 chamfer-sm">
                          مسدود — دوز {TRACKS[i - 1].title} ب 85%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="panel chamfer p-4 text-[15px] text-dim leading-relaxed font-ar">
              <span className="panel-tag ml-2">DOCTRINE · المذهب</span>
              التطبيقات التقليدية بطيئة و مملة. اللغة هي <span className="text-cyan">ريتم</span>، <span className="text-mag">فونيتيك</span> و <span className="text-lime">ريفليكس لاواعي</span>.
              غلط ف 3 كلمات ولا طيح تحت 85% — و الـ CORE كيصوّب ليك <span className="text-mag">Boss Revenge Track</span> من أضعف الكلمات ديالك، و الـ BPM كايطلع.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
