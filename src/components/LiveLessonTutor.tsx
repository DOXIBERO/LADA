import { useState, useEffect } from 'react';
import { audio } from '../game/audio';
import { narrator, type NarratorState } from '../game/narrator';
import { askTutor } from '../game/gemini';
import type { A1Unit } from '../game/a1Curriculum';

/* ============================================================
   LADA — LIVE PERSONAL AI TUTOR (A1 LIVE COACH)
   Speaks automatically when entering a lesson, explaining
   concepts in Moroccan Darija like a real live person on a call.
   ============================================================ */

interface Props {
  unit: A1Unit;
  activeTab: string;
}

export default function LiveLessonTutor({ unit, activeTab }: Props) {
  const [narratorState, setNarratorState] = useState<NarratorState>(narrator.getState());
  const [askOpen, setAskOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [answering, setAnswering] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    return narrator.subscribe(setNarratorState);
  }, []);

  // Auto-start live tutor explanation when entering unit or changing tab
  useEffect(() => {
    audio.ensure();
    narrator.narrateA1Tab(unit, activeTab);
  }, [unit, activeTab]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = userQuestion.trim();
    if (!q || answering) return;

    setUserQuestion('');
    setAnswering(true);
    audio.uiClick();

    try {
      const context = `الوحدة: ${unit.titleDe} (${unit.titleDz}). الكلمات: ${unit.words.map((w) => w.de).join(', ')}.`;
      const response = await askTutor(q, context);

      // Tutor answers out loud with live Gemini voice
      await narrator.narrate({
        text: response,
        subtitle: response,
      }, true);
      setAskOpen(false);
    } catch {
      await narrator.narrate({
        text: 'ما قدرتش نسمعك مزيان، عاود سولني عفاك.',
        subtitle: 'عاود سول الأستاذ.',
      }, true);
    } finally {
      setAnswering(false);
    }
  };

  return (
    <div className="panel chamfer p-3 md:p-4 mb-5 border-cyan/40 bg-void/90 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-line/40 pb-3 mb-3">
        {/* Tutor Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-panel2 border-2 border-cyan flex items-center justify-center text-2xl md:text-3xl shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              👨‍🏫
            </div>
            {narratorState.speaking && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-lime rounded-full border-2 border-void animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan tracking-wide">
                PROF. LADA · LIVE TUTOR
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime/10 border border-lime/40 text-lime animate-pulse">
                ● LIVE ON CALL
              </span>
            </div>
            <div className="font-ar text-sm md:text-base font-bold text-ink">
              الأستاذ المساعد ديالك فـ {unit.titleDz}
            </div>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {/* Unlock Audio Button if browser needs initial touch */}
          {!audioUnlocked && (
            <button
              onClick={() => {
                audio.ensure();
                setAudioUnlocked(true);
                narrator.replay();
              }}
              className="neon-btn neon-btn-cyan chamfer-sm px-3 py-1.5 text-xs font-ar font-bold flex items-center gap-1.5 animate-bounce"
            >
              <span>🔊</span>
              <span>شغّل صوت الأستاذ</span>
            </button>
          )}

          {/* Ask Tutor Button */}
          <button
            onClick={() => { audio.uiClick(); setAskOpen((o) => !o); }}
            className="neon-btn neon-btn-mag chamfer-sm px-3 py-1.5 text-xs font-ar font-bold flex items-center gap-1.5"
          >
            <span>🗣️</span>
            <span>سول الأستاذ</span>
          </button>

          {/* Replay Explanation */}
          <button
            onClick={() => {
              audio.ensure();
              narrator.replay();
              audio.uiClick();
            }}
            title="عاود سمع الشرح"
            className="neon-btn chamfer-sm px-3 py-1.5 text-xs font-ar flex items-center gap-1"
          >
            <span>🔄</span>
            <span>عاود الشرح</span>
          </button>
        </div>
      </div>

      {/* Live Speaking Bubble (What the Tutor is saying aloud right now) */}
      <div
        dir="rtl"
        className="font-ar text-sm md:text-base leading-relaxed text-right p-3 rounded bg-cyan/5 border border-cyan/20 flex items-start gap-3"
      >
        <div className="flex items-center gap-1 mt-1 shrink-0">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                narratorState.speaking
                  ? 'h-4 bg-cyan animate-pulse'
                  : narratorState.loading
                  ? 'h-2 bg-amber animate-bounce'
                  : 'h-1.5 bg-line'
              }`}
            />
          ))}
        </div>

        <div className="flex-1">
          {narratorState.subtitle ? (
            <span className={narratorState.speaking ? 'text-cyan text-glow-cyan font-semibold' : 'text-ink'}>
              {narratorState.subtitle}
            </span>
          ) : (
            <span className="text-dim text-xs">
              الأستاذ كيتسناك تختار شي تمرين باش يشرحو ليك بالدارجة.
            </span>
          )}
        </div>
      </div>

      {/* Quick Question Drawer */}
      {askOpen && (
        <form onSubmit={handleAsk} className="mt-3 pt-3 border-t border-line/40 flex items-center gap-2" dir="rtl">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="سول الأستاذ أي حاجة (مثلا: علاش كنقولو einen machi ein؟)..."
            disabled={answering}
            className="flex-1 bg-void border border-cyan/40 chamfer-sm px-3.5 py-2 font-ar text-sm text-ink focus:border-cyan focus:outline-none"
          />
          <button
            type="submit"
            disabled={!userQuestion.trim() || answering}
            className="neon-btn neon-btn-cyan chamfer-sm px-4 py-2 font-ar text-xs font-bold shrink-0 disabled:opacity-40"
          >
            {answering ? 'الأستاذ كيفكر...' : 'سول دابا ◀'}
          </button>
        </form>
      )}
    </div>
  );
}
