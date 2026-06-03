/**
 * Premium editorial visit/info section — Phase B upgrade.
 * Features:
 * - Dark background for dramatic contrast after gallery
 * - Large italic store name as hero element
 * - Card-style hours and location blocks
 * - Elegant link styling with hover animations
 * - data-reveal for PageTransitions
 */
export default function InfoSection({
  storeName = 'La Letizia',
  area = 'Dubai Marina',
  address,
  hours,
  phone,
  reservationUrl,
  mapsUrl,
}: {
  storeName?: string;
  area?: string;
  address?: string;
  hours?: string;
  phone?: string;
  reservationUrl?: string;
  mapsUrl?: string;
}) {
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
        backgroundColor: '#0E0D0C',
        color: 'var(--overlay-text)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--maxw)' }}>
        {/* Large store name as hero element */}
        <header style={{ marginBottom: 'calc(var(--space-section) * 0.6)' }}>
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              color: 'rgba(242, 238, 232, 0.4)',
              marginBottom: 'calc(var(--space-block) / 2)',
            }}
          >
            Visit
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--overlay-text)',
            }}
          >
            {storeName}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'calc(var(--fs-body) + 2px)',
              color: 'rgba(242, 238, 232, 0.4)',
              marginTop: 'calc(var(--space-block) / 3)',
              letterSpacing: '0.04em',
            }}
          >
            {area}
          </p>
        </header>

        {/* Info grid — two columns */}
        <div
          className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-16"
          style={{
            borderTop: '1px solid rgba(242, 238, 232, 0.08)',
            paddingTop: 'calc(var(--space-block) * 1.5)',
          }}
        >
          {/* Hours card */}
          <div
            className="relative"
            style={{
              padding: 'clamp(24px, 3vw, 40px)',
              backgroundColor: 'rgba(242, 238, 232, 0.03)',
              borderRadius: '4px',
              border: '1px solid rgba(242, 238, 232, 0.06)',
            }}
          >
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(242, 238, 232, 0.35)',
                marginBottom: 'clamp(16px, 2vh, 24px)',
              }}
            >
              Hours
            </p>
            {hours ? (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 2px)',
                  color: 'rgba(242, 238, 232, 0.85)',
                  lineHeight: 1.9,
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
                  color: 'rgba(242, 238, 232, 0.35)',
                }}
              >
                Hours to be confirmed.
              </p>
            )}
          </div>

          {/* Location card */}
          <div
            className="relative"
            style={{
              padding: 'clamp(24px, 3vw, 40px)',
              backgroundColor: 'rgba(242, 238, 232, 0.03)',
              borderRadius: '4px',
              border: '1px solid rgba(242, 238, 232, 0.06)',
            }}
          >
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(242, 238, 232, 0.35)',
                marginBottom: 'clamp(16px, 2vh, 24px)',
              }}
            >
              Location
            </p>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'rgba(242, 238, 232, 0.9)',
                marginBottom: '8px',
              }}
            >
              {storeName}
            </p>
            {address ? (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 1px)',
                  color: 'rgba(242, 238, 232, 0.5)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  marginBottom: 'clamp(20px, 3vh, 32px)',
                }}
              >
                {address}
              </p>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'calc(var(--fs-body) + 1px)',
                  color: 'rgba(242, 238, 232, 0.4)',
                  marginBottom: 'clamp(20px, 3vh, 32px)',
                }}
              >
                {area}
              </p>
            )}

            {/* Links */}
            <div
              className="flex flex-col gap-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="group inline-flex items-center gap-3"
                  style={{
                    color: 'rgba(242, 238, 232, 0.7)',
                    fontSize: 'calc(var(--fs-body) + 1px)',
                  }}
                >
                  <span className="border-b border-current/30 pb-0.5 transition-all duration-300 group-hover:border-current group-hover:text-white">
                    {phone}
                  </span>
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1.5"
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
                  className="group inline-flex items-center gap-3"
                  style={{
                    color: 'rgba(242, 238, 232, 0.7)',
                    fontSize: 'calc(var(--fs-body) + 1px)',
                  }}
                >
                  <span className="border-b border-current/30 pb-0.5 transition-all duration-300 group-hover:border-current group-hover:text-white">
                    Reserve a Table
                  </span>
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </a>
              )}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3"
                  style={{
                    color: 'rgba(242, 238, 232, 0.7)',
                    fontSize: 'calc(var(--fs-body) + 1px)',
                  }}
                >
                  <span className="border-b border-current/30 pb-0.5 transition-all duration-300 group-hover:border-current group-hover:text-white">
                    View on Map
                  </span>
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1.5"
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
