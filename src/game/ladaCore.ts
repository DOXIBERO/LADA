/* ============================================================
   LADA CORE — ON-DEVICE LINGUISTIC INTELLIGENCE
   Same async contract the cloud rotator would expose
   (generateCoaching / analyzeRun / revengeBrief), executed
   fully on-device: zero network, zero keys in the bundle.
   Darija output is in Arabic script (الدارجة بالحروف العربية).
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
  else if (acc >= PASS_ACC) lines.push(`دوزتي الامتحان ب ${Math.round(acc * 100)}% — الـ CORE كيدعم الكومبو ديالك ل 10x.`);
  else lines.push(`الأكوراسي ${Math.round(acc * 100)}% — ما دوزتيش الـ Mastery Law (85%). الـ CORE خزّن كل غلطة، و غادي يرجعها ليك فالـ revenge track.`);

  const seen = new Set<string>();
  for (const w of missed) {
    if (lines.length >= 5) break;
    const key = w.trap;
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(`[${TRAPS[key].label}] ${COACH[key]}`);
  }
  if (missed.length === 0 && acc < PASS_ACC) {
    lines.push('الكلمات صافيّين ولكن التايمينغ خاصو يتشحذ — ركّز على الـ beat، ماشي غير المعنى.');
  }
  lines.push(pick(rng, QUIPS));
  return lines.slice(0, 5);
}

/** Per-word vocal feedback line. */
export async function vocalFeedback(word: Word, score: number): Promise<string> {
  await wait(120);
  if (score >= 85) return `'${word.de}' — ${word.dz}! النتيقة ديالك كانت نقية. ${pick(mulberry32(score * 7 + word.de.length), QUIPS)}`;
  if (score >= 60) return `'${word.de}' مشات مزيان، ولكن رجع لـ ${TRAPS[word.trap].label}: ${TRAPS[word.trap].tip}`;
  return `عندك فهاد الكلمة: ${TRAPS[word.trap].tip}`;
}

/** Revenge-level briefing from the decayed morphemes. */
export async function revengeBrief(words: Word[]): Promise<string[]> {
  await wait(200);
  const sample = words.slice(0, 4).map((w) => `${w.de} (${w.dz})`).join(' · ');
  return [
    `الـ CORE لقا ${words.length} ديال الكلم فالـ CRITICAL_DECAY: ${sample}.`,
    'غادي ندير ليك Boss Revenge Track — الـ BPM طلع، المسافة صغرات، و غير الكلم الضعيفة.',
    'دوزها ب 85%+ باش تصافي البروتوكول. يالله!',
  ];
}

/** Quick lookup used by the highway's miss toasts. */
export function pairHint(de: string): string {
  const w = findWord(de);
  return w ? `${w.de} ⟵ ${w.dz}` : de;
}
