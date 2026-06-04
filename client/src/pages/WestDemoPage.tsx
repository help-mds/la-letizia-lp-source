import { useState, useCallback } from 'react';
import CinematicLoader from '@/components/CinematicLoader';
import PageScrollScrub from '@/components/PageScrollScrub';
import HeroOverlay from '@/components/overlays/HeroOverlay';
import AtmosphereSection from '@/components/sections/AtmosphereSection';
import ShowcaseSection from '@/components/sections/ShowcaseSection';
import DetailSection from '@/components/sections/DetailSection';
import MenuSection from '@/components/sections/MenuSection';
import StorySection from '@/components/sections/StorySection';
import NumbersSection from '@/components/sections/NumbersSection';
import VisitSection from '@/components/sections/VisitSection';
import SeamTransition from '@/components/SeamTransition';
import { PageTransitions } from '@/components/PageTransitions';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import MdsBadge from '@/components/MdsBadge';
import { ASSETS } from '@/data/37west-assets';
import frameData from '@/data/37west-frames.json';

/**
 * 37 West — Into The Amazon style prototype
 *
 * Section order:
 * 01 Hero (Arrival)     — vertical video scrub (existing PageScrollScrub)
 * 02 Atmosphere         — clip-path reveal + kinetic (existing)
 *    ↓ C: mask transition
 * 03 Showcase           — full-screen continuous morph (new)
 * 03.5 Detail           — vertical video scrub (new)
 *    ↓ B: crossfade
 * 04 Menu               — existing menu display
 *    ↓ A: black flash
 * 05 Story              — horizontal video scrub (new)
 * 07 Numbers            — large typography kinetic (new)
 * 08 Visit              — cinematic endroll CTA (new)
 */
export default function WestDemoPage() {
  const [loaderDismissed, setLoaderDismissed] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDismissed(true);
  }, []);

  // Hero frames
  const heroFrames = frameData.hero.frames;
  const detailFrames = frameData.detail.frames;
  const storyFrames = frameData.story.frames;

  // Story steps (37 West = premium yakiniku)
  const storySteps = [
    { number: '01', title: 'Sourcing', subtitle: 'A5-grade wagyu from Miyazaki prefecture' },
    { number: '02', title: 'Aging', subtitle: '21 days of dry-aging for depth' },
    { number: '03', title: 'The Cut', subtitle: 'Hand-carved by our master butcher' },
    { number: '04', title: 'The Flame', subtitle: 'Binchotan charcoal, 800°C precision' },
    { number: '05', title: 'Served', subtitle: 'At the peak of perfection' },
  ];

  // Numbers
  const numbers = [
    { number: '37', label: 'days of aging per cut' },
    { number: '800°', label: 'binchotan flame' },
    { number: '5', label: 'seats at the counter' },
  ];

  // Menu items for the existing MenuSection
  const menuItems = [
    { name: 'A5 Wagyu Sirloin', description: 'Miyazaki prefecture, 150g', price: 'AED 480' },
    { name: 'Wagyu Ribeye', description: 'Kagoshima, dry-aged 21 days', price: 'AED 520' },
    { name: 'Tenderloin Flight', description: '3 cuts, 3 preparations', price: 'AED 680' },
    { name: 'Omakase Course', description: '7 courses, chef\'s selection', price: 'AED 1,200' },
    { name: 'Wagyu Sashimi', description: 'Thinly sliced, ponzu, truffle', price: 'AED 320' },
    { name: 'Binchotan Vegetables', description: 'Seasonal selection, charcoal grilled', price: 'AED 180' },
  ];

  return (
    <main style={{ backgroundColor: '#0E0D0C' }}>
      {/* === 01 Hero: Vertical video scrub === */}
      <PageScrollScrub
        frameUrls={heroFrames}
        frameCount={heroFrames.length}
        loaderActive={!loaderDismissed}
        renderLoader={(progress, ready) =>
          !loaderDismissed ? (
            <CinematicLoader
              progress={progress}
              ready={ready}
              storeName="37 West"
              onComplete={handleLoaderComplete}
            />
          ) : null
        }
      >
        <HeroOverlay
          topSvh={0}
          heightSvh={250}
          title="37 West"
          subtitle="Premium Yakiniku Experience"
          storeName="37 West"
        />
      </PageScrollScrub>

      {/* === 02 Atmosphere: clip-path reveal === */}
      <AtmosphereSection
        imageUrl={ASSETS.interior}
        caption="Where fire meets precision."
      />

      {/* === Transition C: Mask (Atmosphere → Showcase) === */}
      <SeamTransition type="mask" />

      {/* === 03 Showcase: Full-screen continuous morph === */}
      <ShowcaseSection
        items={ASSETS.showcase.map((s) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          image: s.image,
        }))}
        label="Selection"
      />

      {/* === 03.5 Detail: Vertical video scrub === */}
      <DetailSection
        frameUrls={detailFrames}
        caption="The Cut"
      />

      {/* === Transition B: Crossfade (Detail → Menu) === */}
      <SeamTransition type="crossfade" />

      {/* === 04 Menu === */}
      <MenuSection items={menuItems} />

      {/* === Transition A: Black flash (Menu → Story) === */}
      <SeamTransition type="blackflash" flashText="Our Story" />

      {/* === 05 Story: Horizontal video scrub === */}
      <StorySection
        frameUrls={storyFrames}
        steps={storySteps}
      />

      {/* === 07 Numbers === */}
      <NumbersSection items={numbers} />

      {/* === 08 Visit: Endroll CTA === */}
      <VisitSection
        storeName="37 West"
        quote="Every detail, every flame, every cut — for you."
        hours="Tue – Sun, 6 PM – 12 AM"
        address="DIFC, Gate Village, Dubai"
        reservationUrl="#"
      />

      {/* === Utilities === */}
      <PageTransitions />
      <SmoothScroll />
      <CustomCursor />

      {/* === Grain overlay === */}
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
