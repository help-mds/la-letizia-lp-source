import ScrubOverlay from './ScrubOverlay';

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  topSvh: number;
  heightSvh: number;
  eyebrow?: string;
  links: NavLink[];
}

/**
 * Frames 121–180 (approaching the table). Right-aligned numbered nav —
 * the metaphor is "being shown to your section" while the camera glides
 * toward a table.
 *
 * Faithfully translated from ZIP: components/templates/restaurant/overlays/SiteMenuOverlay.tsx
 */
export default function SiteMenuOverlay({
  topSvh,
  heightSvh,
  eyebrow = 'Explore',
  links,
}: Props) {
  if (links.length === 0) return null;

  return (
    <ScrubOverlay id="site-menu" topSvh={topSvh} heightSvh={heightSvh} align="right">
      <p
        className="uppercase ml-auto"
        style={{
          color: 'rgba(242, 238, 232, 0.85)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-eyebrow)',
          letterSpacing: '0.32em',
          marginBottom: 'calc(var(--space-block) / 1.5)',
        }}
      >
        {eyebrow}
      </p>

      <ul
        className="flex flex-col gap-4 md:gap-6 ml-auto"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {links.map((l, i) => (
          <li key={l.href} className="flex items-baseline justify-end gap-4 md:gap-6">
            <span
              className="text-[11px] tabular-nums"
              style={{
                color: 'rgba(242, 238, 232, 0.55)',
                letterSpacing: '0.18em',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <a
              href={l.href}
              className="group relative inline-block"
              style={{
                color: 'var(--overlay-text)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4.2vw, 56px)',
                lineHeight: 1.0,
                fontWeight: 300,
                fontStyle: 'italic',
                letterSpacing: '-0.015em',
              }}
            >
              {l.label}
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 block h-px w-0 transition-[width] duration-500 ease-out group-hover:w-full"
                style={{ backgroundColor: 'var(--overlay-text)' }}
              />
            </a>
          </li>
        ))}
      </ul>
    </ScrubOverlay>
  );
}
