import type { CSSProperties, ReactNode } from 'react';

interface Props {
  id?: string;
  /** Range of the scrub container this overlay claims, in svh. */
  topSvh: number;
  heightSvh: number;
  /** Where the sticky content block sits within the viewport. */
  align?: 'center' | 'left' | 'right' | 'bottom-left' | 'bottom-right';
  /** When false the dark gradient overlay is omitted (transparent canvas). */
  gradient?: boolean;
  /** Optional inline style for the sticky content container. */
  contentStyle?: CSSProperties;
  children: ReactNode;
}

/**
 * Shared overlay wrapper used by Hero/Story/SiteMenu/Freeze overlays.
 *
 * Faithfully translated from ZIP: components/templates/restaurant/overlays/ScrubOverlay.tsx
 *
 *  - The outer element is absolutely positioned within PageScrollScrub
 *    and consumes `heightSvh` of scroll length.
 *  - Both the gradient AND the content stick to viewport top so they
 *    survive across the whole phase.
 *  - `pointer-events` is none on the wrapper so the canvas underneath
 *    receives scroll/touch; content re-enables pointer events on itself.
 */
export default function ScrubOverlay({
  id,
  topSvh,
  heightSvh,
  align = 'center',
  gradient = true,
  contentStyle,
  children,
}: Props) {
  const alignClass =
    align === 'left' ? 'items-start text-left'
    : align === 'right' ? 'items-end text-right'
    : align === 'bottom-left' ? 'items-start justify-end text-left'
    : align === 'bottom-right' ? 'items-end justify-end text-right'
    : 'items-center text-center';

  // For non-bottom-* alignments we still center vertically.
  const verticalClass = align.startsWith('bottom-') ? '' : 'justify-center';

  return (
    <section
      id={id}
      data-scrub-overlay
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        top: `${topSvh}svh`,
        height: `${heightSvh}svh`,
        zIndex: 2,
      }}
    >
      {gradient && (
        <div
          aria-hidden
          className="block w-full h-[100svh]"
          style={{
            position: 'sticky',
            top: 0,
            background: 'var(--overlay-gradient)',
          }}
        />
      )}
      <div
        className={`flex flex-col w-full h-[100svh] px-[var(--gutter)] py-[clamp(48px,8svh,120px)] ${alignClass} ${verticalClass}`}
        style={{
          position: 'sticky',
          top: 0,
          marginTop: gradient ? '-100svh' : '0',
          color: 'var(--overlay-text)',
          textShadow: 'var(--overlay-shadow)',
          pointerEvents: 'auto',
          ...contentStyle,
        }}
      >
        <div className="w-full" style={{ maxWidth: 'var(--maxw)' }}>
          {children}
        </div>
      </div>
    </section>
  );
}
