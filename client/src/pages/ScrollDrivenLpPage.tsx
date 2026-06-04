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
import { useScrollDrivenScene } from '@/hooks/useScrollDrivenScene';
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
  const isSalon = lead.businessType === 'salon';
  return [
    { id: 'hero', label: 'Hero', dotLabel: 'G', eyebrow: 'PROLOGUE', title: lead.storeName },
    { id: 's1', label: 'Space', dotLabel: '1', eyebrow: 'CHAPTER ONE', title: 'The Space' },
    { id: 's2', label: 'Selection', dotLabel: '2', eyebrow: 'CHAPTER TWO', title: isSalon ? 'The Menu' : 'The Selection' },
    { id: 's3', label: 'Craft', dotLabel: '3', eyebrow: 'CHAPTER THREE', title: 'The Craft' },
    { id: 'access', label: 'Access', dotLabel: 'A', eyebrow: 'VISIT', title: 'How to Find Us' },
    { id: 'cta', label: 'Reserve', dotLabel: 'R', eyebrow: 'FINALE', title: isSalon ? 'Book Now' : 'Reserve a Table' },
  ];
}

/* ============================================================
   Hotspot data — restaurant (La Letizia)
   ============================================================ */
const RESTAURANT_HOTSPOTS_DESKTOP: Record<string, Hotspot[]> = {
  s1: [
    { id: 's1a', x: 18, y: 38, title: 'Counter Seating', body: '12 seats facing the marina. We recommend reserving for sunset hours.', ctas: [{ label: 'Reserve counter seat', action: 'reserve' }] },
    { id: 's1b', x: 52, y: 55, title: 'Open Kitchen', body: "Watch every moment of preparation up close. The chef's hands are within arm's reach." },
    { id: 's1c', x: 76, y: 42, title: 'Private Room', body: '6 seats with sliding doors. Available for groups of 4 or more.', ctas: [{ label: 'Reserve private room', action: 'reserve' }] },
  ],
  s2: [
    { id: 's2a', x: 22, y: 55, title: 'Wagyu Sashimi', body: 'A5 rank from Miyazaki, hand-sliced. Wasabi, shiso, a single grain of sea salt.', price: 'AED 280', ctas: [{ label: 'View full menu', action: 'menu' }, { label: 'Reserve', action: 'reserve' }] },
    { id: 's2b', x: 50, y: 75, title: 'Binchotan Grill', body: 'White binchotan charcoal from Wakayama, 30 seconds per side. Nothing else.', price: 'AED 360', ctas: [{ label: 'Reserve', action: 'reserve' }] },
    { id: 's2c', x: 52, y: 30, title: "Chef's Omakase", body: '7 seasonal courses. Available for guests arriving before 7pm.', price: 'AED 880 / person', ctas: [{ label: 'Reserve omakase', action: 'reserve' }] },
  ],
  s3: [
    { id: 's3a', x: 30, y: 45, title: 'Sourcing', body: 'A5 wagyu exclusively from Miyazaki Prefecture. Weekly delivery, never frozen.' },
    { id: 's3b', x: 68, y: 35, title: '21-Day Aging', body: '21 days of dry aging to develop depth. The fat softens, umami concentrates.' },
  ],
};

const RESTAURANT_HOTSPOTS_MOBILE: Record<string, Hotspot[]> = {
  s1: [
    { id: 's1a', x: 25, y: 35, title: 'Counter Seating', body: '12 seats facing the marina. We recommend reserving for sunset hours.', ctas: [{ label: 'Reserve counter seat', action: 'reserve' }] },
    { id: 's1b', x: 50, y: 50, title: 'Open Kitchen', body: "Watch every moment of preparation up close. The chef's hands are within arm's reach." },
    { id: 's1c', x: 75, y: 35, title: 'Private Room', body: '6 seats with sliding doors. Available for groups of 4 or more.', ctas: [{ label: 'Reserve private room', action: 'reserve' }] },
  ],
  s2: [
    { id: 's2a', x: 25, y: 40, title: 'Wagyu Sashimi', body: 'A5 rank from Miyazaki, hand-sliced. Wasabi, shiso, a single grain of sea salt.', price: 'AED 280', ctas: [{ label: 'View full menu', action: 'menu' }, { label: 'Reserve', action: 'reserve' }] },
    { id: 's2b', x: 50, y: 60, title: 'Binchotan Grill', body: 'White binchotan charcoal from Wakayama, 30 seconds per side. Nothing else.', price: 'AED 360', ctas: [{ label: 'Reserve', action: 'reserve' }] },
    { id: 's2c', x: 70, y: 30, title: "Chef's Omakase", body: '7 seasonal courses. Available for guests arriving before 7pm.', price: 'AED 880 / person', ctas: [{ label: 'Reserve omakase', action: 'reserve' }] },
  ],
  s3: [
    { id: 's3a', x: 30, y: 40, title: 'Sourcing', body: 'A5 wagyu exclusively from Miyazaki Prefecture. Weekly delivery, never frozen.' },
    { id: 's3b', x: 70, y: 40, title: '21-Day Aging', body: '21 days of dry aging to develop depth. The fat softens, umami concentrates.' },
  ],
};

