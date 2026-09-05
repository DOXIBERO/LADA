import { useState, useEffect } from 'react';
import { TIKTOK_TRACKS, type TikTokTrack, type TikTokLesson } from '../game/tiktokCourses';
import { audio } from '../game/audio';
import { narrator } from '../game/narrator';

interface Props {
  trackId: string;
  onExit: () => void;
}

export default function TikTokCourseView({ trackId, onExit }: Props) {
  const track = TIKTOK_TRACKS.find((t) => t.id === trackId) ?? TIKTOK_TRACKS[0];
  const [lessonIndex, setLessonIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const lesson: TikTokLesson = track.lessons[lessonIndex] ?? track.lessons[0];

  // Reset quiz state when switching lessons
  useEffect(() => {
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    audio.ensure();

    // Tutor explains the lesson out loud in Darija
    narrator.narrate({
      text: `${lesson.titleDz}. ${lesson.tutorScriptDz}`,
      subtitle: `${lesson.creator}: ${lesson.titleDz} (${lesson.titleDe})`,
    });
  }, [lessonIndex, trackId]);

  const handleNext = () => {
    audio.uiClick();
    if (lessonIndex < track.lessons.length - 1) {
      setLessonIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    audio.uiClick();
    if (lessonIndex > 0) {
      setLessonIndex((i) => i - 1);
    }
  };

  const handleSelectAnswer = (idx: number) => {
    if (quizSubmitted) return;
    audio.uiClick();
    setSelectedQuizAnswer(idx);
    setQuizSubmitted(true);

    if (idx === lesson.quiz.answerIndex) {
      audio.correct();
      setCompletedLessons((prev) => new Set([...prev, lesson.id]));
    } else {
      audio.wrong();
    }
  };

  const progressPercent = Math.round(((lessonIndex + 1) / track.lessons.length) * 100);

  return (
    <div className="min-h-dvh w-full bg-void text-ink flex flex-col items-center justify-between p-3 md:p-6 select-none overflow-y-auto font-sans">
      {/* Top Bar */}
      <header className="w-full max-w-2xl flex items-center justify-between gap-3 pb-3 border-b border-line/40">
        <button
          onClick={() => { audio.uiClick(); onExit(); }}
          className="neon-btn chamfer-sm px-3.5 py-1.5 text-xs md:text-sm font-ar flex items-center gap-1.5"
        >
          <span>◀</span>
          <span>الرجوع للمركز</span>
        </button>

        {/* Track Title & Badge */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="font-ar font-bold text-sm md:text-base text-ink">{track.titleDz}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan/15 text-cyan border border-cyan/40">
              {track.badge}
            </span>
          </div>
          <div className="text-[11px] font-mono text-dim">{track.titleDe}</div>
        </div>

        {/* Progress Badge */}
        <div className="font-mono text-xs font-bold text-cyan bg-panel2 border border-line px-2.5 py-1 chamfer-sm">
          {lessonIndex + 1} / {track.lessons.length}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl h-1.5 bg-panel2 rounded-full overflow-hidden my-3 border border-line/30">
        <div
          className="h-full bg-gradient-to-r from-cyan via-lime to-mag transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main TikTok Video-Reel Card UI */}
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-start space-y-4 my-2">
        {/* Creator Info Bar */}
        <div className="panel chamfer p-3.5 bg-panel/90 border-cyan/40 flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-panel2 border-2 border-cyan flex items-center justify-center text-2xl shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              {lesson.creatorAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-ink">{lesson.creator}</span>
                <span className="text-[11px] font-mono text-cyan">{lesson.creatorHandle}</span>
              </div>
              <div className="text-[10px] font-mono text-lime flex items-center gap-1">
                <span>● TIKTOK MASTERCLASS</span>
                <span>·</span>
                <span className="font-ar text-dim">مستوحى من أحدث الفيديوهات</span>
              </div>
            </div>
          </div>

          {/* Replay Tutor Explanation */}
          <button
            onClick={() => {
              audio.ensure();
              narrator.replay();
              audio.uiClick();
            }}
            title="عاود سمع الشرح بالصوت"
            className="neon-btn neon-btn-cyan chamfer-sm px-3 py-1.5 text-xs font-ar font-bold flex items-center gap-1.5 shrink-0"
          >
            <span>🔊</span>
            <span className="hidden sm:inline">صوت الأستاذ</span>
          </button>
        </div>

        {/* Viral Hook in Darija */}
        <div className="panel chamfer p-3.5 bg-mag/10 border-mag/40 text-right" dir="rtl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-mag mb-1">
            <span>⚡ THE VIRAL HOOK // فكرة الفيديو:</span>
          </div>
          <p className="font-ar text-sm md:text-base font-bold text-ink leading-relaxed">
            {lesson.hookDz}
          </p>
        </div>

        {/* Side-by-Side Comparison Cards: Textbook vs Real Street German */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-dim px-1">
            <span>📖 LEHRBUCH (ألماني الكتوبة)</span>
            <span className="text-cyan font-bold">⚡ ECHTE STRASSE (ألماني الشارع)</span>
          </div>

          {lesson.comparisons.map((comp, idx) => (
            <div
              key={idx}
              className="panel chamfer p-4 bg-panel/80 border-line hover:border-cyan/50 transition-all space-y-3"
            >
              {/* Textbook row (faded/classical) */}
              <div className="flex items-start justify-between gap-3 border-b border-line/30 pb-2 text-xs text-dim" dir="ltr">
                <div>
                  <div className="font-mono line-through opacity-70">{comp.textbook}</div>
                  <div className="font-ar text-[11px] text-dim mt-0.5 text-right" dir="rtl">{comp.textbookMeaning}</div>
                </div>
                <span className="chamfer-sm px-1.5 py-0.5 bg-panel2 border border-line text-[10px] font-mono shrink-0">
                  كلاسيكي 📖
                </span>
              </div>

              {/* Real Street row (high energy neon + audio button) */}
              <div className="flex items-center justify-between gap-3" dir="ltr">
                <div className="flex-1">
                  <div className="font-display text-lg md:text-xl font-bold text-cyan text-glow-cyan tracking-wide">
                    {comp.street}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="font-ar text-xs text-amber font-semibold">
                      [{comp.phoneticAr}]
                    </span>
                    <span className="text-dim text-xs">·</span>
                    <span className="font-ar text-xs md:text-sm text-ink font-bold" dir="rtl">
                      {comp.streetMeaning}
                    </span>
                  </div>
                </div>

                {/* Instant Audio Playback */}
                <button
                  onClick={() => {
                    audio.ensure();
                    void audio.speakLive(comp.street);
                  }}
                  title="سمع النطق الحقيقي"
                  className="neon-btn neon-btn-cyan chamfer-sm p-2.5 shrink-0 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  <span className="text-base">🔊</span>
                </button>
              </div>

              {/* Context in Darija */}
              <div className="chamfer-sm bg-void/60 border border-line/40 p-2 text-right font-ar text-xs text-dim" dir="rtl">
                💡 <span className="text-ink">{comp.contextDz}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Cultural / Practical Tip */}
        <div className="panel chamfer p-3.5 bg-lime/10 border-lime/40 text-right" dir="rtl">
          <div className="text-xs font-mono font-bold text-lime mb-1 flex items-center gap-1.5">
            <span>🧠 PRO TIP // نصيحة ذهبية:</span>
          </div>
          <p className="font-ar text-xs md:text-sm text-ink leading-relaxed">
            {lesson.proTipDz}
          </p>
        </div>

        {/* Interactive Micro-Drill (TikTok Quiz) */}
        <div className="panel chamfer p-4 md:p-5 bg-void/90 border-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
          <div className="flex items-center justify-between gap-2 border-b border-line/40 pb-2.5 mb-3" dir="rtl">
            <span className="text-xs font-mono font-bold text-cyan">
              🎯 TIKTOK RAPID DRILL // اختبار سريع:
            </span>
            <span className="text-[10px] font-mono text-dim">سؤال واحد للتثبيت</span>
          </div>

          <h3 className="font-ar text-sm md:text-base font-bold text-ink mb-3 text-right" dir="rtl">
            {lesson.quiz.questionDz}
          </h3>

          <div className="grid gap-2.5">
            {lesson.quiz.options.map((opt, optIdx) => {
              const isSelected = selectedQuizAnswer === optIdx;
              const isCorrect = optIdx === lesson.quiz.answerIndex;

              let btnClass = 'border-line/70 hover:border-cyan text-ink bg-panel2/60';
              if (quizSubmitted) {
                if (isCorrect) {
                  btnClass = 'border-lime bg-lime/20 text-lime shadow-[0_0_15px_rgba(182,255,46,0.3)] font-bold';
                } else if (isSelected) {
                  btnClass = 'border-mag bg-mag/20 text-mag shadow-[0_0_15px_rgba(255,45,120,0.3)] line-through';
                } else {
                  btnClass = 'border-line/30 text-dim opacity-50';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(optIdx)}
                  disabled={quizSubmitted}
                  className={`chamfer-sm p-3 text-right font-ar text-xs md:text-sm flex items-center justify-between gap-3 border transition-all ${btnClass}`}
                  dir="rtl"
                >
                  <span>{opt}</span>
                  <span className="font-mono text-xs shrink-0">
                    {quizSubmitted && isCorrect && '✓ صح'}
                    {quizSubmitted && isSelected && !isCorrect && '✗ غلط'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {quizSubmitted && (
            <div
              className={`chamfer-sm p-3 mt-3 text-right font-ar text-xs md:text-sm rise border ${
                selectedQuizAnswer === lesson.quiz.answerIndex
                  ? 'bg-lime/10 border-lime/40 text-lime'
                  : 'bg-mag/10 border-mag/40 text-mag'
              }`}
              dir="rtl"
            >
              <div className="font-bold mb-1">
                {selectedQuizAnswer === lesson.quiz.answerIndex ? '🎉 برافو عليك! إجابة صحيحة' : '⚠️ حاول تركز فـ الفرق:'}
              </div>
              <div className="text-ink">{lesson.quiz.explanationDz}</div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="w-full max-w-2xl flex items-center justify-between gap-3 pt-3 border-t border-line/40">
        <button
          onClick={handlePrev}
          disabled={lessonIndex === 0}
          className="neon-btn chamfer-sm px-4 py-2 text-xs md:text-sm font-ar disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
        >
          <span>◀</span>
          <span>الدرس السابق</span>
        </button>

        {/* Quick Lesson Indicator Dots */}
        <div className="flex items-center gap-1.5">
          {track.lessons.map((l, i) => (
            <span
              key={l.id}
              onClick={() => { audio.uiClick(); setLessonIndex(i); }}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                i === lessonIndex
                  ? 'w-6 bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.6)]'
                  : completedLessons.has(l.id)
                  ? 'bg-lime'
                  : 'bg-panel2 border border-line'
              }`}
              title={l.titleDz}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={lessonIndex === track.lessons.length - 1}
          className="neon-btn neon-btn-lime chamfer-sm px-4 py-2 text-xs md:text-sm font-ar font-bold disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
        >
          <span>الدرس الموالي</span>
          <span>▶</span>
        </button>
      </footer>
    </div>
  );
}
