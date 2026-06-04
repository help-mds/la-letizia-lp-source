import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import PageScrollScrub from '@/components/PageScrollScrub';
import CinematicLoader from '@/components/CinematicLoader';
import InteractiveScene, { Hotspot } from '@/components/interactive-lp/InteractiveScene';
import SceneTransition from '@/components/interactive-lp/SceneTransition';
import AccessScene from '@/components/interactive-lp/AccessScene';
import ReservationScene, { ReservationChannel } from '@/components/interactive-lp/ReservationScene';
import SceneNavigation from '@/components/interactive-lp/SceneNavigation';
import '@/components/interactive-lp/interactive-lp.css';

/* ============================================================
   Scene definitions — derived from lead data
   ============================================================ */
interface SceneDef {
  id: string;
  label: string;
  dotLabel: string;
  eyebrow: string;
  title: string;
}

const SCENE_DEFS: SceneDef[] = [
  { id: 'hero', label: 'Hero', dotLabel: 'G', eyebrow: 'PROLOGUE', title: 'La Letizia' },
  { id: 's1', label: 'Space', dotLabel: '1', eyebrow: 'CHAPTER ONE', title: 'The Space' },
  { id: 's2', label: 'Selection', dotLabel: '2', eyebrow: 'CHAPTER TWO', title: 'The Selection' },
  { id: 's3', label: 'Craft', dotLabel: '3', eyebrow: 'CHAPTER THREE', title: 'The Craft' },
  { id: 'access', label: 'Access', dotLabel: 'A', eyebrow: 'VISIT', title: 'How to Find Us' },
  { id: 'cta', label: 'Reserve', dotLabel: 'R', eyebrow: 'FINALE', title: 'Reserve a Table' },
];

/* ============================================================
   Hotspot data for each interactive scene
   ============================================================ */
const SCENE_HOTSPOTS: Record<string, Hotspot[]> = {
  s1: [
    {
      id: 's1a',
      x: 18,
      y: 38,
      title: 'Counter Seating',
      body: '12 seats facing the marina. We recommend reserving for sunset hours.',
      ctas: [{ label: 'Reserve counter seat', action: 'reserve' }],
    },
    {
      id: 's1b',
      x: 52,
      y: 55,
      title: 'Open Kitchen',
      body: "Watch every moment of preparation up close. The chef's hands are within arm's reach.",
    },
    {
      id: 's1c',
      x: 76,
      y: 42,
      title: 'Private Room',
      body: '6 seats with sliding doors. Available for groups of 4 or more.',
      ctas: [{ label: 'Reserve private room', action: 'reserve' }],
    },
  ],
  s2: [
    {
      id: 's2a',
      x: 22,
      y: 55,
      title: 'Wagyu Sashimi',
      body: 'A5 rank from Miyazaki, hand-sliced. Wasabi, shiso, a single grain of sea salt.',
      price: 'AED 280',
      ctas: [
        { label: 'View full menu', action: 'menu' },
        { label: 'Reserve', action: 'reserve' },
      ],
    },
    {
      id: 's2b',
      x: 50,
      y: 75,
      title: 'Binchotan Grill',
      body: 'White binchotan charcoal from Wakayama, 30 seconds per side. Nothing else.',
      price: 'AED 360',
      ctas: [{ label: 'Reserve', action: 'reserve' }],
    },
    {
      id: 's2c',
      x: 52,
      y: 30,
      title: "Chef's Omakase",
      body: '7 seasonal courses. Available for guests arriving before 7pm.',
      price: 'AED 880 / person',
      ctas: [{ label: 'Reserve omakase', action: 'reserve' }],
    },
  ],
  s3: [
    {
      id: 's3a',
      x: 30,
      y: 45,
      title: 'Sourcing',
      body: 'A5 wagyu exclusively from Miyazaki Prefecture. Weekly delivery, never frozen.',
    },
    {
      id: 's3b',
      x: 68,
      y: 35,
      title: '21-Day Aging',
      body: '21 days of dry aging to develop depth. The fat softens, umami concentrates.',
    },
  ],
};

/* ============================================================
   Main Page Component
   ============================================================ */
