import { useCallback, useEffect, useRef, useState } from 'react';
import { audio } from '../game/audio';
import { mulberry32, hashStr, type Track, type Word } from '../game/content';
import { pairHint } from '../game/ladaCore';
import { narrator } from '../game/narrator';

/* ============================================================
   LEVEL 2 — THE CYBER HIGHWAY
   Pseudo-3D three-lane rhythm runner. German word in the HUD,
   Darija translation gates on the road. Steer into the right
   gate before the hit-line. Perfect lock-in = shockwave.
   ============================================================ */

export interface HighwayResult {
  score: number; perfect: number; good: number; miss: number;
  maxCombo: number; acc: number;
  perWord: Record<string, { hit: number; miss: number }>;
}

interface GateEv {
  t: number; word: Word; lanes: string[]; correct: number; travel: number;
  done?: 'perfect' | 'good' | 'miss';
  pendingAt?: number;
}
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; ring?: boolean }
interface Popup { text: string; color: string; x: number; y: number; life: number; big?: boolean }

interface Props {
  track: Track;
  mode: 'normal' | 'revenge';
  weakWords: Word[];
  onFinish: (r: HighwayResult) => void;
  onExit: () => void;
}

const CAM = 11, Z_MAX = 48, GRACE = 0.2, PERFECT_LOCK = 0.3;

