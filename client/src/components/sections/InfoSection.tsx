import PhraseTitle from '@/components/text/PhraseTitle';

interface Props {
  storeName?: string;
  area?: string;
  address?: string;
  hours?: string;
  phone?: string;
  reservationUrl?: string;
  mapsUrl?: string;
}

/**
 * Premium editorial visit/info section.
 * Asymmetric 2-column grid with hours + address/links.
 * Uses data-reveal for PageTransitions choreography.
 */
export default function InfoSection({
  storeName = 'La Letizia',
  area = 'Dubai Marina',
  address,
  hours,
  phone,
  reservationUrl,
  mapsUrl,
}: Props) {
  return (
    <section
      id="info"
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
      <div className="mx-auto" style={{ maxWidth: 'var(--maxw)' }}>
        {/* Header */}
        <header style={{ marginBottom: 'var(--space-section)' }}>
          <p
            className="uppercase"
            style={{
              color: 'var(--accent)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              marginBottom: 'calc(var(--space-block) / 2.5)',
            }}
          >
            Visit
          </p>
          <PhraseTitle>{storeName}</PhraseTitle>
          <p
            style={{
              color: 'rgba(26, 23, 20, 0.55)',
              fontFamily: 'var(--font-body)',
              fontSize: 'calc(var(--fs-body) + 4px)',
              marginTop: 'calc(var(--space-block) / 3)',
            }}
          >
            {area}
          </p>
        </header>

        {/* Two-column grid */}
        <div
          className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-16"
          style={{
            borderTop: '1px solid rgba(26, 23, 20, 0.08)',
            paddingTop: 'var(--space-block)',
          }}
        >
          {/* Hours */}
          <div className="md:col-span-6">
            <p
              className="uppercase"
              style={{
                color: 'rgba(26, 23, 20, 0.45)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-eyebrow)',
                letterSpacing: '0.32em',
                marginBottom: 'calc(var(--space-block) / 2)',
              }}
            >
              Hours
            </p>
            {hours ? (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 1px)',
                  color: 'var(--ink)',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                }}
              >
                {hours}
              </p>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 1px)',
                  color: 'rgba(26, 23, 20, 0.45)',
                }}
              >
                Hours to be confirmed.
              </p>
            )}
          </div>

          {/* Address + links */}
          <div className="md:col-span-6">
            <p
              className="uppercase"
              style={{
                color: 'rgba(26, 23, 20, 0.45)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-eyebrow)',
                letterSpacing: '0.32em',
                marginBottom: 'calc(var(--space-block) / 2)',
              }}
            >
              Location
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'calc(var(--fs-body) + 1px)',
                color: 'var(--ink)',
              }}
            >
              {storeName}
            </p>
            {address ? (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 1px)',
                  color: 'rgba(26, 23, 20, 0.55)',
                  marginBottom: 'var(--space-block)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                }}
              >
                {address}
              </p>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 1px)',
                  color: 'rgba(26, 23, 20, 0.55)',
                  marginBottom: 'var(--space-block)',
                }}
              >
                {area}
              </p>
            )}

            {/* Links */}
            <div
              className="flex flex-col gap-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2"
                  style={{
                    color: 'var(--accent)',
                    fontSize: 'calc(var(--fs-body) + 1px)',
                  }}
                >
                  <span className="border-b border-current pb-0.5">View on Map</span>
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="group inline-flex items-center gap-2"
                  style={{
                    color: 'var(--accent)',
                    fontSize: 'calc(var(--fs-body) + 1px)',
                  }}
                >
                  <span className="border-b border-current pb-0.5">{phone}</span>
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
              {reservationUrl && (
                <a
                  href={reservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2"
                  style={{
                    color: 'var(--accent)',
                    fontSize: 'calc(var(--fs-body) + 1px)',
                  }}
                >
                  <span className="border-b border-current pb-0.5">Reserve a Table</span>
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
