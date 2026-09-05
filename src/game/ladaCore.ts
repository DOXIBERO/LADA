/* ============================================================
   LADA CORE — ON-DEVICE LINGUISTIC INTELLIGENCE
   Same async contract the cloud rotator would expose
   (generateCoaching / analyzeRun / revengeBrief), executed
   fully on-device: zero network, zero keys in the bundle.
   Swap the bodies for /api/ai proxy calls to go hybrid.
   ============================================================ */

import { COACH, PASS_ACC, PRAISE, QUIPS, TRAPS, findWord, type Word } from './content';
import { mulberry32 } from './content';

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

/** Post-run Darija coaching: trap-specific fixes for what the player missed. */
export async function analyzeRun(missed: Word[], acc: number, seed: number): Promise<string[]> {
  await wait(260);
  const rng = mulberry32(seed);
  const lines: string[] = [];

  if (acc >= 0.97) lines.push(pick(rng, PRAISE));
  else if (acc >= PASS_ACC) lines.push(`Duzti l-examen b ${Math.round(acc * 100)}% — l-CORE kayd3em l-combo dyalek l 10x.`);
  else lines.push(`L-accuracy ${Math.round(acc * 100)}% — ma duztech l-Mastery Law (85%). L-CORE khzen kol ghalta, w ghadi yrje3ha lik f revenge track.`);

  const seen = new Set<string>();
  for (const w of missed) {
    if (lines.length >= 5) break;
    const key = w.trap;
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(`[${TRAPS[key].label}] ${COACH[key]}`);
  }
  if (missed.length === 0 && acc < PASS_ACC) {
    lines.push('L-kelmات msalin walakin l-timing khasso ytshel — ركز على الـbeat، machi غير المعنى.');
  }
  lines.push(pick(rng, QUIPS));
  return lines.slice(0, 5);
}

/** Per-word vocal feedback line. */
export async function vocalFeedback(word: Word, score: number): Promise<string> {
  await wait(120);
  if (score >= 85) return `'${word.de}' — ${word.dz}! Nti9tek kant نقية. ${pick(mulberry32(score * 7 + word.de.length), QUIPS)}`;
  if (score >= 60) return `'${word.de}' mchat mzyan, walakin رجع لـ ${TRAPS[word.trap].label}: ${TRAPS[word.trap].tip}`;
  return `3andak fhad l-kelma: ${TRAPS[word.trap].tip}`;
}

/** Revenge-level briefing from the decayed morphemes. */
export async function revengeBrief(words: Word[]): Promise<string[]> {
  await wait(200);
  const sample = words.slice(0, 4).map((w) => w.de).join(' · ');
  return [
    `L-CORE l9a ${words.length} dyal l-kelm f CRITICAL_DECAY: ${sample}.`,
    'Ghadi ndir lik Boss Revenge Track — BPM tela3, l-gapwell sgher, w ghir l-kelm d3ifa.',
    'Duzeha b 85%+ bash tsali l-protocol. Yallah!',
  ];
}

/** Quick lookup used by the highway's miss toasts. */
export function pairHint(de: string): string {
  const w = findWord(de);
  return w ? `${w.de.toUpperCase()} ⟶ ${w.dz.toUpperCase()}` : de.toUpperCase();
}
