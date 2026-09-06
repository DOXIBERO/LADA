import { useState } from 'react';
import { audio } from '../game/audio';
import { TRACKS, type Track } from '../game/content';
import { A1_UNITS, type A1Unit } from '../game/a1Curriculum';
import { TIKTOK_TRACKS, type TikTokTrack } from '../game/tiktokCourses';
import TimelineRoadmap from './TimelineRoadmap';
import type { TimelineDay } from '../game/curriculumTimeline';
import { hasLiveKey } from '../game/gemini';
import { decaySnapshot, isMastered, isUnlocked, type Profile } from '../game/srs';

/* ============================================================
   LADA — COMMAND DECK & LEARNING HUB
   Primary Goethe A1 Curriculum + 30-Day Timeline Roadmap +
   TikTok Creator Masterclasses + AI Voice Roleplay Lab.
   ============================================================ */

interface Props {
  profile: Profile;
  muted: boolean;
  onToggleMute: () => void;
  onDeploy: (t: Track) => void;
  onRevenge: (t: Track) => void;
  onSelectA1Unit: (unit: A1Unit) => void;
  onStartRoleplay: (scenarioId?: string) => void;
  onStartTikTokTrack?: (trackId: string) => void;
  onSelectTimelineDay?: (day: TimelineDay) => void;
}

type HubTab = 'a1' | 'tiktok' | 'roleplay' | 'arcade';

