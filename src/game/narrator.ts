/* ============================================================
   LADA — AUTONOMOUS AI VOICE COMPANION & GUIDE
   Hands-free AI voice tutor that speaks across every step,
   explaining concepts in Moroccan Darija with native German
   phonology. Powered by Gemini Live TTS (gemini-2.5-flash-preview-tts)
   with zero-latency Web Speech dual-voice fallback.
   ============================================================ */

import { audio } from './audio';
import { hasLiveKey, synthesizeGeminiVoice } from './gemini';
import type { Track, Word } from './content';

const AUTO_VOICE_STORAGE = 'lada_auto_voice';

export interface NarratorItem {
  text: string;        // Text sent to Gemini TTS (Darija + German phrases)
  subtitle: string;    // Displayed on-screen subtitle in Darija
  germanCue?: string;  // German word for Web Speech fallback
}

export interface NarratorState {
  speaking: boolean;
  loading: boolean;
  autoVoice: boolean;
  text: string;
  subtitle: string;
  source: 'gemini' | 'webspeech' | 'none';
}

class NarratorManager {
  private autoVoice = true;
  private state: NarratorState = {
    speaking: false,
    loading: false,
    autoVoice: true,
    text: '',
    subtitle: '',
    source: 'none',
  };
  private listeners: ((s: NarratorState) => void)[] = [];
  private lastItem: NarratorItem | null = null;
  private currentToken = 0;

  constructor() {
    try {
      const stored = localStorage.getItem(AUTO_VOICE_STORAGE);
      if (stored !== null) {
        this.autoVoice = stored === 'true';
      }
    } catch { /* private mode */ }
    this.state.autoVoice = this.autoVoice;

    // Listen to audio engine voice state
    audio.onVoiceState((active) => {
      if (!active && this.state.speaking) {
        this.updateState({ speaking: false, loading: false });
      }
    });
  }

  getState(): NarratorState {
    return { ...this.state };
  }

  isAutoVoiceEnabled(): boolean {
    return this.autoVoice;
  }

  setAutoVoice(enabled: boolean): void {
    this.autoVoice = enabled;
    try {
      localStorage.setItem(AUTO_VOICE_STORAGE, String(enabled));
    } catch { /* noop */ }
    this.updateState({ autoVoice: enabled });
    if (!enabled) {
      this.stop();
    }
  }

  toggleAutoVoice(): boolean {
    this.setAutoVoice(!this.autoVoice);
    return this.autoVoice;
  }

