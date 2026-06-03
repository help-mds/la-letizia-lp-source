import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import PageScrollScrub from '@/components/PageScrollScrub';
import HeroOverlay from '@/components/overlays/HeroOverlay';
import StoryOverlay from '@/components/overlays/StoryOverlay';
import SiteMenuOverlay from '@/components/overlays/SiteMenuOverlay';
import FreezeOverlay from '@/components/overlays/FreezeOverlay';
import RestaurantMenuFadeIn from '@/components/RestaurantMenuFadeIn';
import MenuSection from '@/components/sections/MenuSection';
import GallerySection from '@/components/sections/GallerySection';
import InfoSection from '@/components/sections/InfoSection';
import CtaSection from '@/components/sections/CtaSection';

/**
 * Public demo page rendered at /r/:slug.
 * Assembles the full restaurant LP from lead data.
 *
 * Faithfully translated from ZIP: RestaurantTemplate.tsx + app/(public)/r/[slug]/page.tsx
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
    ...(lead.galleryImages && lead.galleryImages.length > 0
      ? [{ label: 'Gallery', href: '#gallery' }]
      : []),
    { label: 'Visit', href: '#info' },
    { label: 'Reserve', href: '#cta' },
  ];

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

      {/* === Gradient Bridge === */}
      <RestaurantMenuFadeIn />

      {/* === White Content Sections === */}
      {lead.menuItems && lead.menuItems.length > 0 && (
        <MenuSection items={lead.menuItems} />
      )}

      {lead.galleryImages && lead.galleryImages.length > 0 && (
        <GallerySection images={lead.galleryImages} />
      )}

      <InfoSection
        address={lead.infoAddress || undefined}
        hours={lead.infoHours || undefined}
        phone={lead.infoPhone || undefined}
        reservationUrl={lead.infoReservationUrl || undefined}
      />

      <CtaSection
        title="Your table is waiting"
        subtitle={`Experience ${lead.storeName} in person.`}
      />

      {/* Footer */}
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
    </main>
  );
}
