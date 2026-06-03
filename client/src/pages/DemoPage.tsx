import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
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
import MdsBadge from '@/components/MdsBadge';

/**
 * Public demo page rendered at /r/:slug.
 * Assembles the full restaurant LP from lead data.
 * Structure: Hero → Atmosphere → Menu → Gallery → CTA (案A)
 */
export default function DemoPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';

  const { data: lead, isLoading, error } = trpc.leads.getBySlug.useQuery(
    { slug },
    { enabled: !!slug },
  );

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--ink)' }}
      >
        <p
          className="text-white/60 text-xs tracking-[0.2em] uppercase"
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

  // Determine frame source: prefer frameUrls array, fallback to basePath
  const hasFrameUrls = lead.frameUrlsLandscape && lead.frameUrlsLandscape.length > 0;
  const hasFramePath = !!lead.framesPathLandscape && (lead.frameCountLandscape ?? 0) > 0;
  const hasFrames = hasFrameUrls || hasFramePath;

  const frameCount = hasFrameUrls
    ? lead.frameUrlsLandscape!.length
    : (lead.frameCountLandscape ?? 0);

  // Navigation links for SiteMenuOverlay
  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Visit', href: '#info' },
    { label: 'Reserve', href: '#cta' },
  ];

  // Gallery items with varied aspect ratios (masonry)
  const galleryItems = (lead.galleryImages || []).map((src: string, i: number) => {
    const aspects = ['3/4', '4/3', '4/5', '16/9'] as const;
    const captions = ['The pour', 'The space', 'Morning ritual', 'The craft'];
    return {
      src,
      aspect: aspects[i % aspects.length],
      caption: captions[i % captions.length],
    };
  });

  // Atmosphere image (first gallery image or dedicated atmosphere image)
  const atmosphereImage = lead.galleryImages?.[1] || lead.galleryImages?.[0] || '';

  return (
    <main style={{ backgroundColor: 'var(--bg)' }}>
      {/* === Scroll Scrub Hero (800svh) === */}
      {hasFrames ? (
        <PageScrollScrub
          framesPath={hasFrameUrls ? undefined : (lead.framesPathLandscape || undefined)}
          frameUrls={hasFrameUrls ? lead.frameUrlsLandscape! : undefined}
          frameCount={frameCount}
          framesPathPortrait={lead.framesPathPortrait || undefined}
          frameUrlsPortrait={lead.frameUrlsPortrait || undefined}
          frameCountPortrait={lead.frameCountPortrait || undefined}
        >
          {/* Phase 1: Hero (0–250svh) */}
          <HeroOverlay
            topSvh={0}
            heightSvh={250}
            title={lead.heroTagline || lead.storeName}
            subtitle={lead.heroSubtitle || undefined}
            storeName={lead.storeName}
          />

          {/* Phase 2: Story (250–450svh) */}
          {lead.storyParagraphs && lead.storyParagraphs.length > 0 && (
            <StoryOverlay
              topSvh={250}
              heightSvh={200}
              paragraphs={lead.storyParagraphs}
            />
          )}

          {/* Phase 3: Site Menu (450–650svh) */}
          <SiteMenuOverlay
            topSvh={450}
            heightSvh={200}
            links={navLinks}
          />

          {/* Phase 4: Freeze (650–800svh) */}
          <FreezeOverlay
            topSvh={650}
            heightSvh={150}
            eyebrow="A taste of what awaits"
          />
        </PageScrollScrub>
      ) : (
        /* Fallback: no frames available yet */
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
            {lead.heroSubtitle && (
              <p
                className="mt-6"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--fs-body)',
                  color: 'rgba(242, 238, 232, 0.75)',
                  maxWidth: '42ch',
                  margin: '1.5rem auto 0',
                  lineHeight: 1.7,
                }}
              >
                {lead.heroSubtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* === Gradient Bridge (black → white) === */}
      <RestaurantMenuFadeIn />

      {/* === Atmosphere Section (full-bleed + Ken Burns) === */}
      {atmosphereImage && (
        <AtmosphereSection
          imageUrl={atmosphereImage}
          caption="Where mornings stretch longer."
        />
      )}

      {/* === Color Transition: Atmosphere → Menu === */}
      <div
        className="w-full h-24"
        style={{
          background: 'linear-gradient(to bottom, rgba(26,23,20,0.03), var(--bg))',
        }}
      />

      {/* === Menu Section === */}
      {lead.menuItems && lead.menuItems.length > 0 && (
        <MenuSection items={lead.menuItems} />
      )}

      {/* === Sticky Reveal Transition: Menu → Gallery === */}
      <div className="w-full" style={{ height: '8vh' }} />

      {/* === Gallery Section (masonry + hover zoom) === */}
      {galleryItems.length > 0 && (
        <GallerySection items={galleryItems} />
      )}

      {/* === Pin Scroll Transition: Gallery → CTA === */}
      <div
        className="w-full"
        style={{
          height: '30vh',
          background: 'linear-gradient(to bottom, var(--bg), var(--ink))',
        }}
      />

      {/* === CTA Section (cinematic credits style) === */}
      <CtaSection
        title="Your table is waiting"
        subtitle={`Experience ${lead.storeName} in person.`}
      />

      {/* === Info Section === */}
      <InfoSection
        address={lead.infoAddress || undefined}
        hours={lead.infoHours || undefined}
        phone={lead.infoPhone || undefined}
        reservationUrl={lead.infoReservationUrl || undefined}
      />

      {/* === Footer === */}
      <footer
        className="w-full py-8"
        style={{
          backgroundColor: 'var(--bg)',
          borderTop: '1px solid rgba(26, 23, 20, 0.06)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'rgba(26, 23, 20, 0.4)',
            letterSpacing: '0.1em',
          }}
        >
          {lead.storeName} &middot; {lead.area}
        </p>
      </footer>

      {/* === MDS Badge === */}
      <MdsBadge />
    </main>
  );
}
