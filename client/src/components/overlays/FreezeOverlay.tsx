import ScrubOverlay from './ScrubOverlay';

interface Props {
  topSvh: number;
  heightSvh: number;
  eyebrow?: string;
  message?: string;
}

/**
 * Frames 181–241 (final close-up). Minimal text so the food still owns
 * the frame — a small eyebrow at the bottom centre, optional one-line
 * teaser. Acts as a 3-second pause before the white Menu section.
 *
 * Faithfully translated from ZIP: components/templates/restaurant/overlays/FreezeOverlay.tsx
 */
export default function FreezeOverlay({
  topSvh,
  heightSvh,
  eyebrow = 'A taste of what awaits',
  message,
}: Props) {
  return (
    <ScrubOverlay
      id="freeze"
      topSvh={topSvh}
      heightSvh={heightSvh}
      align="center"
      gradient={false}
    >
      <div className="mt-auto pb-[clamp(48px,10svh,140px)] flex flex-col items-center gap-3">
        <p
          className="uppercase"
          style={{
            color: 'rgba(242, 238, 232, 0.85)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: '0.32em',
            textShadow: 'var(--overlay-shadow)',
          }}
        >
          {eyebrow}
        </p>
        {message && (
          <p
            className="text-center"
            style={{
              color: 'rgba(242, 238, 232, 0.7)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-body)',
              textShadow: 'var(--overlay-shadow)',
              maxWidth: '36ch',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </ScrubOverlay>
  );
}
