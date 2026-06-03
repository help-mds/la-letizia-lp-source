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
 * Premium gallery — large centered cards with horizontal scroll.
 * Each image is 55-65vw wide so the photo is clearly visible.
 * Smooth GSAP horizontal scroll via data-horizontal-scroll.
 * Dark background, editorial typography, generous whitespace.
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
          padding: 'clamp(80px, 12vh, 140px) var(--gutter) clamp(48px, 6vh, 80px)',
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
              color: 'rgba(242, 238, 232, 0.4)',
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
        <p
          className="hidden md:block"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: 'rgba(242, 238, 232, 0.3)',
          }}
        >
          {totalCount} images
        </p>
      </div>

      {/* Horizontal scroll container — large cards */}
      <div
        data-horizontal-scroll
        className="relative w-full overflow-hidden"
        style={{ height: '75vh', minHeight: '500px' }}
      >
        <div
          data-horizontal-inner
          className="flex items-center h-full will-change-transform"
          style={{
            gap: 'clamp(32px, 4vw, 64px)',
            paddingLeft: 'clamp(48px, 8vw, 120px)',
            paddingRight: 'clamp(48px, 8vw, 120px)',
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
          {/* End spacer for smooth exit */}
          <div className="shrink-0 w-[20vw]" />
        </div>
      </div>
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

  const counter = `${String(index + 1).padStart(2, '0')}`;

  // Aspect ratio determines width/height relationship
  // All cards are tall (60vh) with width determined by aspect
  const aspectWidths: Record<string, string> = {
    '3/4': 'clamp(340px, 50vw, 700px)',
    '4/3': 'clamp(420px, 60vw, 850px)',
    '4/5': 'clamp(320px, 45vw, 640px)',
    '16/9': 'clamp(480px, 65vw, 920px)',
  };

  const cardWidth = aspectWidths[item.aspect] || 'clamp(400px, 55vw, 780px)';

  return (
    <div
      className="gallery-card relative shrink-0 flex flex-col"
      data-cursor-view
      style={{ width: cardWidth, height: '62vh', minHeight: '400px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div
        className="relative flex-1 overflow-hidden cursor-pointer"
        style={{ borderRadius: '3px' }}
      >
        <img
          src={item.src}
          alt={item.caption || ''}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms]"
          style={{
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          loading="lazy"
        />

        {/* Subtle bottom gradient for text readability */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
          }}
        />

        {/* Counter — top left, minimal */}
        <div
          className="absolute top-5 left-5"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {counter}
        </div>
      </div>

      {/* Caption — below image, elegant */}
      {item.caption && (
        <div
          className="flex items-center justify-between mt-5"
          style={{
            paddingBottom: '4px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'rgba(242, 238, 232, 0.6)',
              letterSpacing: '0.01em',
            }}
          >
            {item.caption}
          </p>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: 'rgba(242, 238, 232, 0.25)',
            }}
          >
            {counter} / {String(total).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}
