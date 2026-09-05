/* ============================================================
   LADA — AUDIO ENGINE (100% procedural, zero assets)
   Deterministic beat clock via AudioContext.currentTime so the
   3D highway and the synth never drift. All SFX synthesized.
   German pronunciation via Web Speech (de-DE) when available.
   ============================================================ */

type AC = AudioContext;

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

class LadaAudio {
  private ctx: AC | null = null;
  private master!: GainNode;
  private music!: GainNode;
  private sfxBus!: GainNode;
  private delayIn!: GainNode;
  private noise!: AudioBuffer;
  private timer: number | null = null;
  private step = 0;
  private nextT = 0;
  private _startAt = 0;
  private _bpm = 120;
  private _root = 33;
  private _intensity = 0; // 0..1 extra layers
  muted = false;
  private deVoice: SpeechSynthesisVoice | null = null;

  /* ---------- lifecycle ---------- */
  init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);

    this.music = this.ctx.createGain();
    this.music.gain.value = 0.8;
    this.music.connect(this.master);

    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = 1;
    this.sfxBus.connect(this.master);

    // space delay for arp / plucks
    const delay = this.ctx.createDelay(1);
    delay.delayTime.value = 0.29;
    const fb = this.ctx.createGain(); fb.gain.value = 0.32;
    const wet = this.ctx.createGain(); wet.gain.value = 0.22;
    this.delayIn = this.ctx.createGain();
    this.delayIn.connect(delay); delay.connect(fb); fb.connect(delay);
    delay.connect(wet); wet.connect(this.music);

    // shared noise buffer
    const len = this.ctx.sampleRate * 1;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    // german voice
    const pick = () => {
      const vs = window.speechSynthesis?.getVoices() ?? [];
      this.deVoice = vs.find((v) => v.lang?.toLowerCase().startsWith('de') && /google/i.test(v.name))
        ?? vs.find((v) => v.lang?.toLowerCase().startsWith('de')) ?? null;
    };
    pick();
    window.speechSynthesis?.addEventListener?.('voiceschanged', pick);
  }

  ensure() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
  }

  get ready() { return !!this.ctx; }
  get currentTime() { return this.ctx ? this.ctx.currentTime : 0; }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.03);
  }

  suspend() { this.ctx?.suspend().catch(() => undefined); }
  resume() { this.ctx?.resume().catch(() => undefined); }

  /* ---------- music transport ---------- */
  startMusic(bpm: number, root: number, intensity = 0) {
    this.ensure();
    if (!this.ctx) return;
    this.stopMusic();
    this._bpm = bpm;
    this._root = root;
    this._intensity = intensity;
    this._startAt = this.ctx.currentTime + 0.12;
    this.step = 0;
    this.nextT = this._startAt;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  stopMusic() {
    if (this.timer !== null) { clearInterval(this.timer); this.timer = null; }
  }

  /** seconds since music start (can be negative during count-in) */
  time(): number {
    if (!this.ctx) return 0;
    return this.ctx.currentTime - this._startAt;
  }
  beat(): number { return this.time() * (this._bpm / 60); }
  get bpm() { return this._bpm; }

  private schedule() {
    if (!this.ctx) return;
    const ahead = this.ctx.currentTime + 0.12;
    const spb = 60 / this._bpm / 4; // 16th
    while (this.nextT < ahead) {
      this.playStep(this.step, this.nextT);
      this.step += 1;
      this.nextT += spb;
    }
  }

  private playStep(s: number, t: number) {
    const pos = s % 16;
    const bar = Math.floor(s / 16);
    const prog = [0, 0, -4, -2][bar % 4];         // Am — Am — F — G feel
    const root = this._root + prog;

    if (pos % 4 === 0) this.kick(t);
    if (pos === 4 || pos === 12) this.clap(t);
    if (pos % 2 === 1) this.hat(t, pos % 4 === 3 ? 0.34 : 0.16);

    const bassPat: (number | null)[] = [0, null, 0, 12, null, 0, null, 7, 0, null, 0, 12, null, 10, 7, null];
    const bn = bassPat[pos];
    if (bn !== null && bn !== undefined) this.bass(t, root + bn);

    const scale = [0, 3, 5, 7, 10, 12, 15, 19];
    if (pos % 2 === 0) {
      const idx = (pos / 2 + bar * 3) % scale.length;
      this.pluck(t, root + 24 + scale[idx]);
    }
    if (this._intensity > 0.5 && bar % 2 === 1 && (pos === 14)) {
      this.pluck(t, root + 36 + scale[(bar * 5) % scale.length], 0.16);
    }
  }

  /* ---------- instruments ---------- */
  private kick(t: number) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(43, t + 0.11);
    g.gain.setValueAtTime(0.95, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g); g.connect(this.music);
    o.start(t); o.stop(t + 0.2);
  }

  private hat(t: number, vol: number) {
    if (!this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 7400;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    src.connect(f); f.connect(g); g.connect(this.music);
    src.start(t); src.stop(t + 0.06);
  }

  private clap(t: number) {
    if (!this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 1900; f.Q.value = 0.9;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    src.connect(f); f.connect(g); g.connect(this.music);
    src.start(t); src.stop(t + 0.16);
  }

  private bass(t: number, midi: number) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = mtof(midi);
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(700, t);
    f.frequency.exponentialRampToValueAtTime(160, t + 0.16);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
    o.connect(f); f.connect(g); g.connect(this.music);
    o.start(t); o.stop(t + 0.19);
  }

  private pluck(t: number, midi: number, vol = 0.1) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = mtof(midi);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g);
    g.connect(this.music);
    g.connect(this.delayIn);
    o.start(t); o.stop(t + 0.22);
  }

  /* ---------- SFX ---------- */
  private tone(t0: number, f0: number, f1: number, dur: number, type: OscillatorType, vol: number, dest?: AudioNode) {
    if (!this.ctx) return;
    const t = t0 + this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(dest ?? this.sfxBus);
    o.start(t); o.stop(t + dur + 0.02);
  }

  private noiseBurst(dur: number, freq: number, vol: number, sweepTo?: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise; src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 1.1;
    f.frequency.setValueAtTime(freq, t);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.sfxBus);
    src.start(t); src.stop(t + dur + 0.02);
  }

  uiClick() { this.tone(0, 1250, 900, 0.05, 'square', 0.06); }
  uiOpen() { this.tone(0, 500, 980, 0.09, 'triangle', 0.09); }

  hit(combo: number) {
    const f = 620 + Math.min(combo, 24) * 14;
    this.tone(0, f, f * 1.6, 0.08, 'triangle', 0.22);
  }

  perfect(combo: number) {
    const f = 880 + Math.min(combo, 20) * 10;
    this.tone(0, f, f, 0.07, 'sine', 0.2);
    this.tone(0.05, f * 1.5, f * 1.5, 0.1, 'sine', 0.16);
    this.noiseBurst(0.08, 6200, 0.05);
  }

  /** record-scratch + glitch on miss, ducks the music briefly */
  miss() {
    this.noiseBurst(0.24, 2600, 0.3, 180);
    this.tone(0, 220, 48, 0.28, 'sawtooth', 0.24);
    if (this.ctx && this.music) {
      const t = this.ctx.currentTime;
      this.music.gain.cancelScheduledValues(t);
      this.music.gain.setValueAtTime(0.32, t);
      this.music.gain.linearRampToValueAtTime(0.8, t + 0.34);
    }
  }

  countTick(final = false) {
    this.tone(0, final ? 1560 : 780, final ? 1560 : 780, final ? 0.22 : 0.08, 'square', 0.12);
  }

  grade(score: number) {
    const notes = score >= 85 ? [523, 659, 784] : score >= 60 ? [440, 554] : [330, 262];
    notes.forEach((f, i) => this.tone(i * 0.09, f, f, 0.14, 'triangle', 0.16));
  }

  alarm() { this.tone(0, 200, 400, 0.16, 'square', 0.1); this.tone(0.18, 200, 400, 0.16, 'square', 0.1); }

  win() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(i * 0.12, f, f, 0.25, 'triangle', 0.18));
    this.noiseBurst(0.4, 5000, 0.06);
  }

  lose() { [392, 330, 262, 196].forEach((f, i) => this.tone(i * 0.14, f, f * 0.98, 0.3, 'sawtooth', 0.14)); }

  /* ---------- german TTS ---------- */
  get ttsReady() { return 'speechSynthesis' in window; }

  speak(text: string, rate = 0.85) {
    try {
      if (!this.ttsReady) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      if (this.deVoice) u.voice = this.deVoice;
      u.rate = rate;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch { /* TTS unavailable — the synth blips carry the show */ }
  }

  speakSequence(words: string[], gapMs = 1000) {
    words.forEach((w, i) => window.setTimeout(() => this.speak(w), i * gapMs));
  }
}

export const audio = new LadaAudio();