function shuffle<T>(a: T[], rng: () => number): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Highway({ track, mode, weakWords, onFinish, onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [hud, setHud] = useState({ score: 0, combo: 0, acc: 1, done: 0, total: 0 });
  const [target, setTarget] = useState<{ de: string; ipa: string; idx: number } | null>(null);
  const [toasts, setToasts] = useState<string[]>([]);
  const hudRef = useRef(hud);
  const targetRef = useRef(target);
  const stRef = useRef<ReturnType<typeof freshState> | null>(null);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  function freshState() {
    const rng = mulberry32(hashStr(track.id) + (mode === 'revenge' ? 777 : 13));
    const pool: Word[] = [];
    if (mode === 'revenge') {
      const base = weakWords.length >= 3 ? weakWords : track.words;
      while (pool.length < 14) pool.push(...base);
      pool.length = 14;
    } else {
      pool.push(...track.words, ...track.words);
    }
    shuffle(pool, rng);
    const spb = 60 / (track.bpm + (mode === 'revenge' ? 16 : 0));
    const gap = mode === 'revenge' ? 3 : 4;
    // bchwiya ramp: first gates crawl in, then the highway warms up
    const baseTravel = mode === 'revenge' ? 2.0 : 2.8;
    const warmExtra = mode === 'revenge' ? 0.5 : 1.0;
    const events: GateEv[] = pool.map((w, i) => {
      const others = track.words.filter((x) => x.dz !== w.dz);
      const decoys = shuffle([...others], rng).slice(0, 2).map((x) => x.dz);
      const lanes = shuffle([w.dz, ...decoys], rng);
      const travel = baseTravel + warmExtra * (1 - i / Math.max(1, pool.length - 1));
      return { t: (8 + i * gap) * spb, word: w, lanes, correct: lanes.indexOf(w.dz), travel };
    });
    return {
      events,
      duration: events[events.length - 1].t + 2.4,
      lane: 1, shipX: 0, tilt: 0, lastSwitch: -9,
      score: 0, combo: 0, maxCombo: 0, perfect: 0, good: 0, miss: 0,
      particles: [] as Particle[], popups: [] as Popup[],
      shake: 0, flash: 0, flashColor: '#b6ff2e', glitch: 0,
      perWord: new Map<string, { hit: number; miss: number }>(),
      finished: false, lastCount: -1, evIndex: 0,
    };
  }

  const steer = useCallback((dir: -1 | 1) => {
    const st = stRef.current;
    if (!st || pausedRef.current) return;
    const next = Math.max(0, Math.min(2, st.lane + dir));
    if (next !== st.lane) {
      st.lane = next;
      st.lastSwitch = audio.time();
      audio.uiClick();
      const c = canvasRef.current;
      if (c) for (let i = 0; i < 5; i++) {
        st.particles.push({ x: c.clientWidth / 2, y: c.clientHeight * 0.86, vx: -dir * (40 + Math.random() * 90), vy: -30 - Math.random() * 60, life: 0.4, max: 0.4, size: 2, color: '#00f0ff' });
      }
    }
  }, []);

  const togglePause = useCallback(() => {
    setPaused((p) => {
      const np = !p;
      pausedRef.current = np;
      if (np) audio.suspend(); else audio.resume();
      return np;
    });
  }, []);

  const restart = useCallback(() => {
    stRef.current = freshState();
    setPaused(false); pausedRef.current = false;
    setToasts([]);
    audio.startMusic(track.bpm + (mode === 'revenge' ? 16 : 0), track.root, mode === 'revenge' ? 1 : 0.4);
    audio.countTick(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, mode]);

  useEffect(() => {
    restart();
    narrator.narrateHighway(track);
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd', 'A', 'D'].includes(e.key)) e.preventDefault();
      if (e.repeat) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') steer(-1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') steer(1);
      if (e.key === ' ') togglePause();
    };
    window.addEventListener('keydown', onKey);
    const onResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(c.clientWidth * dpr);
      c.height = Math.floor(c.clientHeight * dpr);
    };
    onResize();
    window.addEventListener('resize', onResize);

    let raf = 0, last = performance.now();
    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      const st = stRef.current, c = canvasRef.current;
      if (!st || !c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      if (!pausedRef.current) update(st, dt);
      draw(ctx, c.clientWidth, c.clientHeight, st);
      syncHud(st);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      audio.stopMusic();
      narrator.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart, steer, togglePause, track]);

  /* ---------------- game logic ---------------- */
  function update(st: NonNullable<typeof stRef.current>, dt: number) {
    const now = audio.time();
    const c = canvasRef.current;
    const W = c ? c.clientWidth : 800, H = c ? c.clientHeight : 600;

    // ship spring — lane spacing matches road projection exactly: 2*half(1)/3
    const laneW = (W * (0.042 + 0.44) * 2) / 3;
    const targetX = W / 2 + (st.lane - 1) * laneW;
    const dx = targetX - st.shipX;
    st.shipX += dx * Math.min(1, dt * 13);
    st.tilt += ((dx * 0.0022) - st.tilt) * Math.min(1, dt * 10);

    // countdown ticks
    const beat = audio.beat();
    if (beat >= 0 && beat < 8) {
      const cb = Math.floor(beat / 2);
      if (cb !== st.lastCount) { st.lastCount = cb; audio.countTick(cb === 3); }
    }

    // target word HUD (next unresolved event within view)
    const upcoming = st.events.find((e) => !e.done && e.t > now - 0.2);
    if (upcoming) {
      const idx = st.events.indexOf(upcoming);
      if (!targetRef.current || targetRef.current.idx !== idx) {
        const t = { de: upcoming.word.de, ipa: upcoming.word.ipa, idx };
        targetRef.current = t;
        setTarget(t);
      }
    }

    // judging
    for (const ev of st.events) {
      if (ev.done) continue;
      if (ev.pendingAt !== undefined) {
        if (st.lane === ev.correct && now < ev.pendingAt + GRACE) judge(st, ev, 'good', W, H);
        else if (now >= ev.pendingAt + GRACE) judge(st, ev, 'miss', W, H);
        continue;
      }
      if (now >= ev.t) {
        if (st.lane === ev.correct) judge(st, ev, (now - st.lastSwitch) > PERFECT_LOCK ? 'perfect' : 'good', W, H);
        else ev.pendingAt = now;
      }
    }

    // particles (O(1) swap-and-pop removal to eliminate GC pause spikes)
    for (let i = st.particles.length - 1; i >= 0; i--) {
      const p = st.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        const last = st.particles.pop();
        if (last && i < st.particles.length) st.particles[i] = last;
        continue;
      }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (!p.ring) p.vy += 160 * dt;
    }
    for (let i = st.popups.length - 1; i >= 0; i--) {
      const p = st.popups[i];
      p.life -= dt; p.y -= 34 * dt;
      if (p.life <= 0) {
        const last = st.popups.pop();
        if (last && i < st.popups.length) st.popups[i] = last;
        continue;
      }
    }
    st.shake = Math.max(0, st.shake - dt * 34);
    st.flash = Math.max(0, st.flash - dt * 2.6);
    st.glitch = Math.max(0, st.glitch - 1);

    // Photosensitivity & reduced motion protection
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      st.shake = 0;
      st.flash = 0;
    }

    // thruster
    if (st.particles.length < 200 && Math.random() < 0.7) {
      st.particles.push({ x: st.shipX + (Math.random() - 0.5) * 10, y: H * 0.86 + 16, vx: (Math.random() - 0.5) * 30, vy: 120 + Math.random() * 120, life: 0.35, max: 0.35, size: 2.4, color: Math.random() < 0.5 ? '#00f0ff' : '#ff2d78' });
    }

    // finish
    if (!st.finished && now > st.duration) {
      st.finished = true;
      audio.stopMusic();
      const total = st.events.length;
      const acc = total ? (st.perfect + st.good * 0.7) / total : 0;
      const perWord: Record<string, { hit: number; miss: number }> = {};
      st.perWord.forEach((v, k) => { perWord[k] = v; });
      window.setTimeout(() => onFinishRef.current({
        score: st.score, perfect: st.perfect, good: st.good, miss: st.miss,
        maxCombo: st.maxCombo, acc, perWord,
      }), 500);
    }
  }

  function judge(st: NonNullable<typeof stRef.current>, ev: GateEv, kind: 'perfect' | 'good' | 'miss', W: number, H: number) {
    ev.done = kind;
    const rec = st.perWord.get(ev.word.de) ?? { hit: 0, miss: 0 };
    const laneW = (W * (0.042 + 0.44) * 2) / 3;
    const gx = W / 2 + (ev.correct - 1) * laneW, gy = H * 0.86;
    if (kind === 'miss') {
      rec.miss += 1;
      st.miss += 1; st.combo = 0;
      st.shake = 13; st.glitch = 9; st.flash = 0.55; st.flashColor = '#ff2d78';
      st.popups.push({ text: 'MISS', color: '#ff2d78', x: W / 2, y: H * 0.5, life: 0.8, big: true });
      audio.miss();
      const hint = pairHint(ev.word.de);
      setToasts((t) => [...t.slice(-2), hint]);
      window.setTimeout(() => setToasts((t) => t.slice(1)), 1400);
    } else {
      rec.hit += 1;
      if (kind === 'perfect') {
        st.perfect += 1;
        st.score += 100 + st.combo * 8;
        st.popups.push({ text: 'PERFECT', color: '#b6ff2e', x: gx, y: gy - 90, life: 0.7 });
        st.flash = 0.3; st.flashColor = '#b6ff2e';
        audio.perfect(st.combo);
        st.particles.push({ x: gx, y: gy, vx: 0, vy: 0, life: 0.5, max: 0.5, size: 6, color: '#b6ff2e', ring: true });
        for (let i = 0; i < 26; i++) {
          const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 320;
          st.particles.push({ x: gx, y: gy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, life: 0.6, max: 0.6, size: 2.6, color: Math.random() < 0.5 ? '#b6ff2e' : '#00f0ff' });
        }
      } else {
        st.good += 1;
        st.score += 60 + st.combo * 4;
        st.popups.push({ text: 'GOOD', color: '#00f0ff', x: gx, y: gy - 90, life: 0.6 });
        audio.hit(st.combo);
        for (let i = 0; i < 10; i++) {
          const a = Math.random() * Math.PI * 2, v = 80 + Math.random() * 180;
          st.particles.push({ x: gx, y: gy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: 0.45, max: 0.45, size: 2, color: '#00f0ff' });
        }
      }
      st.combo += 1;
      st.maxCombo = Math.max(st.maxCombo, st.combo);
    }
    st.perWord.set(ev.word.de, rec);
  }

  function syncHud(st: NonNullable<typeof stRef.current>) {
    const done = st.events.filter((e) => e.done).length;
    const judged = st.perfect + st.good + st.miss;
    const acc = judged ? (st.perfect + st.good * 0.7) / judged : 1;
    const h = { score: st.score, combo: st.combo, acc, done, total: st.events.length };
    const prev = hudRef.current;
    if (prev.score !== h.score || prev.combo !== h.combo || prev.done !== h.done || Math.abs(prev.acc - h.acc) > 0.004) {
      hudRef.current = h;
      setHud(h);
    }
  }

  /* ---------------- rendering ---------------- */
  function draw(ctx: CanvasRenderingContext2D, W: number, H: number, st: NonNullable<typeof stRef.current>) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const now = audio.time();
    const beat = Math.max(0, audio.beat());
    const pulse = 1 - (beat % 1);
    const horizonY = H * 0.36, shipY = H * 0.86;
    const rng0 = mulberry32(4242);

    ctx.save();
    if (st.shake > 0) ctx.translate((Math.random() - 0.5) * st.shake, (Math.random() - 0.5) * st.shake);

    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#03040c');
    sky.addColorStop(0.34, '#0b0d24');
    sky.addColorStop(0.42, '#23102f');
    sky.addColorStop(1, '#04060e');
    ctx.fillStyle = sky;
    ctx.fillRect(-20, -20, W + 40, H + 40);

    // stars
    for (let i = 0; i < 110; i++) {
      const x = rng0() * W, y = rng0() * horizonY * 0.95;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(now * (0.6 + rng0() * 1.4) + i));
      ctx.fillStyle = `rgba(217,236,255,${0.5 * tw})`;
      ctx.fillRect(x, y, rng0() < 0.12 ? 2 : 1, rng0() < 0.12 ? 2 : 1);
    }

    // synth sun
    const sunR = H * 0.17;
    const sun = ctx.createRadialGradient(W / 2, horizonY, 6, W / 2, horizonY, sunR);
    sun.addColorStop(0, '#ffd23e');
    sun.addColorStop(0.45, '#ff2d78');
    sun.addColorStop(1, 'rgba(255,45,120,0)');
    ctx.fillStyle = sun;
    ctx.beginPath();
    ctx.arc(W / 2, horizonY, sunR, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#0b0d24';
    for (let i = 0; i < 5; i++) {
      const yy = horizonY - sunR * 0.1 - i * sunR * 0.16;
      ctx.fillRect(W / 2 - sunR, yy, sunR * 2, 2 + i * 1.6);
    }

    // mountains — two parallax ridges
    const dist = beat * 3;
    for (let layer = 0; layer < 2; layer++) {
      const rL = mulberry32(900 + layer * 77);
      const pts: number[] = [];
      const seg = 14;
      for (let i = 0; i <= 40; i++) pts.push(rL());
      const off = ((dist * (layer === 0 ? 1.4 : 3)) % (seg * 2)) - seg * 2;
      ctx.beginPath();
      ctx.moveTo(-40, horizonY + 1);
      for (let x = -40; x <= W + 40; x += seg) {
        const idx = Math.abs(Math.floor((x - off) / seg)) % 40;
        const hgt = pts[idx] * (layer === 0 ? H * 0.1 : H * 0.06) + 4;
        ctx.lineTo(x, horizonY + 1 - hgt);
      }
      ctx.lineTo(W + 40, horizonY + 1);
      ctx.closePath();
      ctx.fillStyle = layer === 0 ? '#0a0f22' : '#0d0a1e';
      ctx.fill();
      ctx.strokeStyle = layer === 0 ? 'rgba(0,240,255,0.5)' : 'rgba(255,45,120,0.45)';
      ctx.lineWidth = layer === 0 ? 1.4 : 1;
      ctx.stroke();
    }

    // horizon glow
    ctx.fillStyle = `rgba(0,240,255,${0.14 + pulse * 0.1})`;
    ctx.fillRect(0, horizonY - 1, W, 2);

    // road projection helpers
    const T = (z: number) => CAM / (CAM + z);
    const Y = (t: number) => horizonY + (shipY - horizonY) * t;
    const half = (t: number) => W * (0.042 + 0.44 * t);

    // floor fill
    ctx.beginPath();
    ctx.moveTo(W / 2 - half(0.001), Y(0.001));
    ctx.lineTo(W / 2 + half(0.001), Y(0.001));
    ctx.lineTo(W / 2 + half(T(0)), Y(T(0)));
    ctx.lineTo(W / 2 - half(T(0)), Y(T(0)));
    ctx.closePath();
    const floor = ctx.createLinearGradient(0, horizonY, 0, H);
    floor.addColorStop(0, '#0a1024');
    floor.addColorStop(1, '#060a18');
    ctx.fillStyle = floor;
    ctx.fill();

    // moving horizontal grid
    const spacing = 4;
    const gOff = (dist % spacing);
    ctx.lineWidth = 1;
    for (let k = 0; k < 15; k++) {
      const z = k * spacing + (spacing - gOff) + 0.01;
      const t = T(z);
      if (t <= 0.01) continue;
      const y = Y(t);
      ctx.strokeStyle = `rgba(0,240,255,${0.05 + t * (0.22 + pulse * 0.1)})`;
      ctx.beginPath();
      ctx.moveTo(W / 2 - half(t), y);
      ctx.lineTo(W / 2 + half(t), y);
      ctx.stroke();
    }
    // lane dividers + rails
    for (let l = -1.5; l <= 1.5; l += 1) {
      const edge = Math.abs(l) === 1.5;
      ctx.strokeStyle = edge ? `rgba(0,240,255,${0.65 + pulse * 0.25})` : 'rgba(0,240,255,0.22)';
      ctx.lineWidth = edge ? 2 : 1;
      ctx.beginPath();
      for (let z = 0; z <= Z_MAX; z += 1.2) {
        const t = T(z);
        const x = W / 2 + l * (half(t) * 2) / 3;
        if (z === 0) ctx.moveTo(x, Y(t)); else ctx.lineTo(x, Y(t));
      }
      ctx.stroke();
    }

    // gates — far to near (lane centers follow road projection: (lane-1)*2*half(t)/3)
    const evs = st.events
      .map((ev) => ({ ev, zn: (ev.t - now) / ev.travel }))
      .filter((g) => g.zn > -0.04 && g.zn <= 1.06 && !g.ev.done)
      .sort((a, b) => b.zn - a.zn);
    const nearest = evs.length ? evs[evs.length - 1] : null;

    for (const g of evs) {
      const z = Math.max(0.01, g.zn * Z_MAX);
      const t = T(z);
      const y = Y(t);
      const gateH = H * 0.27 * t + 14;
      const isNearest = g === nearest;
      for (let lane = 0; lane < 3; lane++) {
        const cx = W / 2 + (lane - 1) * (half(t) * 2 / 3);
        const gw = (half(t) * 2 / 3) * 0.9;
        const near = isNearest && 1 - t < 0.5;
        ctx.strokeStyle = near ? 'rgba(255,255,255,0.95)' : `rgba(0,240,255,${0.25 + t * 0.55})`;
        ctx.lineWidth = near ? 2 : 1.2;
        ctx.fillStyle = `rgba(6,14,30,${0.55 + t * 0.3})`;
        // posts + bar
        ctx.beginPath();
        ctx.moveTo(cx - gw / 2, y);
        ctx.lineTo(cx - gw / 2, y - gateH);
        ctx.lineTo(cx + gw / 2, y - gateH);
        ctx.lineTo(cx + gw / 2, y);
        ctx.stroke();
        ctx.fillRect(cx - gw / 2, y - gateH, gw, gateH * 0.42);
        ctx.strokeRect(cx - gw / 2, y - gateH, gw, gateH * 0.42);
        // label — Darija in Arabic script, big & obvious (this is the answer)
        const fs = Math.max(15, 33 * t);
        ctx.fillStyle = near ? '#ffffff' : `rgba(0,240,255,${0.55 + t * 0.45})`;
        ctx.font = `700 ${fs}px "Noto Kufi Arabic", sans-serif`;
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';
        ctx.fillText(g.ev.lanes[lane], cx, y - gateH + gateH * 0.28);
      }
      // approach chevron under the live gate row
      if (isNearest) {
        const yC = y + 10 * t + 6;
        ctx.fillStyle = `rgba(182,255,46,${0.5 + pulse * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 12, yC - 8); ctx.lineTo(W / 2 + 12, yC - 8); ctx.lineTo(W / 2, yC);
        ctx.closePath(); ctx.fill();
      }
    }

    // hit line
    ctx.strokeStyle = `rgba(182,255,46,${0.5 + pulse * 0.4})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#b6ff2e';
    ctx.shadowBlur = 12 + pulse * 10;
    ctx.beginPath();
    ctx.moveTo(W / 2 - half(T(0)) * 0.98, shipY);
    ctx.lineTo(W / 2 + half(T(0)) * 0.98, shipY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ship
    const sx = st.shipX || W / 2;
    ctx.save();
    ctx.translate(sx, shipY);
    ctx.rotate(st.tilt);
    // thruster flame
    const fl = 14 + Math.random() * 12 + pulse * 8;
    const flame = ctx.createLinearGradient(0, 10, 0, 10 + fl);
    flame.addColorStop(0, 'rgba(255,210,62,0.95)');
    flame.addColorStop(1, 'rgba(255,45,120,0)');
    ctx.fillStyle = flame;
    ctx.beginPath();
    ctx.moveTo(-7, 10); ctx.lineTo(7, 10); ctx.lineTo(0, 10 + fl);
    ctx.closePath(); ctx.fill();
    // hull
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#071527';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -26); ctx.lineTo(17, 10); ctx.lineTo(7, 14); ctx.lineTo(-7, 14); ctx.lineTo(-17, 10);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff2d78';
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(5, 4); ctx.lineTo(-5, 4);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // particles
    ctx.globalCompositeOperation = 'lighter';
    for (const p of st.particles) {
      const a = p.life / p.max;
      if (p.ring) {
        ctx.strokeStyle = p.color + Math.floor(a * 200).toString(16).padStart(2, '0');
        ctx.lineWidth = 3 * a + 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (1 - a) * 130 + 8, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = a;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalCompositeOperation = 'source-over';

    // combo speed lines
    if (st.combo >= 8) {
      const a = Math.min(0.5, (st.combo - 8) * 0.03);
      ctx.strokeStyle = `rgba(0,240,255,${a})`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 10; i++) {
        const y0 = (rng0() * H * 0.8);
        const side = i % 2 === 0;
        const x0 = side ? rng0() * W * 0.12 : W - rng0() * W * 0.12;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (side ? 40 : -40), y0 + 60); ctx.stroke();
      }
    }

    // popups
    for (const p of st.popups) {
      const a = Math.min(1, p.life * 2.2);
      ctx.globalAlpha = a;
      ctx.font = `400 ${p.big ? 44 : 26}px Audiowide, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = p.color; ctx.shadowBlur = 16;
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // countdown
    if (now < (8 * 60) / (track.bpm + (mode === 'revenge' ? 16 : 0))) {
      const labels = ['3', '2', '1', 'GO'];
      const li = Math.max(0, Math.min(3, Math.floor(beat / 2)));
      const frac = 1 - ((beat % 2) / 2);
      ctx.globalAlpha = Math.min(1, frac * 2);
      ctx.font = '400 84px Audiowide, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = labels[li] === 'GO' ? '#b6ff2e' : '#00f0ff';
      ctx.shadowBlur = 30;
      ctx.fillStyle = labels[li] === 'GO' ? '#b6ff2e' : '#00f0ff';
      ctx.fillText(labels[li], W / 2, H * 0.46);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // glitch slices on miss
    if (st.glitch > 0) {
      ctx.fillStyle = 'rgba(255,45,120,0.12)';
      for (let i = 0; i < 3; i++) {
        const gy = Math.random() * H, gh = 6 + Math.random() * 20;
        ctx.fillRect((Math.random() - 0.5) * 40, gy, W, gh);
      }
    }

    ctx.restore();

    // full flash
    if (st.flash > 0) {
      ctx.globalAlpha = st.flash * 0.22;
      ctx.fillStyle = st.flashColor;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }

  /* ---------------- DOM ---------------- */
  const comboKey = hud.combo;
  return (
    <div className="relative h-full w-full overflow-hidden bg-void select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        onPointerDown={(e) => {
          const r = (e.target as HTMLElement).getBoundingClientRect();
          steer(e.clientX - r.left < r.width / 2 ? -1 : 1);
        }}
      />
      <div className="scanlines vignette pointer-events-none absolute inset-0" />

      {/* top HUD */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-3 md:p-5 pointer-events-none">
        <div className="panel chamfer-sm px-4 py-2 min-w-[150px]">
          <div className="panel-tag">SCORE</div>
          <div className="font-display text-2xl md:text-3xl text-cyan text-glow-cyan leading-none">{hud.score.toString().padStart(6, '0')}</div>
          <div className={`mt-1 font-display text-sm ${hud.combo >= 10 ? 'text-lime text-glow-lime' : 'text-dim'}`}>
            <span key={comboKey} className={hud.combo > 0 ? 'inline-block combo-pop' : ''}>{hud.combo}x</span>
            {hud.combo >= 10 && <span className="ml-2 text-[10px] tracking-widest">COMBO LAW</span>}
          </div>
        </div>

        {target && (
          <div key={target.idx} className="panel chamfer px-8 py-3 text-center rise">
            <div className="panel-tag">TARGET · دوز اللين الصحيحة</div>
            <div className="font-display text-3xl md:text-5xl text-ink leading-tight text-glow-cyan">{target.de}</div>
            <div className="text-dim text-base tracking-wider">{target.ipa}</div>
          </div>
        )}

        <div className="panel chamfer-sm px-4 py-2 text-right min-w-[150px]">
          <div className="panel-tag">ACCURACY</div>
          <div className={`font-display text-2xl leading-none ${hud.acc >= 0.85 ? 'text-lime' : hud.acc >= 0.6 ? 'text-amber' : 'text-mag'}`}>
            {Math.round(hud.acc * 100)}%
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-line/60">
            <div className="h-full bg-cyan transition-all duration-300" style={{ width: `${hud.total ? (hud.done / hud.total) * 100 : 0}%` }} />
          </div>
          <div className="text-[10px] text-dim tracking-widest mt-1">{track.bpm + (mode === 'revenge' ? 16 : 0)} BPM</div>
        </div>
      </div>

      {/* mode chip + toasts */}
      <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 pointer-events-none">
        <div className={`chamfer-sm px-3 py-1 font-display text-xs tracking-widest ${mode === 'revenge' ? 'bg-mag/15 text-mag border border-mag/50 pulse-mag' : 'bg-cyan/10 text-cyan border border-cyan/40'}`}>
          {mode === 'revenge' ? '◢ REVENGE PROTOCOL' : `◢ ${track.tier} — ${track.title}`}
        </div>
      </div>
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
        {toasts.map((t, i) => (
          <div key={`${t}-${i}`} className="rise chamfer-sm bg-mag/15 border border-mag/50 text-mag px-4 py-1 font-ar text-lg leading-none">
            {t}
          </div>
        ))}
      </div>

      {/* controls hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-dim text-sm pointer-events-none flex items-center gap-3 font-ar">
        <span className="border border-line px-2 py-0.5 text-cyan font-body tracking-widest">◀ A</span>
        <span>دوّر اللينات</span>
        <span className="border border-line px-2 py-0.5 text-cyan font-body tracking-widest">D ▶</span>
        <span className="hidden md:inline border border-line px-2 py-0.5 text-amber font-body tracking-widest">ESC ⏸</span>
      </div>

      {/* mobile touch steering controls */}
      <div className="md:hidden absolute inset-x-0 bottom-12 flex items-center justify-between px-6 pointer-events-none z-30">
        <button
          type="button"
          aria-label="سوق لليسر (Steer Left)"
          onPointerDown={(e) => { e.stopPropagation(); steer(-1); }}
          className="pointer-events-auto w-16 h-16 rounded-full bg-void/80 border-2 border-cyan/70 text-cyan text-3xl font-display flex items-center justify-center active:scale-90 active:bg-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.4)] select-none"
        >
          ◀
        </button>
        <button
          type="button"
          aria-label="سوق لليمن (Steer Right)"
          onPointerDown={(e) => { e.stopPropagation(); steer(1); }}
          className="pointer-events-auto w-16 h-16 rounded-full bg-void/80 border-2 border-cyan/70 text-cyan text-3xl font-display flex items-center justify-center active:scale-90 active:bg-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.4)] select-none"
        >
          ▶
        </button>
      </div>

      <button
        type="button"
        onClick={togglePause}
        aria-label={paused ? 'Resume highway run' : 'Pause highway run'}
        className="absolute bottom-3 right-3 md:bottom-5 md:right-5 neon-btn chamfer-sm px-4 py-2 text-xs"
      >
        {paused ? 'RESUME' : 'PAUSE'}
      </button>

      {/* pause overlay */}
      {paused && (
        <div className="absolute inset-0 z-50 bg-void/80 backdrop-blur-sm flex items-center justify-center">
          <div className="panel chamfer p-8 w-[min(92vw,460px)] rise">
            <div className="panel-tag mb-2">SYSTEM HALT</div>
            <div className="font-display text-3xl text-cyan text-glow-cyan mb-1">PAUSED</div>
            <p className="text-dim mb-6 font-ar">الرانر واقف. الـ beat clock مسيّب — ما كاين حتى drift.</p>
            <div className="grid gap-3">
              <button onClick={togglePause} className="neon-btn chamfer-sm px-5 py-3">RESUME RUN</button>
              <button onClick={() => { togglePause(); restart(); }} className="neon-btn neon-btn-mag chamfer-sm px-5 py-3">RESTART TRACK</button>
              <button onClick={onExit} className="neon-btn chamfer-sm px-5 py-3 !text-dim !border-line">EXIT TO COMMAND DECK</button>
            </div>
            <div className="mt-6 text-sm text-dim grid grid-cols-2 gap-y-1 font-ar">
              <span>◀ ▶ / A D — بدّل اللينات</span>
              <span>ESC / P — الوقفة</span>
              <span className="col-span-2">دوز اللين اللي فيها الترجمة الصحيحة بالدارجة.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
