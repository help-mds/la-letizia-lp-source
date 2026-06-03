import ScrubOverlay from './ScrubOverlay';

interface Props {
  topSvh: number;
  heightSvh: number;
  title: string;
  subtitle?: string;
  storeName: string;
}

/**
 * Frames 1–60 (entrance). Full-bleed hero with store name eyebrow,
 * large title, and optional subtitle.
 *
 * Faithfully translated from ZIP: components/templates/restaurant/overlays/HeroOverlay.tsx
 */
export default function HeroOverlay({
  topSvh,
  heightSvh,
  title,
  subtitle,
  storeName,
}: Props) {
  return (
    <ScrubOverlay id="hero" topSvh={topSvh} heightSvh={heightSvh} align="center">
      <p
        className="uppercase"
        style={{
          color: 'rgba(242, 238, 232, 0.85)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-eyebrow)',
          letterSpacing: '0.32em',
          marginBottom: 'calc(var(--space-block) / 2)',
        }}
      >
        {storeName}
      </p>

      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--fs-hero)',
          lineHeight: 0.95,
          fontWeight: 300,
          fontStyle: 'italic',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="mt-6 md:mt-8"
          style={{
            color: 'rgba(242, 238, 232, 0.75)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-body)',
            lineHeight: 1.7,
            maxWidth: '42ch',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {subtitle}
        </p>
      )}
    </ScrubOverlay>
  );
}
