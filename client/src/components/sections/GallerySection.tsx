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
 * Premium horizontal-scroll gallery with pinned scrub.
 * Uses data-horizontal-scroll for GSAP pin + scrub via PageTransitions.
 * Each image has hover zoom + caption reveal.
 */
export default function GallerySection({ items, eyebrow = 'Gallery' }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="gallery"
      className="relative w-full"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--ink)',
      }}
    >
      {/* Eyebrow header */}
      <div
        data-reveal
        style={{
          padding: 'var(--space-section) var(--gutter) calc(var(--space-block) * 1.5)',
          maxWidth: 'var(--maxw)',
          margin: '0 auto',
        }}
      >
        <p
          className="uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: '0.32em',
            color: 'var(--accent)',
          }}
        >
          {eyebrow}
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div
        data-horizontal-scroll
        className="relative w-full overflow-hidden"
        style={{ height: '75vh', minHeight: '500px' }}
      >
        <div
          data-horizontal-inner
          className="flex items-center gap-6 md:gap-8 h-full will-change-transform"
          style={{
            paddingLeft: 'var(--gutter)',
            paddingRight: 'var(--gutter)',
            width: 'max-content',
          }}
        >
          {items.map((item, i) => (
            <GalleryCard key={i} item={item} index={i} />
          ))}
          {/* End spacer */}
          <div className="shrink-0 w-[10vw]" />
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  // Alternate heights for visual rhythm
  const heights = ['60vh', '50vh', '65vh', '55vh'];
  const height = heights[index % heights.length];

  return (
    <div
      className="relative shrink-0 overflow-hidden cursor-pointer"
      style={{
        height,
        aspectRatio: item.aspect,
        borderRadius: '2px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.src}
        alt={item.caption || ''}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
        style={{
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        loading="lazy"
      />

      {/* Hover gradient + caption */}
      <div
        className="absolute inset-0 flex items-end transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
        }}
      >
        {item.caption && (
          <p
            className="p-6 text-white/90 text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {item.caption}
          </p>
        )}
      </div>
    </div>
  );
}