/* ============================================================
   Hotspot data — salon (NOA hair)
   ============================================================ */
const SALON_HOTSPOTS_DESKTOP: Record<string, Hotspot[]> = {
  s1: [
    { id: 's1a', x: 55, y: 45, title: 'Cut Chair', body: 'ゆったり横になれる、リクライニング付き。お疲れの方には足元のクッションも。' },
    { id: 's1b', x: 18, y: 55, title: 'Waiting Lounge', body: 'コーヒー・お茶・スパークリングウォーター、すべて無料です。' },
    { id: 's1c', x: 35, y: 35, title: 'Hair Bar', body: 'サロン用シャンプー・トリートメントの物販。自宅でサロン仕上がりを再現。' },
  ],
  s2: [
    { id: 's2a', x: 25, y: 45, title: 'Cut + Treatment', body: 'カット + トリートメントの基本コース。', price: '¥6,500 / 90min', ctas: [{ label: 'このコースで予約', action: 'reserve' }] },
    { id: 's2b', x: 55, y: 50, title: 'Color Treatment', body: '傷みを最小限に抑える、ブリーチなしのカラー。', price: '¥9,800 / 120min', ctas: [{ label: 'このコースで予約', action: 'reserve' }] },
    { id: 's2c', x: 75, y: 35, title: 'Head Spa', body: '施術中の眠気保証。20分の追加ヘッドスパで頭皮を深くケア。', price: '+¥3,000', ctas: [{ label: 'ヘッドスパ付きで予約', action: 'reserve' }] },
  ],
  s3: [
    { id: 's3a', x: 30, y: 45, title: 'Stylists', body: '在籍3名、全員キャリア10年以上。「似合う」を一緒に探します。' },
    { id: 's3b', x: 68, y: 40, title: 'Products', body: 'Aveda・Oway 系を中心に。髪と頭皮、地球に優しい製品だけを使用。' },
  ],
};

const SALON_HOTSPOTS_MOBILE: Record<string, Hotspot[]> = {
  s1: [
    { id: 's1a', x: 50, y: 45, title: 'Cut Chair', body: 'ゆったり横になれる、リクライニング付き。お疲れの方には足元のクッションも。' },
    { id: 's1b', x: 20, y: 55, title: 'Waiting Lounge', body: 'コーヒー・お茶・スパークリングウォーター、すべて無料です。' },
    { id: 's1c', x: 75, y: 35, title: 'Hair Bar', body: 'サロン用シャンプー・トリートメントの物販。自宅でサロン仕上がりを再現。' },
  ],
  s2: [
    { id: 's2a', x: 25, y: 40, title: 'Cut + Treatment', body: 'カット + トリートメントの基本コース。', price: '¥6,500 / 90min', ctas: [{ label: 'このコースで予約', action: 'reserve' }] },
    { id: 's2b', x: 50, y: 55, title: 'Color Treatment', body: '傷みを最小限に抑える、ブリーチなしのカラー。', price: '¥9,800 / 120min', ctas: [{ label: 'このコースで予約', action: 'reserve' }] },
    { id: 's2c', x: 75, y: 35, title: 'Head Spa', body: '施術中の眠気保証。20分の追加ヘッドスパで頭皮を深くケア。', price: '+¥3,000', ctas: [{ label: 'ヘッドスパ付きで予約', action: 'reserve' }] },
  ],
  s3: [
    { id: 's3a', x: 30, y: 40, title: 'Stylists', body: '在籍3名、全員キャリア10年以上。「似合う」を一緒に探します。' },
    { id: 's3b', x: 70, y: 40, title: 'Products', body: 'Aveda・Oway 系を中心に。髪と頭皮、地球に優しい製品だけを使用。' },
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
    title: 'A Quiet Counter, Tonight',
    subtitle: 'Wagyu from Miyazaki, charcoal from Wakayama. Twelve seats facing the marina.',
  },
  'noa-hair-tokyo-nakameguro': {
    eyebrow: 'NOA HAIR',
    title: 'Tomorrow, a little better',
    subtitle: '中目黒の小さなサロン。今日の続きを、少しだけ変えに来てください。',
  },
};