  subscribe(listener: (s: NarratorState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private updateState(partial: Partial<NarratorState>) {
    this.state = { ...this.state, ...partial };
    for (const l of this.listeners) {
      try { l(this.getState()); } catch { /* noop */ }
    }
  }

  stop(): void {
    this.currentToken += 1;
    audio.stopVoice();
    this.updateState({ speaking: false, loading: false, source: 'none' });
  }

  /**
   * Narrates an instructional script.
   * If autoVoice is disabled and force is false, it only displays subtitles without audio.
   */
  async narrate(item: NarratorItem, force = false): Promise<void> {
    this.lastItem = item;
    const token = ++this.currentToken;

    this.updateState({
      text: item.text,
      subtitle: item.subtitle,
    });

    if (!this.autoVoice && !force) {
      return;
    }

    this.updateState({ loading: true });

    // Step 1: Try Gemini Live TTS
    if (hasLiveKey()) {
      try {
        const pcmBase64 = await synthesizeGeminiVoice(item.text);
        if (this.currentToken !== token) return; // Superceded by another step

        this.updateState({ loading: false, speaking: true, source: 'gemini' });
        await audio.playPcmBase64(pcmBase64);
        if (this.currentToken === token) {
          this.updateState({ speaking: false, source: 'none' });
        }
        return;
      } catch (err) {
        console.warn('Gemini TTS error, falling back to Web Speech:', err);
      }
    }

    if (this.currentToken !== token) return;

    // Step 2: Fallback to dual-voice Web Speech
    try {
      this.updateState({ loading: false, speaking: true, source: 'webspeech' });
      await audio.speakBilingualWebSpeech(item.subtitle, item.germanCue);
    } catch {
      // Audio fallback complete
    } finally {
      if (this.currentToken === token) {
        this.updateState({ speaking: false, source: 'none' });
      }
    }
  }

  replay(): void {
    if (this.lastItem) {
      void this.narrate(this.lastItem, true);
    }
  }

  /* ============================================================
     PRE-PROGRAMMED INSTRUCTIONAL SCRIPTS (Moroccan Darija + German)
     ============================================================ */

  narrateHub(nextTrack?: Track): void {
    if (nextTrack) {
      this.narrate({
        text: `مرحبا بيك ف لادا! راك دابا فالـ Command Deck. الدرس التالي لي عندك هو ${nextTrack.title} بالألمانية ${nextTrack.titleDe}. كليكي على دوز للدرس باش نبداو!`,
        subtitle: `مرحبا بيك ف لادا! الدرس التالي هو: ${nextTrack.title} (${nextTrack.titleDe}). كليكي باش تبدا!`,
        germanCue: nextTrack.titleDe,
      });
    } else {
      this.narrate({
        text: 'مرحبا بيك ف لادا! راك دابا فالـ Command Deck. ختار أي درس بغيتي تعاودو ولا كمل التحديات ديالك!',
        subtitle: 'مرحبا بيك ف لادا! ختار أي درس بغيتي تدرب عليه.',
      });
    }
  }

  narrateStep(track: Track, stepIdx: number): void {
    const step = track.steps[stepIdx];
    if (!step) return;

    const wordsDetails = step.items.map((w) => `${w.de}، كتعني بالدارجة ${w.dz}`).join('؛ و ');
    const firstWord = step.items[0]?.de;

    const text = `الخطوة ${stepIdx + 1} من درس ${track.title}: ${step.title}. ${step.explain}. الكلمات ديال هاد الخطوة هما: ${wordsDetails}. سمع النطق وركّز ف العقلة!`;
    const subtitle = `الخطوة ${stepIdx + 1}: ${step.title}. ${step.explain}`;

    this.narrate({ text, subtitle, germanCue: firstWord });
  }

  narrateQuizIntro(track: Track): void {
    this.narrate({
      text: `دابا وصلنا للتشيكپوان ديال درس ${track.title}! كاينين أسئلة باش نتأكدو بلي ضبطتي الكلمات مزيان. يالاه ركّز واختار الجواب الصحيح!`,
      subtitle: `التشيكپوان: جاوب على الأسئلة باش تتأكد من الكلمات ديال ${track.title}!`,
    });
  }

  narrateQuizQuestion(ri: number, total: number, deWord: string): void {
    this.narrate({
      text: `السؤال ${ri + 1} من ${total}: شنو كتعني هاد الكلمة بالألمانية: ${deWord}؟ سمع النطق ديالها واختار الترجمة بالدارجة!`,
      subtitle: `السؤال ${ri + 1}/${total}: شنو كتعني ${deWord} بالدارجة؟`,
      germanCue: deWord,
    });
  }

  narrateQuizFeedback(correct: boolean, mnemonic: string, word: string): void {
    if (correct) {
      this.narrate({
        text: `برافو عليك! جواب صحيح 100%! الكلمة هي ${word}. ممتاز!`,
        subtitle: `برافو عليك! جواب صحيح! (${word})`,
        germanCue: word,
      }, true);
    } else {
      this.narrate({
        text: `لا، ركّز مزيان! تفكّر العقلة: ${mnemonic}. عاود حاول!`,
        subtitle: `ركّز مزيان! تفكّر العقلة: ${mnemonic}`,
      }, true);
    }
  }

  narrateHighway(track: Track): void {
    this.narrate({
      text: `دابا دخلتي لـ Highway بريتم ${track.bpm} BPM! غاتبان ليك الكلمة بالألمانية الفوق، وسوگ للباب الصحيحة بالدارجة قبل ما يوصل الخط! ركّز مع الريتم!`,
      subtitle: `Cyber Highway: سوگ للباب الصحيحة بريتم ${track.bpm} BPM!`,
    });
  }

  narrateVocal(track: Track, currentWord?: Word): void {
    if (currentWord) {
      this.narrate({
        text: `دابا دورك فـ Vocal Arena! الكلمة هي: ${currentWord.de}. كتعني ${currentWord.dz}. سمع النطق ونطقها نيشان بصوتك!`,
        subtitle: `نطق بصوتك: ${currentWord.de} (${currentWord.dz})`,
        germanCue: currentWord.de,
      });
    } else {
      this.narrate({
        text: `دابا الـ Vocal Arena ديال درس ${track.title}! سمع الكلمة وعاود نطقها بصوتك باش نضبطو مخارج الحروف!`,
        subtitle: `Vocal Arena: سمع الكلمة ونطق بصوتك!`,
      });
    }
  }

  narrateResults(passed: boolean, acc: number, mode: string): void {
    const pct = Math.round(acc * 100);
    if (passed) {
      this.narrate({
        text: `مبروك عليك! ساليتي الـ ${mode === 'revenge' ? 'Revenge' : 'Run'} بنجاح وجبتي ${pct} ف المية! الكلمات دابا راهم ف الذاكرة القوية ديالك.`,
        subtitle: `مبروك! نتيجة ممتازة: ${pct}%! راك غادي مزيان!`,
      });
    } else {
      this.narrate({
        text: `جبتي ${pct} ف المية، باقي خاصك شوية باش توصل لـ 85 بالمية. ما كاين حتى مشكل، عاود ضرب طليلة على الكلمات ودخل لـ Revenge!`,
        subtitle: `النتيجة: ${pct}%. خاصك 85% للماستري. كليكي على Revenge باش تثبت الكلمات!`,
      });
    }
  }
}

export const narrator = new NarratorManager();
