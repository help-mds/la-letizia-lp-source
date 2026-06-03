import ScrubOverlay from './ScrubOverlay';

interface Props {
  topSvh: number;
  heightSvh: number;
  paragraphs: string[];
}

/**
 * Frames 61–120 (mid-room glide). Left-aligned story text that
 * accompanies the camera as it moves through the space.
 *
 * Faithfully translated from ZIP: components/templates/restaurant/overlays/StoryOverlay.tsx
 */
export default function StoryOverlay({
  topSvh,
  heightSvh,
  paragraphs,
}: Props) {
  if (paragraphs.length === 0) return null;

  return (
    <ScrubOverlay id="story" topSvh={topSvh} heightSvh={heightSvh} align="left">
      <div className="flex flex-col gap-5 md:gap-7" style={{ maxWidth: '38ch' }}>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            style={{
              color: 'rgba(242, 238, 232, 0.85)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-body)',
              lineHeight: 1.75,
            }}
          >
            {p}
          </p>
        ))}
      </div>
    </ScrubOverlay>
  );
}
