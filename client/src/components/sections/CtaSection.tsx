import { MagneticButton } from '@/components/MagneticButton';

/**
 * Premium editorial CTA section — Phase B upgrade.
 * Features:
 * - Dark background continuing from Info/Gallery
 * - Large italic heading with generous whitespace
 * - Pill button with hover scale + glow effect
 * - Secondary links with arrow micro-interaction
 * - Subtle radial gradient background for depth
 * - data-reveal for PageTransitions
 */

interface CtaButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctas?: CtaButton[];
}

export default function CtaSection({
  eyebrow = 'Reserve',
  title,
  subtitle,
  ctas = [{ label: 'Make a Reservation', href: '#', variant: 'primary' }],
}: Props) {
  const primaryCtas = ctas.filter((c) => (c.variant ?? 'primary') === 'primary');
  const secondaryCtas = ctas.filter((c) => c.variant === 'secondary');

  return (
    <section
      id="cta"
      data-reveal
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: 'calc(var(--space-section) * 1.2)',
        paddingBottom: 'calc(var(--space-section) * 1.2)',
        paddingLeft: 'var(--gutter)',
        paddingRight: 'var(--gutter)',
        backgroundColor: '#0E0D0C',
        color: 'var(--overlay-text)',
      }}
    >
      {/* Subtle radial gradient for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(242, 238, 232, 0.02) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative mx-auto flex flex-col items-center text-center"
        style={{ maxWidth: 'var(--maxw)' }}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              color: 'rgba(242, 238, 232, 0.35)',
              marginBottom: 'var(--space-block)',
            }}
          >
            {eyebrow}
          </p>
        )}

        {/* Large heading */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--overlay-text)',
            maxWidth: '16ch',
          }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="mx-auto leading-[1.7]"
            style={{
              color: 'rgba(242, 238, 232, 0.5)',
              fontFamily: 'var(--font-body)',
              fontSize: 'calc(var(--fs-body) + 2px)',
              marginTop: 'calc(var(--space-block) * 1.2)',
              maxWidth: '46ch',
              letterSpacing: '0.02em',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Primary CTA buttons */}
        <div
          className="flex flex-col gap-4 sm:flex-row"
          style={{ marginTop: 'calc(var(--space-block) * 2)' }}
        >
          {primaryCtas.map((c, i) => (
            <MagneticButton key={i} strength={0.15}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center rounded-full px-12 py-5 text-sm md:text-base font-medium overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  backgroundColor: 'rgba(242, 238, 232, 0.95)',
                  color: '#0E0D0C',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.06em',
                }}
              >
                {/* Hover glow */}
                <span
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  }}
                />
                <span className="relative">{c.label}</span>
              </a>
            </MagneticButton>
          ))}
        </div>

        {/* Secondary links */}
        {secondaryCtas.length > 0 && (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8 mt-10">
            {secondaryCtas.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3"
                style={{
                  color: 'rgba(242, 238, 232, 0.6)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 1px)',
                }}
              >
                <span className="border-b border-current/30 pb-0.5 transition-all duration-300 group-hover:border-current group-hover:text-white">
                  {c.label}
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1.5"
                >
                  →
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
