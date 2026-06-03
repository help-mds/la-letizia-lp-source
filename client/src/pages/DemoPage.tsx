import { useState, useCallback } from 'react';
import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import CinematicLoader from '@/components/CinematicLoader';
import PageScrollScrub from '@/components/PageScrollScrub';
import HeroOverlay from '@/components/overlays/HeroOverlay';
import StoryOverlay from '@/components/overlays/StoryOverlay';
import SiteMenuOverlay from '@/components/overlays/SiteMenuOverlay';
import FreezeOverlay from '@/components/overlays/FreezeOverlay';
import RestaurantMenuFadeIn from '@/components/RestaurantMenuFadeIn';
import AtmosphereSection from '@/components/sections/AtmosphereSection';
import MenuSection from '@/components/sections/MenuSection';
import GallerySection from '@/components/sections/GallerySection';
import InfoSection from '@/components/sections/InfoSection';
import CtaSection from '@/components/sections/CtaSection';
import FooterSection from '@/components/sections/FooterSection';
import { PageTransitions } from '@/components/PageTransitions';
import MdsBadge from '@/components/MdsBadge';

/**
 * Public demo page rendered at /r/:slug.
 * Assembles the full restaurant LP from lead data.
 * Structure: CinematicLoader → Hero Scrub → Bridge → Atmosphere → Menu → Gallery → CTA → Info → Footer
 */
export default function DemoPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';
  const [loaderDismissed, setLoaderDismissed] = useState(false);

  const { data: lead, isLoading, error } = trpc.leads.getBySlug.useQuery(
    { slug },
    { enabled: !!slug },
  );

  const handleLoaderComplete = useCallback(() => {
    setLoaderDismissed(true);
  }, []);

  // Data still loading from API
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0E0D0C' }}
      >
        <p
          className="text-white/40 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
      >
        <p style={{ fontFamily: 'var(--font-body)' }}>
          Page not found.
        </p>
      </div>
    );
  }

  // Frame source
  const hasFrameUrls = lead.frameUrlsLandscape && lead.frameUrlsLandscape.length > 0;
  const hasFramePath = !!lead.framesPathLandscape && (lead.frameCountLandscape ?? 0) > 0;
  const hasFrames = hasFrameUrls || hasFramePath;
  const frameCount = hasFrameUrls
    ? lead.frameUrlsLandscape!.length
    : (lead.frameCountLandscape ?? 0);

  // Navigation links for SiteMenuOverlay
  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Visit', href: '#info' },
    { label: 'Reserve', href: '#cta' },
  ];

  // Gallery items
  const galleryItems = (lead.galleryImages || []).map((src: string, i: number) => {
    const aspects = ['3/4', '4/3', '4/5', '16/9'] as const;
    const captions = ['The pour', 'The space', 'Morning ritual', 'The craft'];
    return {
      src,
      aspect: aspects[i % aspects.length],
      caption: captions[i % captions.length],
    };
  });

  // Atmosphere image
  const atmosphereImage = lead.galleryImages?.[0] || '';

  return (
    <main style={{ backgroundColor: 'var(--bg)' }}>
      {/* === Cinematic Loading Intro (Option B) === */}
      {hasFrames && (
        <PageScrollScrub
          framesPath={hasFrameUrls ? undefined : (lead.framesPathLandscape || undefined)}
          frameUrls={hasFrameUrls ? lead.frameUrlsLandscape! : undefined}
          frameCount={frameCount}
          framesPathPortrait={lead.framesPathPortrait || undefined}
          frameUrlsPortrait={lead.frameUrlsPortrait || undefined}
          frameCountPortrait={lead.frameCountPortrait || undefined}
          renderLoader={(progress, ready) => (
            !loaderDismissed ? (
              <CinematicLoader
                progress={progress}
                ready={ready}
                storeName={lead.storeName}
                onComplete={handleLoaderComplete}
              />
            ) : null
          )}
        >
          <HeroOverlay
            topSvh={0}
            heightSvh={250}
            title={lead.heroTagline || lead.storeName}
            subtitle={lead.heroSubtitle || undefined}
            storeName={lead.storeName}
          />

          {lead.storyParagraphs && lead.storyParagraphs.length > 0 && (
            <StoryOverlay
              topSvh={250}
              heightSvh={200}
              paragraphs={lead.storyParagraphs}
            />
          )}

          <SiteMenuOverlay
            topSvh={450}
            heightSvh={200}
            links={navLinks}
          />

          <FreezeOverlay
            topSvh={650}
            heightSvh={150}
            eyebrow="A taste of what awaits"
          />
        </PageScrollScrub>
      )}

      {/* Fallback when no frames */}
      {!hasFrames && (
        <div
          className="h-[100svh] flex items-center justify-center"
          style={{ backgroundColor: 'var(--ink)' }}
        >
          <div className="text-center px-[var(--gutter)]">
            <p
              className="uppercase mb-4"
              style={{
                color: 'rgba(242, 238, 232, 0.85)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-eyebrow)',
                letterSpacing: '0.32em',
              }}
            >
              {lead.storeName}
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--fs-hero)',
                color: 'var(--overlay-text)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 0.95,
              }}
            >
              {lead.heroTagline || lead.storeName}
            </h1>
          </div>
        </div>
      )}

      {/* === Gradient Bridge (dark → dark) === */}
      <RestaurantMenuFadeIn />

      {/* === Atmosphere Section (pin scroll + reveal mask + kinetic text) === */}
      {atmosphereImage && (
        <AtmosphereSection
          imageUrl={atmosphereImage}
          caption="Where mornings stretch longer."
        />
      )}

      {/* === Menu Section === */}
      {lead.menuItems && lead.menuItems.length > 0 && (
        <MenuSection items={lead.menuItems} />
      )}

      {/* === Gallery Section (horizontal scroll) === */}
      {galleryItems.length > 0 && (
        <GallerySection items={galleryItems} />
      )}

      {/* === Info Section === */}
      <InfoSection
        storeName={lead.storeName}
        area={lead.area || 'Dubai Marina'}
        address={lead.infoAddress || undefined}
        hours={lead.infoHours || undefined}
        phone={lead.infoPhone || undefined}
        reservationUrl={lead.infoReservationUrl || undefined}
      />

      {/* === CTA Section === */}
      <CtaSection
        title="Your table is waiting"
        subtitle={`Experience ${lead.storeName} in person.`}
        ctas={[
          { label: 'Make a Reservation', href: '#', variant: 'primary' },
          ...(lead.infoPhone
            ? [{ label: `Call ${lead.infoPhone}`, href: `tel:${lead.infoPhone}`, variant: 'secondary' as const }]
            : []),
        ]}
      />

      {/* === Footer === */}
      <FooterSection storeName={lead.storeName} />

      {/* === Page-level scroll choreography === */}
      <PageTransitions />

      {/* === Global grain overlay === */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 9998,
          opacity: 0.035,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* === MDS Badge === */}
      <MdsBadge />
    </main>
  );
}
