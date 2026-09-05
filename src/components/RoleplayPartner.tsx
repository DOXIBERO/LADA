import { useState, useEffect, useRef } from 'react';
import { audio } from '../game/audio';
import { narrator } from '../game/narrator';
import {
  chatRoleplay,
  ROLEPLAY_SCENARIOS,
  type RoleplayMessage,
  type RoleplayResponse,
} from '../game/gemini';

/* ============================================================
   LADA — INTERACTIVE AI VOICE ROLEPLAY PARTNER
   Simulated real-world German conversations with live voice,
   instant Darija translations, and real-time grammar coaching.
   ============================================================ */

interface Props {
  initialScenarioId?: string;
  onExit: () => void;
}

interface ChatEntry {
  role: 'user' | 'model';
  german: string;
  darija?: string;
  coaching?: string;
}

// Browser SpeechRecognition interface
interface SpeechRecognitionResult {
  readonly [index: number]: { readonly transcript: string };
}
interface SpeechRecognitionEvent {
  readonly results: { readonly [index: number]: SpeechRecognitionResult };
}
interface BrowserSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
}

export default function RoleplayPartner({ initialScenarioId = 'restaurant', onExit }: Props) {
  const [scenarioId, setScenarioId] = useState(initialScenarioId);
  const scenario = ROLEPLAY_SCENARIOS[scenarioId] ?? ROLEPLAY_SCENARIOS.restaurant;

  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize or reset scenario conversation
  useEffect(() => {
    setHistory([
      {
        role: 'model',
        german: scenario.initialDe,
        darija: scenario.initialDz,
        coaching: 'مرحبا بيك ف هاد المحاكاة! جاوب بالألمانية بالمايك ولا بالكتيبة ولا كليكي على الاقتراحات لتحت.',
      },
    ]);
    setSuggested([
      'Guten Tag! Ich möchte bitte bestellen.',
      'Hallo! Haben Sie einen Moment Zeit?',
      'Entschuldigung, ich verstehe das nicht ganz.',
    ]);

    // Speak initial welcome
    audio.ensure();
    narrator.narrate({
      text: `${scenario.initialDz} بالألمانية كتقول: ${scenario.initialDe}`,
      subtitle: `${scenario.initialDe} (${scenario.initialDz})`,
      germanCue: scenario.initialDe,
    });
  }, [scenarioId, scenario]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, busy]);

  // Setup Web Speech Recognition for German voice input
  useEffect(() => {
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: new () => BrowserSpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => BrowserSpeechRecognition }).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognizer = new SpeechRecognitionClass();
      recognizer.lang = 'de-DE';
      recognizer.continuous = false;
      recognizer.interimResults = false;

      recognizer.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInput(transcript);
          audio.uiClick();
        }
        setListening(false);
      };

      recognizer.onerror = () => { setListening(false); };
      recognizer.onend = () => { setListening(false); };

      recognitionRef.current = recognizer;
    }

    return () => {
      try { recognitionRef.current?.abort(); } catch { /* noop */ }
    };
  }, []);

  const toggleMic = () => {
    audio.ensure();
    if (!recognitionRef.current) {
      alert('المايكروفون ما مدعومش ف هاد المتصفح، تقدر تكتب الجواب عادي.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
        audio.uiOpen();
      } catch {
        setListening(false);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || busy) return;

    setInput('');
    audio.uiClick();

    // Append user message to chat
    const updatedHistory: ChatEntry[] = [
      ...history,
      { role: 'user', german: text },
    ];
    setHistory(updatedHistory);
    setBusy(true);

    try {
      const apiHistory: RoleplayMessage[] = updatedHistory.map((h) => ({
        role: h.role,
        text: h.german,
      }));

      const res: RoleplayResponse = await chatRoleplay(scenarioId, apiHistory, text);

      setHistory((prev) => [
        ...prev,
        {
          role: 'model',
          german: res.germanReply,
          darija: res.darijaTranslation,
          coaching: res.grammarCorrection,
        },
      ]);
      setSuggested(res.suggestedReplies || []);

      // Speak German response aloud
      audio.ensure();
      narrator.narrate({
        text: `${res.germanReply}. بالدارجة: ${res.darijaTranslation}`,
        subtitle: `${res.germanReply} — ${res.darijaTranslation}`,
        germanCue: res.germanReply,
      });
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          role: 'model',
          german: 'Das klingt gut! Bitte sprechen Sie weiter.',
          darija: 'مزيان! كمل الهضرة ديالك.',
          coaching: 'ممتاز، كمل المحادثة بالألمانية.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-void overflow-hidden flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-line/60 bg-panel/85 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { audio.uiClick(); onExit(); }}
            aria-label="الرجوع للـ Hub"
            className="neon-btn chamfer-sm px-3 py-1.5 text-xs text-cyan border border-cyan/40 hover:border-cyan"
          >
            ◀ لوحة التحكم
          </button>
          <div>
            <div className="text-[11px] font-mono text-cyan tracking-wider flex items-center gap-1.5">
              <span>✦ AI ROLEPLAY LAB</span>
              <span>·</span>
              <span>GOETHE A1 CONVERSATION</span>
            </div>
            <h1 className="text-xl md:text-2xl font-ar font-bold text-ink flex items-center gap-2">
              <span>{scenario.titleDz}</span>
              <span className="text-sm font-display text-dim font-normal">({scenario.titleDe})</span>
            </h1>
          </div>
        </div>

        {/* Live Audio Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 chamfer-sm bg-lime/10 border border-lime/40 text-lime animate-pulse">
            ● AI TUTOR ONLINE
          </span>
        </div>
      </header>

      {/* Scenario Switcher Carousel */}
      <div className="relative z-10 border-b border-line/60 bg-void/90 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="font-ar text-xs text-dim shrink-0">المواقف الحقيقية:</span>
        {Object.values(ROLEPLAY_SCENARIOS).map((s) => (
          <button
            key={s.id}
            onClick={() => {
              if (scenarioId !== s.id) {
                audio.uiClick();
                setScenarioId(s.id);
              }
            }}
            className={`chamfer-sm px-3 py-1 text-xs font-ar shrink-0 border transition-all ${
              scenarioId === s.id
                ? 'border-cyan bg-cyan/15 text-cyan font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'border-line/70 text-dim hover:text-ink hover:border-line'
            }`}
          >
            {s.titleDz}
          </button>
        ))}
      </div>

      {/* Chat Dialogue Stream */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} rise`}
          >
            <div
              className={`max-w-[90%] md:max-w-[80%] chamfer p-4 md:p-5 border ${
                msg.role === 'user'
                  ? 'bg-cyan/10 border-cyan/50 text-ink shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'bg-panel/90 border-line/80 text-ink shadow-[0_0_20px_rgba(0,0,0,0.4)]'
              }`}
            >
              {/* Speaker Tag */}
              <div className="flex items-center justify-between gap-3 border-b border-line/30 pb-2 mb-2">
                <span className="text-[11px] font-mono font-bold text-cyan uppercase tracking-wider">
                  {msg.role === 'user' ? '👤 NTA (YOU)' : '🤖 LADA AI PARTNER'}
                </span>
                {msg.role === 'model' && (
                  <button
                    onClick={() => { audio.ensure(); audio.speak(msg.german, 0.88); }}
                    title="سمع النطق"
                    className="neon-btn chamfer-sm px-2 py-0.5 text-[11px] font-ar flex items-center gap-1 hover:border-cyan text-dim hover:text-cyan"
                  >
                    <span>🔊</span>
                    <span>سمع</span>
                  </button>
                )}
              </div>

              {/* German Text */}
              <div className="font-display text-lg md:text-xl font-bold text-ink leading-relaxed tracking-wide" dir="ltr">
                {msg.german}
              </div>

              {/* Darija Translation */}
              {msg.darija && (
                <div className="font-ar text-sm md:text-base text-cyan/95 mt-2 text-right border-t border-line/20 pt-2" dir="rtl">
                  {msg.darija}
                </div>
              )}

              {/* Real-time Grammar / Coaching feedback in Darija */}
              {msg.coaching && (
                <div className="mt-3 chamfer-sm bg-lime/10 border border-lime/30 p-2.5 font-ar text-xs text-ink/90 text-right" dir="rtl">
                  <span className="text-lime font-bold ml-1.5 inline-block">💡 نصيحة الأستاذ:</span>
                  <span>{msg.coaching}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex items-center gap-2 text-cyan font-mono text-xs p-3">
            <span className="animate-spin text-base">✦</span>
            <span>LADA AI is generating German response & audio...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* Suggested Quick Replies (A1 German Chips) */}
      {suggested.length > 0 && !busy && (
        <div className="relative z-10 bg-void/95 border-t border-line/60 px-4 py-2 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-ar text-dim shrink-0">اقتراحات للجواب:</span>
          {suggested.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="chamfer-sm px-3 py-1.5 text-xs font-mono text-ink bg-panel2/80 border border-line/70 hover:border-cyan hover:text-cyan hover:bg-cyan/10 transition-all shrink-0"
              dir="ltr"
            >
              💬 {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Console */}
      <footer className="relative z-10 border-t border-line/80 bg-panel/90 backdrop-blur-md p-3 md:p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); void handleSend(); }}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={toggleMic}
            title={listening ? 'حبس المايك' : 'تكلم بالألمانية بالمايك'}
            className={`neon-btn chamfer px-3.5 py-3 text-base flex items-center gap-1.5 shrink-0 ${
              listening ? 'neon-btn-mag pulse-mag' : 'hover:border-cyan'
            }`}
          >
            <span>{listening ? '🔴' : '🎙️'}</span>
            <span className="font-ar text-xs hidden sm:inline">{listening ? 'كنسمعوك...' : 'بالمايك'}</span>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="كتب الجواب ديالك بالألمانية هنا... (z.B. Ich möchte einen Kaffee bitte)"
            dir="ltr"
            disabled={busy}
            className="flex-1 bg-void/90 border border-line/80 chamfer px-4 py-3 text-sm md:text-base font-mono text-ink focus:border-cyan focus:outline-none placeholder:text-dim/60"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || busy}
            className="neon-btn neon-btn-cyan chamfer px-6 py-3 text-sm md:text-base font-ar font-bold shrink-0 disabled:opacity-40"
          >
            صيفط ◀
          </button>
        </form>
      </footer>
    </div>
  );
}
