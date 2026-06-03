import PhraseTitle from '@/components/text/PhraseTitle';

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

/**
 * Premium editorial CTA section on white base.
 * Centered heading, pill button, secondary links with arrow micro-interaction.
 * Uses data-reveal for PageTransitions choreography.
 */
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
      className="relative w-full"
      style={{
        paddingTop: 'var(--space-section)',
        paddingBottom: 'var(--space-section)',
        paddingLeft: 'var(--gutter)',
        paddingRight: 'var(--gutter)',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        className="mx-auto flex flex-col items-center text-center"
        style={{ maxWidth: 'var(--maxw)' }}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <p
            className="uppercase"
            style={{
              color: 'var(--accent)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              marginBottom: 'var(--space-block)',
            }}
          >
            {eyebrow}
          </p>
        )}

        {/* Heading */}
        <PhraseTitle className="mx-auto" style={{ maxWidth: '20ch' }}>
          {title}
        </PhraseTitle>

        {/* Subtitle */}
        {subtitle && (
          <p
            data-paragraph
            className="mx-auto leading-[1.7]"
            style={{
              color: 'rgba(26, 23, 20, 0.6)',
              fontFamily: 'var(--font-body)',
              fontSize: 'calc(var(--fs-body) + 1px)',
              marginTop: 'var(--space-block)',
              maxWidth: '46ch',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Primary CTA buttons */}
        <div
          className="flex flex-col gap-3 sm:flex-row"
          style={{ marginTop: 'calc(var(--space-block) * 1.5)' }}
        >
          {primaryCtas.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-10 py-4 text-sm md:text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--ink)',
                color: 'var(--bg)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.04em',
              }}
            >
              {c.label}
            </a>
          ))}
        </div>

        {/* Secondary links */}
        {secondaryCtas.length > 0 && (
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6 mt-8">
            {secondaryCtas.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2"
                style={{
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 1px)',
                }}
              >
                <span className="border-b border-current pb-0.5">{c.label}</span>
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
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
