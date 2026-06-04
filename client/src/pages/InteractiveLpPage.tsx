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
import frameData from '@/data/37west-frames.json';

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
   Desktop vs mobile positions (percentage-based)
   ============================================================ */
const SCENE_HOTSPOTS_DESKTOP: Record<string, Hotspot[]> = {
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

// Mobile hotspot positions: shifted to avoid edges and overlap with navigation
const SCENE_HOTSPOTS_MOBILE: Record<string, Hotspot[]> = {
  s1: [
    {
      id: 's1a',
      x: 25,
      y: 35,
      title: 'Counter Seating',
      body: '12 seats facing the marina. We recommend reserving for sunset hours.',
      ctas: [{ label: 'Reserve counter seat', action: 'reserve' }],
    },
    {
      id: 's1b',
      x: 50,
      y: 50,
      title: 'Open Kitchen',
      body: "Watch every moment of preparation up close. The chef's hands are within arm's reach.",
    },
    {
      id: 's1c',
      x: 75,
      y: 35,
      title: 'Private Room',
      body: '6 seats with sliding doors. Available for groups of 4 or more.',
      ctas: [{ label: 'Reserve private room', action: 'reserve' }],
    },
  ],
  s2: [
    {
      id: 's2a',
      x: 25,
      y: 40,
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
      y: 60,
      title: 'Binchotan Grill',
      body: 'White binchotan charcoal from Wakayama, 30 seconds per side. Nothing else.',
      price: 'AED 360',
      ctas: [{ label: 'Reserve', action: 'reserve' }],
    },
    {
      id: 's2c',
      x: 70,
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
      y: 40,
      title: 'Sourcing',
      body: 'A5 wagyu exclusively from Miyazaki Prefecture. Weekly delivery, never frozen.',
    },
    {
      id: 's3b',
      x: 70,
      y: 40,
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
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroCompletedRef = useRef(false);

  // Touch swipe state
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Touch swipe navigation (mobile)
  useEffect(() => {
    if (!sceneMode) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;
      touchStartRef.current = null;

      // Minimum swipe distance and maximum time
      const minDistance = 50;
      const maxTime = 500;

      if (dt > maxTime) return;

      // Determine if horizontal or vertical swipe
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx > absDy && absDx > minDistance) {
        // Horizontal swipe
        if (dx < 0) {
          // Swipe left → next scene
          navigateToScene(currentScene + 1);
        } else {
          // Swipe right → previous scene
          navigateToScene(currentScene - 1);
        }
      } else if (absDy > absDx && absDy > minDistance) {
        // Vertical swipe
        if (dy < 0) {
          // Swipe up → next scene
          navigateToScene(currentScene + 1);
        } else {
          // Swipe down → previous scene
          navigateToScene(currentScene - 1);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
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

  // Get hotspots based on viewport
  const getHotspots = useCallback(
    (sceneId: string) => {
      const source = isMobile ? SCENE_HOTSPOTS_MOBILE : SCENE_HOTSPOTS_DESKTOP;
      return source[sceneId] || [];
    },
    [isMobile],
  );

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
    s1: '/manus-storage/37west-space-interior_400cd9de.webp', // 37 West interior photo
    s2: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663064885811/MVWtXfT9PJdjxCo6eCiQbT/lp-selection-overhead-eHmSyrXD96nxSAFVzzMQiM.webp', // AI-generated kaiseki overhead
    s3: '/manus-storage/lp-craft-scene_16c7baf2.png', // AI-generated craft scene
  };

  // Reservation channels — use new DB fields when available
  const whatsappUrl = lead.whatsappNumber
    ? `https://wa.me/${lead.whatsappNumber.replace(/[^0-9]/g, '')}`
    : '#';
  const instagramUrl = lead.instagramHandle
    ? `https://instagram.com/${lead.instagramHandle.replace('@', '')}`
    : lead.instagramUrl || '#';
  const mapsUrl = lead.mapLat && lead.mapLng
    ? `https://www.google.com/maps?q=${lead.mapLat},${lead.mapLng}`
    : lead.googleMapsUrl || '#';

  const channels: ReservationChannel[] = [
    { type: 'reserve-form', label: 'Reserve Online', url: lead.reservationUrl || lead.infoReservationUrl || '#' },
    { type: 'call', label: 'Call', sublabel: lead.infoPhone || lead.phoneNumber || '+971 4 XXX XXXX', url: `tel:${lead.infoPhone || lead.phoneNumber || ''}` },
    { type: 'whatsapp', label: 'WhatsApp', sublabel: 'Message us', url: whatsappUrl },
    { type: 'instagram', label: 'Instagram', sublabel: lead.instagramHandle || 'Latest posts', url: instagramUrl },
    { type: 'maps', label: 'Map', sublabel: 'Google Maps', url: mapsUrl },
  ];

  return (
    <div ref={containerRef} className="relative bg-black text-white">
      {/* ===== PERSISTENT HEADER: Always visible (hero + scenes) ===== */}
      <div className="fixed top-0 left-0 right-0 z-[200] pointer-events-none" style={{ opacity: 1 }}>
        <div className="pointer-events-auto">
          <SceneNavigation
            scenes={SCENE_DEFS}
            currentIndex={sceneMode ? currentScene : 0}
            onNavigate={(index) => {
              if (!sceneMode && index > 0) {
                // From hero, enter scene mode and go to that scene
                window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                document.body.style.overflow = 'hidden';
                document.body.style.height = '100vh';
                setSceneMode(true);
                setCurrentScene(index);
                setTransitionEyebrow(SCENE_DEFS[index].eyebrow);
                setTransitionTitle(SCENE_DEFS[index].title);
                setIsTransitioning(true);
                setTimeout(() => setIsTransitioning(false), 1600);
              } else {
                navigateToScene(index);
              }
            }}
            onReserve={handleReserve}
          />
        </div>
      </div>

      {/* ===== HERO MODE: Existing PageScrollScrub ===== */}
      {!sceneMode && (
        <PageScrollScrub
          frameUrls={frameData.hero.frames}
          frameCount={frameData.hero.count}
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
            <div className="text-center px-4">
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
                  margin: '8px auto 0',
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
                    address={lead.infoAddress || 'Dubai Marina Walk\nTower 3, Ground Floor\nDubai, UAE'}
                    hours={lead.infoHours || 'Daily 7:00 AM \u2013 4:00 PM'}
                    accessNote="Dubai Marina Metro Station \u2014 6 min walk\nValet parking available"
                    mapsUrl={mapsUrl}
                    mapsEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.71336055174!2d139.75278397578708!3d35.667317772591836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188babfe1da6ed%3A0xf10d781ee21f3eb9!2zWUFLSU5JS1UgMzcg5paw5qmL5bqX!5e1!3m2!1sja!2sae!4v1780562027490!5m2!1sja!2sae"
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
                  hotspots={getHotspots(scene.id)}
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


        </div>
      )}
    </div>
  );
}
