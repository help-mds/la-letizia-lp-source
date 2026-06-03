import { useState } from 'react';

interface GalleryItem {
  src: string;
  caption?: string;
  aspect: '3/4' | '4/3' | '4/5' | '16/9';
}

interface Props {
  items: GalleryItem[];
  eyebrow?: string;
}

/**
 * Premium horizontal-scroll gallery — Phase B upgrade.
 * Features:
 * - Larger cards with staggered heights
 * - Counter display (01 / 04) on each card
 * - Always-visible caption below each image
 * - Smooth hover zoom with clip-path mask
 * - data-horizontal-scroll for GSAP pin + scrub
 * - Dark section background for dramatic contrast
 */
export default function GallerySection({ items, eyebrow = 'Gallery' }: Props) {
  if (items.length === 0) return null;

  const totalCount = String(items.length).padStart(2, '0');

  return (
    <section
      id="gallery"
      className="relative w-full"
      style={{
        backgroundColor: '#0E0D0C',
        color: 'var(--overlay-text)',
      }}
    >
      {/* Header */}
      <div
        data-reveal
        className="flex items-end justify-between"
        style={{
          padding: 'var(--space-section) var(--gutter) calc(var(--space-block) * 2)',
          maxWidth: 'var(--maxw)',
          margin: '0 auto',
        }}
      >
        <div>
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              color: 'rgba(242, 238, 232, 0.5)',
              marginBottom: 'calc(var(--space-block) / 3)',
            }}
          >
            {eyebrow}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--overlay-text)',
            }}
          >
            Moments captured
          </p>
        </div>
        {/* Total count */}
        <p
          className="hidden md:block"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: 'rgba(242, 238, 232, 0.35)',
          }}
        >
          {totalCount} images
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div
        data-horizontal-scroll
        className="relative w-full overflow-hidden"
        style={{ height: '80vh', minHeight: '550px' }}
      >
        <div
          data-horizontal-inner
          className="flex items-end gap-5 md:gap-7 h-full will-change-transform"
          style={{
            paddingLeft: 'var(--gutter)',
            paddingRight: 'var(--gutter)',
            paddingBottom: 'clamp(32px, 5vh, 64px)',
            width: 'max-content',
          }}
        >
          {items.map((item, i) => (
            <GalleryCard
              key={i}
              item={item}
              index={i}
              total={items.length}
            />
          ))}
          {/* End spacer */}
          <div className="shrink-0 w-[15vw]" />
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #0E0D0C 0%, transparent 100%)',
        }}
      />
    </section>
  );
}

function GalleryCard({
  item,
  index,
  total,
}: {
  item: GalleryItem;
  index: number;
  total: number;
}) {
  const [hovered, setHovered] = useState(false);

  // Staggered heights for visual rhythm
  const heights = ['65vh', '52vh', '70vh', '58vh'];
  const height = heights[index % heights.length];
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <div
      className="relative shrink-0 flex flex-col"
      style={{ height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container with overflow hidden for zoom */}
      <div
        className="relative flex-1 overflow-hidden cursor-pointer"
        style={{
          borderRadius: '2px',
        }}
      >
        <img
          src={item.src}
          alt={item.caption || ''}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms]"
          style={{
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          loading="lazy"
        />

        {/* Subtle vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Counter badge */}
        <div
          className="absolute top-4 right-4"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.6)',
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '2px',
          }}
        >
          {counter}
        </div>
      </div>

      {/* Caption — always visible below image */}
      {item.caption && (
        <p
          className="mt-4"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(242, 238, 232, 0.45)',
          }}
        >
          {item.caption}
        </p>
      )}
    </div>
  );
}
