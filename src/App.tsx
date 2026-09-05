import { useCallback, useEffect, useState } from 'react';
import Boot from './components/Boot';
import Hub from './components/Hub';
import Studio from './components/Studio';
import Highway, { type HighwayResult } from './components/Highway';
import Vocal, { type VocalResult } from './components/Vocal';
import Results from './components/Results';
import { audio } from './game/audio';
import { ALL_WORDS, TRACKS, findWord, type Track, type Word } from './game/content';
import { analyzeRun } from './game/ladaCore';
import {
  allMastered, loadProfile, record, registerRun, saveProfile, weakest,
  type Profile, type RunVerdict,
} from './game/srs';

type Screen = 'boot' | 'hub' | 'studio' | 'highway' | 'vocal' | 'results';

const clone = (p: Profile): Profile => JSON.parse(JSON.stringify(p)) as Profile;

export default function App() {
  const [screen, setScreen] = useState<Screen>('boot');
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [session, setSession] = useState<{ track: Track; mode: 'normal' | 'revenge' } | null>(null);
  const [weakWords, setWeakWords] = useState<Word[]>([]);
  const [hw, setHw] = useState<HighwayResult | null>(null);
  const [vocal, setVocal] = useState<VocalResult | null>(null);
  const [verdict, setVerdict] = useState<RunVerdict | null>(null);
  const [overall, setOverall] = useState(0);
  const [coachLines, setCoachLines] = useState<string[]>([]);
  const [muted, setMuted] = useState(false);

  // keep memory persisted
  useEffect(() => { saveProfile(profile); }, [profile]);

  const deploy = useCallback((t: Track) => {
    setWeakWords(weakest(profile, ALL_WORDS, 6));
    setSession({ track: t, mode: 'normal' });
    setHw(null); setVocal(null); setVerdict(null); setCoachLines([]);
    setScreen('studio');
  }, [profile]);

  const startRevenge = useCallback((t: Track) => {
    setWeakWords(weakest(profile, ALL_WORDS, 6));
    setSession({ track: t, mode: 'revenge' });
    setHw(null); setVocal(null); setVerdict(null); setCoachLines([]);
    setScreen('highway');
  }, [profile]);

  const onHighwayFinish = useCallback((r: HighwayResult) => {
    if (!session) return;
    setHw(r);
    const p = clone(profile);
    for (const [de, v] of Object.entries(r.perWord)) {
      for (let i = 0; i < v.hit; i++) record(p, de, true);
      for (let i = 0; i < v.miss; i++) record(p, de, false);
    }
    setProfile(p);
    if (session.mode === 'normal') {
      setScreen('vocal');
    } else {
      // revenge run — verdict straight away
      const failed = Object.entries(r.perWord).filter(([, v]) => v.miss > 0)
        .map(([de]) => findWord(de)).filter((w): w is Word => !!w);
      const res = registerRun(p, session.track, r.acc, failed, 'revenge');
      setProfile(res.profile);
      setVerdict(res.verdict);
      setOverall(r.acc);
      setVocal(null);
      setCoachLines([]);
      setScreen('results');
      void analyzeRun(failed, r.acc, Date.now() % 100000).then(setCoachLines);
    }
  }, [session, profile]);

  const onVocalFinish = useCallback((v: VocalResult) => {
    if (!session || !hw) return;
    setVocal(v);
    const p = clone(profile);
    for (const [de, sc] of Object.entries(v.perWord)) record(p, de, sc >= 60);
    const failedSet = new Set<string>();
    for (const [de, r2] of Object.entries(hw.perWord)) if (r2.miss > 0) failedSet.add(de);
    for (const [de, sc] of Object.entries(v.perWord)) if (sc < 60) failedSet.add(de);
    const failed = [...failedSet].map((de) => findWord(de)).filter((w): w is Word => !!w);
    const ov = 0.62 * hw.acc + 0.38 * v.acc;
    const res = registerRun(p, session.track, ov, failed, 'normal');
    setProfile(res.profile);
    setVerdict(res.verdict);
    setOverall(ov);
    setCoachLines([]);
    setScreen('results');
    void analyzeRun(failed, ov, Date.now() % 100000).then(setCoachLines);
  }, [session, hw, profile]);

  const retry = useCallback(() => {
    if (!session) return;
    setHw(null); setVocal(null); setVerdict(null); setCoachLines([]);
    setScreen(session.mode === 'normal' ? 'studio' : 'highway');
  }, [session]);

  const nextTrack = useCallback(() => {
    if (!session) return;
    const idx = TRACKS.findIndex((t) => t.id === session.track.id);
    const nx = TRACKS[idx + 1];
    if (nx) deploy(nx); else setScreen('hub');
  }, [session, deploy]);

  const hasNext = !!session && TRACKS.findIndex((t) => t.id === session.track.id) < TRACKS.length - 1;

  return (
    <div className="h-dvh w-full overflow-hidden bg-void text-ink font-body">
      {screen === 'boot' && <Boot onStart={() => setScreen('hub')} />}

      {screen === 'hub' && (
        <Hub
          profile={profile}
          muted={muted}
          onToggleMute={() => { setMuted((m) => { audio.setMuted(!m); return !m; }); }}
          onDeploy={deploy}
          onRevenge={startRevenge}
        />
      )}

      {screen === 'studio' && session && (
        <Studio track={session.track} onReady={() => setScreen('highway')} onExit={() => setScreen('hub')} />
      )}

      {screen === 'highway' && session && (
        <Highway
          key={`${session.track.id}-${session.mode}-${Date.now() % 100000}`}
          track={session.track}
          mode={session.mode}
          weakWords={weakWords}
          onFinish={onHighwayFinish}
          onExit={() => setScreen('hub')}
        />
      )}

      {screen === 'vocal' && session && (
        <Vocal track={session.track} weakWords={weakWords} onFinish={onVocalFinish} />
      )}

      {screen === 'results' && session && verdict && (
        <Results
          track={session.track}
          mode={session.mode}
          hw={hw}
          vocal={vocal}
          overall={overall}
          verdict={verdict}
          coachLines={coachLines}
          hasNext={hasNext}
          allDone={allMastered(profile)}
          onRetry={retry}
          onRevenge={() => session && startRevenge(session.track)}
          onNext={nextTrack}
          onHub={() => setScreen('hub')}
        />
      )}

    </div>
  );
}