export default function Hub({
  profile,
  muted,
  onToggleMute,
  onDeploy,
  onRevenge,
  onSelectA1Unit,
  onStartRoleplay,
  onStartTikTokTrack,
  onSelectTimelineDay,
}: Props) {
  const [hubTab, setHubTab] = useState<HubTab>('a1');
  const snap = decaySnapshot(profile, Date.now());
  const live = hasLiveKey();

  return (
    <div className="relative h-full w-full bg-void overflow-hidden flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6 w-full">
        {/* Header Bar */}
        <header className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <div className="font-display text-4xl text-ink text-glow-cyan glitch-word" data-text="LADA">LADA</div>
            <div className="font-ar text-dim text-sm hidden sm:inline">أكاديمية اللغة الألمانية للمغاربة — Goethe A1</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`chamfer-sm px-3 py-1.5 font-ar text-xs md:text-sm border ${live ? 'text-lime border-lime/50 bg-lime/10' : 'text-amber border-amber/50 bg-amber/10'}`}>
              ✦ AI {live ? 'LIVE GEMINI' : 'LOCAL CORE'}
            </div>
            <div className="chamfer-sm px-3 py-1.5 font-display text-amber border border-line text-sm shadow-[0_0_10px_rgba(255,179,0,0.5)]">
              {profile.xp} XP
            </div>
            <button
              onClick={() => { onToggleMute(); audio.uiClick(); }}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="neon-btn chamfer-sm px-3 py-1.5 text-xs"
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </header>

        {/* Section Navigation Switcher */}
        <div className="flex items-center gap-2 border-b border-line/70 pb-3 mb-4 overflow-x-auto">
          <button
            onClick={() => { audio.uiClick(); setHubTab('a1'); }}
            className={`chamfer-sm px-4 py-2 text-xs md:text-sm font-ar font-bold flex items-center gap-2 border transition-all shrink-0 ${
              hubTab === 'a1'
                ? 'border-cyan bg-cyan/15 text-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'border-line/60 text-dim hover:text-ink'
            }`}
          >
            <span>🎓</span>
            <span>مسار Goethe A1 المعتمد</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan/20 text-cyan">5 وحدات</span>
          </button>

          <button
            onClick={() => { audio.uiClick(); setHubTab('tiktok'); }}
            className={`chamfer-sm px-4 py-2 text-xs md:text-sm font-ar font-bold flex items-center gap-2 border transition-all shrink-0 ${
              hubTab === 'tiktok'
                ? 'border-amber bg-amber/15 text-amber shadow-[0_0_15px_rgba(255,179,0,0.25)]'
                : 'border-line/60 text-dim hover:text-ink'
            }`}
          >
            <span>📱</span>
            <span>دورات التيك توك & ألماني الشارع</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber/20 text-amber animate-pulse">NEW ✦ 6 مسارات</span>
          </button>

          <button
            onClick={() => { audio.uiClick(); setHubTab('roleplay'); }}
            className={`chamfer-sm px-4 py-2 text-xs md:text-sm font-ar font-bold flex items-center gap-2 border transition-all shrink-0 ${
              hubTab === 'roleplay'
                ? 'border-mag bg-mag/15 text-mag shadow-[0_0_15px_rgba(255,45,120,0.25)]'
                : 'border-line/60 text-dim hover:text-ink'
            }`}
          >
            <span>🎙️</span>
            <span>مختبر المحادثة الذكية (Roleplay)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-mag/20 text-mag">LIVE</span>
          </button>

          <button
            onClick={() => { audio.uiClick(); setHubTab('arcade'); }}
            className={`chamfer-sm px-4 py-2 text-xs md:text-sm font-ar flex items-center gap-2 border transition-all shrink-0 ${
              hubTab === 'arcade'
                ? 'border-lime bg-lime/15 text-lime shadow-[0_0_15px_rgba(182,255,46,0.25)]'
                : 'border-line/60 text-dim hover:text-ink'
            }`}
          >
            <span>🕹️</span>
            <span>ألعاب الآركيد الإيقاعية (Highway)</span>
            <span className="text-[10px] font-mono text-dim">اختياري</span>
          </button>
        </div>

        {/* ============================================================
            SECTION 1: GOETHE A1 LEARNING PATH & 30-DAY TIMELINE
           ============================================================ */}
        {hubTab === 'a1' && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-6 pb-6">
            {/* Visual 30-Day Goethe A1 Learning Timeline Roadmap */}
            <TimelineRoadmap
              onSelectDay={(day) => {
                if (onSelectTimelineDay) {
                  onSelectTimelineDay(day);
                } else {
                  const targetUnit = A1_UNITS.find((u) => u.id === day.unitId) ?? A1_UNITS[0];
                  onSelectA1Unit(targetUnit);
                }
              }}
              currentDay={1}
            />

            {/* Units Overview Header */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-700/60 flex-wrap" dir="rtl">
              <div>
                <h3 className="font-ar text-base md:text-lg font-bold text-white">
                  الوحدات الخمسة الشاملة (Goethe A1 Core Units)
                </h3>
                <p className="font-ar text-xs text-dim">
                  دروس منظمة مع البطاقات التفاعلية (Active Recall)، القواعد بالدارجة، تركيب الجمل، والفهم الشفهي.
                </p>
              </div>
              <button
                onClick={() => { audio.uiOpen(); onStartRoleplay('restaurant'); }}
                className="neon-btn neon-btn-mag chamfer-sm px-4 py-2 text-xs font-ar font-bold flex items-center gap-1.5 shrink-0"
              >
                <span>🎙️</span>
                <span>تدرب على المحادثة الحية</span>
              </button>
            </div>

            {A1_UNITS.map((unit) => (
              <div
                key={unit.id}
                className="panel chamfer p-4 md:p-5 rise flex items-center justify-between gap-4 flex-wrap md:flex-nowrap border-line/70 hover:border-cyan/50 transition-all"
              >
                {/* Unit Number Badge */}
                <div className="flex flex-col items-center justify-center w-14 shrink-0 text-center border-r border-line/40 pr-3">
                  <span className="font-display text-3xl font-bold text-cyan text-glow-cyan">
                    {unit.number}
                  </span>
                  <span className="text-[10px] font-mono text-dim tracking-wider">UNIT</span>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h3 className="font-ar text-xl md:text-2xl font-bold text-ink" dir="rtl">{unit.titleDz}</h3>
                    <span className="font-display text-xs px-2 py-0.5 rounded bg-panel2 border border-line text-cyan font-bold">
                      {unit.titleDe}
                    </span>
                    <span className="chamfer-sm bg-cyan/10 border border-cyan/30 text-cyan px-2 py-0.5 text-[10px] font-mono">
                      {unit.badge}
                    </span>
                  </div>
                  <p className="font-ar text-dim text-xs md:text-sm line-clamp-1 mb-2" dir="rtl">{unit.descDz}</p>
                  <div className="flex items-center gap-3 text-xs text-dim font-mono">
                    <span>{unit.words.length} WORDS</span>
                    <span>·</span>
                    <span>{unit.sentenceExercises.length} SATZBAU</span>
                    <span>·</span>
                    <span>{unit.listeningExercises.length} HÖRVERSTEHEN</span>
                  </div>
                </div>

                {/* Launch Unit Button */}
                <div className="shrink-0 ml-auto">
                  <button
                    onClick={() => { audio.ensure(); audio.uiOpen(); onSelectA1Unit(unit); }}
                    className="neon-btn neon-btn-cyan chamfer px-6 py-3 text-sm md:text-base font-ar font-bold flex items-center gap-2"
                  >
                    <span>📖</span>
                    <span>ادخل للدرس</span>
                    <span>◀</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================
            SECTION 2: AI VOICE ROLEPLAY LAB
           ============================================================ */}
        {hubTab === 'roleplay' && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 pb-6">
            <div className="panel chamfer p-5 bg-mag/10 border-mag/40" dir="rtl">
              <h2 className="font-ar text-xl font-bold text-mag text-glow-mag mb-2">
                مختبر المحادثة الصوتية التفاعلية (AI Roleplay Studio)
              </h2>
              <p className="font-ar text-sm text-ink/90 leading-relaxed max-w-2xl">
                هنا فين كتدرب على الهضرة الحقيقية بالألمانية مع المساعد الذكي. هو كيهدر معاك بصوت حقيقي وكيصحح ليك أي غلطة ف القواعد بالدارجة المغربية فوراً!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'restaurant',
                  icon: '🍽️',
                  titleDe: 'Im Restaurant / Dönerladen',
                  titleDz: 'فالمطعم ومحل الدونر',
                  desc: 'طلب الماكلة، سكر ف القهوة، واطلب لاضيسيون مع البوربوار.',
                },
                {
                  id: 'bahn',
                  icon: '🚆',
                  titleDe: 'Am Hauptbahnhof (DB)',
                  titleDz: 'ف محطة القطار ومكتب التذاكر',
                  desc: 'شراء تذكرة التران ل فرانكفورت والسؤال على رصيف Gleis.',
                },
                {
                  id: 'buergeramt',
                  icon: '🏛️',
                  titleDe: 'Beim Bürgeramt (Anmeldung)',
                  titleDz: 'ف البلدية لتسجيل السكن',
                  desc: 'تسجيل السكنى ف ألمانيا، الباسبور وورقة مول الدار.',
                },
                {
                  id: 'ausbildung',
                  icon: '💼',
                  titleDe: 'Ausbildung Vorstellungsgespräch',
                  titleDz: 'مقابلة التكوين المهني',
                  desc: 'تقديم النفس، الخبرة السابقة، والحماس للخدمة ف ألمانيا.',
                },
                {
                  id: 'freetalk',
                  icon: '💬',
                  titleDe: 'Freies Gespräch mit LADA AI',
                  titleDz: 'محادثة حرة ومفتوحة',
                  desc: 'تكلم ف أي موضوع بغيتي، سول على أي كلمة وشات بالصوت.',
                },
              ].map((sc) => (
                <div key={sc.id} className="panel chamfer p-5 border-line/70 flex flex-col justify-between hover:border-mag/50 transition-colors">
                  <div>
                    <div className="text-3xl mb-2">{sc.icon}</div>
                    <div className="flex items-baseline gap-2 mb-1" dir="ltr">
                      <span className="font-display text-base font-bold text-ink">{sc.titleDe}</span>
                    </div>
                    <h3 className="font-ar text-lg font-bold text-cyan mb-2" dir="rtl">{sc.titleDz}</h3>
                    <p className="font-ar text-xs md:text-sm text-dim leading-relaxed" dir="rtl">{sc.desc}</p>
                  </div>
                  <button
                    onClick={() => { audio.ensure(); audio.uiOpen(); onStartRoleplay(sc.id); }}
                    className="mt-4 neon-btn neon-btn-mag chamfer py-2 text-xs font-ar font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>🎙️</span>
                    <span>بدا المحادثة دابا</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            SECTION: TIKTOK CREATOR MASTERCLASSES & STREET GERMAN
           ============================================================ */}
        {hubTab === 'tiktok' && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 pb-6">
            <div className="panel chamfer p-4 bg-amber/5 border-amber/30 flex items-center justify-between gap-3 flex-wrap" dir="rtl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-ar text-base md:text-lg font-bold text-ink">
                    دورات التيك توك & ألماني الشارع (TikTok Creator Academy)
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber/20 text-amber font-bold animate-pulse">
                    VIRAL ⚡
                  </span>
                </div>
                <p className="font-ar text-xs md:text-sm text-dim leading-relaxed">
                  تحليل مستوحى من أشهر قنوات تيك توك لتعلم الألمانية (@easygerman, @doctor.german, @germanwithsarahx, @deutschlernen02...). مقارنات حية بين ألماني الكتوبة وألماني الزنقة!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIKTOK_TRACKS.map((track) => {
                const colorBorder =
                  track.color === 'cyan'
                    ? 'border-cyan/50 hover:border-cyan'
                    : track.color === 'mag'
                    ? 'border-mag/50 hover:border-mag'
                    : track.color === 'lime'
                    ? 'border-lime/50 hover:border-lime'
                    : 'border-amber/50 hover:border-amber';

                const badgeColor =
                  track.color === 'cyan'
                    ? 'bg-cyan/10 text-cyan border-cyan/40'
                    : track.color === 'mag'
                    ? 'bg-mag/10 text-mag border-mag/40'
                    : track.color === 'lime'
                    ? 'bg-lime/10 text-lime border-lime/40'
                    : 'bg-amber/10 text-amber border-amber/40';

                return (
                  <div
                    key={track.id}
                    className={`panel chamfer p-5 bg-panel/90 border transition-all flex flex-col justify-between ${colorBorder}`}
                  >
                    <div>
                      {/* Badge & Creator Style */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border ${badgeColor}`}>
                          {track.badge}
                        </span>
                        <span className="text-[11px] font-mono text-dim">
                          {track.lessons.length} كبسولات تفاعلية
                        </span>
                      </div>

                      {/* Titles */}
                      <h3 className="font-ar text-lg md:text-xl font-bold text-ink mb-1 text-right" dir="rtl">
                        {track.titleDz}
                      </h3>
                      <div className="font-display text-sm text-dim mb-2 text-right" dir="ltr">
                        {track.titleDe}
                      </div>

                      {/* Creator attribution */}
                      <div className="chamfer-sm bg-panel2/70 border border-line/40 px-2.5 py-1 text-xs font-mono text-cyan mb-3 text-right" dir="rtl">
                        👨‍🏫 <span className="text-dim">مستوحى من:</span> <span className="font-bold">{track.creatorStyle}</span>
                      </div>

                      {/* Description */}
                      <p className="font-ar text-xs md:text-sm text-dim leading-relaxed text-right" dir="rtl">
                        {track.descriptionDz}
                      </p>
                    </div>

                    {/* Launch Button */}
                    <button
                      onClick={() => {
                        audio.ensure();
                        audio.uiOpen();
                        if (onStartTikTokTrack) {
                          onStartTikTokTrack(track.id);
                        }
                      }}
                      className="mt-5 neon-btn neon-btn-amber chamfer py-2.5 text-xs md:text-sm font-ar font-bold flex items-center justify-center gap-2"
                    >
                      <span>▶</span>
                      <span>ابدأ هاد المسار التفاعلي</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            SECTION 3: OPTIONAL ARCADE DRILLS (HIGHWAY & VOCAL)
           ============================================================ */}
        {hubTab === 'arcade' && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid content-start gap-3.5 pb-6">
            <div className="panel chamfer p-4 bg-panel2/60 border-line/60 flex items-center justify-between gap-3" dir="rtl">
              <div>
                <span className="font-ar text-sm font-bold text-ink">ألعاب الآركيد الإيقاعية (اختيارية):</span>
                <p className="font-ar text-xs text-dim">
                  لعبة السريع وتدريب الذاكرة على الريتم السريع للكلمات. دوز ليها وقتما بغيتي تلعب.
                </p>
              </div>
            </div>

            {TRACKS.map((t) => {
              const unlocked = isUnlocked(profile, t);
              const mastered = isMastered(profile, t);
              const best = profile.tracks[t.id]?.best ?? 0;
              const revenge = profile.revenge.includes(t.id);
              return (
                <div
                  key={t.id}
                  className={`panel chamfer p-4 md:p-5 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap border-line/70 transition-all ${
                    revenge ? 'panel-mag border-mag/50' : mastered ? 'panel-lime border-lime/50' : ''
                  }`}
                >
                  <div className="flex flex-col items-center justify-center w-12 shrink-0 text-center border-r border-line/40 pr-3">
                    <span className="font-display text-xl font-bold text-dim">{t.num}</span>
                    <span className="text-[10px] font-mono text-dim">BPM {t.bpm}</span>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-ar text-xl font-bold text-ink" dir="rtl">{t.title}</span>
                      <span className="font-display text-xs text-cyan font-semibold">({t.titleDe})</span>
                    </div>
                    <div className="font-ar text-dim text-xs" dir="rtl">{t.goal}</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-auto">
                    {best > 0 && (
                      <div className="font-display text-sm text-dim">
                        BEST: <span className="text-lime font-bold">{Math.round(best * 100)}%</span>
                      </div>
                    )}
                    {unlocked && (
                      <button
                        onClick={() => { audio.ensure(); audio.uiOpen(); onDeploy(t); }}
                        className="neon-btn neon-btn-lime chamfer px-5 py-2 text-xs font-ar font-bold flex items-center gap-1.5"
                      >
                        <span>🕹️</span>
                        <span>لعب Highway</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Compact SRS Memory Bar */}
        {snap.weakest.length > 0 && (
          <footer className="border-t border-line/60 pt-2.5 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="font-ar text-dim shrink-0">الذاكرة التكرارية (SRS):</span>
            {snap.weakest.slice(0, 5).map((e) => (
              <span key={e.de} className={`chamfer-sm px-2 py-0.5 font-ar text-[11px] border shrink-0 ${e.critical ? 'text-mag border-mag/50 bg-mag/10' : 'text-dim border-line'}`}>
                {e.de} · {Math.round(e.R * 100)}%
              </span>
            ))}
          </footer>
        )}
      </div>
    </div>
  );
}
