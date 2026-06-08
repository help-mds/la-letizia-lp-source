import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import PageScrollScrub from '@/components/PageScrollScrub';
import LpLoader from '@/components/interactive-lp/LpLoader';
import InteractiveScene, { Hotspot } from '@/components/interactive-lp/InteractiveScene';
import SceneTransition from '@/components/interactive-lp/SceneTransition';
import AccessScene from '@/components/interactive-lp/AccessScene';
import ReservationScene, { ReservationChannel } from '@/components/interactive-lp/ReservationScene';
import SceneNavigation from '@/components/interactive-lp/SceneNavigation';

import '@/components/interactive-lp/interactive-lp.css';

// Frame data imports
import laLetiziaFrameData from '@/data/37west-frames.json';
import noaHairFrameData from '@/data/noa-hair-frames.json';

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

function buildSceneDefs(lead: { storeName: string; businessType: string }): SceneDef[] {
  return [
    { id: 'hero', label: 'Hero', dotLabel: 'G', eyebrow: 'xxxxxx', title: lead.storeName },
    { id: 's1', label: 'Space', dotLabel: '1', eyebrow: 'xxxxxx', title: 'xxxxxx' },
    { id: 's2', label: 'Selection', dotLabel: '2', eyebrow: 'xxxxxx', title: 'xxxxxx' },
    { id: 's3', label: 'Craft', dotLabel: '3', eyebrow: 'xxxxxx', title: 'xxxxxx' },
    { id: 'access', label: 'Access', dotLabel: 'A', eyebrow: 'xxxxxx', title: 'xxxxxx' },
    { id: 'cta', label: 'Reserve', dotLabel: 'R', eyebrow: 'xxxxxx', title: 'xxxxxx' },
  ];
}

/* ============================================================
   Hotspot data — restaurant (La Letizia)
   ============================================================ */
