/* ============================================================
   LADA — SENTIENT MEMORY (SRS ENGINE)
   Retention decay  R = e^(-Δt / S)   with S in milliseconds.
   CRITICAL_DECAY under 40%. Mastery Law: >=85% acc.
   Revenge levels are synthesized from the weakest morphemes.
   Persistence: localStorage, zero-latency, local-first.
   ============================================================ */

import { PASS_ACC, TRACKS, type Track, type Word } from './content';

export interface WordStat {
  ok: number;
  fail: number;
  last: number;   // epoch ms
  S: number;      // stability, ms
}

export interface TrackRecord { best: number; passes: number }

export interface Profile {
  v: number;
  xp: number;
  words: Record<string, WordStat>;
  tracks: Record<string, TrackRecord>;
  revenge: string[]; // track ids awaiting a revenge run
  runs: number;
}

const KEY = 'lada_memory_v1';
const H = 3600_000;

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Profile;
      if (p && p.v === 1 && p.words && p.tracks) return p;
    }
  } catch { /* corrupted memory — rebuild */ }
  return { v: 1, xp: 0, words: {}, tracks: {}, revenge: [], runs: 0 };
}

export function saveProfile(p: Profile) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* quota — keep in RAM */ }
}

/** R = e^(-Δt/S) — memory retention at `now` */
export function retention(stat: WordStat | undefined, now: number): number {
  if (!stat || stat.last <= 0) return 0;
  const S = Math.max(stat.S, 0.1 * H);
  const delta = Math.max(0, now - stat.last);
  return Math.exp(-delta / S);
}

export function isCritical(stat: WordStat | undefined, now: number): boolean {
  return !!stat && (stat.fail >= 2 || retention(stat, now) < 0.4);
}

function touch(p: Profile, de: string): WordStat {
  if (!p.words[de]) p.words[de] = { ok: 0, fail: 0, last: 0, S: 3 * H };
  return p.words[de];
}

/** Record one exposure outcome. Hit: S grows ~2.1x. Miss: S collapses. */
export function record(p: Profile, de: string, hit: boolean, now = Date.now()): Profile {
  const s = touch(p, de);
  if (hit) { s.ok += 1; s.S = Math.min(72 * H, Math.max(s.S * 2.1, 3 * H)); }
  else { s.fail += 1; s.S = Math.max(0.6 * H, s.S * 0.45); }
  s.last = now;
  p.xp += hit ? 12 : 3;
  return p;
}

/** Weakest words overall (or within a track), most decayed / most failed first. */
export function weakest(p: Profile, pool: Word[], n: number, now = Date.now()): Word[] {
  return [...pool]
    .map((w) => {
      const st = p.words[w.de];
      const R = retention(st, now);
      const score = (st ? st.fail * 2 : 0) + (1 - R) * 3 - (st ? st.ok * 0.2 : 0);
      return { w, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.w);
}

export interface RunVerdict {
  passed: boolean;
  revengeTriggered: boolean;
  failedWords: Word[];
}

/** Mastery law + revenge trigger. Mutates and returns a new profile. */
export function registerRun(
  p: Profile, track: Track, acc: number, failed: Word[], mode: 'normal' | 'revenge',
): { profile: Profile; verdict: RunVerdict } {
  const next: Profile = { ...p, words: { ...p.words }, tracks: { ...p.tracks }, revenge: [...p.revenge], runs: p.runs + 1 };
  const rec = next.tracks[track.id] ?? { best: 0, passes: 0 };
  const passed = acc >= PASS_ACC;

  if (mode === 'normal') {
    next.tracks[track.id] = { best: Math.max(rec.best, acc), passes: rec.passes + (passed ? 1 : 0) };
    const revengeTriggered = !passed || failed.length >= 3;
    if (revengeTriggered && !next.revenge.includes(track.id)) next.revenge.push(track.id);
    if (passed && acc >= 0.85 && failed.length === 0) {
      next.revenge = next.revenge.filter((id) => id !== track.id);
    }
    return { profile: next, verdict: { passed, revengeTriggered, failedWords: failed } };
  }

  // revenge run: clear the flag only on a clean kill
  if (passed) next.revenge = next.revenge.filter((id) => id !== track.id);
  next.tracks[track.id] = { best: Math.max(rec.best, acc), passes: rec.passes + (passed ? 1 : 0) };
  return { profile: next, verdict: { passed, revengeTriggered: !passed, failedWords: failed } };
}

export function isUnlocked(p: Profile, track: Track): boolean {
  const idx = TRACKS.findIndex((t) => t.id === track.id);
  if (idx <= 0) return true;
  const prev = TRACKS[idx - 1];
  return (p.tracks[prev.id]?.best ?? 0) >= PASS_ACC;
}

export function isMastered(p: Profile, track: Track): boolean {
  return (p.tracks[track.id]?.best ?? 0) >= PASS_ACC;
}

export function allMastered(p: Profile): boolean {
  return TRACKS.every((t) => isMastered(p, t));
}

/** decay ticker — recomputed on every hub visit */
export function decaySnapshot(p: Profile, now = Date.now()) {
  const entries = Object.entries(p.words)
    .map(([de, st]) => ({ de, st, R: retention(st, now), critical: isCritical(st, now) }))
    .sort((a, b) => a.R - b.R);
  return {
    total: entries.length,
    critical: entries.filter((e) => e.critical).length,
    weakest: entries.slice(0, 8),
  };
}