export default function InteractiveLpPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: lead, isLoading } = trpc.leads.getBySlug.useQuery(
    { slug: slug || '' },
    { enabled: !!slug },
  );

  // Scene mode state
  const [sceneMode, setSceneMode] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionEyebrow, setTransitionEyebrow] = useState('');
  const [transitionTitle, setTransitionTitle] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const heroCompletedRef = useRef(false);

  const exitSceneMode = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.height = '';
    setSceneMode(false);
    heroCompletedRef.current = false;
    setCurrentScene(0);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const navigateToScene = useCallback(
    (index: number) => {
      if (index < 0 || index >= SCENE_DEFS.length || index === currentScene || isTransitioning) return;

      // If navigating back to Hero (index 0), exit scene mode
      if (index === 0) {
        exitSceneMode();
        return;
      }

      setIsTransitioning(true);
      setTransitionEyebrow(SCENE_DEFS[index].eyebrow);
      setTransitionTitle(SCENE_DEFS[index].title);

      // After curtain is fully opaque, switch scene
      setTimeout(() => {
        setCurrentScene(index);
      }, 450);

      // After title card shows, remove curtain
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1600);
    },
    [currentScene, isTransitioning, exitSceneMode],
  );

  const enterSceneMode = useCallback(() => {
    // Scroll to top and lock
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    setSceneMode(true);
    setCurrentScene(1); // Start at Scene 1 (The Space)
    // Show transition
    setTransitionEyebrow(SCENE_DEFS[1].eyebrow);
    setTransitionTitle(SCENE_DEFS[1].title);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 1600);
  }, []);

  // Detect when Hero scrub completes (user scrolls to the bottom of the page)
  useEffect(() => {
    if (sceneMode) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      // Trigger when user reaches within 50px of the bottom
      if (scrollY >= maxScroll - 50 && !heroCompletedRef.current) {
        heroCompletedRef.current = true;
        enterSceneMode();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sceneMode, enterSceneMode]);

  // Keyboard navigation
  useEffect(() => {
    if (!sceneMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToScene(currentScene + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToScene(currentScene - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sceneMode, currentScene, navigateToScene]);

  const handleReserve = useCallback(() => {
    const ctaIndex = SCENE_DEFS.findIndex((s) => s.id === 'cta');
    navigateToScene(ctaIndex);
  }, [navigateToScene]);

  const handleCtaAction = useCallback((action: string) => {
    if (action === 'reserve') {
      handleReserve();
    }
    // Other actions handled by ReservationScene directly
  }, [handleReserve]);

  // Loading state
  if (isLoading || !lead) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <CinematicLoader storeName={slug || 'Loading'} progress={0.5} ready={false} onComplete={() => {}} />
      </div>
    );
  }

  // Derive scene images from lead data
  const galleryImages = (lead.galleryImages as string[] | null) || [];
  const sceneImages = {
    s1: galleryImages[1] || '/placeholder-space.jpg', // gallery-2 = space/interior
    s2: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663064885811/MVWtXfT9PJdjxCo6eCiQbT/lp-selection-overhead-eHmSyrXD96nxSAFVzzMQiM.webp', // AI-generated kaiseki overhead
    s3: '/manus-storage/lp-craft-scene_16c7baf2.png', // AI-generated craft scene
  };

  // Reservation channels
  const channels: ReservationChannel[] = [
    { type: 'reserve-form', label: 'Reserve Online', url: lead.infoReservationUrl || '#' },
    { type: 'call', label: 'Call', sublabel: lead.infoPhone || '+971 4 XXX XXXX', url: `tel:${lead.infoPhone || ''}` },
    { type: 'whatsapp', label: 'WhatsApp', sublabel: 'Message us', url: '#' },
    { type: 'instagram', label: 'Instagram', sublabel: 'Latest posts', url: '#' },
    { type: 'maps', label: 'Map', sublabel: 'Google Maps', url: '#' },
  ];

  return (
    <div ref={containerRef} className="relative bg-black text-white">
      {/* ===== HERO MODE: Existing PageScrollScrub ===== */}
      {!sceneMode && (
        <PageScrollScrub
          frameUrls={lead.frameUrlsLandscape as string[] || []}
          frameCount={241}
          renderLoader={(progress, ready) => (
            <CinematicLoader
              storeName={lead.storeName || ''}
              progress={progress}
              ready={ready}
              onComplete={() => {}}
            />
          )}
        >
          {/* Hero overlay text */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-[15vh]">
            <div className="text-center">
              <div
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.5em',
                  opacity: 0.5,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                {(lead.storeName || '').toUpperCase()}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading, "Cormorant Garamond", Georgia, serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(24px, 5vw, 40px)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                }}
              >
                A Quiet Counter, Tonight
              </div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.6,
                  marginTop: '8px',
                  maxWidth: '300px',
                }}
              >
                Wagyu from Miyazaki, charcoal from Wakayama. Twelve seats facing the marina.
              </div>
            </div>
          </div>
        </PageScrollScrub>
      )}

      {/* ===== SCENE MODE: Interactive scenes ===== */}
      {sceneMode && (
        <div
          className="fixed inset-0 bg-black"
          style={{ zIndex: 100 }}
        >
          {/* Scene containers */}
          {SCENE_DEFS.slice(1).map((scene, i) => {
            const sceneIndex = i + 1;
            const isActive = currentScene === sceneIndex;

            if (scene.id === 'access') {
              return (
                <div
                  key={scene.id}
                  className={`scene-container ${isActive ? 'active' : ''}`}
                >
                  <AccessScene
                    address={lead.infoAddress || 'Dubai Marina Walk, Tower 3\nP.O. Box 12345, Dubai UAE'}
                    hours={lead.infoHours || 'Mon–Sat 18:00 – 24:00\nSunday Closed'}
                    accessNote="Dubai Marina Metro Station — 6 min walk\nValet parking available"
                    mapsUrl="#"
                  />
                </div>
              );
            }

            if (scene.id === 'cta') {
              return (
                <div
                  key={scene.id}
                  className={`scene-container ${isActive ? 'active' : ''}`}
                >
                  <ReservationScene
                    storeName={lead.storeName || 'La Letizia'}
                    channels={channels}
                  />
                </div>
              );
            }

            // Interactive scenes (s1, s2, s3)
            return (
              <div
                key={scene.id}
                className={`scene-container ${isActive ? 'active' : ''}`}
              >
                <InteractiveScene
                  imageUrl={sceneImages[scene.id as keyof typeof sceneImages] || ''}
                  hotspots={SCENE_HOTSPOTS[scene.id] || []}
                  isActive={isActive}
                  onCtaAction={handleCtaAction}
                />
              </div>
            );
          })}

          {/* Transition overlay */}
          <SceneTransition
            isTransitioning={isTransitioning}
            eyebrow={transitionEyebrow}
            title={transitionTitle}
          />

          {/* Navigation */}
          <SceneNavigation
            scenes={SCENE_DEFS}
            currentIndex={currentScene}
            onNavigate={navigateToScene}
            onReserve={handleReserve}
          />
        </div>
      )}
    </div>
  );
}
