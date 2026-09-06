import { useState } from 'react';
import { TIMELINE_STAGES, TIMELINE_DAYS, type TimelineDay, type TimelineStage } from '../game/curriculumTimeline';
import { audio } from '../game/audio';

/* ============================================================
   LADA — 30-DAY GOETHE A1 VISUAL TIMELINE ROADMAP
   Interactive stepping-stone path with daily milestones,
   stage checkpoints, and motivating progress metrics.
   ============================================================ */

interface Props {
  onSelectDay: (day: TimelineDay) => void;
  currentDay?: number;
}

export default function TimelineRoadmap({ onSelectDay, currentDay = 1 }: Props) {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set([1]));

  const stageDays = TIMELINE_DAYS.filter((d) => d.stageId === activeStageId);
  const activeStage = TIMELINE_STAGES.find((s) => s.id === activeStageId) ?? TIMELINE_STAGES[0];
  const totalCompleted = completedDays.size;
  const progressPercent = Math.round((totalCompleted / TIMELINE_DAYS.length) * 100);

  const currentDayData = TIMELINE_DAYS.find((d) => d.day === currentDay) ?? TIMELINE_DAYS[0];

  const handleLaunchDay = (day: TimelineDay) => {
    audio.uiClick();
    audio.ensure();
    onSelectDay(day);
  };

  const handleToggleCompleted = (dayNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    audio.uiClick();
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNum)) {
        next.delete(dayNum);
      } else {
        next.add(dayNum);
        audio.correct();
      }
      return next;
    });
  };

  return (
    <div className="w-full space-y-5">
      {/* ============================================================
          1. HERO MOTIVATION & CONTINUATION CARD
         ============================================================ */}
      <div className="edtech-card edtech-card-active p-5 md:p-6 text-right relative overflow-hidden" dir="rtl">
        {/* Background gradient decorative glow */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 flex-wrap relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs">
                🎯 خطة الـ 30 يوماً المعتمدة
              </span>
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                <span>🔥</span>
                <span>سلسلة الالتزام: 3 أيام متتالية</span>
              </span>
            </div>
            <h2 className="font-ar text-xl md:text-2xl font-bold text-white mb-1">
              خريطة الطريق الرسمية لمستوى Goethe-Zertifikat A1
            </h2>
            <p className="font-ar text-xs md:text-sm text-dim leading-relaxed max-w-2xl">
              15 دقيقة يومياً كافية باش تمشي من الصفر حتى لاجتياز امتحان A1 بتفوق والتحضير للفيزا والتكوين المهني.
            </p>
          </div>

          {/* Quick CTA to continue today's lesson */}
          <button
            onClick={() => handleLaunchDay(currentDayData)}
            className="neon-btn neon-btn-lime chamfer px-5 py-3 text-sm font-ar font-bold flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 transition-transform shrink-0"
          >
            <span>▶</span>
            <span>واصل التعلم: اليوم {currentDayData.day}</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between gap-4 flex-wrap text-xs font-mono text-dim">
          <div className="flex items-center gap-3">
            <span className="font-bold text-emerald-400">إتمام المنهج: {progressPercent}%</span>
            <span>({totalCompleted} من 30 يوماً)</span>
          </div>
          <div className="flex-1 min-w-[200px] max-w-md h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan to-amber-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-amber-400 font-bold">باقي: {30 - totalCompleted} يوماً للتخرج 🎓</span>
        </div>
      </div>

      {/* ============================================================
          2. STAGE TABS (4 WEEKS)
         ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5" dir="rtl">
        {TIMELINE_STAGES.map((stg) => {
          const isSelected = stg.id === activeStageId;
          const stgDays = TIMELINE_DAYS.filter((d) => d.stageId === stg.id);
          const stgCompleted = stgDays.filter((d) => completedDays.has(d.day)).length;

          return (
            <button
              key={stg.id}
              onClick={() => { audio.uiClick(); setActiveStageId(stg.id); }}
              className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/95 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-dim'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{stg.icon}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-dim">
                    {stg.daysRange}
                  </span>
                </div>
                <div className={`font-ar text-xs md:text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {stg.weeksDz}
                </div>
                <div className="font-display text-[10px] text-dim line-clamp-1 mt-0.5">
                  {stg.titleDe}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">{stgCompleted}/{stgDays.length} مكتمل</span>
                <span className="text-dim">{Math.round((stgCompleted / stgDays.length) * 100)}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          3. ACTIVE STAGE TIMELINE PATH & DAILY MILESTONES
         ============================================================ */}
      <div className="edtech-card p-4 md:p-6 space-y-4">
        {/* Stage Header Info */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3" dir="rtl">
          <div>
            <h3 className="font-ar text-lg font-bold text-white flex items-center gap-2">
              <span>{activeStage.icon}</span>
              <span>{activeStage.titleDz}</span>
            </h3>
            <p className="font-ar text-xs text-dim mt-0.5">
              {activeStage.descriptionDz}
            </p>
          </div>

          <span className="text-xs font-mono text-cyan bg-cyan/10 border border-cyan/30 px-3 py-1 rounded-full shrink-0">
            ⏱️ 15 دقيقة لكل يوم
          </span>
        </div>

        {/* Vertical Timeline Stepping Stones */}
        <div className="space-y-3 relative" dir="rtl">
          {stageDays.map((dayItem, idx) => {
            const isDone = completedDays.has(dayItem.day);
            const isCurrent = dayItem.day === currentDay;

            return (
              <div
                key={dayItem.day}
                onClick={() => handleLaunchDay(dayItem)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 flex-wrap md:flex-nowrap group ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                    : isCurrent
                    ? 'bg-slate-800/90 border-cyan/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan/40'
                    : 'bg-slate-850/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                {/* Stepping Stone Node & Day Badge */}
                <div className="flex items-center gap-3.5">
                  <div
                    onClick={(e) => handleToggleCompleted(dayItem.day, e)}
                    title={isDone ? 'اضغط لإلغاء الإكمال' : 'اضغط للتحديد كمكتمل'}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-base transition-all shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : isCurrent
                        ? 'bg-cyan text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 group-hover:border-cyan'
                    }`}
                  >
                    {isDone ? '✓' : dayItem.day}
                  </div>

                  {/* Day Content */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-cyan">
                        اليوم {dayItem.day}
                      </span>
                      {dayItem.isCheckpoint && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-ar text-[11px] font-bold flex items-center gap-1">
                          <span>🏆</span>
                          <span>نقطة تفتيش واختبار المرحلة</span>
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-dim">
                        {dayItem.titleDe}
                      </span>
                    </div>

                    <h4 className="font-ar text-base font-bold text-white group-hover:text-cyan transition-colors">
                      {dayItem.titleDz}
                    </h4>

                    <p className="font-ar text-xs text-dim leading-relaxed mt-0.5 max-w-xl">
                      {dayItem.objectiveDz}
                    </p>

                    {/* Key Phrases preview */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                      {dayItem.keyPhrases.slice(0, 2).map((kp, kIdx) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]"
                          dir="ltr"
                        >
                          {kp.de} <span className="font-ar text-dim">({kp.dz})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills & Action Button */}
                <div className="flex items-center gap-3 shrink-0 mr-auto">
                  {/* Skill Pills */}
                  <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-dim">
                    {dayItem.skills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 uppercase">
                        {sk === 'hören' ? '🎧 استماع' : sk === 'sprechen' ? '🗣️ نطق' : sk === 'lesen' ? '📖 قراءة' : '✍️ كتابة'}
                      </span>
                    ))}
                  </div>

                  {/* Launch CTA */}
                  <button
                    onClick={() => handleLaunchDay(dayItem)}
                    className={`px-4 py-2 rounded-xl font-ar text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                      isDone
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : isCurrent
                        ? 'neon-btn neon-btn-cyan text-slate-950 font-bold'
                        : 'bg-slate-800/90 hover:bg-cyan/20 hover:text-cyan text-slate-300 border border-slate-700'
                    }`}
                  >
                    <span>{isDone ? '🔄 راجع الدرس' : 'ابدأ الدرس'}</span>
                    <span>◀</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
