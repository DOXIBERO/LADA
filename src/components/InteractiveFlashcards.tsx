import { useState } from 'react';
import { audio } from '../game/audio';
import type { A1Word } from '../game/a1Curriculum';

/* ============================================================
   LADA — INTERACTIVE 3D ACTIVE RECALL FLASHCARDS
   Real pedagogical technique: Spaced Retrieval + Self-Assessment
   (Leitner Box System) tailored for Moroccan Arabic speakers.
   ============================================================ */

interface Props {
  words: A1Word[];
  onComplete?: () => void;
}

export default function InteractiveFlashcards({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [reviewQueue, setReviewQueue] = useState<A1Word[]>(words);
  const [completed, setCompleted] = useState(false);

  const currentWord = reviewQueue[currentIndex];

  const handleFlip = () => {
    audio.uiClick();
    setIsFlipped((f) => !f);
  };

  const handlePlayAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentWord) return;
    audio.ensure();
    void audio.speakLive(currentWord.de);
  };

  const handleRate = (rating: 'hard' | 'medium' | 'easy') => {
    if (!currentWord) return;
    audio.uiClick();

    if (rating === 'easy') {
      audio.correct();
      setMasteredIds((prev) => new Set([...prev, currentWord.de]));
    } else if (rating === 'hard') {
      audio.wrong();
      // Re-append hard word to end of queue so user encounters it again!
      setReviewQueue((prev) => [...prev, currentWord]);
    }

    setIsFlipped(false);

    if (currentIndex + 1 < reviewQueue.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
      if (onComplete) onComplete();
    }
  };

  const handleRestart = () => {
    audio.uiOpen();
    setReviewQueue(words);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
  };

  if (!currentWord || completed) {
    return (
      <div className="edtech-card p-6 md:p-8 text-center max-w-xl mx-auto rise">
        <div className="text-5xl mb-3 animate-bounce">🎉</div>
        <h3 className="font-ar text-2xl font-bold text-emerald-400 mb-2" dir="rtl">
          برافو عليك! كملتي مراجعة جميع كلمات هاد الوحدة
        </h3>
        <p className="font-ar text-sm text-dim mb-6 leading-relaxed" dir="rtl">
          قدرتي تثبت {masteredIds.size} كلمة فـ الذاكرة طويلة المدى. دابا راك واجد دوز للحوار أو تركيب الجمل!
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleRestart}
            className="neon-btn chamfer px-5 py-2.5 text-sm font-ar flex items-center gap-2"
          >
            <span>🔄</span>
            <span>عاود المراجعة من الأول</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / reviewQueue.length) * 100);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Header with Progress & Counter */}
      <div className="w-full flex items-center justify-between gap-3 mb-3 px-1 text-xs font-ar font-bold text-dim">
        <div className="flex items-center gap-2">
          <span>البطاقة:</span>
          <span className="font-mono text-cyan text-sm">{currentIndex + 1} / {reviewQueue.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-400">حفظتي: {masteredIds.size}</span>
          <span>·</span>
          <span className="text-amber-400">باقي: {reviewQueue.length - currentIndex}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-5 border border-slate-700/50">
        <div
          className="h-full bg-gradient-to-r from-cyan via-emerald-400 to-amber-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Flipping Flashcard */}
      <div
        onClick={handleFlip}
        className="w-full min-h-[320px] md:min-h-[360px] perspective-1000 cursor-pointer select-none group"
      >
        <div
          className={`relative w-full h-full min-h-[320px] md:min-h-[360px] transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ==================== FRONT OF CARD ==================== */}
          <div className="absolute inset-0 backface-hidden edtech-card p-6 md:p-8 flex flex-col justify-between items-center text-center border-slate-600/60 group-hover:border-cyan/60 transition-colors shadow-2xl">
            {/* Top Indicator */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-dim">
              <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-cyan">
                🇩🇪 DEUTSCH
              </span>
              <span className="text-xs font-ar text-cyan/90 flex items-center gap-1">
                <span>🔄 انقر لقلب البطاقة</span>
              </span>
            </div>

            {/* German Word + Phonetics */}
            <div className="my-auto space-y-3">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-wide">
                {currentWord.de}
              </h2>

              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs text-dim">{currentWord.ipa}</span>
                <span className="text-slate-600">·</span>
                <span className="font-ar text-sm text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                  {currentWord.phoneticAr}
                </span>
              </div>
            </div>

            {/* Audio Button */}
            <div className="w-full flex items-center justify-center gap-3 pt-4 border-t border-slate-700/50">
              <button
                onClick={handlePlayAudio}
                className="neon-btn neon-btn-cyan chamfer-sm px-5 py-2.5 text-sm font-ar font-bold flex items-center gap-2 shadow-lg"
              >
                <span>🔊</span>
                <span>استمع للنطق الأصلي (Gemini 24k)</span>
              </button>
            </div>
          </div>

          {/* ==================== BACK OF CARD ==================== */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 edtech-card p-6 md:p-8 flex flex-col justify-between text-right border-emerald-500/50 shadow-2xl" dir="rtl">
            {/* Top Indicator */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-dim" dir="ltr">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold">
                🇲🇦 DARIJA MEANING
              </span>
              <span className="text-xs font-ar text-dim">
                {currentWord.de}
              </span>
            </div>

            {/* Darija Meaning & Mnemonic Hook */}
            <div className="my-auto space-y-3.5">
              <div className="font-ar text-3xl font-bold text-emerald-400">
                {currentWord.dz}
              </div>

              {/* 3o9ola Mnemonic */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-xs font-mono text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                  <span>💡 عقلة الذاكرة (Mnemonic):</span>
                </div>
                <p className="font-ar text-sm text-slate-200 leading-relaxed">
                  {currentWord.mnemonic}
                </p>
              </div>

              {/* Mouth Phonetic Coach */}
              {currentWord.trapTip && (
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-700/40 text-xs font-ar text-cyan-200">
                  <span className="font-bold text-cyan-400 ml-1">🗣️ نصيحة مخرج الحرف:</span>
                  <span>{currentWord.trapTip}</span>
                </div>
              )}
            </div>

            {/* Quick Listen */}
            <div className="w-full flex items-center justify-between pt-3 border-t border-slate-700/50">
              <span className="text-xs font-ar text-dim">
                كفاش جاك هاد المصطلح؟ قيّم حفظك دابا 👇
              </span>
              <button
                onClick={handlePlayAudio}
                className="neon-btn chamfer-sm p-2 text-xs"
                title="سمع مرة أخرى"
              >
                <span>🔊</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Recall Evaluation Rating Controls */}
      <div className="w-full mt-5">
        <div className="text-center font-ar text-xs font-bold text-dim mb-2.5">
          {isFlipped ? 'قيّم درجة التذكر ديالك باش نكررو معاك الكلمات الصعيبة:' : 'انقر على البطاقة أولاً باش تشوف المعنى وتقيم راسك'}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => handleRate('hard')}
            className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 active:scale-95 transition-all text-center font-ar"
          >
            <div className="text-lg mb-0.5">🔴</div>
            <div className="text-xs md:text-sm font-bold">صعيبة بزاف</div>
            <div className="text-[10px] text-rose-400/80 font-mono mt-0.5">عاود دابا</div>
          </button>

          <button
            onClick={() => handleRate('medium')}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 active:scale-95 transition-all text-center font-ar"
          >
            <div className="text-lg mb-0.5">🟡</div>
            <div className="text-xs md:text-sm font-bold">متوسطة</div>
            <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">نص نص</div>
          </button>

          <button
            onClick={() => handleRate('easy')}
            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 active:scale-95 transition-all text-center font-ar"
          >
            <div className="text-lg mb-0.5">🟢</div>
            <div className="text-xs md:text-sm font-bold">ساهلة حفظتها</div>
            <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">Mastered ✓</div>
          </button>
        </div>
      </div>
    </div>
  );
}