/* ============================================================
   ScrollDrivenScene wrapper — one per interactive scene (s1, s2, s3)
   ============================================================ */
interface ScrollDrivenSceneSectionProps {
  sceneId: string;
  imageUrl: string;
  hotspots: Hotspot[];
  onCtaAction?: (action: string) => void;
}

function ScrollDrivenSceneSection({
  sceneId,
  imageUrl,
  hotspots,
  onCtaAction,
}: ScrollDrivenSceneSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hotspotIds = useMemo(() => hotspots.map((h) => h.id), [hotspots]);

  const {
    activePopupId,
    glowingHotspotId,
    overrideMode,
    setOverride,
    clearOverride,
  } = useScrollDrivenScene({
    sectionRef,
    hotspotIds,
    enabled: true,
    sceneId,
  });

  // Handle user tap on hotspot — enter override mode
  const handleUserInterrupt = useCallback(() => {
    // When user taps a hotspot, InteractiveScene handles manualPopup internally
    // We just need to pause scroll-driven popup
    // Actually, let's let InteractiveScene's internal manualPopup take priority
    // The scroll-driven popup will be overridden by manualPopup in InteractiveScene
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-driven-scene"
      data-scene-id={sceneId}
    >
      <div className="scroll-driven-scene-viewport">
        <InteractiveScene
          imageUrl={imageUrl}
          hotspots={hotspots}
          isActive={true}
          onCtaAction={onCtaAction}
          autoplayPopupId={activePopupId}
          glowingHotspotId={glowingHotspotId}
          onUserInterrupt={handleUserInterrupt}
        />
      </div>
    </section>
  );
}

/* ============================================================
   Main Page Component
   ============================================================ */
export default function ScrollDrivenLpPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: lead, isLoading } = trpc.leads.getBySlug.useQuery(
    { slug: slug || '' },
    { enabled: !!slug },
  );

  const [isMobile, setIsMobile] = useState(false);
  const [lpLoading, setLpLoading] = useState(true);

  // Derive scene defs from lead
  const sceneDefs = useMemo(() => {
    if (!lead) return [];
    return buildSceneDefs({ storeName: lead.storeName, businessType: lead.businessType });
  }, [lead]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track which scene is in viewport for navigation UI
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Use IntersectionObserver to track which scene is visible
  useEffect(() => {
    const sections = document.querySelectorAll('[data-scene-id]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sceneId = (entry.target as HTMLElement).dataset.sceneId;
            const index = sceneDefs.findIndex((s) => s.id === sceneId);
            if (index >= 0) setActiveSceneIndex(index);
          }
        });
      },
      { threshold: 0.3 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [sceneDefs, lpLoading]);

  // Also track hero visibility
  useEffect(() => {
    const heroEl = document.querySelector('[data-scene-id="hero"]');
    if (!heroEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSceneIndex(0);
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [lpLoading]);

  const handleReserve = useCallback(() => {
    // Scroll to the reservation section
    const ctaSection = document.querySelector('[data-scene-id="cta"]');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleCtaAction = useCallback((action: string) => {
    if (action === 'reserve') {
      handleReserve();
    }
  }, [handleReserve]);

  const handleNavigate = useCallback((index: number) => {
    if (index < 0 || index >= sceneDefs.length) return;
    const targetId = sceneDefs[index].id;
    const targetEl = document.querySelector(`[data-scene-id="${targetId}"]`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sceneDefs]);

  const handleLoaderComplete = useCallback(() => {
    setLpLoading(false);
  }, []);

  // Loading state
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

  // Get hotspots based on viewport and business type
  const getHotspots = (sceneId: string): Hotspot[] => {
    const source = isMobile
      ? (isSalon ? SALON_HOTSPOTS_MOBILE : RESTAURANT_HOTSPOTS_MOBILE)
      : (isSalon ? SALON_HOTSPOTS_DESKTOP : RESTAURANT_HOTSPOTS_DESKTOP);
    return source[sceneId] || [];
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

  const channels: ReservationChannel[] = isSalon
    ? [
        { type: 'reserve-form', label: 'Reserve Online', url: lead.reservationUrl || lead.infoReservationUrl || '#' },
        { type: 'call', label: 'Call', sublabel: lead.infoPhone || lead.phoneNumber || '', url: `tel:${lead.infoPhone || lead.phoneNumber || ''}` },
        { type: 'line', label: 'LINE 友達追加', sublabel: '@noa-hair', url: lineUrl || '#' },
        { type: 'instagram', label: 'Instagram', sublabel: lead.instagramHandle || '', url: instagramUrl },
        { type: 'maps', label: 'Map', sublabel: 'Google Maps', url: mapsUrl },
      ]
    : [
        { type: 'reserve-form', label: 'Reserve Online', url: lead.reservationUrl || lead.infoReservationUrl || '#' },
        { type: 'call', label: 'Call', sublabel: lead.infoPhone || lead.phoneNumber || '+971 4 XXX XXXX', url: `tel:${lead.infoPhone || lead.phoneNumber || ''}` },
        { type: 'whatsapp', label: 'WhatsApp', sublabel: 'Message us', url: whatsappUrl },
        { type: 'instagram', label: 'Instagram', sublabel: lead.instagramHandle || 'Latest posts', url: instagramUrl },
        { type: 'maps', label: 'Map', sublabel: 'Google Maps', url: mapsUrl },
      ];

  const reservationTitle = isSalon ? 'ご予約はこちらから' : 'Your table is waiting';
  const reservationSubtitle = isSalon ? 'お好きな方法でお気軽にご連絡ください' : `Experience ${lead.storeName} in person`;

  const accessAddress = lead.infoAddress || (isSalon ? '東京都目黒区中目黒1-2-3 ノアビル2F' : 'Dubai Marina Walk\nTower 3, Ground Floor\nDubai, UAE');
  const accessHours = lead.infoHours || (isSalon ? '11:00 — 21:00（火曜定休）' : 'Daily 7:00 AM – 4:00 PM');
  const accessNote = isSalon
    ? '東急東横線・東京メトロ日比谷線 中目黒駅より徒歩5分\n駐車場なし（近隣コインパーキングをご利用ください）'
    : 'Dubai Marina Metro Station — 6 min walk\nValet parking available';
  const mapsEmbedUrl = isSalon
    ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7!2d139.6989!3d35.644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5Lit55uu6buS!5e0!3m2!1sja!2sjp!4v1234567890'
    : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.71336055174!2d139.75278397578708!3d35.667317772591836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188babfe1da6ed%3A0xf10d781ee21f3eb9!2zWUFLSU5JS1UgMzcg5paw5qmL5bqX!5e1!3m2!1sja!2sae!4v1780562027490!5m2!1sja!2sae';

  return (
    <div className="relative bg-black text-white scroll-driven-lp">
      {/* ===== PERSISTENT HEADER: Always visible ===== */}
      <div className="fixed top-0 left-0 right-0 z-[200] pointer-events-none">
        <div className="pointer-events-auto">
          <SceneNavigation
            scenes={sceneDefs}
            currentIndex={activeSceneIndex}
            storeName={lead.storeName || ''}
            isLoading={lpLoading}
            onNavigate={handleNavigate}
            onReserve={handleReserve}
          />
        </div>
      </div>

      {/* ===== HERO: Existing PageScrollScrub (unchanged) ===== */}
      <div data-scene-id="hero">
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
      </div>

      {/* ===== SCROLL-DRIVEN INTERACTIVE SCENES ===== */}
      {/* Step 1: Only Space (s1) is scroll-driven for now */}
      <ScrollDrivenSceneSection
        sceneId="s1"
        imageUrl={sceneImages.s1}
        hotspots={getHotspots('s1')}
        onCtaAction={handleCtaAction}
      />

      {/* s2 and s3: also scroll-driven */}
      <ScrollDrivenSceneSection
        sceneId="s2"
        imageUrl={sceneImages.s2}
        hotspots={getHotspots('s2')}
        onCtaAction={handleCtaAction}
      />

      <ScrollDrivenSceneSection
        sceneId="s3"
        imageUrl={sceneImages.s3}
        hotspots={getHotspots('s3')}
        onCtaAction={handleCtaAction}
      />

      {/* ===== ACCESS SCENE ===== */}
      <section data-scene-id="access" className="scroll-driven-scene scroll-driven-scene--static">
        <div className="scroll-driven-scene-viewport">
          <AccessScene
            address={accessAddress}
            hours={accessHours}
            accessNote={accessNote}
            mapsUrl={mapsUrl}
            mapsEmbedUrl={mapsEmbedUrl}
          />
        </div>
      </section>

      {/* ===== RESERVATION SCENE ===== */}
      <section data-scene-id="cta" className="scroll-driven-scene scroll-driven-scene--static">
        <div className="scroll-driven-scene-viewport">
          <ReservationScene
            storeName={lead.storeName || ''}
            channels={channels}
            title={reservationTitle}
            subtitle={reservationSubtitle}
            accentColor={accentColor}
          />
        </div>
      </section>
    </div>
  );
}
