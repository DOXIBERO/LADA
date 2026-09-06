import { Component, useCallback, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';
import Boot from './components/Boot';
import Hub from './components/Hub';
import Studio from './components/Studio';
import Highway, { type HighwayResult } from './components/Highway';
import Vocal, { type VocalResult } from './components/Vocal';
import Results from './components/Results';
import AiVoiceCompanion from './components/AiVoiceCompanion';
import A1UnitView, { type A1UnitTab } from './components/A1UnitView';
import RoleplayPartner from './components/RoleplayPartner';
import TikTokCourseView from './components/TikTokCourseView';
import { A1_UNITS, type A1Unit } from './game/a1Curriculum';
import { audio } from './game/audio';
import { ALL_WORDS, TRACKS, findWord, type Track, type Word } from './game/content';
import { analyzeRun } from './game/ladaCore';
import { narrator } from './game/narrator';
import {
  allMastered, isMastered, isUnlocked, loadProfile, record, registerRun, saveProfile, weakest,
  type Profile, type RunVerdict,
} from './game/srs';

type Screen = 'boot' | 'hub' | 'a1Unit' | 'tiktokCourse' | 'roleplay' | 'studio' | 'highway' | 'vocal' | 'results';

const clone = (p: Profile): Profile => JSON.parse(JSON.stringify(p)) as Profile;

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LADA Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-dvh w-full bg-void text-ink flex items-center justify-center p-6 select-none font-ar" dir="rtl">
          <div className="panel chamfer p-8 max-w-md w-full text-center border-mag/60 shadow-[0_0_30px_rgba(255,45,120,0.3)]">
            <div className="panel-tag text-mag mb-2">SYSTEM ERROR // خطأ في النظام</div>
            <h2 className="text-2xl font-display text-mag text-glow-mag mb-4">وقع مشكل تقني</h2>
            <p className="text-dim text-sm mb-6 leading-relaxed">
              وقع استثناء غير متوقع فالـ Engine ديال اللعبة. الذاكرة ديالك باقية محفوظة ومحمية فالـ LocalStorage.
            </p>
            <button
              onClick={() => { window.location.reload(); }}
              className="neon-btn neon-btn-mag chamfer px-6 py-3 w-full text-base font-bold"
            >
              🔄 إعادة تشغيل LADA
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const [selectedA1Unit, setSelectedA1Unit] = useState<A1Unit | null>(null);
  const [selectedA1Tab, setSelectedA1Tab] = useState<A1UnitTab | undefined>(undefined);
  const [roleplayScenario, setRoleplayScenario] = useState<string>('restaurant');
  const [activeTikTokTrackId, setActiveTikTokTrackId] = useState<string>('street_vs_textbook');

  // keep memory persisted
  useEffect(() => { saveProfile(profile); }, [profile]);

  // Autonomous Hub narration when landing on Command Deck
  useEffect(() => {
    if (screen === 'hub') {
      const nextIdx = TRACKS.findIndex((t) => isUnlocked(profile, t) && !isMastered(profile, t));
      const nextT = TRACKS[nextIdx] ?? TRACKS[0];
      narrator.narrateHub(nextT);
    }
  }, [screen, profile]);

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
    <ErrorBoundary>
      <div className="h-dvh w-full overflow-hidden bg-void text-ink font-body relative">
        {/* Floating global mute toggle accessible on all active screens */}
        {screen !== 'boot' && screen !== 'hub' && (
          <button
            type="button"
            onClick={() => { setMuted((m) => { const next = !m; audio.setMuted(next); return next; }); audio.uiClick(); }}
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
            className="fixed top-2.5 left-2.5 z-50 neon-btn chamfer-sm px-2.5 py-1 text-xs bg-void/85 backdrop-blur-sm border border-line hover:border-cyan"
          >
            {muted ? '🔇' : '🔊'}
          </button>
        )}

        {screen === 'boot' && <Boot onStart={() => setScreen('hub')} />}

        {screen === 'hub' && (
          <Hub
            profile={profile}
            muted={muted}
            onToggleMute={() => { setMuted((m) => { audio.setMuted(!m); return !m; }); }}
            onDeploy={deploy}
            onRevenge={startRevenge}
            onSelectA1Unit={(unit) => {
              setSelectedA1Unit(unit);
              setSelectedA1Tab('words');
              setScreen('a1Unit');
            }}
            onSelectTimelineDay={(day) => {
              const unit = A1_UNITS.find((u) => u.id === day.unitId) ?? A1_UNITS[0];
              setSelectedA1Unit(unit);
              setSelectedA1Tab(day.tabTarget ?? 'words');
              setScreen('a1Unit');
            }}
            onStartRoleplay={(sc) => {
              if (sc) setRoleplayScenario(sc);
              setScreen('roleplay');
            }}
            onStartTikTokTrack={(tId) => {
              setActiveTikTokTrackId(tId);
              setScreen('tiktokCourse');
            }}
          />
        )}

        {screen === 'a1Unit' && selectedA1Unit && (
          <A1UnitView
            unit={selectedA1Unit}
            initialTab={selectedA1Tab}
            onExit={() => setScreen('hub')}
            onStartRoleplay={(sc) => {
              setRoleplayScenario(sc);
              setScreen('roleplay');
            }}
          />
        )}

        {screen === 'tiktokCourse' && (
          <TikTokCourseView
            trackId={activeTikTokTrackId}
            onExit={() => setScreen('hub')}
          />
        )}

        {screen === 'roleplay' && (
          <RoleplayPartner
            initialScenarioId={roleplayScenario}
            onExit={() => setScreen('hub')}
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

        {/* Global Autonomous AI Voice Companion (hands-free Darija guidance) */}
        {screen !== 'boot' && <AiVoiceCompanion />}

      </div>
    </ErrorBoundary>
  );
}