const RESTAURANT_HOTSPOTS_DESKTOP: Record<string, Hotspot[]> = {
  s1: [
    { id: 's1a', x: 18, y: 38, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx', ctas: [{ label: '予約する', action: 'reserve' }] },
    { id: 's1b', x: 52, y: 55, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's1c', x: 76, y: 42, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx', ctas: [{ label: '予約する', action: 'reserve' }] },
  ],
  s2: [
    { id: 's2a', x: 22, y: 55, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx', price: '¥X,XXX', ctas: [{ label: 'メニューを見る', action: 'menu' }, { label: '予約する', action: 'reserve' }] },
    { id: 's2b', x: 50, y: 75, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx', price: '¥X,XXX', ctas: [{ label: '予約する', action: 'reserve' }] },
    { id: 's2c', x: 52, y: 30, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx', price: '¥X,XXX / 名', ctas: [{ label: '予約する', action: 'reserve' }] },
  ],
  s3: [
    { id: 's3a', x: 30, y: 45, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's3b', x: 68, y: 35, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
  ],
};

const RESTAURANT_HOTSPOTS_MOBILE: Record<string, Hotspot[]> = {
  s1: [
    { id: 's1a', x: 25, y: 35, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx', ctas: [{ label: '予約する', action: 'reserve' }] },
    { id: 's1b', x: 50, y: 50, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's1c', x: 75, y: 35, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx', ctas: [{ label: '予約する', action: 'reserve' }] },
  ],
  s2: [
    { id: 's2a', x: 25, y: 40, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx', price: '¥X,XXX', ctas: [{ label: 'メニューを見る', action: 'menu' }, { label: '予約する', action: 'reserve' }] },
    { id: 's2b', x: 50, y: 60, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx', price: '¥X,XXX', ctas: [{ label: '予約する', action: 'reserve' }] },
    { id: 's2c', x: 70, y: 30, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx', price: '¥X,XXX / 名', ctas: [{ label: '予約する', action: 'reserve' }] },
  ],
  s3: [
    { id: 's3a', x: 30, y: 40, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's3b', x: 70, y: 40, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
  ],
};

/* ============================================================
   Hotspot data — salon (NOA hair)
   ============================================================ */
const SALON_HOTSPOTS_DESKTOP: Record<string, Hotspot[]> = {
  s1: [
    { id: 's1a', x: 55, y: 45, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's1b', x: 18, y: 55, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's1c', x: 35, y: 35, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
  ],
  s2: [
    { id: 's2a', x: 25, y: 45, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx', price: '¥X,XXX / 90min', ctas: [{ label: 'このコースで予約', action: 'reserve' }] },
    { id: 's2b', x: 55, y: 50, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx', price: '¥X,XXX / 120min', ctas: [{ label: 'このコースで予約', action: 'reserve' }] },
    { id: 's2c', x: 75, y: 35, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx', price: '+¥X,XXX', ctas: [{ label: 'ヘッドスパ付きで予約', action: 'reserve' }] },
  ],
  s3: [
    { id: 's3a', x: 30, y: 45, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's3b', x: 68, y: 40, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
  ],
};

const SALON_HOTSPOTS_MOBILE: Record<string, Hotspot[]> = {
  s1: [
    { id: 's1a', x: 50, y: 45, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's1b', x: 20, y: 55, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's1c', x: 75, y: 35, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
  ],
  s2: [
    { id: 's2a', x: 25, y: 40, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx', price: '¥X,XXX / 90min', ctas: [{ label: 'このコースで予約', action: 'reserve' }] },
    { id: 's2b', x: 50, y: 55, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx', price: '¥X,XXX / 120min', ctas: [{ label: 'このコースで予約', action: 'reserve' }] },
    { id: 's2c', x: 75, y: 35, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx', price: '+¥X,XXX', ctas: [{ label: 'ヘッドスパ付きで予約', action: 'reserve' }] },
  ],
  s3: [
    { id: 's3a', x: 30, y: 40, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
    { id: 's3b', x: 70, y: 40, title: 'xxxxxx', body: 'xxxxxx xxxxxx xxxxxx xxxxxx' },
  ],
};

/* ============================================================
   Scene images by slug
   ============================================================ */
const SCENE_IMAGES_BY_SLUG: Record<string, Record<string, string>> = {
  'la-letizia-dubai-marina': {
    s1: '/manus-storage/37west-space-interior_400cd9de.webp',
    s2: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663064885811/MVWtXfT9PJdjxCo6eCiQbT/lp-selection-overhead-eHmSyrXD96nxSAFVzzMQiM.webp',
    s3: '/manus-storage/lp-craft-scene_16c7baf2.png',
  },
  'noa-hair-tokyo-nakameguro': {
    s1: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663064885811/MVWtXfT9PJdjxCo6eCiQbT/noa-space-interior-YFnW9GusRqg2qpSZU7PJ3s.webp',
    s2: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663064885811/MVWtXfT9PJdjxCo6eCiQbT/noa-selection-overhead-L2j7VcBVnRf94ZeizB539m.webp',
    s3: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663064885811/MVWtXfT9PJdjxCo6eCiQbT/noa-craft-hands-9vWzVS5P8zw2W8uBkwdSWm.webp',
  },
};

/* ============================================================
   Frame data by slug
   ============================================================ */
const FRAME_DATA_BY_SLUG: Record<string, { hero: { count: number; frames: string[] } }> = {
  'la-letizia-dubai-marina': laLetiziaFrameData,
  'noa-hair-tokyo-nakameguro': noaHairFrameData,
};

/* ============================================================
   Hero overlay copy by slug
   ============================================================ */
interface HeroOverlayCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
}

const HERO_OVERLAY_BY_SLUG: Record<string, HeroOverlayCopy> = {
  'la-letizia-dubai-marina': {
    eyebrow: 'LA LETIZIA',
    title: 'xxxxxx xxxxxx',
    subtitle: 'xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx',
  },
  'noa-hair-tokyo-nakameguro': {
    eyebrow: 'NOA HAIR',
    title: 'xxxxxx xxxxxx',
    subtitle: 'xxxxxx xxxxxx xxxxxx xxxxxx',
  },
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
  const [prevScene, setPrevScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionEyebrow, setTransitionEyebrow] = useState('');
  const [transitionTitle, setTransitionTitle] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [heroFadingOut, setHeroFadingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroCompletedRef = useRef(false);
  const sceneEntryLockRef = useRef(false);

  // Loading state: controls light glass → dark glass transition
  const [lpLoading, setLpLoading] = useState(true);

  // Derive scene defs from lead
  const sceneDefs = useMemo(() => {
    if (!lead) return [];
    return buildSceneDefs({ storeName: lead.storeName, businessType: lead.businessType });
  }, [lead]);

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
      if (index < 0 || index >= sceneDefs.length || index === currentScene || isTransitioning) return;

      if (index === 0) {
        exitSceneMode();
        return;
      }

      setPrevScene(currentScene);
      setIsTransitioning(true);
      setTransitionEyebrow(sceneDefs[index].eyebrow);
      setTransitionTitle(sceneDefs[index].title);

      setTimeout(() => {
        setCurrentScene(index);
      }, 450);

      setTimeout(() => {
        setIsTransitioning(false);
        setPrevScene(null);
      }, 1600);
    },
    [currentScene, isTransitioning, exitSceneMode, sceneDefs],
  );

  const enterSceneMode = useCallback(() => {
    // Start fade-out overlay first, then switch to scene mode
    setHeroFadingOut(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
      setSceneMode(true);
      setCurrentScene(1);
      setHeroFadingOut(false);
      if (sceneDefs.length > 1) {
        setTransitionEyebrow(sceneDefs[1].eyebrow);
        setTransitionTitle(sceneDefs[1].title);
      }
      setIsTransitioning(true);
      // Lock swipe/wheel during initial scene entry
      sceneEntryLockRef.current = true;
      setTimeout(() => {
        setIsTransitioning(false);
        // Keep lock a bit longer after transition ends to prevent accidental skip
        setTimeout(() => { sceneEntryLockRef.current = false; }, 800);
      }, 1600);
    }, 500);
  }, [sceneDefs]);

  // Detect when Hero scrub completes
  useEffect(() => {
    if (sceneMode) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
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

  // ===== SWIPE / WHEEL NAVIGATION (scene mode) =====
  useEffect(() => {
    if (!sceneMode) return;

    let cooldown = false;
    let touchStartY = 0;
    let touchStartX = 0;

    const COOLDOWN_MS = 1200;
    const SWIPE_THRESHOLD = 60;
    const WHEEL_THRESHOLD = 80;

    const triggerNav = (direction: 'next' | 'prev') => {
      if (cooldown || isTransitioning || sceneEntryLockRef.current) return;
      cooldown = true;
      if (direction === 'next') {
        navigateToScene(currentScene + 1);
      } else {
        navigateToScene(currentScene - 1);
      }
      setTimeout(() => { cooldown = false; }, COOLDOWN_MS);
    };

    // Wheel (PC trackpad / mouse)
    let wheelAccum = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccum += e.deltaY;

      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelAccum = 0; }, 200);

      if (wheelAccum > WHEEL_THRESHOLD) {
        triggerNav('next');
        wheelAccum = 0;
      } else if (wheelAccum < -WHEEL_THRESHOLD) {
        triggerNav('prev');
        wheelAccum = 0;
      }
    };

    // Touch (mobile swipe)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = Math.abs(touchStartX - e.changedTouches[0].clientX);

      // Ignore horizontal swipes
      if (deltaX > Math.abs(deltaY)) return;

      if (deltaY > SWIPE_THRESHOLD) {
        triggerNav('next');
      } else if (deltaY < -SWIPE_THRESHOLD) {
        triggerNav('prev');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, [sceneMode, currentScene, isTransitioning, navigateToScene]);

  // Get hotspots based on viewport and business type
  const getHotspotsForScene = useCallback(
    (sceneId: string) => {
      if (!lead) return [];
      const isSalon = lead.businessType === 'salon';
      const source = isMobile
        ? (isSalon ? SALON_HOTSPOTS_MOBILE : RESTAURANT_HOTSPOTS_MOBILE)
        : (isSalon ? SALON_HOTSPOTS_DESKTOP : RESTAURANT_HOTSPOTS_DESKTOP);
      return source[sceneId] || [];
    },
    [isMobile, lead],
  );

  const handleReserve = useCallback(() => {
    const ctaIndex = sceneDefs.findIndex((s) => s.id === 'cta');
    navigateToScene(ctaIndex);
  }, [navigateToScene, sceneDefs]);

  const handleCtaAction = useCallback((action: string) => {
    if (action === 'reserve') {
      handleReserve();
    }
  }, [handleReserve]);

  // Get hotspots based on viewport and business type
  const getHotspots = useCallback(
    (sceneId: string) => {
      return getHotspotsForScene(sceneId);
    },
    [getHotspotsForScene],
  );

  // Handler when LpLoader fade-out completes
  const handleLoaderComplete = useCallback(() => {
    setLpLoading(false);
  }, []);

  // Loading state — show minimal loader while tRPC data loads
  if (isLoading || !lead) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: '#FBFAF8' }}>
        <div style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontSize: '24px', color: '#1A1714', opacity: 0.5 }}>
          Loading...
        </div>
      </div>
    );
  }

  // Derive data from lead
  const currentSlug = slug || '';
  const isSalon = lead.businessType === 'salon';
  const accentColor = (lead as Record<string, unknown>).paletteAccent as string || (isSalon ? '#FFD4D4' : '#B0552F');

  // Frame data
  const frameData = FRAME_DATA_BY_SLUG[currentSlug] || laLetiziaFrameData;

  // Scene images
  const sceneImages = SCENE_IMAGES_BY_SLUG[currentSlug] || SCENE_IMAGES_BY_SLUG['la-letizia-dubai-marina'];

  // Hero overlay
  const heroOverlay = HERO_OVERLAY_BY_SLUG[currentSlug] || {
    eyebrow: (lead.storeName || '').toUpperCase(),
    title: lead.heroTagline || 'Welcome',
    subtitle: lead.heroSubtitle || '',
  };

  // Reservation channels
  const lineUrl = (lead as Record<string, unknown>).lineUrl as string | null;
  const whatsappUrl = lead.whatsappNumber
    ? `https://wa.me/${lead.whatsappNumber.replace(/[^0-9]/g, '')}`
    : '#';
  const instagramUrl = lead.instagramHandle
    ? `https://instagram.com/${lead.instagramHandle.replace('@', '')}`
    : lead.instagramUrl || '#';
  const mapsUrl = lead.mapLat && lead.mapLng
    ? `https://www.google.com/maps?q=${lead.mapLat},${lead.mapLng}`
    : lead.googleMapsUrl || '#';

  // Build channels based on business type
  const channels: ReservationChannel[] = isSalon
    ? [
        { type: 'reserve-form', label: 'オンライン予約', url: lead.reservationUrl || lead.infoReservationUrl || '#' },
        { type: 'call', label: '電話', sublabel: lead.infoPhone || lead.phoneNumber || '', url: `tel:${lead.infoPhone || lead.phoneNumber || ''}` },
        { type: 'line', label: 'LINE', sublabel: 'xxxxxx', url: lineUrl || '#' },
        { type: 'instagram', label: 'Instagram', sublabel: 'xxxxxx', url: instagramUrl },
        { type: 'maps', label: '地図', sublabel: 'Google Maps', url: mapsUrl },
      ]
    : [
        { type: 'reserve-form', label: 'オンライン予約', url: lead.reservationUrl || lead.infoReservationUrl || '#' },
        { type: 'call', label: '電話', sublabel: lead.infoPhone || lead.phoneNumber || 'XXX-XXXX-XXXX', url: `tel:${lead.infoPhone || lead.phoneNumber || ''}` },
        { type: 'whatsapp', label: 'WhatsApp', sublabel: 'xxxxxx', url: whatsappUrl },
        { type: 'instagram', label: 'Instagram', sublabel: 'xxxxxx', url: instagramUrl },
        { type: 'maps', label: '地図', sublabel: 'Google Maps', url: mapsUrl },
      ];

  // Reservation scene copy
  const reservationTitle = 'xxxxxx xxxxxx';
  const reservationSubtitle = 'xxxxxx xxxxxx xxxxxx';

  // Access scene data
  const accessAddress = lead.infoAddress || 'xxxxxx xxxxxx\nxxxxxx xxxxxx';
  const accessHours = lead.infoHours || 'XX:XX — XX:XX';
  const accessNote = 'xxxxxx xxxxxx xxxxxx\nxxxxxx xxxxxx';
  const mapsEmbedUrl = isSalon
    ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7!2d139.6989!3d35.644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5Lit55uu6buS!5e0!3m2!1sja!2sjp!4v1234567890'
    : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.71336055174!2d139.75278397578708!3d35.667317772591836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188babfe1da6ed%3A0xf10d781ee21f3eb9!2zWUFLSU5JS1UgMzcg5paw5qmL5bqX!5e1!3m2!1sja!2sae!4v1780562027490!5m2!1sja!2sae';

  return (
    <div ref={containerRef} className="relative bg-black text-white">
      {/* ===== PERSISTENT HEADER: Always visible (hero + scenes) ===== */}
      <div className="fixed top-0 left-0 right-0 z-[200] pointer-events-none" style={{ opacity: 1 }}>
        <div className="pointer-events-auto">
          <SceneNavigation
            scenes={sceneDefs}
            currentIndex={sceneMode ? currentScene : 0}
            storeName={lead.storeName || ''}
            isLoading={lpLoading}
            onNavigate={(index) => {
              if (!sceneMode && index > 0) {
                window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                document.body.style.overflow = 'hidden';
                document.body.style.height = '100dvh';
                setSceneMode(true);
                setCurrentScene(index);
                setTransitionEyebrow(sceneDefs[index].eyebrow);
                setTransitionTitle(sceneDefs[index].title);
                setIsTransitioning(true);
                setTimeout(() => setIsTransitioning(false), 1600);
              } else {
                navigateToScene(index);
              }
            }}
            onReserve={handleReserve}
            customizeUrl="https://timerex.net/s/ichikawa_9fa0_0088/dbb48451"
          />
        </div>
      </div>

      {/* ===== HERO MODE: Existing PageScrollScrub ===== */}
      {!sceneMode && (
        <PageScrollScrub
          frameUrls={frameData.hero.frames}
          frameCount={frameData.hero.count}
          loaderActive={lpLoading}
          renderLoader={(progress, ready) => (
            <LpLoader
              ready={ready}
              onComplete={handleLoaderComplete}
              storeName={lead.storeName}
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
                {heroOverlay.eyebrow}
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
                {heroOverlay.title}
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
                {heroOverlay.subtitle}
              </div>
            </div>
          </div>
        </PageScrollScrub>
      )}

      {/* ===== HERO FADE-OUT OVERLAY ===== */}
      {heroFadingOut && (
        <div
          className="fixed inset-0 z-[150]"
          style={{
            background: '#000',
            animation: 'fadeIn 500ms ease-out forwards',
          }}
        />
      )}

      {/* ===== SCENE MODE: Interactive scenes ===== */}
      {sceneMode && (
        <div
          className="fixed inset-0 bg-black"
          style={{ zIndex: 100 }}
        >
          {/* Scene containers */}
          {sceneDefs.slice(1).map((scene, i) => {
            const sceneIndex = i + 1;
            const isActive = currentScene === sceneIndex;
            const isExiting = prevScene === sceneIndex && isTransitioning;

            if (scene.id === 'access') {
              return (
                <div
                  key={scene.id}
                  className={`scene-container ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
                >
                  <AccessScene
                    address={accessAddress}
                    hours={accessHours}
                    accessNote={accessNote}
                    mapsUrl={mapsUrl}
                    mapsEmbedUrl={mapsEmbedUrl}
                  />
                </div>
              );
            }

            if (scene.id === 'cta') {
              return (
                <div
                  key={scene.id}
                  className={`scene-container ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
                >
                  <ReservationScene
                    storeName={lead.storeName || ''}
                    channels={channels}
                    title={reservationTitle}
                    subtitle={reservationSubtitle}
                    accentColor={accentColor}
                  />
                </div>
              );
            }

            // Interactive scenes (s1, s2, s3)
            return (
              <div
                key={scene.id}
                className={`scene-container ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
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
