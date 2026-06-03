import PhraseTitle from '@/components/text/PhraseTitle';
import { RevealSection } from '@/components/PageTransitions';

interface Props {
  address?: string;
  hours?: string;
  phone?: string;
  reservationUrl?: string;
  eyebrow?: string;
  title?: string;
}

/**
 * Info / contact section with address, hours, phone.
 *
 * Faithfully translated from ZIP: components/sections/InfoSection.tsx
 */
export default function InfoSection({
  address,
  hours,
  phone,
  reservationUrl,
  eyebrow = 'Visit',
  title = 'Find Us',
}: Props) {
  return (
    <section
      id="info"
      className="w-full"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--ink)',
        padding: 'var(--space-section) var(--gutter)',
      }}
    >
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
        <RevealSection>
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              color: 'var(--accent)',
              marginBottom: 'calc(var(--space-block) / 3)',
            }}
          >
            {eyebrow}
          </p>
          <PhraseTitle>{title}</PhraseTitle>
        </RevealSection>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <RevealSection delay={0.1}>
            <div className="flex flex-col gap-6">
              {address && (
                <div>
                  <p
                    className="uppercase mb-2"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--fs-eyebrow)',
                      letterSpacing: '0.2em',
                      color: 'rgba(26, 23, 20, 0.5)',
                    }}
                  >
                    Address
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--fs-body)',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {address}
                  </p>
                </div>
              )}
              {phone && (
                <div>
                  <p
                    className="uppercase mb-2"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--fs-eyebrow)',
                      letterSpacing: '0.2em',
                      color: 'rgba(26, 23, 20, 0.5)',
                    }}
                  >
                    Phone
                  </p>
                  <a
                    href={`tel:${phone}`}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--fs-body)',
                      color: 'var(--ink)',
                    }}
                  >
                    {phone}
                  </a>
                </div>
              )}
            </div>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="flex flex-col gap-6">
              {hours && (
                <div>
                  <p
                    className="uppercase mb-2"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--fs-eyebrow)',
                      letterSpacing: '0.2em',
                      color: 'rgba(26, 23, 20, 0.5)',
                    }}
                  >
                    Hours
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--fs-body)',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {hours}
                  </p>
                </div>
              )}
              {reservationUrl && (
                <a
                  href={reservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--fs-eyebrow)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    borderBottom: '1px solid var(--accent)',
                    paddingBottom: '2px',
                  }}
                >
                  Reserve a Table
                </a>
              )}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
