import { useParams } from 'wouter';
import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import SalonLoader from '@/components/salon/SalonLoader';
import ScrollAnimatedHero from '@/components/salon/ScrollAnimatedHero';
import SalonArrival from '@/components/salon/SalonArrival';
import ThePause from '@/components/salon/ThePause';
import SalonMenu from '@/components/salon/SalonMenu';
import TheWork from '@/components/salon/TheWork';
import Transformation from '@/components/salon/Transformation';
import Lingering from '@/components/salon/Lingering';
import SalonFooter from '@/components/salon/SalonFooter';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';

/**
 * Salon demo page rendered at /s/:slug.
 * "The Ritual" template — time-based experience with faceless macro photography.
 *
 * Structure: Loader → ScrollAnimatedHero → Arrival → The Pause → Menu → The Work → Transformation → Lingering → Footer
 *
 * Differentiation from restaurant (/r/:slug):
 * - SalonLoader (fade out, not slide up)
 * - Hero is 3-image cross-fade (Ken Burns), not video frames
 * - Sections flow as "time passing" not "space entering"
 * - Light background (not dark), faceless, texture-focused
 * - Motion is slower, more deliberate
 */
export default function SalonDemoPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';
  const [loaderDone, setLoaderDone] = useState(false);
  const [heroImagesReady, setHeroImagesReady] = useState(false);

  const { data: lead, isLoading, error } = trpc.leads.getBySlug.useQuery(
    { slug },
    { enabled: !!slug },
  );

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  // Preload hero images and signal readiness
  const handleHeroImagesLoaded = useCallback(() => {
    setHeroImagesReady(true);
  }, []);

  // Loading state (data fetch)
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0E0D0C' }}
      />
    );
  }

  if (error || !lead) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#fafaf9' }}
      >
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
          Page not found.
        </p>
      </div>
    );
  }

  // Extract data from lead
  const heroImages = (lead.galleryImages || []).slice(0, 3);
  const arrivalImage = (lead.galleryImages || [])[3] || heroImages[0] || '';
  const pauseImages = (lead.galleryImages || []).slice(4, 6);
  const workImages = (lead.galleryImages || []).slice(6, 10);
  const transformImage = (lead.galleryImages || [])[10] || (lead.galleryImages || [])[2] || '';

  // Determine tone from template
  const isLuxury = lead.template?.includes('luxury') !== false;
  const motionScale = isLuxury ? 0.8 : 1.2;

  // Dynamic CSS variables for salon
  const salonVars = {
    '--salon-bg': '#fafaf9',
    '--salon-ink': '#1a1a1a',
    '--salon-muted': '#888888',
    '--salon-font-heading': '"Fraunces", serif',
    '--salon-accent': lead.paletteAccent || '#1a1a1a',
  } as React.CSSProperties;

  return (
    <main style={salonVars}>
      {/* === Cinematic Loader === */}
      {!loaderDone && (
        <SalonLoader
          storeName={lead.storeName}
          imagesReady={heroImagesReady}
          onComplete={handleLoaderComplete}
        />
      )}

      {/* === Hero: 3-image cross-fade with Ken Burns (🔴 LOCK) === */}
      {heroImages.length > 0 && (
        <ScrollAnimatedHero
          images={heroImages}
          storeName={lead.storeName}
          subtitle={lead.heroSubtitle || 'The Ritual'}
          motionScale={motionScale}
          onImagesLoaded={handleHeroImagesLoaded}
        />
      )}

      {/* === Arrival: Space reveals itself === */}
      {arrivalImage && (
        <SalonArrival
          imageUrl={arrivalImage}
          caption={lead.atmosphereCaption || 'Where time moves differently.'}
        />
      )}

      {/* === The Pause: Detail photos + kinetic text === */}
      {pauseImages.length > 0 && (
        <ThePause
          images={pauseImages}
          text={lead.storyParagraphs?.[0] || 'A moment before the work begins.'}
        />
      )}

      {/* === Menu / Services === */}
      {lead.menuItems && lead.menuItems.length > 0 && (
        <SalonMenu
          items={lead.menuItems}
          title="Services"
          eyebrow="Our Rituals"
        />
      )}

      {/* === The Work: Circle reveal macro photography === */}
      {workImages.length > 0 && (
        <TheWork
          images={workImages}
          motionScale={motionScale}
        />
      )}

      {/* === Transformation: Wipe reveal of finished result === */}
      {transformImage && (
        <Transformation
          imageUrl={transformImage}
          caption={lead.storyParagraphs?.[1] || 'The reveal.'}
        />
      )}

      {/* === Lingering: CTA + contact === */}
      <Lingering
        storeName={lead.storeName}
        ctaLabel={lead.ctaTitle || 'Book Your Ritual'}
        ctaUrl={lead.infoReservationUrl || '#'}
        phone={lead.infoPhone || undefined}
        address={lead.infoAddress || undefined}
        hours={lead.infoHours || undefined}
      />

      {/* === Footer === */}
      <SalonFooter storeName={lead.storeName} />

      {/* === Global effects (shared with restaurant) === */}
      <SmoothScroll />
      <CustomCursor />

      {/* === Grain overlay (lighter for salon) === */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 9998,
          opacity: 0.02,
          mixBlendMode: 'multiply',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
        }}
      />
    </main>
  );
}
