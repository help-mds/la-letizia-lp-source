import PhraseTitle from '@/components/text/PhraseTitle';
import { RevealSection } from '@/components/PageTransitions';

interface Props {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

/**
 * Call-to-action section at the bottom of the page.
 *
 * Faithfully translated from ZIP: components/sections/CtaSection.tsx
 */
export default function CtaSection({
  title = 'Your table is waiting',
  subtitle,
  buttonText = 'Reserve',
  buttonHref = '#',
}: Props) {
  return (
    <section
      id="cta"
      className="w-full"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--ink)',
        padding: 'var(--space-section) var(--gutter)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
        <RevealSection>
          <PhraseTitle>{title}</PhraseTitle>
          {subtitle && (
            <p
              className="mt-5 md:mt-6 mx-auto"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-body)',
                color: 'rgba(26, 23, 20, 0.65)',
                maxWidth: '42ch',
                lineHeight: 1.7,
              }}
            >
              {subtitle}
            </p>
          )}
          <a
            href={buttonHref}
            className="inline-block mt-10 md:mt-12"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--bg)',
              backgroundColor: 'var(--ink)',
              padding: '16px 48px',
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
          >
            {buttonText}
          </a>
        </RevealSection>
      </div>
    </section>
  );
}
